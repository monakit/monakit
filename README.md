# MonaKit

Multi-format content platform built with Astro, featuring knowledge cards, articles, presentations, announcements, and courses.

## Features

- **Knowledge Cards** - Research summaries with customizable themes
- **Articles** - Long-form blog content
- **Slide Presentations** - Interactive reveal.js presentations
- **Doodles** - Release logs and announcements (Mona Pulse)
- **Courses** - Structured learning with chapters, parts, and slide chapters
- **Video** - Course video support via Cloudflare Stream
- **Search** - Full-text search with Pagefind
- **Promotion** - Product and link showcase

## Tech Stack

- Astro 5 (SSR)
- React 19
- TailwindCSS 4
- Reveal.js
- Pagefind

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
pnpm build:search-index # Build search index manually
pnpm check              # Type check and lint
pnpm fix                # Auto-fix issues
```

## Content Structure

```
src/content/
├── cards/      # Knowledge cards (Markdown)
├── blogs/      # Blog articles (Markdown)
├── slides/     # Presentations (Markdown)
├── doodles/    # Announcements (Markdown)
└── courses/    # Courses (Markdown)
    └── <course-id>/
        ├── toc.md          # Course metadata + chapter order
        ├── 01-chapter.md   # Chapter file (text or slide)
        └── slides/         # Slide resources (embedded in chapters)
```

Content organized by `year/month` subdirectories, except courses which are organized by `course-id`.

## Courses

Each course lives in `src/content/courses/<course-id>/`:

- **`toc.md`** — course metadata (`title`, `description`, `pubDate`, `structure`) and optional intro body
- **`NN-slug.md`** — chapter files, numbered for ordering; add `theme:` frontmatter to make a chapter a reveal.js slide
- **`slides/`** — standalone slide resources that can be embedded in chapter `.mdx` files via `<Slide id="slug" />`

Chapters can optionally include video via Cloudflare Stream. See [MonaKit in Action](https://www.mymona.xyz/courses/monakit-in-action) for a full walkthrough.

### Cloudflare Stream (optional)

To enable video in courses, generate a signing key pair and set the following env vars:

```bash
# Generate KEY_ID and PRIVATE_KEY
pnpm tsx scripts/generate-stream-key.ts
```

```env
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_API_TOKEN=
CLOUDFLARE_STREAM_CUSTOMER_CODE=
CLOUDFLARE_STREAM_KEY_ID=
CLOUDFLARE_STREAM_PRIVATE_KEY=
```

## Product Data

All products data is defined in `src/assets/creations.json`.
