"use client";

import { useState } from "react";
import { useGuide } from "@/lib/guide-context";
import { StatusLabel } from "@/components/primitives";
import {
  PATCH,
  TIER_OBJECTIVE,
  TIER_FACTORS,
  ARCHETYPES,
  TIER_DISCLAIMER,
  TIER_LIMITS,
} from "@/content/history";

/**
 * History — one era done properly (§6.8). A major patch note plus a before/after
 * tier board with a scrub. Standard edition uses plain historical headings; Game
 * Guide uses patch/tier vocabulary — same substance, hiding no one. The fixed
 * disclaimer is rendered prominently. All content illustrative-historical.
 */
export function History() {
  const { edition } = useGuide();
  const game = edition === "game";
  const [side, setSide] = useState<"before" | "after">("after");

  const H = {
    added: game ? "Mechanics added" : "What was newly possible",
    removed: game ? "Mechanics removed" : "What stopped working",
    buffs: game ? "Direct buffs" : "Who was directly advantaged",
    nerfs: game ? "Direct nerfs" : "Who was directly set back",
    rollout: game ? "Rollout and adoption lag" : "How unevenly it arrived",
    transition: game ? "The generation caught between metas" : "The generation caught in the transition",
    board: game ? "Before / after tier board" : "Before and after: a ranking of positions",
  };

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
          <div>
            <h3>{H.buffs}</h3>
            <ul>
              {PATCH.buffs.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>{H.nerfs}</h3>
            <ul>
              {PATCH.nerfs.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>

        <h3>{H.rollout}</h3>
        <p>{PATCH.rollout}</p>
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
        <p className="tier-objective">
          <strong>Declared objective:</strong> {TIER_OBJECTIVE}
        </p>
        <p className="tier-weights">
          <strong>Factors weighted:</strong>{" "}
          {TIER_FACTORS.map((f) => `${f.label} (${f.weight})`).join(", ")}.
        </p>

        <div className="tier-scrub" role="group" aria-label="Ruleset">
          <span className="tier-scrub-label">Ruleset:</span>
          <button type="button" aria-pressed={side === "before"} onClick={() => setSide("before")}>
            Before
          </button>
          <button type="button" aria-pressed={side === "after"} onClick={() => setSide("after")}>
            After
          </button>
        </div>

        <ul className="tier-rows">
          {ARCHETYPES.map((a) => {
            const cell = a[side];
            const other = a[side === "before" ? "after" : "before"];
            const moved = cell.tier !== other.tier;
            return (
              <li key={a.id} className="tier-row-item">
                <span className={`tier-badge tier-${cell.tier}`} aria-hidden="true">
                  {cell.tier}
                </span>
                <div className="tier-row-body">
                  <div className="tier-row-head">
                    <strong>{a.name}</strong>
                    <span className="tier-sr">
                      {cell.tier}-tier under the {side} ruleset
                    </span>
                    {moved && (
                      <span className="tier-moved">
                        {side === "after" ? `was ${other.tier}` : `becomes ${other.tier}`}
                      </span>
                    )}
                  </div>
                  <p className="tier-ruling">{cell.ruling}</p>
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
      </section>
    </div>
  );
}
