import type { Config, Context } from "@netlify/edge-functions";

export default async function handler(request: Request, context: Context) {
  const sessionCookie = context.cookies.get("ot_session");

  if (!sessionCookie || !(await validateSession(sessionCookie))) {
    return Response.redirect(new URL("/dashboard-login", request.url));
  }

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
