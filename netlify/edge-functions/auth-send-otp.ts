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

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const phone = Deno.env.get("DASHBOARD_PHONE");

  const res = await fetch(`${supabaseUrl}/auth/v1/otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseAnonKey!,
    },
    body: JSON.stringify({ phone, create_user: true }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error("Supabase OTP error:", detail);
    return Response.json({ error: "Failed to send OTP" }, { status: 500 });
  }

  return Response.json({ ok: true });
}

export const config: Config = { path: "/api/auth/send-otp" };
