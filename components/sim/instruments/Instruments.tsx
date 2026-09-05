"use client";

/**
 * CANONICAL INSTRUMENTS 2–6 (blueprint 4.0 §4.1, §4.3) — the strip, the gauges,
 * the budget instrument, the queue, and the timeline. Drawn once here, reused
 * everywhere. Together with the card face (CardFace.tsx) these are the six the
 * graphical floor names, and "the six canonical instruments exist as drawn
 * components" is an assertion about this file.
 *
 * THE ACCESSIBILITY RULE (§4.1): every instrument exposes a text/DOM equivalent
 * carrying the SAME information — not a shorter summary. Each component below
 * renders its numbers-free reading into a `.sim-sr` element or a visible caption,
 * so an assistive-tech user gets the instrument, not a note that one exists.
 *
 * THE MOTION RULE: every instrument's reduced-motion form is the same picture with
 * the transition removed (handled in sim.css), never a different, lesser render.
 *
 * NO NUMBERS (§6, gate S-2): pips are quantities and are fine; nothing here ever
 * renders a probability, a percentage, or a statistic.
 */

import { GAUGE_BAND_ORDER, GAUGE_KEYS, GAUGE_LABEL, GAUGE_MEANING, type GaugeKey } from "@/content/bands";
import { BUDGET_CURRENCIES, BUDGET_LABEL, BUDGET_MEANING, type Budget, type QueueEntry } from "@/content/sim/schema";
import { pendingLine } from "@/lib/sim/queue";
import type { StripSegment } from "@/lib/sim/resolve";

/* =========================================================================
   2 · THE DISTRIBUTION STRIP — the visible half of G-09
   ========================================================================= */

const BAND_WORD: Record<string, string> = {
  strong: "it went well",
  solid: "it held",
  mixed: "mixed",
  poor: "it went poorly",
  failure: "it fell through",
};

export function Strip({
  segments,
  marker,
  shift,
  shown = true,
  caption,
}: {
  segments: StripSegment[];
  marker?: number;
  shift?: number;
  shown?: boolean;
  caption?: string;
}) {
  const widest = segments.reduce((a, b) => (b.width > a.width ? b : a), segments[0]);
  const shiftWord = shift === undefined ? null : shift > 0.2 ? "wider toward the good end" : shift < -0.2 ? "wider toward the poor end" : "close to its base shape";
  return (
    <figure className="sim-strip">
      <div className="sim-strip-bar" aria-hidden="true">
        {segments.map((s, i) => (
          <span key={i} className="sim-strip-seg" data-band={s.name} style={{ flexGrow: Math.max(0.02, s.width) }}>
            <span className="sim-strip-seg-label">{BAND_WORD[s.name] ?? s.name}</span>
          </span>
        ))}
        {marker !== undefined ? (
          <span className="sim-strip-marker" data-shown={shown ? "1" : "0"} style={{ left: `${marker * 100}%` }}>
            <span className="sim-strip-marker-dot" />
          </span>
        ) : null}
      </div>
      <figcaption className="sim-strip-caption">
        {caption ?? "The move set this range. The draw lands inside it."}
        {/* The instrument's text equivalent — the same reading, in words (§4.1). */}
        <span className="sim-sr">
          {" "}
          A range of outcomes, widest at {BAND_WORD[widest?.name] ?? "the middle"}
          {shiftWord ? `, ${shiftWord} because of where this character is standing` : ""}
          {marker !== undefined && shown
            ? `. The draw landed in ${BAND_WORD[bandAt(segments, marker)] ?? "one of the bands"}.`
            : "."}
        </span>
      </figcaption>
    </figure>
  );
}

function bandAt(segments: StripSegment[], marker: number): string {
  let acc = 0;
  for (const s of segments) {
    acc += s.width;
    if (marker < acc) return s.name;
  }
  return segments[segments.length - 1]?.name ?? "";
}

/* =========================================================================
   3 · THE GAUGES — the stocks
   ========================================================================= */

export function Gauges({
  gauges,
  slack,
  relevantOnly,
  title = "Where you stand",
}: {
  gauges: Record<GaugeKey, number>;
  slack?: number;
  /** The state rail shows only what is relevant now (§4.1); the explain view all. */
  relevantOnly?: GaugeKey[];
  title?: string;
}) {
  const keys = relevantOnly?.length ? relevantOnly : [...GAUGE_KEYS];
  return (
    <section className="sim-gauges" aria-label={title}>
      <h4 className="sim-instrument-title">{title}</h4>
      <ul className="sim-gauge-list">
        {keys.map((k) => {
          const value = Math.max(0, Math.min(4, gauges[k]));
          const band = GAUGE_BAND_ORDER[value];
          return (
            <li key={k} className="sim-gauge" data-band={band}>
              <span className="sim-gauge-name">{GAUGE_LABEL[k]}</span>
              <span className="sim-gauge-track" aria-hidden="true">
                {GAUGE_BAND_ORDER.map((_, i) => (
                  <span key={i} className="sim-gauge-cell" data-on={i <= value ? "1" : "0"} />
                ))}
              </span>
              <span className="sim-gauge-band">{band}</span>
              <span className="sim-sr">
                {GAUGE_LABEL[k]} is {band}. {GAUGE_MEANING[k]}.
              </span>
            </li>
          );
        })}
        {slack !== undefined ? (
          <li className="sim-gauge sim-gauge-derived" data-band={GAUGE_BAND_ORDER[slack]}>
            <span className="sim-gauge-name">slack</span>
            <span className="sim-gauge-track" aria-hidden="true">
              {GAUGE_BAND_ORDER.map((_, i) => (
                <span key={i} className="sim-gauge-cell" data-on={i <= slack ? "1" : "0"} />
              ))}
            </span>
            <span className="sim-gauge-band">{GAUGE_BAND_ORDER[slack]}</span>
            <span className="sim-sr">
              Slack is {GAUGE_BAND_ORDER[slack]}. It is what absorbs a shock before the shock becomes a
              problem, and it is derived from money and time, stepped down while you are under load.
            </span>
          </li>
        ) : null}
      </ul>
    </section>
  );
}

/* =========================================================================
   4 · THE BUDGET INSTRUMENT — the flow, distinct from the stocks (§7.5)
   ========================================================================= */

export function BudgetInstrument({
  budget,
  spent,
  title = "This season",
  compact,
}: {
  budget: Budget;
  spent?: Budget;
  title?: string;
  compact?: boolean;
}) {
  return (
    <section className="sim-budget" aria-label={title} data-compact={compact ? "1" : undefined}>
      <h4 className="sim-instrument-title">{title}</h4>
      <ul className="sim-budget-list">
        {BUDGET_CURRENCIES.map((c) => {
          const total = budget[c];
          const used = spent?.[c] ?? 0;
          const left = Math.max(0, total - used);
          return (
            <li key={c} className="sim-budget-row" data-empty={left === 0 ? "1" : undefined}>
              <span className="sim-budget-name">{BUDGET_LABEL[c]}</span>
              <span className="sim-budget-pips" aria-hidden="true">
                {Array.from({ length: Math.max(total, used) }).map((_, i) => (
                  <span key={i} className="sim-budget-pip" data-state={i < left ? "left" : i < total ? "spent" : "over"} />
                ))}
                {total === 0 ? <span className="sim-budget-none">none this season</span> : null}
              </span>
              <span className="sim-sr">
                {BUDGET_LABEL[c]}: {word(left)} of {word(total)} pips left. {BUDGET_MEANING[c]}.
              </span>
            </li>
          );
        })}
      </ul>
      <p className="sim-budget-note">
        Re-derived every season from where you stand. Unspent pips do not carry over.
      </p>
    </section>
  );
}

const WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
function word(n: number): string {
  return WORDS[n] ?? "several";
}

/* =========================================================================
   5 · THE CONSEQUENCE QUEUE
   ========================================================================= */

export function Queue({
  queue,
  seasonIndex,
  title = "Already set in motion",
  onInspect,
}: {
  queue: QueueEntry[];
  seasonIndex: number;
  title?: string;
  onInspect?: (entry: QueueEntry) => void;
}) {
  if (!queue.length)
    return (
      <section className="sim-queue sim-queue-empty" aria-label={title}>
        <h4 className="sim-instrument-title">{title}</h4>
        <p className="sim-queue-none">Nothing is pending. What happens next season has not been decided yet.</p>
      </section>
    );
  return (
    <section className="sim-queue" aria-label={title}>
      <h4 className="sim-instrument-title">{title}</h4>
      <ul className="sim-queue-list">
        {queue.map((entry) => (
          <li key={entry.id} className="sim-queue-item">
            <span className="sim-queue-mark" aria-hidden="true" />
            <span className="sim-queue-text">{pendingLine(entry, seasonIndex)}</span>
            {onInspect ? (
              <button type="button" className="sim-queue-inspect" onClick={() => onInspect(entry)}>
                Where this came from
              </button>
            ) : null}
          </li>
        ))}
      </ul>
      <p className="sim-queue-note">
        This is what has already been set going. It is not a forecast — genuinely uncertain things are not
        listed here, because they are not decided.
      </p>
    </section>
  );
}

/* =========================================================================
   6 · THE TIMELINE — the window walked so far, with branch points and milestones
   ========================================================================= */

export type TimelineMark = {
  seasonIndex: number;
  /**
   * No "beat" kind, deliberately. Nothing constructed one, and a beat mark on a
   * timeline would be a beat PREVIEWED on a surface — which §5.1 forbids outright.
   * Leaving the arm in the union left that path open for the next author to take
   * by accident.
   */
  kind: "played" | "branch" | "pending" | "now";
  label: string;
};

export function Timeline({
  seasonCount,
  seasonIndex,
  marks,
  milestones,
  title = "The window",
}: {
  seasonCount: number;
  seasonIndex: number;
  marks: TimelineMark[];
  /** Doors still open from the current state — qualitative, never probabilistic. */
  milestones?: string[];
  title?: string;
}) {
  const played = marks.filter((m) => m.kind === "played");
  return (
    <section className="sim-timeline" aria-label={title}>
      <h4 className="sim-instrument-title">{title}</h4>
      <ol className="sim-timeline-track" data-scroll-region="x" tabIndex={0} aria-label="Seasons walked">
        {Array.from({ length: seasonCount }).map((_, i) => {
          const mark = marks.find((m) => m.seasonIndex === i);
          const state = i < seasonIndex ? "past" : i === seasonIndex ? "now" : "ahead";
          const age = 18 + Math.floor(i / 2);
          return (
            <li key={i} className="sim-timeline-cell" data-state={state} data-kind={mark?.kind}>
              {/* The timeline is READ, not operated. Each cell used to be a real
                  44x44 button wired to an onScrub that discarded its index and
                  re-set the stage the player was already on — twenty-four tab
                  stops that did nothing, which is worse for a keyboard user than
                  no control at all. There is no scrubbing behaviour to give them:
                  jumping back to an earlier season is either a read-only review
                  (unbuilt) or the silent rewind §3.8 forbids. The per-season
                  label stays, so a screen reader still gets every cell. */}
              <span className="sim-timeline-tick" aria-hidden="true" />
              <span className="sim-sr">
                Season {word(i + 1)}, age {age}
                {mark ? `: ${mark.label}` : state === "ahead" ? ": not walked yet" : ""}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="sim-timeline-legend">
        <span className="sim-timeline-key" data-kind="played" /> walked
        <span className="sim-timeline-key" data-kind="branch" /> a branch point
        <span className="sim-timeline-key" data-kind="pending" /> something pending
      </p>
      <span className="sim-sr">
        {word(played.length)} seasons walked of {word(seasonCount)}. You are in season {word(seasonIndex + 1)},
        at age {18 + Math.floor(seasonIndex / 2)}.
      </span>
      {milestones?.length ? (
        <div className="sim-milestones">
          <h5 className="sim-instrument-subtitle">Still reachable from here</h5>
          <ul className="sim-milestone-list">
            {milestones.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
          <p className="sim-milestone-note">
            Doors that are open from where you are standing. Not predictions, and not a to-do list.
          </p>
        </div>
      ) : null}
    </section>
  );
}
