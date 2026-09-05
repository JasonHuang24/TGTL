"use client";

/**
 * Shared reader context (blueprint §8, G-01, G-02, G-11).
 *
 * Holds only the site-wide preferences that must survive navigation and edition
 * switches: edition, the "reduce game framing" override, and theme. Page-level
 * interactive state (board, logs, guidance, daily plan) persists to its own
 * localStorage key from its own component, and is cleared by the same reset.
 *
 * Edition and framing are DIFFERENT controls (G-02): edition selects vocabulary,
 * framing selects how much apparatus is present at all. Set-down is hard-assigned
 * per route (§4.2) and cannot be overridden upward by a reader.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  STORAGE_KEYS,
  eraseAll,
  readString,
  writeString,
} from "./storage";
import { intensityForRoute, type Intensity } from "@/content/routes";
import { resolveTerm, type TermKey } from "@/content/terminology";

export type Edition = "standard" | "game";
export type ThemeChoice = "system" | "light" | "dark";

type GuideValue = {
  edition: Edition;
  reduceFraming: boolean;
  theme: ThemeChoice;
  /** True once localStorage has been read on the client (avoids hydration flash logic). */
  hydrated: boolean;
  setEdition: (value: Edition) => void;
  setReduceFraming: (value: boolean) => void;
  setTheme: (value: ThemeChoice) => void;
  /** Effective presentation frame for a route, accounting for the reduce-framing override. */
  effectiveFrame: (route: string) => Intensity;
  /** Resolve a semantic key for the current edition on a given route. */
  term: (key: TermKey, route: string) => string;
  reset: () => void;
};

const GuideCtx = createContext<GuideValue | null>(null);

function isEdition(v: string | null): v is Edition {
  return v === "standard" || v === "game";
}
function isTheme(v: string | null): v is ThemeChoice {
  return v === "system" || v === "light" || v === "dark";
}

export function GuideProvider({ children }: { children: React.ReactNode }) {
  const [edition, setEditionState] = useState<Edition>("standard");
  const [reduceFraming, setReduceFramingState] = useState(false);
  const [theme, setThemeState] = useState<ThemeChoice>("system");
  const [hydrated, setHydrated] = useState(false);

  // Read persisted preferences once, on the client.
  useEffect(() => {
    const savedEdition = readString(STORAGE_KEYS.edition);
    if (isEdition(savedEdition)) setEditionState(savedEdition);
    if (readString(STORAGE_KEYS.reduceFraming) === "1") setReduceFramingState(true);
    const savedTheme = readString(STORAGE_KEYS.theme);
    if (isTheme(savedTheme)) setThemeState(savedTheme);
    setHydrated(true);
  }, []);

  // Reflect edition + theme onto <html> so CSS (and the JS-off floor) can respond.
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.edition = edition;
    if (theme === "system") delete root.dataset.theme;
    else root.dataset.theme = theme;
    root.dataset.reduceFraming = reduceFraming ? "1" : "0";
  }, [edition, theme, reduceFraming]);

  const setEdition = useCallback((value: Edition) => {
    setEditionState(value);
    writeString(STORAGE_KEYS.edition, value);
  }, []);

  const setReduceFraming = useCallback((value: boolean) => {
    setReduceFramingState(value);
    writeString(STORAGE_KEYS.reduceFraming, value ? "1" : "0");
  }, []);

  const setTheme = useCallback((value: ThemeChoice) => {
    setThemeState(value);
    writeString(STORAGE_KEYS.theme, value);
  }, []);

  const effectiveFrame = useCallback(
    (route: string): Intensity => {
      const base = intensityForRoute(route);
      if (base === "down") return "down";
      return reduceFraming ? "down" : base;
    },
    [reduceFraming],
  );

  const term = useCallback(
    (key: TermKey, route: string) => resolveTerm(key, edition, effectiveFrame(route)),
    [edition, effectiveFrame],
  );

  const reset = useCallback(() => {
    eraseAll();
    setEditionState("standard");
    setReduceFramingState(false);
    setThemeState("system");
    // Let pages holding their own state know to clear it.
    window.dispatchEvent(new CustomEvent("tgtl:reset"));
  }, []);

  const value = useMemo<GuideValue>(
    () => ({
      edition,
      reduceFraming,
      theme,
      hydrated,
      setEdition,
      setReduceFraming,
      setTheme,
      effectiveFrame,
      term,
      reset,
    }),
    [
      edition,
      reduceFraming,
      theme,
      hydrated,
      setEdition,
      setReduceFraming,
      setTheme,
      effectiveFrame,
      term,
      reset,
    ],
  );

  return <GuideCtx.Provider value={value}>{children}</GuideCtx.Provider>;
}

export function useGuide(): GuideValue {
  const ctx = useContext(GuideCtx);
  if (!ctx) throw new Error("useGuide must be used inside <GuideProvider>");
  return ctx;
}
