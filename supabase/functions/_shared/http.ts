import { CONFIG } from "./config.ts";

const allowedOrigins = CONFIG.allowedOrigin
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const originFor = (request: Request) => {
  if (allowedOrigins.includes("*")) return "*";
  const origin = request.headers.get("Origin") ?? "";
  return allowedOrigins.includes(origin) ? origin : allowedOrigins[0] ?? "";
};

const corsHeaders = (request: Request) => ({
  "Access-Control-Allow-Origin": originFor(request),
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  Vary: "Origin",
});

export const responder = (request: Request) => ({
  json: (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders(request), "Content-Type": "application/json" },
    }),
  preflight: () =>
    request.method === "OPTIONS"
      ? new Response("ok", { headers: corsHeaders(request) })
      : null,
});
