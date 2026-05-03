import type { Config, Context } from "@netlify/edge-functions";

export default async function handler(request: Request, context: Context) {
  const sessionCookie = context.cookies.get("ot_session");
  const hasCookie = !!sessionCookie;
  console.log("[dashboard-gate] invoked", { hasCookie, url: request.url });

  if (!sessionCookie) {
    console.log("[dashboard-gate] no cookie → redirect to login");
    return Response.redirect(new URL("/dashboard-login", request.url));
  }

  const valid = await validateSession(sessionCookie);
  console.log("[dashboard-gate] session valid:", valid);

  if (!valid) {
    console.log("[dashboard-gate] invalid session → redirect to login");
    return Response.redirect(new URL("/dashboard-login", request.url));
  }

  console.log("[dashboard-gate] PASS — serving dashboard");
  return context.next();
}

async function validateSession(token: string): Promise<boolean> {
  try {
    const secret = Deno.env.get("SESSION_SECRET");
    if (!secret) return false;

    const dotIndex = token.lastIndexOf(".");
    if (dotIndex === -1) return false;

    const data = token.slice(0, dotIndex);
    const sig = token.slice(dotIndex + 1);

    const payload = JSON.parse(atob(data));
    if (Date.now() > payload.exp) return false;

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const sigBytes = Uint8Array.from(atob(sig), (c) => c.charCodeAt(0));
    return crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      new TextEncoder().encode(data)
    );
  } catch {
    return false;
  }
}

export const config: Config = { path: "/dashboard" };
