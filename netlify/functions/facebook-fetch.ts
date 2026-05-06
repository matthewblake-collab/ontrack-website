const GRAPH = "https://graph.facebook.com/v22.0";

interface FBInsight {
  name: string;
  period: string;
  values: { value: number | Record<string, number>; end_time: string }[];
}

interface MetaError {
  message: string;
  code?: number;
}

async function supabaseUpsert(
  url: string,
  key: string,
  table: string,
  rows: object[],
  onConflict: string
): Promise<void> {
  const resp = await fetch(`${url}/rest/v1/${table}?on_conflict=${onConflict}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(rows),
  });
  if (!resp.ok) {
    const text = await resp.text();
    console.error(`[supabase] upsert ${table} failed ${resp.status}: ${text}`);
  }
}

async function supabaseUpsertReturning(
  url: string,
  key: string,
  table: string,
  rows: object[],
  onConflict: string
): Promise<{ ok: boolean; data?: Record<string, unknown>[] }> {
  const resp = await fetch(`${url}/rest/v1/${table}?on_conflict=${onConflict}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(rows),
  });
  if (!resp.ok) {
    const text = await resp.text();
    console.error(`[supabase] upsert ${table} failed ${resp.status}: ${text}`);
    return { ok: false };
  }
  const data = (await resp.json()) as Record<string, unknown>[];
  return { ok: true, data };
}

async function supabaseInsert(
  url: string,
  key: string,
  table: string,
  rows: object[]
): Promise<void> {
  const resp = await fetch(`${url}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rows),
  });
  if (!resp.ok) {
    const text = await resp.text();
    console.error(`[supabase] insert ${table} failed ${resp.status}: ${text}`);
  }
}

function extractInsightValue(insight: FBInsight | undefined): number {
  if (!insight) return 0;
  const values = insight.values ?? [];
  const lastValue = values[values.length - 1]?.value ?? 0;
  if (typeof lastValue === "number") return lastValue;
  // Breakdown object — sum all values
  return Object.values(lastValue as Record<string, number>).reduce((a, b) => a + b, 0);
}

export const handler = async () => {
  const TOKEN = process.env.META_ACCESS_TOKEN;
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!TOKEN || !SUPABASE_URL || !SUPABASE_KEY) {
    console.error("[facebook-fetch] Missing required env vars: META_ACCESS_TOKEN, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
    return { statusCode: 500, body: "Missing required env vars" };
  }

  // Auto-discovery early exit — do NOT write any rows if FB_PAGE_ID is missing
  let fbPageId = process.env.FB_PAGE_ID;
  if (!fbPageId) {
    const accountsResp = await fetch(`${GRAPH}/me/accounts?access_token=${TOKEN}`);
    const accountsData = (await accountsResp.json()) as {
      data?: { id: string; name: string }[];
      error?: MetaError;
    };

    if (accountsData.error) {
      console.error("[facebook-fetch] Discovery failed:", accountsData.error.message);
      return { statusCode: 200, body: `Discovery error: ${accountsData.error.message}` };
    }

    const pages = accountsData.data ?? [];
    if (pages.length === 0) {
      console.error("[facebook-fetch] No Facebook Pages found for this token");
      return { statusCode: 200, body: "Discovery run — no Facebook Pages found. Ensure the token has pages_show_list permission." };
    }

    const first = pages[0];
    console.log(`[facebook-fetch] ACTION REQUIRED: Set FB_PAGE_ID=${first.id} in Netlify env (page: "${first.name}")`);
    if (pages.length > 1) {
      const all = pages.map((p) => `${p.name} (${p.id})`).join(", ");
      console.log(`[facebook-fetch] Multiple pages found: ${all}. Edit FB_PAGE_ID if the first isn't correct.`);
    }
    return {
      statusCode: 200,
      body: `Discovery run — set FB_PAGE_ID=${first.id} in Netlify env and re-run`,
    };
  }

  // Fetch page info
  const pageResp = await fetch(
    `${GRAPH}/${fbPageId}?fields=fan_count,followers_count,name&access_token=${TOKEN}`
  );
  const pageData = (await pageResp.json()) as {
    fan_count?: number;
    followers_count?: number;
    name?: string;
    error?: MetaError;
  };

  if (pageData.error) {
    console.error("[facebook-fetch] Page fetch failed:", pageData.error.message);
    return { statusCode: 500, body: `Page fetch failed: ${pageData.error.message}` };
  }

  // Fetch page insights for yesterday
  // v22: `page_impressions` deprecated Nov 15 2025 → replaced by `page_views`.
  // `page_views_total` deprecated v21. `page_website_clicks_logged_in_unique` deprecated.
  // `page_reach` is post-level only in v22. Surviving page-level metrics:
  // `page_post_engagements`, `page_fan_adds_unique`, `page_views`.
  const insightsResp = await fetch(
    `${GRAPH}/${fbPageId}/insights?metric=page_post_engagements,page_fan_adds_unique,page_views&period=day&date_preset=yesterday&access_token=${TOKEN}`
  );
  const insightsData = (await insightsResp.json()) as {
    data?: FBInsight[];
    error?: MetaError;
  };

  if (insightsData.error) {
    console.warn(
      "[facebook-fetch] Page insights failed:",
      JSON.stringify(insightsData.error)
    );
    // Non-fatal — continue with zero insight values
  }

  const find = (name: string) => insightsData.data?.find((i) => i.name === name);

  const now = new Date();
  // AEST = UTC+10
  const summaryDate = new Date(now.getTime() + 10 * 3600000).toISOString().split("T")[0];

  const summaryRow = {
    platform: "facebook",
    account_id: fbPageId,
    account_handle: pageData.name ?? null,
    summary_date: summaryDate,
    followers: pageData.followers_count ?? pageData.fan_count ?? 0,
    following: 0,
    total_posts: 0,
    // v22 mapping: `page_views` is the closest analog for both impressions and
    // profile-style traffic. `page_reach` and `page_website_clicks` no longer
    // exist at page level — will be derived from per-post sums (F11 + Phase B).
    period_reach: 0,
    period_impressions: extractInsightValue(find("page_views")),
    period_profile_views: extractInsightValue(find("page_views")),
    period_website_clicks: 0,
    // page_fan_adds_unique surfaces here for follower-velocity calc:
    period_follower_growth: extractInsightValue(find("page_fan_adds_unique")),
    raw: { page: pageData, insights: insightsData.data ?? null },
  };

  await supabaseUpsert(
    SUPABASE_URL,
    SUPABASE_KEY,
    "social_account_summary",
    [summaryRow],
    "platform,account_id,summary_date"
  );

  // ── Posts loop (F11) — mirrors instagram-fetch.ts pattern ─────────────────
  const postsResp = await fetch(
    `${GRAPH}/${fbPageId}/posts?fields=id,created_time,permalink_url,message,attachments{type,media{image{src}}},comments.summary(true).limit(0),shares,reactions.summary(true).limit(0)&limit=50&access_token=${TOKEN}`
  );
  const postsData = (await postsResp.json()) as {
    data?: Array<{
      id: string;
      created_time: string;
      permalink_url?: string;
      message?: string;
      attachments?: { data?: Array<{ type?: string; media?: { image?: { src?: string } } }> };
      comments?: { summary?: { total_count?: number } };
      shares?: { count?: number };
      reactions?: { summary?: { total_count?: number } };
    }>;
    error?: MetaError;
  };

  if (postsData.error) {
    console.warn(
      "[facebook-fetch] Posts fetch failed:",
      JSON.stringify(postsData.error)
    );
  }

  const posts = postsData.data ?? [];
  let processedPosts = 0;

  for (const post of posts) {
    try {
      const attachment = post.attachments?.data?.[0];
      const postRow = {
        platform: "facebook",
        platform_post_id: post.id,
        post_type: attachment?.type ?? "status",
        caption: post.message ?? null,
        permalink: post.permalink_url ?? null,
        thumbnail_url: attachment?.media?.image?.src ?? null,
        published_at: post.created_time,
        updated_at: now.toISOString(),
      };

      const { data: upsertData } = await supabaseUpsertReturning(
        SUPABASE_URL,
        SUPABASE_KEY,
        "social_posts",
        [postRow],
        "platform,platform_post_id"
      );
      const socialPostId = upsertData?.[0]?.id as string | undefined;
      if (!socialPostId) continue;

      // Per-post insights — v22 valid set
      const postInsightsResp = await fetch(
        `${GRAPH}/${post.id}/insights?metric=post_impressions_unique,post_engaged_users,post_clicks,post_reactions_by_type_total&access_token=${TOKEN}`
      );
      const postInsightsData = (await postInsightsResp.json()) as {
        data?: FBInsight[];
        error?: MetaError;
      };

      if (!postInsightsData.data) {
        if (postInsightsData.error) {
          console.warn(
            `[facebook-fetch] Post ${post.id} insights error:`,
            JSON.stringify(postInsightsData.error)
          );
        }
        continue;
      }

      const findP = (name: string) => postInsightsData.data?.find((i) => i.name === name);

      const metricsRow = {
        social_post_id: socialPostId,
        platform: "facebook",
        reach: extractInsightValue(findP("post_impressions_unique")),
        impressions: extractInsightValue(findP("post_impressions_unique")),
        likes: post.reactions?.summary?.total_count ?? 0,
        comments: post.comments?.summary?.total_count ?? 0,
        shares: post.shares?.count ?? 0,
        // post_engaged_users = unique people who clicked, liked, commented, or shared
        profile_visits: extractInsightValue(findP("post_engaged_users")),
        // raw retains post_clicks + reactions-by-type breakdown for future surfaces
        raw: { insights: postInsightsData.data, post_native: { reactions: post.reactions?.summary?.total_count, shares: post.shares?.count, comments: post.comments?.summary?.total_count } },
      };

      await supabaseInsert(SUPABASE_URL, SUPABASE_KEY, "social_metrics", [metricsRow]);
      processedPosts++;
    } catch (err) {
      console.warn(`[facebook-fetch] Skipped post ${post.id}:`, err);
    }
  }

  console.log(
    `[facebook-fetch] Complete: account summary upserted for ${summaryDate}; ${processedPosts}/${posts.length} posts processed`
  );
  return {
    statusCode: 200,
    body: `OK: summary + ${processedPosts}/${posts.length} posts for ${summaryDate}`,
  };
};
