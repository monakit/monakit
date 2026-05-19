import type { CollectionEntry } from "astro:content";

export interface AdjacentContent {
  previous?: {
    id: string;
    title: string;
    pubDate: Date;
  };
  next?: {
    id: string;
    title: string;
    pubDate: Date;
  };
}

export function getAdjacentContent(
  items: CollectionEntry<
    "blogs" | "slides" | "cards" | "doodles" | "courses"
  >[],
  currentId: string,
): AdjacentContent {
  // Sort by publication date (newest first)
  const sortedItems = items.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  const currentIndex = sortedItems.findIndex((item) => item.id === currentId);

  if (currentIndex === -1) {
    return {};
  }

  const result: AdjacentContent = {};

  // Previous item (newer, previous in array)
  if (currentIndex > 0) {
    const prev = sortedItems[currentIndex - 1];
    result.previous = {
      id: prev.id,
      title: prev.data.title,
      pubDate: prev.data.pubDate,
    };
  }

  // Next item (older, next in array)
  if (currentIndex < sortedItems.length - 1) {
    const next = sortedItems[currentIndex + 1];
    result.next = {
      id: next.id,
      title: next.data.title,
      pubDate: next.data.pubDate,
    };
  }

  return result;
}
