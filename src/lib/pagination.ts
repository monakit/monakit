import type { PaginatedResponse } from "../schemas/content/blog";

export function paginate<T>(
  items: T[],
  page = 1,
  limit = 10,
): PaginatedResponse<T> {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const total = items.length;
  const totalPages = Math.ceil(total / limit);

  return {
    items: items.slice(startIndex, endIndex),
    total,
    page,
    limit,
    totalPages,
    hasMore: endIndex < total,
  };
}
