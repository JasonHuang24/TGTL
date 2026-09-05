"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { MECHANICS } from "@/content/play/mechanics";
import { MechanicViz } from "@/components/reference/MechanicViz";

/**
 * "Why this happened" (blueprint 3.0 §3.5) — a quiet, optional, never-blocking
 * door to the mechanic card: one screen, one visual, one paragraph, one link
 * deeper. Closes to return to play exactly where you were.
 */
export function MechanicWhy({
  mechanicId,
  edition,
  onClose,
}: {
  mechanicId: string;
  edition: "standard" | "game";
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mech = MECHANICS[mechanicId];

  useEffect(() => {
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!mech) return null;

  return (
    <div className="sim-why-overlay" role="dialog" aria-modal="true" aria-label="Why this happened">
      <div className="sim-why-card" tabIndex={-1} ref={ref}>
        <p className="sim-why-eyebrow">Why this happened</p>
        <h2 className="sim-why-title">{edition === "game" ? mech.gameTitle : mech.standardTitle}</h2>
        <div className="sim-why-viz">
          <MechanicViz kind={mech.viz} />
        </div>
        <p className="sim-why-para">{mech.paragraph}</p>
        <div className="sim-why-actions">
          <Link href={mech.deepHome} className="sim-why-deep">
            {mech.deepHomeLabel} →
          </Link>
          <button type="button" className="sim-why-close" onClick={onClose}>
            Back to the run
          </button>
        </div>
      </div>
      <button type="button" className="sim-why-scrim" aria-label="Close" onClick={onClose} />
    </div>
  );
}
