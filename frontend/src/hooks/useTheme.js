import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "resumeiq-theme";

/** The OS preference, used the first time someone visits. */
function systemTheme() {
  if (typeof window === "undefined" || !window.matchMedia) return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function storedTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "light" || saved === "dark" ? saved : null;
  } catch {
    // Private mode can throw on localStorage; the OS preference is fine.
    return null;
  }
}

/**
 * Owns the colour theme. The choice is written to <html data-theme> so the CSS
 * variables in index.css switch, and remembered so it survives a reload.
 */
export default function useTheme() {
  const [theme, setTheme] = useState(() => storedTheme() || systemTheme());

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    // Keeps the browser UI (scrollbars, form controls) in step with the page.
    document.documentElement.style.colorScheme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Not being able to remember the choice is not worth breaking over.
    }
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggle };
}
