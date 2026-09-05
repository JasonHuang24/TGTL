import type { Metadata } from "next";
import Link from "next/link";
import { LabApp } from "@/components/sim/LabApp";

export const metadata: Metadata = {
  title: "The Decision Lab",
  description:
    "Fork one decision, play both branches, and see what actually separated them — the decision, the draw, or the position you started from. Models, never predictions; nothing here is saved or scored.",
};

/**
 * The Decision Lab (blueprint 4.0 §3.8). Needs JavaScript; the static floor
 * explains the three axes so the lesson is legible even without the tool.
 */
export default function LabPage() {
  return (
    <div className="sim-play-page">
      <noscript>
        <style>{`:root .sim-lab{display:none!important}`}</style>
      </noscript>

      <div className="sim-play-nojs-floor">
        <div className="prose-page">
          <p className="eyebrow">The Playthrough · ten minutes</p>
          <h1>The Decision Lab</h1>
          <p className="lede">
            Play both sides of a single choice and look at what actually separated them.
          </p>
          <p>Three things can be varied, one at a time, and each teaches something different:</p>
          <ul>
            <li>
              <strong>The decision</strong> — same starting position, same luck, different choice. Whatever
              separates the branches is what the decision was worth.
            </li>
            <li>
              <strong>The luck</strong> — same choices, a different draw. If the branches end apart, that gap is
              not skill and not judgement; it is the range the move always had.
            </li>
            <li>
              <strong>The starting position</strong> — same choices, same luck, a different place to start from.
              What separates them is not something either character did.
            </li>
          </ul>
          <p>
            It needs JavaScript to run. Without it: <Link href="/walkthrough">how a run works</Link>,{" "}
            <Link href="/methodology">how the engine works</Link>, or{" "}
            <Link href="/map/credential-decision">a worked decision, written out</Link>.
          </p>
        </div>
      </div>

      <LabApp />
    </div>
  );
}
