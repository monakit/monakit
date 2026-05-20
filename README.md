# MonaKit

Multi-format content platform built with Astro, featuring knowledge cards, articles, presentations, announcements, and courses.

## Features

- **Knowledge Cards** - Research summaries with customizable themes
- **Articles** - Long-form blog content
- **Slide Presentations** - Interactive reveal.js presentations with Mermaid and math support
- **Doodles** - Release logs and announcements
- **Courses** - Structured learning with chapters, parts, and slide chapters
- **Video** - Course video support via Cloudflare Stream
- **Search** - Full-text search with Pagefind
- **Creations** - Product and link showcase
- **RSS Feed** - Auto-generated feed for blogs
- **OG Images** - Dynamic Open Graph image generation
- **Sitemap** - Auto-generated sitemap

## Tech Stack

- Astro 6 (SSR, Vercel adapter)
- React 19
- TailwindCSS 4
- Reveal.js
- Pagefind
- Biome (lint + format)

## Quick Start

```bash
npm create astro@latest my-astro-project -- --template monakit/monakit
```

## Development

```bash
pnpm install
cp .env.example .env
pnpm dev
```

### Available Scripts

```bash
pnpm dev                # Start dev server
pnpm build              # Production build (auto-builds search index)
pnpm preview            # Preview production build
pnpm build:search-index # Build search index manually
pnpm build:analyze      # Build with bundle analyzer report
pnpm check              # Type check and lint
pnpm fix                # Auto-fix issues
pnpm format             # Format files with Biome
```

## Content Structure

```
src/content/
├── cards/      # Knowledge cards (Markdown/MDX)
├── blogs/      # Blog articles (Markdown/MDX)
├── slides/     # Presentations (Markdown/MDX)
├── doodles/    # Announcements (Markdown/MDX)
└── courses/    # Courses (Markdown/MDX)
    └── <course-id>/
        ├── toc.md          # Course metadata + chapter order
        ├── 01-chapter.md   # Chapter file (text or slide)
        └── slides/         # Slide resources (embedded in chapters)
```

Content organized by `year/month` subdirectories, except courses which are organized by `course-id`.

## Courses

Each course lives in `src/content/courses/<course-id>/`:

- **`toc.md`** — course metadata (`title`, `description`, `pubDate`, `structure`, optional `video` for course trailer) and optional intro body
- **`NN-slug.md`** — chapter files, numbered for ordering; add `theme:` frontmatter to make a chapter a reveal.js slide
- **`slides/`** — standalone slide resources that can be embedded in chapter `.mdx` files via `<Slide id="slug" />`

Chapters can optionally include video via Cloudflare Stream. See [MonaKit in Action](https://www.mymona.xyz/courses/monakit-in-action) for a full walkthrough.

### Cloudflare Stream (optional)

To enable video in courses, generate a signing key pair and set the following env vars:

```bash
# Generate KEY_ID and PRIVATE_KEY (only needed once)
npx tsx scripts/generate-stream-key.ts
```

```env
SITE_URL=https://yourdomain.com

# Cloudflare Stream (optional — for video chapters and course trailers)
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_API_TOKEN=
CLOUDFLARE_STREAM_CUSTOMER_CODE=
CLOUDFLARE_STREAM_KEY_ID=
CLOUDFLARE_STREAM_PRIVATE_KEY=
```

Note: `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` are only needed to run the key generation script — they are not used at runtime.

## Product Data

All creations data is defined in `src/assets/creations.json`.
