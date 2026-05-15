import { z } from "astro:content";
import { SlideConfig } from "./slide";

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

export const ChapterMetadata = z
  .object({
    title: z.string(),
    description: z.string().optional(),
  })
  .merge(SlideConfig.partial());

export const CourseSlideResource = z
  .object({
    title: z.string().optional(),
  })
  .merge(SlideConfig);

export type Course = z.infer<typeof CourseMetadata>;
export type Chapter = z.infer<typeof ChapterMetadata>;
export type CourseSlide = z.infer<typeof CourseSlideResource>;
