import type { Config } from "@netlify/edge-functions";

export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  let otp: string;
  try {
    ({ token: otp } = await request.json());
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const phone = Deno.env.get("DASHBOARD_PHONE");

  const res = await fetch(`${supabaseUrl}/auth/v1/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseAnonKey!,
    },
    body: JSON.stringify({ phone, token: otp, type: "sms" }),
  });

  if (!res.ok) {
    return Response.json({ error: "Invalid OTP" }, { status: 401 });
  }

  // Build HMAC-signed session token
  const secret = Deno.env.get("SESSION_SECRET")!;
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const data = btoa(JSON.stringify({ phone, exp }));

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const sigBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(data)
  );
  const signature = btoa(
    String.fromCharCode(...new Uint8Array(sigBuffer))
  );
  const sessionToken = `${data}.${signature}`;

  const maxAge = 7 * 24 * 3600;
  const headers = new Headers({
    Location: "/dashboard",
    "Set-Cookie": `ot_session=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`,
  });

  return new Response(null, { status: 302, headers });
}

export const config: Config = { path: "/api/auth/verify-otp" };
