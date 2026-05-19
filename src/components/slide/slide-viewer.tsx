import type React from "react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { RevealApi, RevealPluginFactory } from "reveal.js";
import Reveal from "reveal.js";
import Highlight from "reveal.js/plugin/highlight";
import RevealMarkdown from "reveal.js/plugin/markdown";
import Notes from "reveal.js/plugin/notes";
import { hasMermaidContent } from "@/lib/utils";
import {
  generateThemeStyles,
  SLIDE_THEME_CONFIG,
} from "@/themes/slide-card-themes";

import "reveal.js/reveal.css";
import "reveal.js/plugin/highlight/monokai.css";
import "@/styles/slide-viewer.css";

const themeCssLoaders = {
  beige: () => import("reveal.js/theme/beige.css?url"),
  black: () => import("reveal.js/theme/black.css?url"),
  blood: () => import("reveal.js/theme/blood.css?url"),
  dracula: () => import("reveal.js/theme/dracula.css?url"),
  league: () => import("reveal.js/theme/league.css?url"),
  moon: () => import("reveal.js/theme/moon.css?url"),
  night: () => import("reveal.js/theme/night.css?url"),
  serif: () => import("reveal.js/theme/serif.css?url"),
  simple: () => import("reveal.js/theme/simple.css?url"),
  sky: () => import("reveal.js/theme/sky.css?url"),
  solarized: () => import("reveal.js/theme/solarized.css?url"),
  white: () => import("reveal.js/theme/white.css?url"),
} as const;

type ThemeName = keyof typeof themeCssLoaders;

interface SlideViewerProps {
  content: string;
  theme?: string;
  transition?: string;
  controls?: boolean;
  progress?: boolean;
  preview?: boolean;
}

function hasMathContent(content: string): boolean {
  return /\$[^$]+\$|\$\$[\s\S]+?\$\$|\\\([\s\S]+?\\\)|\\\[[\s\S]+?\\\]/.test(
    content,
  );
}

async function renderMermaidDiagrams(deck: RevealApi) {
  const deckEl = deck.getRevealElement();
  if (!deckEl) return;

  const mermaidEls = Array.from(
    deckEl.querySelectorAll("pre code.mermaid, pre code.language-mermaid"),
  );
  if (mermaidEls.length === 0) return;

  const mermaid = (await import("mermaid")).default;
  mermaid.initialize({ startOnLoad: false });

  await Promise.all(
    mermaidEls.map(async (el, i) => {
      const definition = el.textContent?.trim() ?? "";
      if (!definition) return;

      const id =
        typeof crypto.randomUUID === "function"
          ? `mermaid-${crypto.randomUUID().slice(0, 8)}-${i}`
          : `mermaid-${Date.now()}-${i}`;

      try {
        const { svg } = await mermaid.render(id, definition);
        const pre = el.closest("pre");
        if (!pre) return;

        const wrapper = document.createElement("div");
        wrapper.className = "mermaid";
        wrapper.innerHTML = svg;
        pre.replaceWith(wrapper);
      } catch (error) {
        console.error("Mermaid render error:", error);
      }
    }),
  );
}

function buildSlidesHTML(
  content: string,
  preview: boolean,
  theme: string,
): string {
  const themeConfig =
    SLIDE_THEME_CONFIG[theme as keyof typeof SLIDE_THEME_CONFIG] ||
    SLIDE_THEME_CONFIG.black;

  let sectionAttrs = 'data-markdown=""';
  if (preview) {
    if (themeConfig.type === "gradient") {
      sectionAttrs += ` data-background="${themeConfig.background}"`;
    } else {
      sectionAttrs += ` data-background-color="${themeConfig.background}"`;
    }
    sectionAttrs += ` class="theme-${theme}"`;
  }

  const templateContent = content.replace(/<\/script>/gi, "<\\/script>");
  return `<div class="slides"><section ${sectionAttrs}><script type="text/template">${templateContent}</script></section></div>`;
}

export const SlideViewer: React.FC<SlideViewerProps> = ({
  content,
  theme = "black",
  transition = "slide",
  controls = true,
  progress = true,
  preview = false,
}) => {
  const [themeLoaded, setThemeLoaded] = useState(false);
  const [stylesInjected, setStylesInjected] = useState(false);
  const uniqueId = useId();
  const scopeId = uniqueId.replace(/:/g, "-");
  const containerRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<RevealApi | null>(null);

  const needsMath = hasMathContent(content);
  const needsMermaid = hasMermaidContent(content);
  const [mathReady, setMathReady] = useState(!needsMath);
  const mathPluginRef = useRef<RevealPluginFactory | null>(null);

  useEffect(() => {
    if (!needsMath) {
      setMathReady(true);
      mathPluginRef.current = null;
      return;
    }

    setMathReady(false);
    let cancelled = false;
    const load = async () => {
      const mod = await import("reveal.js/plugin/math");
      if (!cancelled) {
        mathPluginRef.current = mod.default.KaTeX;
        setMathReady(true);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [needsMath]);

  useEffect(() => {
    const normalizedTheme = theme in themeCssLoaders ? theme : "black";
    setThemeLoaded(false);
    const existingTheme = document.querySelector(
      `link[data-reveal-theme="${normalizedTheme}"]`,
    );
    if (existingTheme) {
      setThemeLoaded(true);
      return;
    }

    let cancelled = false;
    themeCssLoaders[normalizedTheme as ThemeName]().then(({ default: url }) => {
      if (cancelled) return;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = url;
      link.setAttribute("data-reveal-theme", normalizedTheme);
      link.onload = () => setThemeLoaded(true);
      link.onerror = () => {
        console.warn(`Failed to load reveal.js theme: ${normalizedTheme}`);
        setThemeLoaded(true);
      };
      document.head.appendChild(link);
    });

    return () => {
      cancelled = true;
    };
  }, [theme]);

  useEffect(() => {
    if (!preview) {
      setStylesInjected(true);
      return;
    }

    setStylesInjected(false);
    const styleId = `slide-theme-${scopeId}`;
    document.getElementById(styleId)?.remove();

    const styleElement = document.createElement("style");
    styleElement.id = styleId;
    styleElement.textContent = generateThemeStyles(theme, uniqueId);
    document.head.appendChild(styleElement);
    setStylesInjected(true);

    return () => {
      document.getElementById(styleId)?.remove();
    };
  }, [theme, preview, scopeId, uniqueId]);

  const plugins = useMemo(() => {
    const p: RevealPluginFactory[] = [RevealMarkdown, Highlight, Notes];
    if (mathReady && mathPluginRef.current) p.push(mathPluginRef.current);
    return p;
  }, [mathReady]);

  useEffect(() => {
    const revealEl = containerRef.current;
    if (!revealEl || !themeLoaded || !mathReady || (preview && !stylesInjected))
      return;

    revealEl.innerHTML = buildSlidesHTML(content, preview, theme);

    const slideSize = preview
      ? { width: "100%", height: "100%", margin: 0.02 }
      : { width: 1280, height: 720, margin: 0.04 };

    const deck = new Reveal(revealEl, {
      hash: false,
      controls,
      progress,
      transition: transition as
        | "none"
        | "fade"
        | "slide"
        | "convex"
        | "concave"
        | "zoom",
      plugins,
      markdown: { smartypants: true },
      embedded: true,
      ...slideSize,
    });

    const onReady = () => {
      if (needsMermaid) void renderMermaidDiagrams(deck);
    };

    deckRef.current = deck;
    deck.on("ready", onReady);
    void deck.initialize();

    return () => {
      deck.off("ready", onReady);
      deck.destroy();
      deckRef.current = null;
      revealEl.innerHTML = "";
    };
  }, [
    content,
    theme,
    transition,
    controls,
    progress,
    preview,
    plugins,
    themeLoaded,
    mathReady,
    stylesInjected,
    needsMermaid,
  ]);

  if (!themeLoaded || !mathReady || (preview && !stylesInjected)) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "#666",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`reveal mona-slide-viewer reveal-${scopeId}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
};
