const GRAPH = "https://graph.facebook.com/v22.0";

interface IGMedia {
  id: string;
  timestamp: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  product_type?: "REELS" | "FEED" | "IGTV";
  permalink?: string;
  thumbnail_url?: string;
  caption?: string;
  like_count?: number;
  comments_count?: number;
}

interface IGInsight {
  name: string;
  period: string;
  values: { value: number; end_time?: string }[];
}

interface IGAccount {
  id?: string;
  username?: string;
  followers_count?: number;
  following_count?: number;
  media_count?: number;
}

interface MetaError {
  message: string;
  code?: number;
}

function getInsightMetrics(mediaType: string, productType?: string): string {
  // v22: `impressions` deprecated for non-Reels media → unified into `views`.
  // `follows` is Reels-only (errors on FEED/IMAGE), so it lives in the Reels branch only.
  // `video_views` and `ig_reels_video_view_total` are replaced by `views` /
  // `ig_reels_aggregated_all_plays_count` respectively in v22.
  const base = "reach,saved,shares,total_interactions,profile_visits,views,likes,comments";
  if (mediaType === "VIDEO") {
    if (productType === "REELS") return `${base},follows,ig_reels_aggregated_all_plays_count,ig_reels_avg_watch_time`;
    return base;
  }
  return base;
}

async function supabaseUpsert(
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

export const handler = async () => {
  const TOKEN = process.env.META_ACCESS_TOKEN;
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!TOKEN || !SUPABASE_URL || !SUPABASE_KEY) {
    console.error("[instagram-fetch] Missing required env vars: META_ACCESS_TOKEN, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
    return { statusCode: 500, body: "Missing required env vars" };
  }

  // Auto-discovery early exit — do NOT proceed to fetch metrics if ID is missing
  let igUserId = process.env.IG_USER_ID;
  if (!igUserId) {
    const accountsResp = await fetch(`${GRAPH}/me/accounts?access_token=${TOKEN}`);
    const accountsData = (await accountsResp.json()) as {
      data?: { id: string; name: string }[];
      error?: MetaError;
    };

    if (accountsData.error) {
      console.error("[instagram-fetch] Discovery failed:", accountsData.error.message);
      return { statusCode: 200, body: `Discovery error: ${accountsData.error.message}` };
    }

    for (const page of accountsData.data ?? []) {
      const pageResp = await fetch(
        `${GRAPH}/${page.id}?fields=instagram_business_account&access_token=${TOKEN}`
      );
      const pageData = (await pageResp.json()) as {
        instagram_business_account?: { id: string };
        error?: MetaError;
      };

      if (pageData.instagram_business_account?.id) {
        const discoveredId = pageData.instagram_business_account.id;
        console.log(`[instagram-fetch] ACTION REQUIRED: Set IG_USER_ID=${discoveredId} in Netlify env (page: "${page.name}")`);
        return {
          statusCode: 200,
          body: `Discovery run — set IG_USER_ID=${discoveredId} in Netlify env and re-run`,
        };
      }
    }

    console.error("[instagram-fetch] No Instagram Business Account found on any connected page");
    return {
      statusCode: 200,
      body: "Discovery run — no Instagram Business Account found. Connect Instagram to a Facebook Page first.",
    };
  }

  // Fetch last 50 posts
  const mediaResp = await fetch(
    `${GRAPH}/${igUserId}/media?fields=id,timestamp,media_type,product_type,permalink,thumbnail_url,caption,like_count,comments_count&limit=50&access_token=${TOKEN}`
  );
  const mediaData = (await mediaResp.json()) as {
    data?: IGMedia[];
    error?: MetaError;
  };

  if (mediaData.error) {
    console.error("[instagram-fetch] Media fetch failed:", mediaData.error.message);
    return { statusCode: 500, body: `Media fetch failed: ${mediaData.error.message}` };
  }

  const posts = mediaData.data ?? [];
  let processedCount = 0;
  const now = new Date();

  for (const post of posts) {
    try {
      // Upsert social_posts
      const postRow = {
        platform: "instagram",
        platform_post_id: post.id,
        post_type: post.product_type === "REELS" ? "reel" : post.media_type.toLowerCase(),
        caption: post.caption ?? null,
        permalink: post.permalink ?? null,
        thumbnail_url: post.thumbnail_url ?? null,
        published_at: post.timestamp,
        updated_at: now.toISOString(),
      };

      const { data: upsertData } = await supabaseUpsert(
        SUPABASE_URL,
        SUPABASE_KEY,
        "social_posts",
        [postRow],
        "platform,platform_post_id"
      );
      const socialPostId = upsertData?.[0]?.id as string | undefined;
      if (!socialPostId) continue;

      // Fetch per-post insights
      const metricStr = getInsightMetrics(post.media_type, post.product_type);
      const insightsResp = await fetch(
        `${GRAPH}/${post.id}/insights?metric=${metricStr}&access_token=${TOKEN}`
      );
      const insightsData = (await insightsResp.json()) as {
        data?: IGInsight[];
        error?: MetaError;
      };

      if (!insightsData.data) {
        // v22: surface the actual API error so scope-fail is distinguishable from metric-fail.
        if (insightsData.error) {
          console.warn(
            `[instagram-fetch] Post ${post.id} insights error:`,
            JSON.stringify(insightsData.error)
          );
        }
        continue;
      }

      const get = (name: string): number =>
        (insightsData.data!.find((i) => i.name === name)?.values?.[0]?.value ?? 0);

      const metricsRow = {
        social_post_id: socialPostId,
        platform: "instagram",
        views: get("views") || get("ig_reels_aggregated_all_plays_count"),
        reach: get("reach"),
        impressions: get("impressions"),
        likes: post.like_count ?? 0,
        comments: post.comments_count ?? 0,
        shares: get("shares"),
        saves: get("saved"),
        watch_time_ms: get("ig_reels_avg_watch_time"),
        follows_from_post: get("follows"),
        profile_visits: get("profile_visits"),
        raw: insightsData.data,
      };

      await supabaseInsert(SUPABASE_URL, SUPABASE_KEY, "social_metrics", [metricsRow]);
      processedCount++;
    } catch (err) {
      console.warn(`[instagram-fetch] Skipped post ${post.id}:`, err);
    }
  }

  // Account summary
  try {
    const acctResp = await fetch(
      `${GRAPH}/${igUserId}?fields=followers_count,media_count,username&access_token=${TOKEN}`
    );
    const acctData = (await acctResp.json()) as IGAccount & { error?: MetaError };

    // AEST = UTC+10
    const summaryDate = new Date(now.getTime() + 10 * 3600000).toISOString().split("T")[0];

    const since = Math.floor((now.getTime() - 86400000) / 1000);
    const until = Math.floor(now.getTime() / 1000);
    const acctInsightsResp = await fetch(
      // v22: `impressions` → `views`. `profile_views` and `website_clicks` deprecated as
      // user-level metrics in v21. `accounts_engaged` + `total_interactions` are the v22
      // successors. `metric_type=total_value` is required for the new aggregate metrics.
      `${GRAPH}/${igUserId}/insights?metric=reach,views,accounts_engaged,total_interactions&period=day&metric_type=total_value&since=${since}&until=${until}&access_token=${TOKEN}`
    );
    const acctInsightsData = (await acctInsightsResp.json()) as { data?: IGInsight[] };

    const getAcct = (name: string): number =>
      (acctInsightsData.data?.find((i) => i.name === name)?.values?.[0]?.value ?? 0);

    const summaryRow = {
      platform: "instagram",
      account_id: igUserId,
      account_handle: acctData.username ?? null,
      summary_date: summaryDate,
      followers: acctData.followers_count ?? 0,
      following: acctData.following_count ?? 0,
      total_posts: acctData.media_count ?? 0,
      period_reach: getAcct("reach"),
      period_impressions: getAcct("views"),
      // v22: `profile_views` + `website_clicks` deprecated at user-level. Will be
      // derived from per-post sums in a later phase. `accounts_engaged` +
      // `total_interactions` are still captured in `raw.insights` for future use.
      period_profile_views: 0,
      period_website_clicks: 0,
      raw: { account: acctData, insights: acctInsightsData.data },
    };

    await supabaseUpsert(
      SUPABASE_URL,
      SUPABASE_KEY,
      "social_account_summary",
      [summaryRow],
      "platform,account_id,summary_date"
    );
  } catch (err) {
    console.warn("[instagram-fetch] Account summary failed:", err);
  }

  console.log(`[instagram-fetch] Complete: ${processedCount}/${posts.length} posts processed`);
  return { statusCode: 200, body: `OK: ${processedCount}/${posts.length} posts processed` };
};
