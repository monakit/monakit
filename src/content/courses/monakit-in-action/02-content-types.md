---
title: "Content Types at a Glance"
description: "A quick reference for MonaKit's four content types and where each one lives."
---

MonaKit organises content into four types. Each lives under `src/content/<type>/YYYY-MM/`.

## Knowledge Cards

Bite-sized, structured summaries of a single concept, tool, or finding. The body is a JSON object in a fenced code block — not free Markdown.

```
src/content/cards/2026-05/zod-basics.md
```

## Blog Articles

Long-form writing: tutorials, deep dives, opinions, case studies. Supports Markdown, MDX, and Mermaid diagrams.

```
src/content/blogs/2026-05/my-first-post.md
```

## Slide Presentations

Full reveal.js presentations from a single Markdown file. Separate slides with `---`.

```
src/content/slides/2026-05/my-deck.md
```

## Doodles

Time-bound announcements. Set `pubDate` and `endDate` — the doodle appears automatically while active and disappears when it expires.

```
src/content/doodles/2026-05/v2-released.md
```

---

For a full walkthrough of each content type, see the complete course at [mymona.xyz/courses/monakit-in-action](https://www.mymona.xyz/courses/monakit-in-action).
