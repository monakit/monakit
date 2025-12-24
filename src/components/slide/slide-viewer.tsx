import type React from "react";
import { useEffect, useId, useRef, useState } from "react";
import {
  generateThemeStyles,
  getThemeBackgroundAttrs,
} from "@/themes/slide-card-themes";

// Import reveal.js CSS
import "reveal.js/dist/reveal.css";
import "reveal.js/plugin/highlight/monokai.css";
import "katex/dist/katex.min.css";

interface SlideViewerProps {
  content: string;
  theme?: string;
  transition?: string;
  controls?: boolean;
  progress?: boolean;
  preview?: boolean;
}

export const SlideViewer: React.FC<SlideViewerProps> = ({
  content,
  theme = "black",
  transition = "slide",
  controls = true,
  progress = true,
  preview = false,
}) => {
  const deckRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<Reveal.Api>(null);
  const [isClient, setIsClient] = useState(false);
  const [themeLoaded, setThemeLoaded] = useState(false);
  const [stylesInjected, setStylesInjected] = useState(false);
  const uniqueId = useId();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load theme CSS dynamically (shared across instances)
  useEffect(() => {
    if (!isClient) return;

    const loadTheme = () => {
      // Check if this theme is already loaded globally
      const existingTheme = document.querySelector(
        `link[data-reveal-theme="${theme}"]`,
      );
      if (existingTheme) {
        setThemeLoaded(true);
        return;
      }

      // Add new theme link
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `https://cdnjs.cloudflare.com/ajax/libs/reveal.js/5.2.1/theme/${theme}.css`;
      link.setAttribute("data-reveal-theme", theme);
      link.onload = () => setThemeLoaded(true);
      link.onerror = () => {
        console.warn(`Failed to load theme: ${theme}`);
        setThemeLoaded(true);
      };
      document.head.appendChild(link);
    };

    loadTheme();
  }, [theme, isClient]);

  // Inject dynamic theme styles based on SLIDE_THEME_CONFIG
  useEffect(() => {
    if (!isClient || !preview) return;

    const styleId = `slide-theme-${uniqueId.replace(/:/g, "-")}`;

    // Remove existing styles for this instance
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create and inject new styles
    const styleElement = document.createElement("style");
    styleElement.id = styleId;
    styleElement.textContent = generateThemeStyles(theme, uniqueId);
    document.head.appendChild(styleElement);

    setStylesInjected(true);

    // Cleanup function
    return () => {
      const styleToRemove = document.getElementById(styleId);
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [theme, isClient, preview, uniqueId]);

  useEffect(() => {
    if (
      !deckRef.current ||
      !isClient ||
      !themeLoaded ||
      (preview && !stylesInjected)
    )
      return;

    // Add a small random delay to prevent multiple instances from initializing simultaneously
    const initDelay = Math.random() * 200 + 50; // 50-250ms random delay

    const timer = setTimeout(async () => {
      await initializeReveal();
    }, initDelay);

    const initializeReveal = async () => {
      try {
        // Dynamically import reveal.js and plugins only on client side
        const { default: Reveal } = await import("reveal.js");
        const { default: Highlight } = await import(
          "reveal.js/plugin/highlight/highlight.esm.js"
        );
        const { default: RevealMarkdown } = await import(
          "reveal.js/plugin/markdown/markdown.esm.js"
        );
        const { default: Notes } = await import(
          "reveal.js/plugin/notes/notes.esm.js"
        );
        const { default: RevealMermaid } = await import(
          "reveal.js-mermaid-plugin"
        );
        const { default: RevealMath } = await import(
          "reveal.js/plugin/math/math.esm.js"
        );

        // Create HTML structure for reveal.js
        const backgroundAttrs = preview ? getThemeBackgroundAttrs(theme) : "";
        const slidesHtml = `\
          <section data-markdown ${backgroundAttrs}>
            <script type="text/template">
              ${content}
            </script>
          </section>`;

        // Set the HTML content
        if (deckRef.current && !revealRef.current) {
          // Add unique class to container for CSS isolation
          deckRef.current.className = `reveal reveal-${uniqueId.replace(/:/g, "-")}`;
          deckRef.current.innerHTML = `<div class="slides">${slidesHtml}</div>`;

          // Initialize reveal.js in embedded mode
          revealRef.current = new Reveal(deckRef.current, {
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
            plugins: [
              RevealMarkdown,
              Highlight,
              Notes,
              RevealMermaid,
              RevealMath.KaTeX,
            ],
            markdown: { smartypants: true },
            embedded: true,
            width: "100%",
            height: "100%",
          });

          await revealRef.current.initialize();
        }
      } catch (error) {
        console.error(`Failed to initialize reveal.js for ${uniqueId}:`, error);
      }
    };

    return () => {
      clearTimeout(timer);
      if (revealRef.current) {
        try {
          revealRef.current.destroy();
        } catch (error) {
          console.warn("Error destroying reveal.js instance:", error);
        }
        revealRef.current = null;
      }
    };
  }, [
    content,
    theme,
    transition,
    controls,
    progress,
    preview,
    isClient,
    themeLoaded,
    stylesInjected,
    uniqueId,
  ]);

  return (
    <div
      className={`reveal reveal-container-${uniqueId.replace(/:/g, "-")}`}
      ref={deckRef}
      style={{ width: "100%", height: "100%" }}
    >
      {!isClient && (
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
      )}
      {/* Slides will be injected here */}
    </div>
  );
};
