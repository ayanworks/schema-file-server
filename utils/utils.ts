import { Header, Payload, create } from "https://deno.land/x/djwt@v3.0.1/mod.ts"
import * as base64 from "https://deno.land/std@0.207.0/encoding/base64.ts"
import { ISSUER, JWT_TOKEN_SECRET } from "../config.ts"

export const secretKey = await crypto.subtle.importKey(
  "raw",
  base64.decodeBase64(JWT_TOKEN_SECRET),
  { name: "HMAC", hash: "SHA-256" },
  true,
  ["sign", "verify"]
)

const header: Header = {
  alg: "HS256",
  typ: "JWT",
}

export const getAuthToken = async () => {
  const payload: Payload = {
    iss: ISSUER,
    id: crypto.randomUUID(),
  }

  const jwt = await create(header, payload, secretKey)

  return {
    token: jwt,
    payload,
  }
}
