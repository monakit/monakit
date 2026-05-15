---
title: "MonaKit Architecture"
theme: "dracula"
transition: "slide"
controls: true
progress: true
---

## Content Pipeline

```mermaid
flowchart LR
    subgraph Content["src/content/"]
        A[Cards]
        B[Blogs]
        C[Slides]
        D[Doodles]
        E[Courses]
    end

    subgraph Astro
        F[Content Collections]
        G[SSR Pages]
    end

    subgraph Output
        H[HTML Pages]
        I[Search Index]
    end

    Content --> F
    F --> G
    G --> H
    G --> I
```

---

## Key Directories

```text
src/
├── content/        # All content (Markdown)
├── components/     # Astro + React components
├── pages/          # File-based routing
├── schemas/        # Zod schemas per content type
├── lib/            # Shared utilities
└── styles/         # Global CSS
```

---

## Courses Are Composed

```mermaid
flowchart TB
    T["toc.md\n(metadata + structure)"]
    C1["01-overview.md\n(slide chapter)"]
    C2["02-content-types.md\n(text chapter)"]
    C3["03-structure.mdx\n(text + embedded slide)"]
    S["slides/architecture.md\n(slide resource)"]

    T --> C1
    T --> C2
    T --> C3
    C3 -. "&lt;Slide id='architecture' /&gt;" .-> S
```
