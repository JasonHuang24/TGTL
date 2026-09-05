"use client";

/**
 * THE DECISION LAB, on screen (blueprint 4.0 §3.8, Phase 1).
 *
 * Pick a situation, pick an axis, see two branches side by side. The axis label
 * and its frame render at the top of every comparison, the no-prediction line
 * renders at the bottom of every one, and the differences are COMPUTED from the
 * branches rather than described — so the Lab cannot claim a difference the
 * engine did not produce.
 *
 * The three axes are the three lessons, and the UI says which is which:
 *   choice-vary   → the agency lesson
 *   draw-vary     → G-09, the move sets the range and the draw lands inside it
 *   position-vary → G-08, the same move costs different amounts from where you are
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSimHydrated } from "@/lib/sim/use-hydrated";
import { compare, NO_PREDICTION_LINE, type Comparison } from "@/lib/sim/lab";
import { LAB_SITUATIONS } from "@/content/sim/lab/situations";
import { LAB_AXIS_LABEL, LAB_AXIS_LESSON, type LabAxis, type ResolvedItem } from "@/content/sim/schema";
import { ATTRIBUTION_LABEL } from "@/content/sim/schema";
import { CardFace } from "@/components/sim/instruments/CardFace";
import { SceneBackdrop, ScenePlate } from "@/components/sim/scene/Scene";
import { PRESET_BY_ID } from "@/content/sim/registry";

export function LabApp() {
  useSimHydrated();
  const [situationId, setSituationId] = useState<string | null>(null);
  const [axis, setAxis] = useState<LabAxis | null>(null);
  const [openStep, setOpenStep] = useState<string | null>(null);

  const situation = LAB_SITUATIONS.find((s) => s.id === situationId) ?? null;
  const comparison: Comparison | null = useMemo(
    () => (situationId && axis ? compare(situationId, axis) : null),
    [situationId, axis],
  );

  if (!situation) {
    return (
      <div className="sim-lab sim-surface">
        <section className="sim-scene">
          <SceneBackdrop stage="void" />
          <ScenePlate eyebrow="The Decision Lab" title="Fork one decision and compare" wide>
            <p>
              Play both sides of a single choice, then look at what actually separated them. Nothing here is
              saved, nothing is scored, and you can rewind as often as you like — a branch in the Lab is a
              hypothesis, not a life.
            </p>
            <ul className="sim-lab-grid">
              {LAB_SITUATIONS.map((s) => (
                <li key={s.id}>
                  <CardFace family={s.face} eyebrow={`${s.window.length} decisions`} title={s.title} as="div">
                    <p className="sim-door-note">
                      Compares {s.axes.map((a) => AXIS_SHORT[a]).join(", ")}.
                    </p>
                    <button
                      type="button"
                      className="sim-primary-btn"
                      onClick={() => {
                        setSituationId(s.id);
                        setAxis(s.axes[0]);
                      }}
                    >
                      Open this one
                    </button>
                  </CardFace>
                </li>
              ))}
            </ul>
            <p className="sim-door-foot">{NO_PREDICTION_LINE}</p>
          </ScenePlate>
        </section>
      </div>
    );
  }

  return (
    <div className="sim-lab sim-surface">
      <header className="sim-header">
        <dl className="sim-header-facts">
          <div className="sim-header-fact">
            <dt>situation</dt>
            <dd>{situation.title}</dd>
          </div>
          <div className="sim-header-fact sim-header-intent">
            <dt>comparing</dt>
            <dd>{axis ? LAB_AXIS_LABEL[axis] : "—"}</dd>
          </div>
        </dl>
        <div className="sim-header-controls">
          <button
            type="button"
            className="sim-ghost-btn"
            onClick={() => {
              setSituationId(null);
              setAxis(null);
            }}
          >
            Another situation
          </button>
        </div>
      </header>

      <div className="sim-lab-axes" role="group" aria-label="What to vary">
        {situation.axes.map((a) => (
          <button
            key={a}
            type="button"
            className="sim-filter-btn"
            aria-pressed={axis === a}
            onClick={() => setAxis(a)}
          >
            {AXIS_SHORT[a]}
          </button>
        ))}
      </div>

      {comparison ? (
        <section className="sim-lab-compare">
          <p className="sim-lab-frame">{comparison.frame}</p>
          <p className="sim-lab-lesson">
            <span className="sim-lab-lesson-label">what this axis teaches</span> {LAB_AXIS_LESSON[comparison.axis]}
          </p>

          {/* N-225 (C-22). What the fork cannot settle, BEFORE the branches.
              The comparison below looks decisive — two columns, a computed
              difference list, a reading. These are the facts outside the model
              that would actually decide it, and no branch on this screen contains
              any of them. Rendered above the columns because after them is too
              late: by then the screen has already made its case. */}
          <section className="sim-panel sim-lab-unknowns" aria-label="What this cannot settle">
            <h4 className="sim-instrument-title">What this cannot settle</h4>
            <ul className="sim-plain-list">
              {comparison.situation.unknowns.map((u, i) => (
                <li key={i} data-sim-lab-unknown>
                  {u}
                </li>
              ))}
            </ul>
          </section>

          <div className="sim-lab-columns">
            {[comparison.left, comparison.right].map((branch) => (
              <div key={branch.id} className="sim-lab-column">
                <h3 className="sim-lab-branch-title">{branch.label}</h3>
                {comparison.axis === "position-vary" ? (
                  <p className="sim-lab-branch-sub">
                    starting from {PRESET_BY_ID[branch.presetId]?.label ?? branch.presetId}
                  </p>
                ) : null}
                <ol className="sim-lab-steps">
                  {branch.steps.map((step) => {
                    const key = `${branch.id}:${step.stepIndex}`;
                    return (
                      <li key={key}>
                        <CardFace
                          family={step.family}
                          band={step.band}
                          eyebrow={step.optionLabel}
                          title={step.actionLabel}
                          as="div"
                        >
                          {/* What the move cost, and what it cost FROM HERE.
                              The Lab rendered none of this, which left
                              position-vary claiming "the same move costs
                              different amounts from where you are" over two
                              columns with no costs in them. */}
                          <ul className="sim-chip-row">
                            {step.chips.costs.map((c, i) => (
                              <li key={i} className="sim-chip" data-kind="cost">
                                {c}
                              </li>
                            ))}
                            <li className="sim-chip" data-kind="variance">
                              {step.chips.variance}
                            </li>
                            <li className="sim-chip" data-kind="rev">
                              {step.chips.reversibility}
                            </li>
                            {step.chips.recovery ? (
                              <li className="sim-chip" data-kind="recovery">
                                a way back
                              </li>
                            ) : null}
                            {step.chips.positionNotes.map((p, i) => (
                              <li key={`pn${i}`} className="sim-chip" data-kind="position">
                                {p}
                              </li>
                            ))}
                          </ul>
                          <p className="sim-result-line">{step.line}</p>
                          <button
                            type="button"
                            className="sim-ghost-btn"
                            aria-expanded={openStep === key}
                            onClick={() => setOpenStep(openStep === key ? null : key)}
                          >
                            {openStep === key ? "Close" : "Why this happened"}
                          </button>
                          {openStep === key ? <Attribution item={step} /> : null}
                        </CardFace>
                      </li>
                    );
                  })}
                </ol>
              </div>
            ))}
          </div>

          <section className="sim-panel">
            <h4 className="sim-instrument-title">What actually differs</h4>
            {comparison.differences.length ? (
              <ul className="sim-lab-diff">
                {comparison.differences.map((d, i) => (
                  <li key={i}>
                    <span className="sim-lab-diff-field">{d.field}</span>
                    <span className="sim-lab-diff-left">{d.left}</span>
                    <span className="sim-lab-diff-vs">vs</span>
                    <span className="sim-lab-diff-right">{d.right}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="sim-panel-empty">Nothing separated them. That is a result, not a bug.</p>
            )}
            <p className="sim-panel-note">{comparison.reading}</p>
            {/* N-224. WHEN A COMPARISON STOPS BEING CONTROLLED — as a standing
                note, because in this Lab it never does.
                `compare()` builds both branches in one call, from one content
                version, holding every input identical except the named axis
                (S-1 asserts exactly that: choice-vary differs in one step, the
                other two axes in none). So there is no state of this screen where
                a "these two are not comparable" warning would be TRUE, and
                rendering it conditionally would mean rendering it never. What is
                worth saying is the condition itself: the reader is about to carry
                this habit to comparisons that are not built this way — two
                branches saved months apart, or read back after the content
                changed — and those are the ones the sentence is about. */}
            <p className="sim-panel-note" data-sim-lab-control-note>
              Both branches were run just now, from the same content, holding everything identical except the one
              thing named above — which is what makes this comparison controlled. Different ages or versions are
              not controlled experiments. Each explanation keeps its original version.
            </p>
          </section>

          <p className="sim-no-prediction">{comparison.noPrediction}</p>

          <div className="sim-season-nav">
            <Link href="/play/campaign" className="sim-ghost-btn">
              Take this into a campaign
            </Link>
            <Link href="/play" className="sim-ghost-btn">
              Back to the play door
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function Attribution({ item }: { item: ResolvedItem }) {
  if (!item.attribution.length) return <p className="sim-panel-empty">Nothing pushed this one either way.</p>;
  return (
    <ul className="sim-attribution">
      {item.attribution.map((c, i) => (
        <li key={i} data-category={c.category} data-dir={c.weight >= 0 ? "up" : "down"}>
          <span className="sim-attribution-cat">{ATTRIBUTION_LABEL[c.category]}</span>
          <span className="sim-attribution-note">{c.note}</span>
        </li>
      ))}
    </ul>
  );
}

const AXIS_SHORT: Record<LabAxis, string> = {
  "choice-vary": "the decision",
  "draw-vary": "the luck",
  "position-vary": "the starting position",
};
