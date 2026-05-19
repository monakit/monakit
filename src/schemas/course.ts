import { z } from "astro/zod";
import { SlideConfig, SlideTheme } from "./slide";

export {
  type ChapterRefType,
  isChapterRef,
  isPartDef,
  type PartDefType,
  type StructureItemType,
} from "@/types/course";

export const ChapterRef = z.object({
  slug: z.string(),
  title: z.string(),
  free: z.boolean().default(false),
});

export const PartDef = z.object({
  title: z.string(),
  chapters: z.array(ChapterRef),
});

export const StructureItem = z.union([PartDef, ChapterRef]);

export const CourseMetadata = z.object({
  title: z.string(),
  description: z.string(),
  author: z.string().optional(),
  tags: z.array(z.string()).default([]),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  cover: z.string().optional(),
  video: z.string().optional(),
  structure: z.array(StructureItem),
});

const EmbeddedSlideConfig = SlideConfig.extend({
  theme: SlideTheme.optional(),
}).partial();

// Chapter metadata (for individual chapter files)
// When `theme` is present the chapter renders as a reveal.js slide.
export const ChapterMetadata = z.object({
  title: z.string(),
  description: z.string().optional(),
  ...EmbeddedSlideConfig.shape,
});

// Slide resource metadata (for courses/<id>/slides/*.md)
export const CourseSlideResource = ChapterMetadata.partial({
  description: true,
});

export type Course = z.infer<typeof CourseMetadata>;
export type Chapter = z.infer<typeof ChapterMetadata>;
export type CourseSlide = z.infer<typeof CourseSlideResource>;
