/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(undefined);

const STORAGE_KEY = "medorc-theme";

function getStoredPreference() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") return stored;
  } catch {
    /* ignore */
  }
  return "light";
}

function getSystemTheme() {
  return "light";
}

function resolveTheme(preference) {
  return preference === "system" || !preference ? "light" : preference;
}

export function ThemeProvider({ children }) {
  const [preference, setPreferenceState] = useState(getStoredPreference);
  const [theme, setTheme] = useState(() => resolveTheme(getStoredPreference()));

  useEffect(() => {
    const apply = () => {
      const resolved = resolveTheme(preference);
      setTheme(resolved);
      document.documentElement.classList.toggle("dark", resolved === "dark");
    };

    apply();

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (preference === "system") apply();
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [preference]);

  const setPreference = useCallback((next) => {
    const value = next === "light" || next === "dark" || next === "system" ? next : "system";
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    setPreferenceState(value);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, preference, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
