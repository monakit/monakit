export interface ChapterRefType {
  slug: string;
  title: string;
  free?: boolean;
}

export interface PartDefType {
  title: string;
  chapters: ChapterRefType[];
}

export type StructureItemType = PartDefType | ChapterRefType;

export function isPartDef(item: StructureItemType): item is PartDefType {
  return "chapters" in item;
}

export function isChapterRef(item: StructureItemType): item is ChapterRefType {
  return "slug" in item && !("chapters" in item);
}
