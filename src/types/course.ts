/**
 * Client-safe course types and type guards.
 * These are independent of Zod/astro:content and can be used in client components.
 */

// Chapter reference in TOC
export interface ChapterRefType {
  slug: string;
  title: string;
  free?: boolean;
}

// Part (optional grouping)
export interface PartDefType {
  title: string;
  chapters: ChapterRefType[];
}

// Structure can be flat chapters OR parts with chapters
export type StructureItemType = PartDefType | ChapterRefType;

// Type guard: check if structure item is a Part (has chapters array)
export function isPartDef(item: StructureItemType): item is PartDefType {
  return "chapters" in item;
}

// Type guard: check if structure item is a Chapter reference
export function isChapterRef(item: StructureItemType): item is ChapterRefType {
  return "slug" in item && !("chapters" in item);
}
