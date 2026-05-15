import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import sitemap from "@inox-tools/sitemap-ext";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { analyzer } from "vite-bundle-analyzer";
import { env } from "./src/env";

export default defineConfig({
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
  site: env().SITE_URL,
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
    react({
      include: [
        "**/components/image-viewer.tsx",
        "**/components/slide/slide-viewer.tsx",
        "**/components/course/CourseSidebar.tsx",
      ],
    }),
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
  env: {
    schema: {
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
    },
  },
  security: {
    checkOrigin: false,
  },
});
