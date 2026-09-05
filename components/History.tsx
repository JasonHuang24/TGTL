"use client";

import { useState } from "react";
import { useGuide } from "@/lib/guide-context";
import { StatusLabel, NoWinner } from "@/components/primitives";
import {
  PATCH,
  ARCHETYPES,
  TIER_DISCLAIMER,
  TIER_LIMITS,
  TIER_OBJECTIVES,
  TIER_NOT_MEASURED,
  EVIDENCE_LABEL_WORD,
  EMPTY_TIER_LINE,
  EMPTY_TIER_NOTE,
  RULES_GRID_NOTE,
  TIERS,
  type Tier,
} from "@/content/history";

/**
 * History — one era done properly (§6.8). A major patch note plus a before/after
 * tier board with a scrub. Standard edition uses plain historical headings; Game
 * Guide uses patch/tier vocabulary — same substance, hiding no one. All content
 * illustrative-historical.
 *
 * 6.0 (N-170, N-171, N-172, N-176, N-093):
 *  - the objective is a `<select>` over an enumerated set, and the board
 *    re-renders under it (C-43);
 *  - the ruleset header — objective, unit, priority factors, not measured,
 *    evidence state — renders ABOVE every letter (C-44);
 *  - a tier with no responsible placement renders as empty and badged, rather
 *    than being quietly filled or quietly omitted;
 *  - the patch note's rules render as three parallel panels;
 *  - the board closes on the refusal to name a winner (C-41).
 */
export function History() {
  const { edition } = useGuide();
  const game = edition === "game";
  const [side, setSide] = useState<"before" | "after">("after");
  const [objectiveId, setObjectiveId] = useState(TIER_OBJECTIVES[0].id);

  const objective = TIER_OBJECTIVES.find((o) => o.id === objectiveId) ?? TIER_OBJECTIVES[0];

  const H = {
    added: game ? "Mechanics added" : "What was newly possible",
    removed: game ? "Mechanics removed" : "What stopped working",
    buffs: game ? "Direct buffs" : "Who was directly advantaged",
    nerfs: game ? "Direct nerfs" : "Who was directly set back",
    rollout: game ? "Rollout and adoption lag" : "How unevenly it arrived",
    transition: game ? "The generation caught between metas" : "The generation caught in the transition",
    board: game ? "Before / after tier board" : "Before and after: a ranking of positions",
  };

  /** Rows under the current objective, in the board's authored archetype order. */
  const rows = ARCHETYPES.map((a) => {
    const p = objective.placements[a.id];
    return { archetype: a, placement: p };
  });

  /*
   * N-172 — THE EMPTY TOP TIER, and only the top tier.
   *
   * A first pass rendered the explicit empty state for every unoccupied letter,
   * which is wrong in a way worth recording: `EMPTY_TIER_NOTE` says the evidence
   * cannot justify a strong placement, and that is a claim about the TOP of the
   * board. An ordinary gap in the middle — nobody happens to sit at B under this
   * objective — is not a refusal of anything, and dressing it as one dilutes the
   * one place where the refusal is the whole point.
   *
   * So the card renders for S alone, where an empty tier means the instrument
   * looked and would not say. It carries the objective's own evidence label, and
   * C-43 requires that label to be `insufficient-evidence` — an empty top tier
   * that claimed to be evidence-informed would be the same overclaim wearing the
   * opposite costume.
   */
  const occupied = new Set(rows.map((r) => r.placement?.[side]).filter(Boolean) as Tier[]);
  const topTierEmpty = !occupied.has(TIERS[0]);

  return (
    <div className="history">
      <section className="panel atlas patch-note">
        <p className="eyebrow">{game ? "Major patch note" : "A major change, in one entry"}</p>
        <h2>{PATCH.version}</h2>
        <p className="patch-subtitle">{PATCH.subtitle}</p>
        <p className="patch-headline">{PATCH.headline}</p>

        <div className="patch-grid">
          <div>
            <h3>{H.added}</h3>
            <ul>
              {PATCH.added.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>{H.removed}</h3>
            <ul>
              {PATCH.removed.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>

        {/*
         * N-176 — the written rule, what actually happened to people, and how
         * long the distance between them lasted, side by side rather than in
         * sequence. Nothing is authored here that was not already in PATCH; the
         * headings and the one framing sentence are the whole addition.
         */}
        <h3 id="rules-and-effects">{game ? "Rules, effects, and rollout" : "What was written, what happened, and how long the gap lasted"}</h3>
        <p className="rules-grid-note">{RULES_GRID_NOTE}</p>
        <div className="rules-grid" data-rules-grid>
          <div className="rules-panel" data-rules-panel="official">
            <h3>{game ? "Official rules" : "The rules as written"}</h3>
            <ul>
              {PATCH.added.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div className="rules-panel" data-rules-panel="practical">
            <h3>{game ? "Practical effects" : "What it did to people"}</h3>
            <ul>
              {[...PATCH.buffs, ...PATCH.nerfs].map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div className="rules-panel" data-rules-panel="rollout">
            <h3>{H.rollout}</h3>
            <p>{PATCH.rollout}</p>
          </div>
        </div>

        <h3>{H.transition}</h3>
        <p>{PATCH.transitionGeneration}</p>
      </section>

      <section className="panel tier-board" aria-labelledby="tier-heading">
        <p className="eyebrow" id="tier-heading">
          {H.board}
        </p>
        <p className="tier-disclaimer" role="note">
          {TIER_DISCLAIMER}
        </p>

        {/*
         * N-170 (C-43) — the objective switch. The board below is authored per
         * objective; changing this changes which placements exist, not how a
         * single set of placements is displayed.
         */}
        <div className="tier-objective-select">
          <label htmlFor="tier-objective">
            <strong>Ranked for:</strong>
          </label>
          <select
            id="tier-objective"
            data-tier-objective={objective.id}
            value={objectiveId}
            onChange={(e) => setObjectiveId(e.target.value)}
          >
            {TIER_OBJECTIVES.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/*
         * N-171 (C-44) — THE RULESET HEADER, ABOVE EVERY LETTER.
         *
         * The trunk carried a long caveat paragraph BELOW the board, which is
         * the wrong side of it: by the time a reader gets there they have
         * already read five letters and decided what they mean. Declared first,
         * the reader knows what is being ranked before they see a rank — and
         * "an economic position, not a demographic group or a person" is the
         * line that stops a tier list turning into a ranking of people.
         */}
        <div className="tier-ruleset" data-tier-ruleset={objective.id}>
          <p className="eyebrow">The ruleset this board is using</p>
          <dl>
            <div>
              <dt>Objective</dt>
              <dd data-ruleset-objective>
                {objective.label} — {objective.question}
              </dd>
            </div>
            <div>
              <dt>Unit</dt>
              <dd data-ruleset-unit>{objective.unit}</dd>
            </div>
            <div>
              <dt>Priority factors</dt>
              <dd>
                <ul className="tier-factor-weights" data-ruleset-factors>
                  {objective.factors.map((f) => (
                    <li key={f.name}>
                      {f.name} — <span className="tier-weight-word">{f.weight}</span>
                    </li>
                  ))}
                </ul>
                No number is involved. A weight says how much a factor mattered to this question, and
                nothing is added up.
              </dd>
            </div>
            <div>
              <dt>Not measured</dt>
              <dd data-ruleset-not-measured>{objective.notMeasured.join(" · ")}.</dd>
            </div>
            <div>
              <dt>Evidence state</dt>
              <dd data-ruleset-evidence={objective.evidence}>{EVIDENCE_LABEL_WORD[objective.evidence]}</dd>
            </div>
          </dl>
        </div>

        <div className="tier-scrub" role="group" aria-label="Ruleset">
          <span className="tier-scrub-label">Ruleset:</span>
          <button type="button" aria-pressed={side === "before"} onClick={() => setSide("before")}>
            Before
          </button>
          <button type="button" aria-pressed={side === "after"} onClick={() => setSide("after")}>
            After
          </button>
        </div>

        <ul className="tier-rows" data-tier-rows={objective.id}>
          {/* N-172 — the empty top tier renders as an empty tier, badged with the
              objective's own evidence state. The most persuasive refusal on the
              site is an instrument visibly declining to answer. */}
          {topTierEmpty && (
            <li className="tier-row-item is-empty-tier" data-empty-tier={TIERS[0]}>
              <span className={`tier-badge tier-${TIERS[0]}`} aria-hidden="true">
                {TIERS[0]}
              </span>
              <div className="tier-row-body">
                <div className="tier-row-head">
                  <strong>
                    {TIERS[0]} — {EMPTY_TIER_LINE}
                  </strong>
                  <span className="status-label" data-empty-tier-evidence={objective.evidence}>
                    <span className="status-dot" aria-hidden="true" />
                    {EVIDENCE_LABEL_WORD[objective.evidence]}
                  </span>
                </div>
                <p className="tier-ruling tier-empty-ruling">{EMPTY_TIER_NOTE}</p>
              </div>
            </li>
          )}
          {rows.map(({ archetype: a, placement }) => {
            if (!placement) return null;
            const tier = placement[side];
            const other = placement[side === "before" ? "after" : "before"];
            const moved = tier !== other;
            if (!tier) return null;
            return (
              <li key={a.id} className="tier-row-item" data-tier-placement={a.id}>
                <span className={`tier-badge tier-${tier}`} aria-hidden="true">
                  {tier}
                </span>
                <div className="tier-row-body">
                  <div className="tier-row-head">
                    <strong>{a.name}</strong>
                    <span className="tier-sr">
                      {tier}-tier under the {side} ruleset, ranked for {objective.label.toLowerCase()}
                    </span>
                    {moved && other && (
                      <span className="tier-moved">
                        {side === "after" ? `was ${other}` : `becomes ${other}`}
                      </span>
                    )}
                  </div>
                  <p className="tier-ruling">{placement.ruling}</p>
                  {a.dependency && side === "after" && (
                    <p className="tier-dependency">
                      <span className="tier-dependency-label">Depended on:</span> {a.dependency}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <p className="tier-limits">{TIER_LIMITS}</p>
        <StatusLabel status="illustrative" note="illustrative-historical, pending research" />

        {/* N-093 (C-41) — the board closes on the refusal. It renders last, after
            the letters and after the limits, because a comparison that simply
            stops invites the reader to supply the verdict themselves. */}
        <NoWinner
          sides={TIER_OBJECTIVES.map((o) => ({
            name: o.label,
            emphasises: o.question,
          }))}
          title="No overall winner — and no overall board"
          note={`Three questions, three different orders, and no way to combine them that is not just a fourth opinion with the arithmetic hidden. What is never ranked, under any of them: ${TIER_NOT_MEASURED.join(", ").toLowerCase()}.`}
        />
      </section>
    </div>
  );
}
