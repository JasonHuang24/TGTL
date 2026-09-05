"use client";

import { GAUGE_KEYS, GAUGE_LABEL, GAUGE_MEANING, GAUGE_BAND_ORDER, type GaugeKey } from "@/content/bands";
import { conditionLabel, skillLabel } from "@/content/play/registry";
import { OBJECTIVE_LABEL, type ObjectiveKey, type RunState } from "@/content/play/schema";
import { slack } from "@/lib/engine/run";
import { profileRender } from "@/content/sim/profile";

/**
 * The state panel (blueprint 3.0 §3.6) — the 2.0 character sheet made live.
 * Qualitative bands only, no total, no overall score, nowhere for one to go.
 * Progressive HUD: it starts small in the watched acts and grows as acts introduce
 * instruments (the walkthrough principle, in the interface).
 */

/** Which panel instruments are visible at a given act (progressive HUD). */
function instrumentsForAct(act: number) {
  return {
    gauges: act >= 3 ? (GAUGE_KEYS.slice(0, act >= 5 ? 4 : 3) as GaugeKey[]) : ([] as GaugeKey[]),
    slack: act >= 6,
    skills: act >= 3,
  };
}

function GaugeMeter({ label, meaning, level }: { label: string; meaning: string; level: number }) {
  const word = GAUGE_BAND_ORDER[level];
  return (
    <div className="sim-gauge" title={meaning}>
      <div className="sim-gauge-head">
        <span className="sim-gauge-name">{label}</span>
        <span className="sim-gauge-band">{word}</span>
      </div>
      <div className="sim-gauge-track" role="img" aria-label={`${label}: ${word}`}>
        {GAUGE_BAND_ORDER.map((_, i) => (
          <span key={i} className="sim-gauge-cell" data-on={i <= level ? "1" : "0"} />
        ))}
      </div>
    </div>
  );
}

export function StatePanel({
  run,
  edition,
}: {
  run: RunState;
  edition: "standard" | "game";
}) {
  const instr = instrumentsForAct(run.act);
  const profile = run.hand ? profileRender(run.hand.profile) : null;
  const sl = slack(run);
  const activeObjectives = (Object.keys(run.winWeights) as ObjectiveKey[]).filter((k) => run.winWeights[k] > 0);

  return (
    <aside className="sim-state-panel" aria-label="Your situation, so far">
      <div className="sim-state-panel-head">
        <p className="sim-eyebrow">{edition === "game" ? "Character" : "Where you stand"}</p>
        {run.hand && (
          <p className="sim-panel-hand">
            <span className="sim-panel-hand-profile">
              {profile ? profile.lines.map((l) => `${l.label}: ${l.band}`).join(" · ") : ""}
            </span>
            <span className="sim-panel-hand-note" title={profile ? profile.worthGuard : ""}>
              start — not a measure of you
            </span>
          </p>
        )}
      </div>

      {instr.gauges.length > 0 && (
        <div className="sim-panel-section">
          {instr.gauges.map((k) => (
            <GaugeMeter key={k} label={GAUGE_LABEL[k]} meaning={GAUGE_MEANING[k]} level={run.gauges[k]} />
          ))}
          {instr.slack && (
            <GaugeMeter label="slack (your buffer)" meaning="the margin that absorbs a shock before it cascades" level={sl} />
          )}
        </div>
      )}

      {instr.skills && run.skills.length > 0 && (
        <div className="sim-panel-section">
          <p className="sim-panel-label">what you've become good at</p>
          <ul className="sim-chip-list sim-panel-chips">
            {run.skills.map((s) => (
              <li key={s}>{skillLabel(s)}</li>
            ))}
          </ul>
        </div>
      )}

      {run.relationships.length > 0 && (
        <div className="sim-panel-section">
          <p className="sim-panel-label">the people around you</p>
          <ul className="sim-panel-marks">
            {run.relationships.map((r) => (
              <li key={r.id} data-quality={qualityBand(r.quality)}>
                <span className="sim-mark-name">{r.label}</span>
                <span className="sim-mark-quality">{qualityWord(r.quality)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {run.conditions.length > 0 && (
        <div className="sim-panel-section">
          <p className="sim-panel-label">what's true right now</p>
          <ul className="sim-chip-list sim-panel-chips sim-panel-conditions">
            {run.conditions.map((c) => (
              <li key={c}>{conditionLabel(c)}</li>
            ))}
          </ul>
        </div>
      )}

      {activeObjectives.length > 0 && (
        <div className="sim-panel-section">
          <p className="sim-panel-label">what you decided winning means</p>
          <ul className="sim-chip-list sim-panel-chips sim-panel-aims">
            {activeObjectives
              .sort((a, b) => run.winWeights[b] - run.winWeights[a])
              .map((k) => (
                <li key={k} data-weight={run.winWeights[k]}>
                  {OBJECTIVE_LABEL[k]}
                </li>
              ))}
          </ul>
        </div>
      )}

      <p className="sim-panel-foot">No total. No score. There is nowhere on this panel for one to go.</p>
    </aside>
  );
}

function qualityWord(q: number): string {
  if (q >= 2) return "close";
  if (q === 1) return "warm";
  if (q === 0) return "there";
  return "strained";
}
function qualityBand(q: number): string {
  if (q >= 2) return "close";
  if (q === 1) return "warm";
  if (q === 0) return "there";
  return "strained";
}
