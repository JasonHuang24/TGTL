"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import terminology from "../content/terminology.json";

export type Edition = "standard" | "game";
export type Frame = "full" | "light" | "down";
export type SexLens = "shared" | "female" | "male";

type GuideContextValue = {
  edition: Edition;
  frame: Frame;
  effectiveFrame: Frame;
  age: number;
  sexLens: SexLens;
  setEdition: (value: Edition) => void;
  setFrame: (value: Frame) => void;
  setAge: (value: number) => void;
  setSexLens: (value: SexLens) => void;
  term: (key: keyof typeof terminology) => string;
  reset: () => void;
};

const GuideContext = createContext<GuideContextValue | null>(null);
const STORAGE_KEY = "tgtl-guide-context-v2";
const sensitiveRoutes = new Set([
  "/help-now",
  "/situations/abuse",
  "/situations/grief",
  "/situations/death",
  "/situations/depression",
]);

export function GuideProvider({ route, children }: { route: string; children: React.ReactNode }) {
  const [edition, setEditionState] = useState<Edition>("standard");
  const [frame, setFrameState] = useState<Frame>("light");
  const [age, setAgeState] = useState(28);
  const [sexLens, setSexLensState] = useState<SexLens>("shared");

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
      if (saved.edition === "standard" || saved.edition === "game") setEditionState(saved.edition);
      if (saved.frame === "full" || saved.frame === "light" || saved.frame === "down") setFrameState(saved.frame);
      if (Number.isInteger(saved.age) && saved.age >= 0 && saved.age <= 100) setAgeState(saved.age);
      if (saved.sexLens === "shared" || saved.sexLens === "female" || saved.sexLens === "male") setSexLensState(saved.sexLens);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.edition = edition;
    document.documentElement.dataset.frame = sensitiveRoutes.has(route) ? "down" : frame;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ edition, frame, age, sexLens }));
  }, [edition, frame, age, sexLens, route]);

  const effectiveFrame: Frame = sensitiveRoutes.has(route) ? "down" : frame;
  const term = (key: keyof typeof terminology) =>
    effectiveFrame === "down" ? terminology[key].standard : terminology[key][edition];

  const value = useMemo<GuideContextValue>(() => ({
    edition,
    frame,
    effectiveFrame,
    age,
    sexLens,
    setEdition: setEditionState,
    setFrame: setFrameState,
    setAge: setAgeState,
    setSexLens: setSexLensState,
    term,
    reset: () => {
      setEditionState("standard");
      setFrameState("light");
      setAgeState(28);
      setSexLensState("shared");
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem("tgtl-daily-plan-v1");
    },
  }), [edition, frame, effectiveFrame, age, sexLens]);

  return <GuideContext.Provider value={value}>{children}</GuideContext.Provider>;
}

export function useGuide() {
  const value = useContext(GuideContext);
  if (!value) throw new Error("useGuide must be used within GuideProvider");
  return value;
}

export function isSensitiveRoute(route: string) {
  return sensitiveRoutes.has(route);
}
