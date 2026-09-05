"use client";

import Link from "next/link";
import { OUTCOME_BAND_LABEL, GAUGE_BAND_ORDER } from "@/content/bands";
import { OBJECTIVE_KEYS, OBJECTIVE_LABEL, type ObjectiveKey } from "@/content/play/schema";
import { profileRender } from "@/content/sim/profile";
import { BEATS } from "@/content/play/beats";
import { readAim, AIM_READS, AIM_TENSION } from "@/content/play/parse-copy";
import { PARSE_TITLE, PARSE_INTRO, REPLAY_NOTE, NEW_HAND_DISANALOGY } from "@/content/play/framing";
import type { ParseSummary } from "@/lib/engine/run";

/**
 * The post-mortem parse (blueprint 3.0 §3.7) — a complete run analysis, never a
 * grade. No totals, no letter, no comparison to other runs or readers. Scripted
 * beats render reduced-frame; skipped beats appear as one neutral factual line.
 */
export function Parse({
  summary,
  edition,
  onSameHand,
  onNewHand,
}: {
  summary: ParseSummary;
  edition: "standard" | "game";
  onSameHand: () => void;
  onNewHand: () => void;
}) {
  const game = edition === "game";
  const weighted = OBJECTIVE_KEYS.filter((k) => summary.winWeights[k] > 0);
  const aimInput = {
    gauges: summary.gaugesFinal,
    skills: summary.skillsFinal,
    relationships: summary.relationshipsFinal,
  };
  const thinButWanted = weighted.filter((k) => summary.winWeights[k] >= 2 && readAim(k, aimInput) === "thin");
  // The first PLAYED turning point gets the full skill/draw sentence; later played
  // ones are compacted (F4). Watched entries are decided-for-you context (§3.4).
  const firstPlayedIdx = summary.turningPoints.findIndex((tp) => !tp.watched);

  return (
    <div className="sim-parse">
      <header className="sim-parse-head">
        <p className="sim-eyebrow">{game ? "Post-mortem" : "The run, read back"}</p>
        <h1>{game ? PARSE_TITLE.game : PARSE_TITLE.standard}</h1>
        <p className="sim-parse-intro">{game ? PARSE_INTRO.game : PARSE_INTRO.standard}</p>
      </header>

      {/* The hand and its constraint profile — worth-guard adjacent (S-8). */}
      {summary.hand && (
        <section className="sim-parse-section sim-parse-hand">
          <h2>The hand you were dealt</h2>
          <ul className="sim-parse-hand-list">
            <li><span>household</span> {summary.hand.household}</li>
            <li><span>family</span> {summary.hand.family}</li>
            <li><span>body</span> {summary.hand.health}</li>
            <li><span>place</span> {summary.hand.environment}</li>
          </ul>
          {/* The per-axis constraint profile (§2.3.1), worth-guard adjacent (S-8). */}
          <ul className="sim-profile-lines">
            {profileRender(summary.profile).lines.map((l) => (
              <li key={l.axis} className="sim-profile-line">
                <span className="sim-profile-axis">{l.label}</span>
                <span className="sim-profile-band">{l.band}</span>
              </li>
            ))}
          </ul>
          <p className="sim-worth-guard">{profileRender(summary.profile).worthGuard}</p>
        </section>
      )}

      {/* Turning points — the skill/draw split at each decision. */}
      <section className="sim-parse-section">
        <h2>Where it turned</h2>
        <ol className="sim-turning-list">
          {summary.turningPoints.map((tp, i) => {
            // Watched acts (§3.4): the call was made *for* the character. No button
            // existed, so no skill/draw framing — just decided-for-you context.
            if (tp.watched) {
              return (
                <li key={tp.cardId + i} className="sim-turning sim-turning-watched">
                  <p className="sim-turning-choice">
                    <span className="sim-turning-madefor">Decided for you:</span>{" "}
                    <strong>{tp.optionLabel}</strong>.
                  </p>
                </li>
              );
            }
            const firstPlayed = i === firstPlayedIdx;
            return (
              <li key={tp.cardId + i} className="sim-turning" data-band={tp.band}>
                <p className="sim-turning-choice">
                  You chose to <strong>{tp.optionLabel}</strong>.
                  {tp.recovery && <>{" "}<span className="sim-turning-tag">a route back</span></>}
                  {tp.failure && <>{" "}<span className="sim-turning-tag sim-turning-tag-fail">a bad draw</span></>}
                </p>
                <div className="sim-turning-strip" aria-hidden="true">
                  <span className="sim-turning-marker" style={{ left: `${Math.round(tp.marker * 1000) / 10}%` }} />
                </div>
                {firstPlayed ? (
                  <p className="sim-turning-split">
                    Your move set the range ({shiftWord(tp.shift)}); the draw came up{" "}
                    <strong>{OUTCOME_BAND_LABEL[tp.band]}</strong>.
                  </p>
                ) : (
                  <p className="sim-turning-split">
                    Footing {shiftPhrase(tp.shift)}; the draw: <strong>{OUTCOME_BAND_LABEL[tp.band]}</strong>.
                  </p>
                )}
              </li>
            );
          })}
        </ol>
        <p className="sim-parse-note">
          {game
            ? "Skill set each range; the die landed each marker. You can't read the decision back from the result — which is the whole point of playing it twice."
            : "Each move set a range of outcomes; luck landed each one. A good decision can still land badly — you can't judge the choice by the result."}
        </p>
      </section>

      {/* Compounding — the buffer across the run. */}
      {summary.slackByAct.length > 1 && (
        <section className="sim-parse-section">
          <h2>What compounded</h2>
          <SlackCurve slackByAct={summary.slackByAct} />
          <p className="sim-parse-note">
            The line is your buffer across the run — bent by the small, repeated choices more than the loud ones.
          </p>
        </section>
      )}

      {/* Scripted beats — reduced frame, skip propagation (§3.7). */}
      {summary.scriptedNotes.length > 0 && (
        <section className="sim-parse-section sim-parse-beats">
          <h2>The quiet parts</h2>
          <ul className="sim-beat-notes">
            {summary.scriptedNotes.map((n, i) => {
              const beat = BEATS[n.beatId];
              if (!beat) return null;
              return (
                <li key={n.beatId + i} className="sim-beat-note">
                  {n.skipped ? beat.skippedLine : beat.prose}
                  {!n.skipped && (
                    <>
                      {" "}
                      <Link href={beat.realPageLink} className="sim-beat-real-link">
                        For the real thing, there's a page.
                      </Link>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Achievements — narrative, uncounted, unranked. */}
      <section className="sim-parse-section">
        <h2>{game ? "What this life did" : "What this life did"}</h2>
        <ul className="sim-achievement-list">
          {summary.achievements.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </section>

      {/* The win-condition read — against the player's OWN weights. */}
      {weighted.length > 0 && (
        <section className="sim-parse-section">
          <h2>Against what you said winning meant</h2>
          <ul className="sim-aim-read-list">
            {weighted.map((k: ObjectiveKey) => (
              <li key={k}>
                <span className="sim-aim-name">{OBJECTIVE_LABEL[k]}</span>
                <span className="sim-aim-verdict">{AIM_READS[k][readAim(k, aimInput)]}</span>
              </li>
            ))}
          </ul>
          {thinButWanted.length > 0 && <p className="sim-aim-tension">{AIM_TENSION}</p>}
        </section>
      )}

      {/* Replay — the one thing this room has that life doesn't. */}
      <section className="sim-parse-section sim-parse-replay">
        <p className="sim-replay-note">{REPLAY_NOTE}</p>
        <div className="sim-replay-buttons">
          <button type="button" className="sim-primary-btn" onClick={onSameHand}>
            Same hand, again
            <span className="sim-replay-sub">skill moves the distribution</span>
          </button>
          <button type="button" className="sim-primary-btn" onClick={onNewHand}>
            A new hand
            <span className="sim-replay-sub">position moves everything else</span>
          </button>
          <Link href="/topics" className="sim-ghost-btn sim-replay-library">
            Back to the library
            <span className="sim-replay-sub">the reading layer, for why</span>
          </Link>
        </div>
        <p className="sim-replay-disanalogy">{NEW_HAND_DISANALOGY}</p>
      </section>
    </div>
  );
}

function shiftWord(shift: number): string {
  return shift > 0.25 ? "your footing widened the good outcomes" : shift < -0.25 ? "your footing widened the hard ones" : "the base spread";
}

/** Compact footing phrase for subsequent played entries (F4) — direction stays visible. */
function shiftPhrase(shift: number): string {
  return shift > 0.25 ? "widened the good outcomes" : shift < -0.25 ? "widened the harder outcomes" : "held the base spread";
}

function SlackCurve({ slackByAct }: { slackByAct: number[] }) {
  const w = 320;
  const h = 120;
  const padX = 16;
  const padY = 16;
  const n = slackByAct.length;
  const points = slackByAct.map((v, i) => {
    const x = padX + (i * (w - 2 * padX)) / Math.max(1, n - 1);
    const y = padY + (1 - v / (GAUGE_BAND_ORDER.length - 1)) * (h - 2 * padY);
    return `${Math.round(x)},${Math.round(y)}`;
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="sim-slack-curve" role="img" aria-label="Your buffer across the run">
      <line x1={padX} y1={h - padY} x2={w - padX} y2={h - padY} className="sim-chart-axis" />
      <polyline points={points.join(" ")} className="sim-slack-line" fill="none" />
      {points.map((p, i) => {
        const [x, y] = p.split(",");
        return <circle key={i} cx={x} cy={y} r="3" className="sim-chart-node" />;
      })}
    </svg>
  );
}
