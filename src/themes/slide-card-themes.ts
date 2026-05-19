import type { SlideTheme } from "@/consts";

export const SLIDE_THEME_CONFIG: Record<string, SlideTheme> = {
  black: {
    background: "#191919",
    type: "solid",
    titleFont: '"Source Sans Pro", Helvetica, sans-serif',
    titleWeight: 600,
    titleTransform: "uppercase",
    textFont: '"Source Sans Pro", Helvetica, sans-serif',
    titleColor: "#fff",
    textColor: "#fff",
    overlayColor: "rgba(0, 0, 0, 0.3)",
  },
  white: {
    background: "#ffffff",
    type: "solid",
    titleFont: '"Source Sans Pro", Helvetica, sans-serif',
    titleWeight: 600,
    titleTransform: "uppercase",
    textFont: '"Source Sans Pro", Helvetica, sans-serif',
    titleColor: "#222",
    textColor: "#222",
    overlayColor: "rgba(255, 255, 255, 0.3)",
  },
  league: {
    background:
      "radial-gradient(circle, rgb(85, 90, 95) 0%, rgb(28, 30, 32) 100%)",
    type: "gradient",
    titleFont: '"League Gothic", Impact, sans-serif',
    titleWeight: "normal",
    titleTransform: "uppercase",
    textFont: "Lato, sans-serif",
    titleColor: "#eee",
    textColor: "#eee",
    overlayColor: "rgba(0, 0, 0, 0.3)",
  },
  beige: {
    background:
      "radial-gradient(circle, rgb(255, 255, 255) 0%, rgb(247, 242, 211) 100%)",
    type: "gradient",
    titleFont: '"League Gothic", Impact, sans-serif',
    titleWeight: "normal",
    titleTransform: "uppercase",
    textFont: "Lato, sans-serif",
    titleColor: "#333",
    textColor: "#333",
    overlayColor: "rgba(0, 0, 0, 0.1)",
  },
  moon: {
    background: "#002b36",
    type: "solid",
    titleFont: '"League Gothic", Impact, sans-serif',
    titleWeight: "normal",
    titleTransform: "uppercase",
    textFont: "Lato, sans-serif",
    titleColor: "#eee8d5",
    textColor: "#93a1a1",
    overlayColor: "rgba(0, 0, 0, 0.3)",
  },
  solarized: {
    background: "#fdf6e3",
    type: "solid",
    titleFont: '"League Gothic", Impact, sans-serif',
    titleWeight: "normal",
    titleTransform: "uppercase",
    textFont: "Lato, sans-serif",
    titleColor: "#657b83",
    textColor: "#657b83",
    overlayColor: "rgba(255, 255, 255, 0.3)",
  },
  sky: {
    background: "radial-gradient(circle, #f7fbfc 0%, #add9e4 100%)",
    type: "gradient",
    titleFont: '"Quicksand", sans-serif',
    titleWeight: "normal",
    titleTransform: "uppercase",
    textFont: '"Open Sans", sans-serif',
    titleColor: "#333",
    textColor: "#333",
    overlayColor: "rgba(0, 0, 0, 0.1)",
  },
  night: {
    background: "radial-gradient(circle, #1e1e1e 0%, #000000 100%)",
    type: "gradient",
    titleFont: '"Montserrat", Impact, sans-serif',
    titleWeight: "normal",
    titleTransform: "none",
    textFont: '"Open Sans", sans-serif',
    titleColor: "#fff",
    textColor: "#fff",
    overlayColor: "rgba(0, 0, 0, 0.3)",
  },
  serif: {
    background: "#f0f1eb",
    type: "solid",
    titleFont:
      '"Palatino Linotype", "Book Antiqua", Palatino, FreeSerif, serif',
    titleWeight: "normal",
    titleTransform: "none",
    textFont: '"Palatino Linotype", "Book Antiqua", Palatino, FreeSerif, serif',
    titleColor: "#383d3d",
    textColor: "#383d3d",
    overlayColor: "rgba(255, 255, 255, 0.3)",
  },
  simple: {
    background: "#ffffff",
    type: "solid",
    titleFont: '"Source Sans Pro", Helvetica, sans-serif',
    titleWeight: 600,
    titleTransform: "none",
    textFont: "Lato, sans-serif",
    titleColor: "#333",
    textColor: "#333",
    overlayColor: "rgba(255, 255, 255, 0.3)",
  },
  blood: {
    background: "#222",
    type: "solid",
    titleFont: '"Ubuntu", sans-serif',
    titleWeight: 700,
    titleTransform: "uppercase",
    textFont: "Ubuntu, sans-serif",
    titleColor: "#fff",
    textColor: "#fff",
    overlayColor: "rgba(0, 0, 0, 0.3)",
  },
  dracula: {
    background: "#282a36",
    type: "solid",
    titleFont: '"League Gothic", Impact, sans-serif',
    titleWeight: "normal",
    titleTransform: "none",
    textFont:
      '-apple-system, BlinkMacSystemFont, "avenir next", avenir, "segoe ui", "helvetica neue", helvetica, Cantarell, Ubuntu, roboto, noto, arial, sans-serif',
    titleColor: "#bd93f9",
    textColor: "#fff",
    overlayColor: "rgba(0, 0, 0, 0.3)",
  },
};

export function generateThemeStyles(theme: string, uniqueId: string): string {
  const config =
    SLIDE_THEME_CONFIG[theme as keyof typeof SLIDE_THEME_CONFIG] ||
    SLIDE_THEME_CONFIG.black;

  return `
    .reveal-${uniqueId.replace(/:/g, "-")} .slides section {
      background: ${config.background} !important;
      padding-top: 30px;
    }

    .reveal-${uniqueId.replace(/:/g, "-")} .slides section h1,
    .reveal-${uniqueId.replace(/:/g, "-")} .slides section h2 {
      font-family: ${config.titleFont} !important;
      font-weight: ${config.titleWeight} !important;
      text-transform: ${config.titleTransform} !important;
      color: ${config.titleColor} !important;
      font-size: 32px !important;
      padding-left: 8px;
      padding-right: 8px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
      line-height: 1.2;
      letter-spacing: normal !important;
    }

    .reveal-${uniqueId.replace(/:/g, "-")} .slides section p,
    .reveal-${uniqueId.replace(/:/g, "-")} .slides section em {
      font-family: ${config.textFont} !important;
      color: ${config.textColor} !important;
      font-size: 20px !important;
      line-height: 0.8 !important;
      letter-spacing: normal !important;
    }

    .reveal-${uniqueId.replace(/:/g, "-")} .slides section em {
      font-style: normal !important;
    }

    .reveal-${uniqueId.replace(/:/g, "-")} .reveal-viewport {
      border: 1px solid black;
      border-radius: 1rem;
    }
  `;
}
