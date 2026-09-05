"use client";

import { useEffect } from "react";

/**
 * Marks the document as hydrated so the static no-JS floor hides and the play
 * surface shows (blueprint 4.0 §4.1; the 3.0 pattern, shared).
 *
 * Every play surface uses this ONE hook rather than repeating the effect, so a
 * new surface cannot ship with a live app rendering underneath a visible floor —
 * which is exactly the defect this replaced.
 */
export function useSimHydrated(): void {
  useEffect(() => {
    const el = document.documentElement;
    const before = el.getAttribute("data-play-hydrated");
    el.setAttribute("data-play-hydrated", "1");
    return () => {
      if (before === null) el.removeAttribute("data-play-hydrated");
    };
  }, []);
}
