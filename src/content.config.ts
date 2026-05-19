import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { BlogMetadata } from "./schemas/content/blog";
import { CardMetadata } from "./schemas/content/card";
import {
  ChapterMetadata,
  CourseMetadata,
  CourseSlideResource,
} from "./schemas/content/course";
import { DoodleMetadata } from "./schemas/content/doodle";
import { SlideMetadata } from "./schemas/content/slide";

const blogs = defineCollection({
  loader: glob({
    base: "./src/content/blogs",
    pattern: "**/*.{md,mdx}",
  }),
  schema: BlogMetadata,
});

const cards = defineCollection({
  loader: glob({
    base: "./src/content/cards",
    pattern: "**/*.{md,mdx}",
  }),
  schema: CardMetadata,
});

const slides = defineCollection({
  loader: glob({
    base: "./src/content/slides",
    pattern: "**/*.{md,mdx}",
  }),
  schema: SlideMetadata,
});

const doodles = defineCollection({
  loader: glob({ base: "./src/content/doodles", pattern: "**/*.{md,mdx}" }),
  schema: DoodleMetadata,
});

const courses = defineCollection({
  loader: glob({
    base: "./src/content/courses",
    pattern: "**/toc.{md,mdx}",
  }),
  schema: CourseMetadata,
});

const courseChapters = defineCollection({
  loader: glob({
    base: "./src/content/courses",
    pattern: "**/[0-9][0-9]-*.{md,mdx}",
  }),
  schema: ChapterMetadata,
});

const courseSlideResources = defineCollection({
  loader: glob({
    base: "./src/content/courses",
    pattern: "**/slides/*.{md,mdx}",
  }),
  schema: CourseSlideResource,
});

export const collections = {
  blogs,
  cards,
  slides,
  doodles,
  courses,
  courseChapters,
  courseSlideResources,
};
