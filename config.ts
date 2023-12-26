import { load } from "https://deno.land/std@0.210.0/dotenv/mod.ts"

await load({ export: true })
export const APP_PORT = Deno.env.get("APP_PORT") || 4000
export const JWT_TOKEN_SECRET =
  Deno.env.get("JWT_TOKEN_SECRET") || "your_secret_key_here"
