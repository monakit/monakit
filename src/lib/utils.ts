import { type ClassValue, clsx } from "clsx";
import type React from "react";
import { twMerge } from "tailwind-merge";
import type { CardTheme } from "@/consts";
import {
  DEFAULT_KNOWLEDGE_CARD_THEME,
  KNOWLEDGE_CARD_THEME,
} from "@/themes/knowledge-card-themes";

const CATEGORY_GRADIENTS = [
  "from-emerald-100 to-emerald-200",
  "from-amber-100 to-amber-200",
  "from-blue-100 to-blue-200",
  "from-pink-100 to-pink-200",
  "from-purple-100 to-purple-200",
  "from-teal-100 to-teal-200",
  "from-orange-100 to-orange-200",
  "from-cyan-100 to-cyan-200",
  "from-lime-100 to-lime-200",
  "from-gray-100 to-gray-200",
];

export function getCategoryColor(id: string): string {
  const sum = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return CATEGORY_GRADIENTS[sum % CATEGORY_GRADIENTS.length];
}

export const TEMPLATE_KEY_MAP: Record<string, string> = {
  blackwhite: "blackWhite",
  vintage: "vintage",
  glassmorphism: "glassmorphism",
  freshnature: "freshNature",
};

export function getTemplateKey(template: string | undefined): string {
  if (!template) return "blackWhite";
  const key = String(template).toLowerCase();
  return TEMPLATE_KEY_MAP[key] || "blackWhite";
}

const publicCardImages = import.meta.glob<string>("/public/cards/*.png", {
  query: "?inline",
  import: "default",
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFileNameWithoutExtension(fileBaseName: string): string {
  return fileBaseName.split(".").slice(0, -1).join(".");
}

export function truncateText(text: string, length = 80) {
  return text.length > length ? `${text.substring(0, length)}...` : text;
}

export function splitCurrentKey(currentKey: string) {
  const [email, date, topic, title] = currentKey.split("/");
  return { email, date, topic, title };
}

export function truncateMiddle(str: string): string {
  if (!str || str.length <= 6) {
    return str;
  }

  return `${str.substring(0, 3)}...${str.substring(str.length - 3)}`;
}

export function formatDate(dateString: string | Date): string {
  return new Date(dateString).toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function parseStartDate(dateString: string | null): Date | undefined {
  if (!dateString) return undefined;
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function parseEndDate(dateString: string | null): Date | undefined {
  if (!dateString) return undefined;
  const date = new Date(dateString);
  date.setHours(23, 59, 59, 999);
  return date;
}

export function isVideoUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    const pathname = urlObj.pathname.toLowerCase();

    const videoPatterns = [
      {
        hosts: ["youtube.com", "www.youtube.com", "m.youtube.com"],
        paths: ["/watch", "/embed/", "/v/"],
      },
      { hosts: ["youtu.be"], paths: ["/"] },
      { hosts: ["music.youtube.com"], paths: ["/watch"] },

      {
        hosts: ["bilibili.com", "www.bilibili.com", "m.bilibili.com"],
        paths: ["/video/", "/bangumi/"],
      },
      { hosts: ["v.qq.com"], paths: ["/x/cover/", "/x/page/"] },
      { hosts: ["youku.com", "v.youku.com"], paths: ["/v_show/"] },
      { hosts: ["iqiyi.com", "www.iqiyi.com"], paths: ["/v_", "/a_"] },
      { hosts: ["acfun.cn", "www.acfun.cn"], paths: ["/v/"] },

      { hosts: ["vimeo.com"], paths: ["/"] },
      { hosts: ["dailymotion.com"], paths: ["/video/"] },
      { hosts: ["twitch.tv"], paths: ["/videos/"] },
      { hosts: ["facebook.com", "www.facebook.com"], paths: ["/watch/"] },
      {
        hosts: ["instagram.com", "www.instagram.com"],
        paths: ["/reel/", "/tv/"],
      },
      { hosts: ["tiktok.com", "www.tiktok.com"], paths: ["/@"] },

      { hosts: ["video.weibo.com"], paths: ["/show"] },
      { hosts: ["tv.sohu.com"], paths: ["/v/"] },
      { hosts: ["56.com"], paths: ["/u"] },
    ];

    for (const pattern of videoPatterns) {
      if (pattern.hosts.includes(hostname)) {
        if (pattern.paths.length === 1 && pattern.paths[0] === "/") {
          return true;
        }

        for (const path of pattern.paths) {
          if (pathname.startsWith(path)) {
            return true;
          }
        }
      }
    }

    const videoExtensions = [
      ".mp4",
      ".avi",
      ".mov",
      ".wmv",
      ".flv",
      ".webm",
      ".mkv",
      ".m4v",
      ".3gp",
      ".ogv",
      ".ts",
      ".m3u8",
    ];

    for (const ext of videoExtensions) {
      if (pathname.endsWith(ext)) {
        return true;
      }
    }

    const searchParams = urlObj.searchParams;
    if (searchParams.has("v") && hostname.includes("youtube")) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

export async function loadSourceContent(sources: string[]) {
  const contents = [];
  const failedSources = [];

  for (const source of sources) {
    try {
      try {
        new URL(source);
      } catch {
        throw new Error("Invalid URL");
      }

      if (/\.(pdf|doc|docx|txt|csv|pptx|xlsx)$/i.exec(source)) {
        throw new Error("Document URL detected");
      }
      if (isVideoUrl(source)) {
        throw new Error("Video URL detected");
      }
      const websiteContent = await loadWebsite(source);
      if (websiteContent.length === 0 || !websiteContent[0].pageContent) {
        throw new Error("No content found");
      }
      contents.push(...websiteContent);
    } catch (error) {
      console.warn(`Failed to load source ${source}:`, error);
      failedSources.push({
        source,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
  return { contents, failedSources };
}

async function loadWebsite(uri: string) {
  try {
    const response = await fetch("/api/proxy/web-content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: uri }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.docs;
  } catch (error) {
    console.error(`Failed to load website ${uri}:`, error);
    throw error;
  }
}

export async function loadPako(mermaidMarkdown: string) {
  try {
    const { deflate } = await import("pako");
    const { fromUint8Array } = await import("js-base64");

    const cleanedText = cleanText(mermaidMarkdown);
    const json = JSON.stringify({ code: cleanedText });
    const structureText = parseMindmapToJson(cleanedText);
    const encodeData = new TextEncoder().encode(json);
    const compressed = deflate(encodeData, { level: 9 });
    const base64 = fromUint8Array(compressed, true);
    return {
      pakoValue: base64,
      structureText: structureText,
      cleanedText: cleanedText,
    };
  } catch (error) {
    console.error("Error", error);
  }
}

function cleanText(text: string): string {
  const lines: string[] = [];
  for (const lineRaw of text.split("\n")) {
    let line = lineRaw;
    if (line.includes("root((")) {
      const pattern = /(\(\([^()]*?)\s+\([^()]*?\)(.*?\)\))/;
      line = line.replace(pattern, (_match, p1, p2) => `${p1}${p2}`);
    } else {
      const pattern = /\s*\([^()]*?\)\s*(?=:|\w|\s)/g;
      line = line.replace(pattern, "");
    }
    lines.push(line);
  }

  let mmMarkdown = lines.join("\n");
  if (!mmMarkdown.startsWith("mindmap")) {
    mmMarkdown = `mindmap\n${mmMarkdown}`;
  }
  return mmMarkdown;
}

export function parseMindmapToJson(text: string): {
  root: string;
  branches: Array<{
    title: string;
    subBranches: Array<{ title: string; leaves: string[] }>;
  }>;
} {
  const lines = text.split("\n").filter((line) => line.trim());
  const result = {
    root: "",
    branches: [] as Array<{
      title: string;
      subBranches: Array<{ title: string; leaves: string[] }>;
    }>,
  };

  let currentBranch: {
    title: string;
    subBranches: Array<{ title: string; leaves: string[] }>;
  } | null = null;
  let currentSubBranch: { title: string; leaves: string[] } | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine === "mindmap") {
      continue;
    }

    if (trimmedLine.includes("root((")) {
      const rootMatch = trimmedLine.match(/root\(\(([^)]+)\)\)/);
      if (rootMatch) {
        result.root = rootMatch[1].trim();
      }
      continue;
    }

    const indentLevel = line.length - line.trimStart().length;

    if (indentLevel === 4) {
      // Level 1 branch
      const title = trimmedLine;
      currentBranch = { title, subBranches: [] };
      currentSubBranch = null;
      result.branches.push(currentBranch);
    } else if (indentLevel === 6 && currentBranch) {
      // Level 2 sub-branch
      const title = trimmedLine;
      currentSubBranch = { title, leaves: [] };
      currentBranch.subBranches.push(currentSubBranch);
    } else if (indentLevel === 8 && currentSubBranch) {
      // Level 3 leaf
      const leaf = trimmedLine;
      currentSubBranch.leaves.push(leaf);
    }
  }

  return result;
}

function getCardCSSVariablesObject(
  theme: string | CardTheme,
): Record<string, string | undefined> {
  const cardTheme =
    typeof theme === "string"
      ? KNOWLEDGE_CARD_THEME[theme] ||
        KNOWLEDGE_CARD_THEME[DEFAULT_KNOWLEDGE_CARD_THEME]
      : theme;

  return {
    "--card-text-color": cardTheme.textColor,
    "--card-background-class": cardTheme.backgroundClass,
    "--card-accent-color": cardTheme.accentColor,
    "--card-border-color": cardTheme.borderColor,
    "--card-subtle-color": cardTheme.subtleColor,
    "--card-decorative-line-color": cardTheme.decorativeLineColor,
    "--card-number-color": cardTheme.numberColor,
    "--card-background-color": cardTheme.backgroundColor,
    "--card-background-image": cardTheme.backgroundImage,
    "--card-title-color": cardTheme.titleColor,
    "--card-title-font-size": cardTheme.titleFontSize,
    "--card-title-font-weight": cardTheme.titleFontWeight,
    "--card-title-font-family": cardTheme.titleFontFamily,
    "--card-description-color": cardTheme.descriptionColor,
    "--card-description-font-size": cardTheme.descriptionFontSize,
    "--card-description-font-family": cardTheme.descriptionFontFamily,
    "--card-section-title-color": cardTheme.sectionTitleColor,
    "--card-section-title-font-size": cardTheme.sectionTitleFontSize,
    "--card-section-title-font-weight": cardTheme.sectionTitleFontWeight,
    "--card-section-title-font-family": cardTheme.sectionTitleFontFamily,
    "--card-key-point-color": cardTheme.keyPointColor,
    "--card-key-point-font-size": cardTheme.keyPointFontSize,
    "--card-key-point-font-family": cardTheme.keyPointFontFamily,
    "--card-number-background-color": cardTheme.numberBackgroundColor,
    "--card-number-text-color": cardTheme.numberTextColor,
    "--card-number-font-weight": cardTheme.numberFontWeight,
    "--card-number-font-family": cardTheme.numberFontFamily,
    "--card-decorative-line-width": cardTheme.decorativeLineWidth,
    "--card-decorative-line-height": cardTheme.decorativeLineHeight,
    "--card-link-color": cardTheme.linkColor,
    "--card-font-family": cardTheme.fontFamily,
  };
}

export function createCardStyles(
  theme: string | CardTheme,
): React.CSSProperties {
  return getCardCSSVariablesObject(theme) as React.CSSProperties;
}

export function createCardCSSVariables(theme: string | CardTheme): string {
  const cssVars = getCardCSSVariablesObject(theme);

  return Object.entries(cssVars)
    .map(([key, value]) => `${key}: ${value || ""};`)
    .join("\n    ");
}

export async function createCardBackgroundStyles(
  theme: CardTheme,
): Promise<Record<string, string>> {
  if (theme.backgroundImage) {
    try {
      const imagePath = `/public${theme.backgroundImage.replace(/\.webp$/, ".png")}`;
      if (!publicCardImages[imagePath]) {
        console.warn(`Image not found: ${imagePath}`);
        return {};
      }
      const imageBase64 = await publicCardImages[imagePath]();
      return {
        backgroundImage: `url("${imageBase64}")`,
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        position: "relative",
        backgroundRepeat: "no-repeat",
        backdropFilter: "blur(4px) saturate(1.2)",
      };
    } catch (error) {
      console.error("Error reading background image file:", error);
    }
  }
  if (theme.gradient) {
    return {
      backgroundImage: theme.gradient,
      position: "relative",
    };
  }
  return {
    backgroundColor: theme.backgroundColor || "#ffffff",
    position: "relative",
  };
}

export function parseCardContent(jsonString?: string) {
  const content = jsonString;
  if (!content) return null;

  const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
  if (jsonMatch) {
    try {
      return {
        rawJson: jsonMatch[1],
        parsedData: JSON.parse(jsonMatch[1]),
      };
    } catch (error) {
      console.error("Error parsing card JSON:", error);
      return null;
    }
  }
  return null;
}
