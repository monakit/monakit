import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import sitemap from "@inox-tools/sitemap-ext";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { loadEnv } from "vite";
import { analyzer } from "vite-bundle-analyzer";
import { envSchema } from "./src/envSchema";

const { SITE_URL } = loadEnv(process.env.NODE_ENV, process.cwd(), "");

export default defineConfig({
  env: {
    schema: envSchema,
  },
  server: {
    // This will allow all hosts to be used in development. Not only localhost.
    allowedHosts: true,
  },
  trailingSlash: "never",
  output: "server",
  image: {
    domains: ["public-files.gumroad.com"],
  },
  adapter: vercel({
    imageService: true,
  }),
  site: SITE_URL || "http://localhost:4321",
  markdown: {
    rehypePlugins: [rehypeSanitize(defaultSchema)],
  },
  integrations: [
    sitemap({
      includeByDefault: true,
    }),
    mdx({
      rehypePlugins: [rehypeSanitize(defaultSchema)],
    }),
    react(),
  ],
  vite: {
    plugins: [
      tailwindcss(),
      process.env.ANALYZE &&
        analyzer({
          analyzerMode: "static",
          reportFilename: "dist/bundle-report.html",
          openAnalyzer: false,
        }),
    ].filter(Boolean),
  },
});
