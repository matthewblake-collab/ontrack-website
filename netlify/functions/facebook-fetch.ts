const GRAPH = "https://graph.facebook.com/v21.0";

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
  const insightsResp = await fetch(
    `${GRAPH}/${fbPageId}/insights?metric=page_impressions,page_reach,page_views_total,page_website_clicks_logged_in_unique&period=day&date_preset=yesterday&access_token=${TOKEN}`
  );
  const insightsData = (await insightsResp.json()) as {
    data?: FBInsight[];
    error?: MetaError;
  };

  if (insightsData.error) {
    console.warn("[facebook-fetch] Page insights failed:", insightsData.error.message);
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
    period_reach: extractInsightValue(find("page_reach")),
    period_impressions: extractInsightValue(find("page_impressions")),
    period_profile_views: extractInsightValue(find("page_views_total")),
    period_website_clicks: extractInsightValue(find("page_website_clicks_logged_in_unique")),
    raw: { page: pageData, insights: insightsData.data ?? null },
  };

  await supabaseUpsert(
    SUPABASE_URL,
    SUPABASE_KEY,
    "social_account_summary",
    [summaryRow],
    "platform,account_id,summary_date"
  );

  console.log(`[facebook-fetch] Complete: account summary upserted for ${summaryDate}`);
  return { statusCode: 200, body: `OK: account summary upserted for ${summaryDate}` };
};
