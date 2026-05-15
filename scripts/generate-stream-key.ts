import fs from "node:fs";
import path from "node:path";

const envPath = path.join(process.cwd(), ".env");
const env: Record<string, string> = {};

for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eq = trimmed.indexOf("=");
  if (eq === -1) continue;
  const key = trimmed.slice(0, eq).trim();
  const value = trimmed
    .slice(eq + 1)
    .trim()
    .replace(/^["']|["']$/g, "");
  env[key] = value;
}

const accountId = env.CLOUDFLARE_ACCOUNT_ID;
const apiToken = env.CLOUDFLARE_API_TOKEN;

if (!accountId || !apiToken) {
  console.error(
    "Missing required env vars: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN",
  );
  process.exit(1);
}

const res = await fetch(
  `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/keys`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
  },
);

const json = await res.json();

if (!json.success) {
  console.error("Cloudflare API error:", JSON.stringify(json.errors, null, 2));
  process.exit(1);
}

const { id, jwk } = json.result;

console.log("\nSigning key generated. Add these to your .env:\n");
console.log(`CLOUDFLARE_STREAM_KEY_ID=${id}`);
console.log(`CLOUDFLARE_STREAM_PRIVATE_KEY=${jwk}`);
