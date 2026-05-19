import { z } from "astro/zod";

export const SlideTheme = z.enum([
  "black",
  "white",
  "league",
  "beige",
  "dracula",
  "sky",
  "night",
  "serif",
  "simple",
  "solarized",
  "blood",
  "moon",
]);

export const SlideConfig = z.object({
  theme: SlideTheme.default("beige"),
  transition: z.string().default("slide"),
  controls: z.boolean().default(true),
  progress: z.boolean().default(true),
});

export const SlideMetadata = z
  .object({
    title: z.string(),
    author: z.string().optional(),
    description: z.string(),
    tags: z.array(z.string()).optional(),
    pubDate: z.coerce.date(),
  })
  .extend(SlideConfig.shape);
