import {
  CLOUDFLARE_STREAM_CUSTOMER_CODE,
  CLOUDFLARE_STREAM_KEY_ID,
  CLOUDFLARE_STREAM_PRIVATE_KEY,
} from "astro:env/server";

// Cloudflare Stream enforces a maximum of 24 hours
const VIDEO_TOKEN_TTL_SECONDS = 8 * 60 * 60;

function base64UrlEncode(data: ArrayBuffer | Uint8Array): string {
  return Buffer.from(new Uint8Array(data))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function encodePayload(obj: object): string {
  return base64UrlEncode(new TextEncoder().encode(JSON.stringify(obj)));
}

export async function getSignedEmbedUrl(
  videoUID: string,
): Promise<string | null> {
  if (
    !CLOUDFLARE_STREAM_PRIVATE_KEY ||
    !CLOUDFLARE_STREAM_KEY_ID ||
    !CLOUDFLARE_STREAM_CUSTOMER_CODE
  ) {
    return null;
  }

  const jwk = JSON.parse(
    Buffer.from(CLOUDFLARE_STREAM_PRIVATE_KEY, "base64").toString("utf-8"),
  );
  const key = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const header = encodePayload({ alg: "RS256", kid: CLOUDFLARE_STREAM_KEY_ID });
  const payload = encodePayload({
    sub: videoUID,
    kid: CLOUDFLARE_STREAM_KEY_ID,
    exp: Math.floor(Date.now() / 1000) + VIDEO_TOKEN_TTL_SECONDS,
    downloadable: false,
  });

  const data = new TextEncoder().encode(`${header}.${payload}`);
  const signature = await crypto.subtle.sign(
    { name: "RSASSA-PKCS1-v1_5" },
    key,
    data,
  );

  const token = `${header}.${payload}.${base64UrlEncode(signature)}`;
  return `https://customer-${CLOUDFLARE_STREAM_CUSTOMER_CODE}.cloudflarestream.com/${token}/iframe`;
}
