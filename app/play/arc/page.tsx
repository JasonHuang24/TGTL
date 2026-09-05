import type { Metadata } from "next";
import Link from "next/link";
import { Playthrough } from "@/components/play/Playthrough";

export const metadata: Metadata = {
  title: "The Playthrough",
  description:
    "Play a life — character creation through Birth RNG, eight acts of branching decisions with visible outcomes, and an end-of-life run analysis. The character is gamified; you never are.",
};

/**
 * The Playthrough (blueprint 3.0 §3). The interactive run needs JavaScript by
 * nature, so the exported HTML carries a static explanation floor — never a blank —
 * with links to the reading layer. The client orchestrator hydrates over it; once
 * hydrated, the floor is hidden by CSS (`:root[data-play-hydrated="1"]`).
 */
export default function PlayPage() {
  return (
    <div className="sim-play-page">
      <noscript>
        <style>{`:root .sim-play-app{display:none!important}`}</style>
      </noscript>

      <div className="sim-play-nojs-floor">
        <div className="prose-page">
          <p className="eyebrow">The Playthrough</p>
          <h1>A life you play, not a page you read</h1>
          <p className="lede">
            This is the interactive spine of the guidebook: you create a character, are dealt a starting
            hand you did not choose, and move through eight acts of a life — watching where skill sets the
            range and luck lands the draw — down to an honest look back at the run.
          </p>
          <p>
            It needs JavaScript to play. With scripting on, it starts right here. In the meantime, the
            reading layer is fully open:
          </p>
          <ul>
            <li>
              <Link href="/walkthrough">Learn the game</Link> — how a run works, the five controls, the mechanics.
            </li>
            <li>
              <Link href="/map">The world map</Link> — the same eight stages, as a static reference.
            </li>
            <li>
              <Link href="/topics">Look something up</Link> — money, health, relationships, work.
            </li>
            <li>
              <Link href="/triage">Something happened</Link> — if you need a specific page right now.
            </li>
          </ul>
          <p className="nojs-content-note">
            Nothing you do here is recorded off this device. The run holds the shape of a whole life,
            including loss; any heavy beat can be skipped, and the help pages are always in the header.
          </p>
        </div>
      </div>

      <Playthrough />
    </div>
  );
}
