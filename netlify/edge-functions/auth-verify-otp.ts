import type { Config } from "@netlify/edge-functions";

export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  let otp: string;
  let challenge: string;
  try {
    ({ token: otp, challenge } = await request.json());
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  console.log("[auth-verify-otp] invoked", { hasChallenge: !!challenge, otpLength: otp?.length });

  if (!challenge || !otp) {
    console.log("[auth-verify-otp] missing token or challenge");
    return Response.json({ error: "Missing token or challenge" }, { status: 400 });
  }

  const secret = Deno.env.get("SESSION_SECRET");
  console.log("[auth-verify-otp] SESSION_SECRET set:", !!secret);
  if (!secret) {
    return Response.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  // Verify the challenge was signed by this server (prevents forged challenges)
  const dotIndex = challenge.lastIndexOf(".");
  if (dotIndex === -1) {
    return Response.json({ error: "Invalid OTP" }, { status: 401 });
  }
  const payload = challenge.slice(0, dotIndex);
  const sig = challenge.slice(dotIndex + 1);

  const hmacKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const sigBytes = Uint8Array.from(atob(sig), (c) => c.charCodeAt(0));
  const sigValid = await crypto.subtle.verify(
    "HMAC",
    hmacKey,
    sigBytes,
    new TextEncoder().encode(payload)
  );
  if (!sigValid) {
    return Response.json({ error: "Invalid OTP" }, { status: 401 });
  }

  // Decode payload and check expiry
  const { otpHash, exp } = JSON.parse(atob(payload));
  if (Date.now() > exp) {
    return Response.json({ error: "OTP expired" }, { status: 401 });
  }

  // Verify the submitted OTP matches the hashed one in the challenge
  const inputHashBuf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(otp + secret)
  );
  const inputHash = btoa(String.fromCharCode(...new Uint8Array(inputHashBuf)));
  console.log("[auth-verify-otp] sig valid:", sigValid, "| expired:", Date.now() > exp, "| otp match:", inputHash === otpHash);
  if (inputHash !== otpHash) {
    return Response.json({ error: "Invalid OTP" }, { status: 401 });
  }

  // OTP verified — build 7-day session cookie
  const phone = Deno.env.get("DASHBOARD_PHONE") ?? "dashboard";
  const sessionExp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const sessionData = btoa(JSON.stringify({ phone, exp: sessionExp }));

  const sessionKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sessionSigBuf = await crypto.subtle.sign(
    "HMAC",
    sessionKey,
    new TextEncoder().encode(sessionData)
  );
  const sessionToken = `${sessionData}.${btoa(String.fromCharCode(...new Uint8Array(sessionSigBuf)))}`;

  const headers = new Headers({
    Location: "/dashboard",
    "Set-Cookie": `ot_session=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 3600}`,
  });

  return new Response(null, { status: 302, headers });
}

export const config: Config = { path: "/api/auth/verify-otp" };
