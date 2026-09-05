"use client";

import { useState } from "react";
import {
  OBJECTIVE_KEYS,
  OBJECTIVE_LABEL,
  OBJECTIVE_NOTE,
  LEANING_KEYS,
  LEANING_LABEL,
  LEANING_NOTE,
  type WinWeights,
  type LeaningKey,
} from "@/content/play/schema";
import type { DrawnHand } from "@/lib/engine/hand";
import { profileRender } from "@/content/sim/profile";
import {
  WEIGHTS_INTRO,
  LEANING_INTRO,
  HAND_INTRO,
  REDRAW_LINE_1,
  REDRAW_LINE_EXTENDED,
} from "@/content/play/framing";

type Step = "weights" | "leaning" | "hand";

/**
 * Character creation (blueprint 3.0 §3.3): choose what winning means and one
 * leaning; then the Birth RNG deals the hand you don't choose, one card at a time.
 * The per-axis constraint profile and the verbatim worth-guard render together
 * (gate S-8) — 4.0 §2.3.1 replaced the single difficulty tier. Redraw is
 * unlimited — and its wink stays true (§3.3).
 */
export function Creation({
  edition,
  drawn,
  redrawCount,
  onRedraw,
  onAccept,
}: {
  edition: "standard" | "game";
  drawn: DrawnHand;
  redrawCount: number;
  onRedraw: () => void;
  onAccept: (weights: WinWeights, leaning: LeaningKey) => void;
}) {
  const [step, setStep] = useState<Step>("weights");
  const [weights, setWeights] = useState<WinWeights>(() => {
    const w = {} as WinWeights;
    for (const k of OBJECTIVE_KEYS) w[k] = 0;
    w.safety = 2;
    w.closeness = 1;
    return w;
  });
  const [leaning, setLeaning] = useState<LeaningKey>("curious");
  const [revealed, setRevealed] = useState(1); // era card shown first

  const game = edition === "game";
  const anyWeight = OBJECTIVE_KEYS.some((k) => weights[k] > 0);
  const allRevealed = revealed >= drawn.reveal.length;
  const profile = profileRender(drawn.hand.profile);

  // A new hand resets the reveal to just the era card.
  const doRedraw = () => {
    onRedraw();
    setRevealed(1);
  };

  return (
    <div className="sim-creation">
      <ol className="sim-creation-steps" aria-label="Creation steps">
        {(["weights", "leaning", "hand"] as Step[]).map((s, i) => (
          <li key={s} className={step === s ? "sim-is-current" : ""} aria-current={step === s ? "step" : undefined}>
            <span className="sim-creation-step-num">{i + 1}</span>
            {s === "weights" ? "What winning means" : s === "leaning" ? "Your leaning" : "The hand you're dealt"}
          </li>
        ))}
      </ol>

      {step === "weights" && (
        <section className="sim-creation-panel">
          <h2>{game ? "Set your objective" : "Decide what winning means"}</h2>
          <p className="sim-creation-intro">{game ? WEIGHTS_INTRO.game : WEIGHTS_INTRO.standard}</p>
          <div className="sim-weight-rows">
            {OBJECTIVE_KEYS.map((k) => (
              <div key={k} className="sim-weight-row">
                <label>
                  <strong>{OBJECTIVE_LABEL[k]}</strong> — {OBJECTIVE_NOTE[k]}
                </label>
                <div className="sim-weight-buttons" role="group" aria-label={OBJECTIVE_LABEL[k]}>
                  {[0, 1, 2, 3].map((w) => (
                    <button
                      key={w}
                      type="button"
                      aria-pressed={weights[k] === w}
                      onClick={() => setWeights((prev) => ({ ...prev, [k]: w } as WinWeights))}
                    >
                      {w === 0 ? "none" : w === 1 ? "some" : w === 2 ? "a lot" : "most"}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="sim-creation-nav">
            <button type="button" className="sim-primary-btn" disabled={!anyWeight} onClick={() => setStep("leaning")}>
              Next: your leaning
            </button>
            {!anyWeight && <span className="sim-creation-hint">Give weight to at least one.</span>}
          </div>
        </section>
      )}

      {step === "leaning" && (
        <section className="sim-creation-panel">
          <h2>{game ? "Pick a leaning" : "One leaning"}</h2>
          <p className="sim-creation-intro">{game ? LEANING_INTRO.game : LEANING_INTRO.standard}</p>
          <div className="sim-leaning-grid">
            {LEANING_KEYS.map((k) => (
              <button
                key={k}
                type="button"
                className="sim-leaning-option"
                aria-pressed={leaning === k}
                onClick={() => setLeaning(k)}
              >
                <span className="sim-leaning-name">{LEANING_LABEL[k]}</span>
                <span className="sim-leaning-note">{LEANING_NOTE[k]}</span>
              </button>
            ))}
          </div>
          <div className="sim-creation-nav">
            <button type="button" className="sim-ghost-btn" onClick={() => setStep("weights")}>
              Back
            </button>
            <button type="button" className="sim-primary-btn" onClick={() => setStep("hand")}>
              Next: the draw
            </button>
          </div>
        </section>
      )}

      {step === "hand" && (
        <section className="sim-creation-panel sim-creation-hand">
          <h2>{game ? "Birth RNG — your starting hand" : "The hand you're dealt"}</h2>
          <p className="sim-creation-intro">{game ? HAND_INTRO.game : HAND_INTRO.standard}</p>

          <ol className="sim-hand-cards">
            {drawn.reveal.map((card, i) => {
              const shown = i < revealed;
              return (
                <li key={card.axisId} className="sim-hand-card" data-shown={shown ? "1" : "0"} aria-hidden={!shown}>
                  <p className="sim-hand-card-axis">{card.title}</p>
                  {shown ? (
                    <>
                      <p className="sim-hand-card-value">{card.value.label}</p>
                      <p className="sim-hand-card-reveal">{card.value.reveal}</p>
                    </>
                  ) : (
                    <p className="sim-hand-card-facedown" aria-hidden="true">
                      ✦
                    </p>
                  )}
                </li>
              );
            })}
          </ol>

          {!allRevealed && (
            <div className="sim-creation-nav">
              <button type="button" className="sim-primary-btn" onClick={() => setRevealed((r) => r + 1)}>
                Turn the next card
              </button>
              <button type="button" className="sim-ghost-btn" onClick={() => setRevealed(drawn.reveal.length)}>
                Turn them all
              </button>
            </div>
          )}

          {allRevealed && (
            <>
              {/* THE CONSTRAINT PROFILE (§2.3.1) — what this start makes expensive,
                  per axis, with no composite anywhere and the verbatim worth-guard
                  adjacent (gate S-8). This is what replaced the difficulty tier. */}
              <div className="sim-profile" role="group" aria-label="What this start makes expensive">
                <p className="sim-profile-intro">{profile.intro}</p>
                <ul className="sim-profile-lines">
                  {profile.lines.map((l) => (
                    <li key={l.axis} className="sim-profile-line">
                      <span className="sim-profile-axis">{l.label}</span>
                      <span className="sim-profile-band">{l.band}</span>
                      <span className="sim-profile-note">{l.note}</span>
                    </li>
                  ))}
                </ul>
                <p className="sim-worth-guard">{profile.worthGuard}</p>
              </div>

              <div className="sim-redraw-block">
                <p className="sim-redraw-line">{redrawCount > 0 ? REDRAW_LINE_EXTENDED : REDRAW_LINE_1}</p>
                <div className="sim-creation-nav">
                  <button type="button" className="sim-ghost-btn" onClick={doRedraw}>
                    Draw a different hand
                  </button>
                  <button type="button" className="sim-primary-btn" onClick={() => onAccept(weights, leaning)}>
                    Begin the run with this hand
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}
