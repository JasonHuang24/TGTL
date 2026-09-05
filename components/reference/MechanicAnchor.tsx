"use client";

import Link from "next/link";
import { useGuide } from "@/lib/guide-context";
import { MECHANICS } from "@/content/play/mechanics";
import { MechanicViz } from "@/components/reference/MechanicViz";

/**
 * The mechanic-card anchor (blueprint 3.0 §6.3, a sanctioned addition per §2.1):
 * a first-screen section on a deep home so a reader arriving from "why this
 * happened" lands on the picture before the prose. Each mechanic gets an id
 * anchor. The topic prose below stays the single home (G-06).
 */
export function MechanicAnchor({ ids }: { ids: string[] }) {
  const { edition } = useGuide();
  const game = edition === "game";
  return (
    <section className="topic-mechanics" aria-label="How this shows up in the Playthrough">
      <p className="eyebrow">In the Playthrough</p>
      <div className="topic-mech-grid">
        {ids.map((id) => {
          const m = MECHANICS[id];
          if (!m) return null;
          return (
            <div key={id} id={id} className="topic-mech">
              <div className="topic-mech-viz">
                <MechanicViz kind={m.viz} />
              </div>
              <div className="topic-mech-body">
                <h3>{game ? m.gameTitle : m.standardTitle}</h3>
                <p>{m.paragraph}</p>
              </div>
            </div>
          );
        })}
      </div>
      <p className="topic-mech-note">
        <Link href="/play">Feel it in a run →</Link>
      </p>
    </section>
  );
}
