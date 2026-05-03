import type { Config } from "@netlify/edge-functions";

export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  let password: string;
  try {
    ({ password } = await request.json());
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (password !== Deno.env.get("DASHBOARD_PASSWORD")) {
    return Response.json({ error: "Invalid password" }, { status: 401 });
  }

  const secret = Deno.env.get("SESSION_SECRET");
  if (!secret) {
    return Response.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const testCode = Deno.env.get("OTP_TEST_CODE");

  // In test mode: use fixed code. In production: generate random 6-digit OTP.
  const otp = testCode || Math.floor(100000 + Math.random() * 900000).toString();
  const exp = Date.now() + 5 * 60 * 1000; // 5-minute window

  // Hash the OTP salted with SESSION_SECRET so it can't be read from the challenge token
  const otpHashBuf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(otp + secret)
  );
  const otpHash = btoa(String.fromCharCode(...new Uint8Array(otpHashBuf)));

  // Build HMAC-signed challenge: payload is b64(json), sig prevents client tampering
  const payload = btoa(JSON.stringify({ otpHash, exp }));
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuf = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  const challenge = `${payload}.${btoa(String.fromCharCode(...new Uint8Array(sigBuf)))}`;

  // Production SMS delivery via Supabase + Twilio (skipped in test mode)
  if (!testCode) {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const phone = Deno.env.get("DASHBOARD_PHONE");

    const res = await fetch(`${supabaseUrl}/auth/v1/otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: supabaseAnonKey! },
      body: JSON.stringify({ phone, create_user: true }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("Supabase OTP send error:", detail);
      return Response.json({ error: "Failed to send OTP" }, { status: 500 });
    }
  }

  return Response.json({ ok: true, challenge });
}

export const config: Config = { path: "/api/auth/send-otp" };
