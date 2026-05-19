import { z } from "astro/zod";

// Pagination types
export const PaginationParams = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(10),
});

export type Pagination = z.infer<typeof PaginationParams>;

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
};

export const PageBaseMetadata = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
});

export const BlogMetadata = PageBaseMetadata.extend({
  author: z.string().optional(),
  tags: z.array(z.string()).default([]),
  metadata: z.array(z.string()).optional(),
});

export const BaseAIConfig = z.object({
  temperature: z.number().min(0.1).max(1).default(0.1),
});

export const BlogGenerationConfig = BaseAIConfig.extend({
  tags: z.array(z.string()).optional(),
  sources: z.array(z.string()).optional(),
  contentPrompt: z.string(),
  contentParams: z.record(z.string(), z.any()).optional(),
});

export const BlogConfigFile = z.object({
  defaultConfig: BaseAIConfig,
  topics: z.record(z.string(), BlogGenerationConfig),
});
