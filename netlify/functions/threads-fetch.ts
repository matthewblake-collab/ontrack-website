const THREADS_GRAPH = "https://graph.threads.net/v1.0";

interface ThreadsMedia {
  id: string;
  timestamp: string;
  media_type?: string;
  permalink?: string;
  text?: string;
}

interface ThreadsInsight {
  name: string;
  values: { value: number }[];
}

interface MetaError {
  message: string;
  code?: number;
  error_subcode?: number;
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

function isPermissionError(err?: MetaError): boolean {
  if (!err) return false;
  return (
    err.code === 200 || // OAuthException permission denied
    err.code === 10 || // Application does not have permission
    err.code === 190 || // Invalid / expired token
    err.message?.toLowerCase().includes("permission") ||
    err.message?.toLowerCase().includes("oauthexception")
  );
}

export const handler = async () => {
  const TOKEN = process.env.META_ACCESS_TOKEN;
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!TOKEN || !SUPABASE_URL || !SUPABASE_KEY) {
    console.error("[threads-fetch] Missing required env vars: META_ACCESS_TOKEN, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
    return { statusCode: 500, body: "Missing required env vars" };
  }

  // Auto-discovery early exit — do NOT write any rows if THREADS_USER_ID is missing
  let threadsUserId = process.env.THREADS_USER_ID;
  if (!threadsUserId) {
    const meResp = await fetch(
      `${THREADS_GRAPH}/me?fields=id,username&access_token=${TOKEN}`
    );
    const meData = (await meResp.json()) as {
      id?: string;
      username?: string;
      error?: MetaError;
    };

    if (meData.error) {
      if (isPermissionError(meData.error)) {
        console.log(
          `[threads-fetch] Permission error during discovery: ${meData.error.message}. ` +
            "Ensure threads_basic permission is granted in Meta App Review."
        );
        return {
          statusCode: 200,
          body: `Threads permission error: ${meData.error.message}. Grant threads_basic in Meta App Review.`,
        };
      }
      console.error("[threads-fetch] Discovery failed:", meData.error.message);
      return { statusCode: 200, body: `Discovery error: ${meData.error.message}` };
    }

    if (!meData.id) {
      console.error("[threads-fetch] No Threads user ID in /me response");
      return {
        statusCode: 200,
        body: "Discovery run — no Threads user ID returned. Check threads_basic permission.",
      };
    }

    console.log(
      `[threads-fetch] ACTION REQUIRED: Set THREADS_USER_ID=${meData.id} in Netlify env (username: @${meData.username ?? "unknown"})`
    );
    return {
      statusCode: 200,
      body: `Discovery run — set THREADS_USER_ID=${meData.id} in Netlify env and re-run`,
    };
  }

  // Fetch recent threads
  const threadsResp = await fetch(
    `${THREADS_GRAPH}/${threadsUserId}/threads?fields=id,timestamp,media_type,permalink,text&limit=50&access_token=${TOKEN}`
  );
  const threadsData = (await threadsResp.json()) as {
    data?: ThreadsMedia[];
    error?: MetaError;
  };

  if (threadsData.error) {
    if (isPermissionError(threadsData.error)) {
      // Expected condition — return 200 so Netlify does not alert / retry
      console.log(
        `[threads-fetch] Permission error fetching threads: ${threadsData.error.message}. ` +
          "Grant threads_basic + threads_manage_insights in Meta App Review."
      );
      return {
        statusCode: 200,
        body: `Threads permission error: ${threadsData.error.message}. Grant threads_basic + threads_manage_insights in Meta App Review.`,
      };
    }
    console.error("[threads-fetch] Threads fetch failed:", threadsData.error.message);
    return { statusCode: 500, body: `Threads fetch failed: ${threadsData.error.message}` };
  }

  const threads = threadsData.data ?? [];
  let processedCount = 0;
  const now = new Date();

  for (const thread of threads) {
    try {
      // Upsert social_posts
      const postRow = {
        platform: "threads",
        platform_post_id: thread.id,
        post_type: thread.media_type?.toLowerCase() ?? "text",
        caption: thread.text ?? null,
        permalink: thread.permalink ?? null,
        published_at: thread.timestamp,
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

      // Fetch per-thread insights
      const insightsResp = await fetch(
        `${THREADS_GRAPH}/${thread.id}/insights?metric=views,likes,replies,reposts,quotes&access_token=${TOKEN}`
      );
      const insightsData = (await insightsResp.json()) as {
        data?: ThreadsInsight[];
        error?: MetaError;
      };

      if (insightsData.error) {
        if (isPermissionError(insightsData.error)) {
          // threads_manage_insights not granted — exit cleanly, do not retry
          console.log(
            `[threads-fetch] Insights permission error: ${insightsData.error.message}. ` +
              "threads_manage_insights permission required. Grant in Meta App Review."
          );
          return {
            statusCode: 200,
            body: `Threads insights require threads_manage_insights permission. Grant in Meta App Review.`,
          };
        }
        console.warn(`[threads-fetch] Insights failed for ${thread.id}:`, insightsData.error.message);
        continue;
      }

      if (!insightsData.data) continue;

      const get = (name: string): number =>
        (insightsData.data!.find((i) => i.name === name)?.values?.[0]?.value ?? 0);

      const metricsRow = {
        social_post_id: socialPostId,
        platform: "threads",
        views: get("views"),
        likes: get("likes"),
        comments: get("replies"),
        shares: get("reposts"),
        raw: insightsData.data,
      };

      await supabaseInsert(SUPABASE_URL, SUPABASE_KEY, "social_metrics", [metricsRow]);
      processedCount++;
    } catch (err) {
      console.warn(`[threads-fetch] Skipped thread ${thread.id}:`, err);
    }
  }

  console.log(`[threads-fetch] Complete: ${processedCount}/${threads.length} threads processed`);
  return { statusCode: 200, body: `OK: ${processedCount}/${threads.length} threads processed` };
};
