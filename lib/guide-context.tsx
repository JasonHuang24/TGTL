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
  readJSON,
  readString,
  writeJSON,
  writeString,
} from "./storage";
import { intensityForRoute, type Intensity } from "@/content/routes";
import { resolveTerm, type TermKey } from "@/content/terminology";

export type Edition = "standard" | "game";
export type ThemeChoice = "system" | "light" | "dark";

/* =========================================================================
   N-150 (6.0 §3.6, C-42) — SET YOUR POSITION ONCE.
   =========================================================================
   The machinery has existed since 2.0 and exactly one page has ever read it:
   `components/CredentialFilter.tsx` writes `STORAGE_KEYS.credentialPosition`
   and re-resolves its own cost notes from it. Everywhere else on the site,
   position sensitivity is prose the reader has to apply to themselves.

   Promoting the EXISTING key to shared state — no new key, §7.1 — turns the
   site's best mechanic (the same move costing differently from a different
   start) from a demonstration on one page into how the guide speaks.

   THE WALLS ON IT, all asserted by C-42:
   - Position is ENUMERATED. Three questions, two or three answers each, and
     `unsure` is a first-class answer rather than a gap.
   - Position NEVER produces a rank, a band, a score, or a comparison between
     readers. Its only two consumers are the control that sets it and the note
     that re-resolves prose from it. Nothing derives anything else from it.
   - Position NEVER enters a URL, and never reaches the play layer.
   - It is erased by the same site-wide erase control as everything else.
   ========================================================================= */
export type Floor = "unsure" | "yes" | "no";
export type Dependents = "no" | "yes";
export type Debt = "some" | "none";
export type Position = { floor: Floor; dependents: Dependents; debt: Debt };

export const DEFAULT_POSITION: Position = { floor: "unsure", dependents: "no", debt: "some" };

function isPosition(v: unknown): v is Position {
  if (!v || typeof v !== "object") return false;
  const p = v as Position;
  return (
    (p.floor === "unsure" || p.floor === "yes" || p.floor === "no") &&
    (p.dependents === "no" || p.dependents === "yes") &&
    (p.debt === "some" || p.debt === "none")
  );
}

type GuideValue = {
  edition: Edition;
  reduceFraming: boolean;
  theme: ThemeChoice;
  /** True once localStorage has been read on the client (avoids hydration flash logic). */
  hydrated: boolean;
  /** N-150 — the reader's position, from the EXISTING credentialPosition key. */
  position: Position;
  setPosition: (value: Position) => void;
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
  const [position, setPositionState] = useState<Position>(DEFAULT_POSITION);
  const [hydrated, setHydrated] = useState(false);

  // Read persisted preferences once, on the client.
  useEffect(() => {
    const savedEdition = readString(STORAGE_KEYS.edition);
    if (isEdition(savedEdition)) setEditionState(savedEdition);
    if (readString(STORAGE_KEYS.reduceFraming) === "1") setReduceFramingState(true);
    const savedTheme = readString(STORAGE_KEYS.theme);
    if (isTheme(savedTheme)) setThemeState(savedTheme);
    // N-150 — the existing key, validated rather than trusted: a value stored by
    // an older build (or edited by hand) falls back to the default instead of
    // rendering a note keyed on a shape that does not exist.
    const savedPosition = readJSON<unknown>(STORAGE_KEYS.credentialPosition, DEFAULT_POSITION);
    if (isPosition(savedPosition)) setPositionState(savedPosition);
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

  /* N-150 — one write, to the key that already existed. No URL, ever. */
  const setPosition = useCallback((value: Position) => {
    setPositionState(value);
    writeJSON(STORAGE_KEYS.credentialPosition, value);
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
    setPositionState(DEFAULT_POSITION);
    // Let pages holding their own state know to clear it.
    window.dispatchEvent(new CustomEvent("tgtl:reset"));
  }, []);

  const value = useMemo<GuideValue>(
    () => ({
      edition,
      reduceFraming,
      theme,
      hydrated,
      position,
      setPosition,
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
      position,
      setPosition,
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
