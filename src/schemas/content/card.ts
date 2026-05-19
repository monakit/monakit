import { z } from "astro/zod";

export const CardMetadata = z.object({
  title: z.string(),
  tags: z.array(z.string()).optional(),
  pubDate: z.coerce.date(),
  template: z.string().default("blackWhite"),
});
