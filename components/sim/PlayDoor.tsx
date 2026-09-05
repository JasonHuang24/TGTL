"use client";

/**
 * THE PLAY DOOR (blueprint 4.0 §3.11) — `/play` becomes a one-screen mode select.
 *
 * Three modes, framed reader-facing, with a recommended default for first-timers.
 * "Recommended for a first play" is a statement about ORDER OF LEARNING, not a
 * ranking of the modes and never a recommendation about the reader — the arc is
 * suggested first because it shows the whole shape of a life in twenty minutes,
 * which is what makes the campaign legible afterwards.
 */

import Link from "next/link";
import { useSimHydrated } from "@/lib/sim/use-hydrated";
import { CardFace } from "@/components/sim/instruments/CardFace";
import { SceneBackdrop, ScenePlate } from "@/components/sim/scene/Scene";
import { CAMPAIGN_LABEL } from "@/content/sim/registry";

export function PlayDoor() {
  useSimHydrated();
  return (
    <div className="sim-door sim-surface">
      <section className="sim-scene">
        <SceneBackdrop stage="books" />
        <ScenePlate eyebrow="The Playthrough" title="Three ways to play a life" wide>
          <p>
            One engine, three shapes. All of them are models — none of them predicts anything about your life, and
            none of them scores you. The rules they run on are{" "}
            <Link href="/methodology">published in full</Link>.
          </p>

          <ul className="sim-door-grid">
            <li>
              <CardFace family="inner" eyebrow="a good first play · about twenty minutes" title="A Whole Life" as="div">
                <p className="sim-door-line">The whole shape of a life, fast.</p>
                <p className="sim-door-note">
                  Birth to the end, in eight acts. You are dealt a starting hand you did not choose and play the
                  turning points. It is the short version, and it makes the long one legible.
                </p>
                <Link href="/play/arc" className="sim-primary-btn">
                  Play a whole life
                </Link>
              </CardFace>
            </li>

            <li>
              <CardFace family="work" eyebrow="the long one · two to four hours, across sittings" title="Launch Window" as="div">
                <p className="sim-door-line">Run twelve years of a life.</p>
                <p className="sim-door-note">
                  {CAMPAIGN_LABEL}. Ages eighteen to thirty in twenty-four six-month seasons: a real budget, an
                  open action menu, other people with their own decisions, and consequences that arrive seasons
                  after you set them going. Saveable, forkable, and meant to be played more than once.
                </p>
                <Link href="/play/campaign" className="sim-primary-btn">
                  Start a campaign
                </Link>
              </CardFace>
            </li>

            <li>
              <CardFace family="threshold" eyebrow="ten minutes · nothing to save" title="The Decision Lab" as="div">
                <p className="sim-door-line">Fork one decision and compare.</p>
                <p className="sim-door-note">
                  Play both sides of a single choice and see what actually separated them — the decision, the
                  draw, or the position you started from. Unlimited rewind; nothing here is a prediction.
                </p>
                <Link href="/play/lab" className="sim-primary-btn">
                  Open the Lab
                </Link>
              </CardFace>
            </li>
          </ul>

          <p className="sim-door-foot">
            Everything you do here stays on this device. There is no account, nothing is sent anywhere, and you
            can erase all of it at any time.
          </p>
        </ScenePlate>
      </section>
    </div>
  );
}
