import { envField } from "astro/config";

export const envSchema = {
  SITE_URL: envField.string({
    context: "server",
    access: "secret",
    default: "http://localhost:4321",
  }),
  CLOUDFLARE_STREAM_CUSTOMER_CODE: envField.string({
    context: "server",
    access: "secret",
    optional: true,
  }),
  CLOUDFLARE_STREAM_KEY_ID: envField.string({
    context: "server",
    access: "secret",
    optional: true,
  }),
  CLOUDFLARE_STREAM_PRIVATE_KEY: envField.string({
    context: "server",
    access: "secret",
    optional: true,
  }),
};
