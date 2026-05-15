import { useState } from "react";
import { type FlatChapter, getStructuredTOC } from "@/lib/course";
import type { StructureItemType } from "@/types/course";

interface Props {
  courseId: string;
  courseTitle: string;
  structure: StructureItemType[];
  currentSlug: string;
}

export function CourseSidebar({
  courseId,
  courseTitle,
  structure,
  currentSlug,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const toc = getStructuredTOC(structure);

  const renderChapterLink = (chapter: FlatChapter, isActive: boolean) => {
    return (
      <a
        key={chapter.slug}
        href={`/courses/${courseId}/${chapter.slug}`}
        className={`flex items-center gap-2 px-3 py-2 text-sm rounded-r transition-colors ${
          isActive
            ? "bg-emerald-500/20 text-emerald-400 border-l-2 border-emerald-500 -ml-0.5"
            : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }`}
        onClick={() => setIsOpen(false)}
      >
        <span className="flex-1 truncate">{chapter.title}</span>
        {chapter.free && (
          <span className="text-xs px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">
            FREE
          </span>
        )}
      </a>
    );
  };

  const renderTOC = () => (
    <nav className="space-y-4">
      {toc.map((item) => {
        if (item.type === "part" && item.chapters) {
          return (
            <div key={`part-${item.title}`} className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                {item.title}
              </h4>
              <ul className="space-y-1 pl-2 border-l border-slate-700">
                {item.chapters.map((chapter) =>
                  renderChapterLink(chapter, chapter.slug === currentSlug),
                )}
              </ul>
            </div>
          );
        }
        if (item.type === "chapter" && item.chapter) {
          return renderChapterLink(
            item.chapter,
            item.chapter.slug === currentSlug,
          );
        }
        return null;
      })}
    </nav>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-4 left-4 z-40 flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg shadow-lg text-slate-300 hover:bg-slate-700 transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        <span className="text-sm font-medium">TOC</span>
      </button>

      {isOpen && (
        <button
          type="button"
          className="lg:hidden fixed inset-0 z-50 bg-black/50 cursor-default"
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
          aria-label="Close menu"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-auto h-full lg:h-auto w-72 lg:w-64 bg-slate-900 lg:bg-transparent border-r border-slate-700 lg:border-0 transform transition-transform duration-300 lg:transform-none ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full lg:h-auto overflow-y-auto p-4 lg:p-0 lg:sticky lg:top-24">
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <a
              href={`/courses/${courseId}`}
              className="text-lg font-semibold text-white hover:text-emerald-400 transition-colors"
            >
              {courseTitle}
            </a>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-2 text-slate-400 hover:text-white"
              aria-label="Close sidebar"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <a
            href={`/courses/${courseId}`}
            className="hidden lg:block text-lg font-semibold text-white hover:text-emerald-400 transition-colors mb-4"
          >
            {courseTitle}
          </a>

          {renderTOC()}
        </div>
      </aside>
    </>
  );
}
