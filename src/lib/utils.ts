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

export function hasMermaidContent(content: string | undefined): boolean {
  if (!content) return false;
  return /```(?:mermaid|mmd)\b|<pre[^>]*class=["'][^"']*mermaid/i.test(content);
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
