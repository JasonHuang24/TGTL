"use client";

import Link from "next/link";
import { useGuide } from "@/lib/guide-context";
import { ALL_MECHANICS } from "@/content/play/mechanics";
import { MechanicViz } from "@/components/reference/MechanicViz";

/**
 * The "Playing well" mechanic index (blueprint 3.0 §6.2): each of the seven
 * mechanics as its canonical visualization + one paragraph + its deep home
 * (G-06). Edition-aware titles. Picture first, prose confirms.
 */
export function WalkthroughMechanics() {
  const { edition } = useGuide();
  const game = edition === "game";
  return (
    <ul className="mech-index">
      {ALL_MECHANICS.map((m) => (
        <li key={m.id} className="mech-index-card">
          <div className="mech-index-viz">
            <MechanicViz kind={m.viz} />
          </div>
          <div className="mech-index-body">
            <h3>{game ? m.gameTitle : m.standardTitle}</h3>
            <p>{m.paragraph}</p>
            <Link href={m.deepHome} className="mech-deep">
              {m.deepHomeLabel} →
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
