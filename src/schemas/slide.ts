import { z } from "astro:content";

export const SlideConfig = z.object({
  theme: z
    .enum([
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
    ])
    .default("beige"),
  transition: z.string().default("slide"),
  controls: z.boolean().default(true),
  progress: z.boolean().default(true),
});

export const SlideMetadata = SlideConfig.extend({
  title: z.string(),
  author: z.string().optional(),
  description: z.string(),
  tags: z.array(z.string()).optional(),
  pubDate: z.coerce.date(),
});
