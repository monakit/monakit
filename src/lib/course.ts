import {
  type ChapterRefType,
  isChapterRef,
  isPartDef,
  type PartDefType,
  type StructureItemType,
} from "@/types/course";

export interface FlatChapter {
  slug: string;
  title: string;
  free: boolean;
  partTitle?: string;
  partIndex?: number;
  chapterIndex: number;
}

export interface ChapterNavigation {
  previous?: FlatChapter;
  current: FlatChapter;
  next?: FlatChapter;
}

/**
 * Flatten course structure into a single array of chapters
 */
export function getFlatChapterList(
  structure: StructureItemType[],
): FlatChapter[] {
  const chapters: FlatChapter[] = [];
  let globalIndex = 0;

  for (let i = 0; i < structure.length; i++) {
    const item = structure[i];

    if (isPartDef(item)) {
      const part = item as PartDefType;
      for (const chapter of part.chapters) {
        chapters.push({
          slug: chapter.slug,
          title: chapter.title,
          free: chapter.free ?? false,
          partTitle: part.title,
          partIndex: i,
          chapterIndex: globalIndex++,
        });
      }
    } else if (isChapterRef(item)) {
      const chapter = item as ChapterRefType;
      chapters.push({
        slug: chapter.slug,
        title: chapter.title,
        free: chapter.free ?? false,
        chapterIndex: globalIndex++,
      });
    }
  }

  return chapters;
}

/**
 * Get total chapter count from structure
 */
export function getChapterCount(structure: StructureItemType[]): number {
  return getFlatChapterList(structure).length;
}

/**
 * Get chapter navigation (previous, current, next)
 */
export function getChapterNavigation(
  structure: StructureItemType[],
  currentSlug: string,
): ChapterNavigation | null {
  const chapters = getFlatChapterList(structure);
  const currentIndex = chapters.findIndex((ch) => ch.slug === currentSlug);

  if (currentIndex === -1) {
    return null;
  }

  return {
    previous: currentIndex > 0 ? chapters[currentIndex - 1] : undefined,
    current: chapters[currentIndex],
    next:
      currentIndex < chapters.length - 1
        ? chapters[currentIndex + 1]
        : undefined,
  };
}

/**
 * Check if a chapter is free
 */
export function isChapterFree(
  structure: StructureItemType[],
  chapterSlug: string,
): boolean {
  const chapters = getFlatChapterList(structure);
  const chapter = chapters.find((ch) => ch.slug === chapterSlug);
  return chapter?.free ?? false;
}

/**
 * Get the first chapter of a course
 */
export function getFirstChapter(
  structure: StructureItemType[],
): FlatChapter | undefined {
  const chapters = getFlatChapterList(structure);
  return chapters[0];
}

/**
 * Get course ID from chapter ID (e.g., "my-course/01-intro" -> "my-course")
 */
export function getCourseIdFromChapterId(chapterId: string): string {
  const parts = chapterId.split("/");
  return parts.slice(0, -1).join("/");
}

/**
 * Get chapter slug from chapter ID (e.g., "my-course/01-intro" -> "01-intro")
 */
export function getChapterSlugFromId(chapterId: string): string {
  const parts = chapterId.split("/");
  return parts[parts.length - 1];
}

/**
 * Build chapter ID from course ID and slug
 */
export function buildChapterId(courseId: string, chapterSlug: string): string {
  return `${courseId}/${chapterSlug}`;
}

/**
 * Structure helper: group chapters by parts for rendering
 */
export interface StructuredTOC {
  type: "part" | "chapter";
  title: string;
  chapters?: FlatChapter[];
  chapter?: FlatChapter;
}

export function getStructuredTOC(
  structure: StructureItemType[],
): StructuredTOC[] {
  const result: StructuredTOC[] = [];
  let globalIndex = 0;

  for (let i = 0; i < structure.length; i++) {
    const item = structure[i];

    if (isPartDef(item)) {
      const part = item as PartDefType;
      const chapters: FlatChapter[] = part.chapters.map((chapter) => ({
        slug: chapter.slug,
        title: chapter.title,
        free: chapter.free ?? false,
        partTitle: part.title,
        partIndex: i,
        chapterIndex: globalIndex++,
      }));

      result.push({
        type: "part",
        title: part.title,
        chapters,
      });
    } else if (isChapterRef(item)) {
      const chapter = item as ChapterRefType;
      result.push({
        type: "chapter",
        title: chapter.title,
        chapter: {
          slug: chapter.slug,
          title: chapter.title,
          free: chapter.free ?? false,
          chapterIndex: globalIndex++,
        },
      });
    }
  }

  return result;
}
