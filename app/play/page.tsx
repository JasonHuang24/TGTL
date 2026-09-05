import type { Metadata } from "next";
import Link from "next/link";
import { PlayDoor } from "@/components/sim/PlayDoor";
import { ModelBreak } from "@/components/primitives";

export const metadata: Metadata = {
  title: "The Playthrough",
  description:
    "Three ways to play a life: the whole shape of one fast, twelve years as a sandbox campaign, or a single decision forked and compared. Models, never predictions — and the reader is never scored.",
};

/**
 * THE PLAY DOOR (blueprint 4.0 §3.11). `/play` is now a one-screen mode select;
 * the whole-life arc that used to live here moved to `/play/arc` with its inner
 * experience unchanged.
 *
 * The door needs JavaScript for the mode cards' art, so the exported HTML carries
 * a static floor — never a blank — that links to all three modes and to the
 * reading layer. Once the client hydrates, CSS hides the floor.
 */
export default function PlayDoorPage() {
  return (
    <div className="sim-play-page">
      <noscript>
        <style>{`:root .sim-door{display:none!important}`}</style>
      </noscript>

      <div className="sim-play-nojs-floor">
        <div className="prose-page">
          <p className="eyebrow">The Playthrough</p>
          <h1>Three ways to play a life</h1>
          <p className="lede">
            One engine, three shapes. All of them are models: none predicts anything about your life, and none of
            them scores you.
          </p>
          <ul>
            <li>
              <Link href="/play/arc">A Whole Life</Link> — the whole shape of a life, fast. A good first play.
            </li>
            <li>
              <Link href="/play/campaign">Launch Window</Link> — twelve years, twenty-four seasons, a real budget.
            </li>
            <li>
              <Link href="/play/lab">The Decision Lab</Link> — fork one decision and compare.
            </li>
          </ul>
          <p>
            All three need JavaScript to play. The reading layer is fully open without it:{" "}
            <Link href="/walkthrough">learn the game</Link>, <Link href="/map">the world map</Link>,{" "}
            <Link href="/topics">look something up</Link>, or <Link href="/triage">something happened</Link>.
          </p>
          <p className="nojs-content-note">
            Nothing you do here is recorded off this device. Any heavy beat can be skipped, and the help pages are
            always in the header.
          </p>
        </div>
      </div>

      <PlayDoor />

      {/* N-281, N-253 (§3.11, C-45) — the presentation walls for a scene layer are
          now entry eleven of the disanalogy register rather than a hand-written
          section beside it, and this is the door a scene would ever be behind. The
          citation is the whole content: the rules live in one maintained place. */}
      <ModelBreak n={11}>
        Nothing here is drawn, and the rules a picture would have to inherit were written before
        there was a picture to argue with.
      </ModelBreak>
    </div>
  );
}
