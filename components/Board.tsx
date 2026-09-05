"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { STORAGE_KEYS, readJSON, writeJSON, removeKey } from "@/lib/storage";
import { CrisisNote } from "@/components/primitives";
import {
  CRISIS_CHIPS,
  CONSTRAINT_STEPS,
  computeReading,
  type BoardSelections,
} from "@/content/board";

/**
 * The guided pressure reading (blueprint 3.0 §4). Every input is enumerated —
 * radios and multi-select chips, no free text the site interprets. Crisis-domain
 * routes sit at the top as direct links to the real pages (the short-circuit,
 * working with or without JS); they are never rated or folded into the reading.
 * The reading names WHICH row binds, never how bad — no score, meter, or tier.
 * Local-only; visible erase.
 */

const EMPTY: BoardSelections = { levels: {}, chips: {} };

export function Board() {
  const [sel, setSel] = useState<BoardSelections>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const [erased, setErased] = useState(false);

  useEffect(() => {
    setSel(readJSON<BoardSelections>(STORAGE_KEYS.board, EMPTY));
    setHydrated(true);
    const onReset = () => setSel(EMPTY);
    window.addEventListener("tgtl:reset", onReset);
    return () => window.removeEventListener("tgtl:reset", onReset);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEYS.board, sel);
  }, [sel, hydrated]);

  const setLevel = (stepId: string, value: string) => {
    setErased(false);
    setSel((s) => ({ ...s, levels: { ...s.levels, [stepId]: value } }));
  };
  const toggleChip = (stepId: string, chipId: string) => {
    setErased(false);
    setSel((s) => {
      const cur = s.chips[stepId] ?? [];
      const next = cur.includes(chipId) ? cur.filter((c) => c !== chipId) : [...cur, chipId];
      return { ...s, chips: { ...s.chips, [stepId]: next } };
    });
  };
  const erase = () => {
    setSel(EMPTY);
    removeKey(STORAGE_KEYS.board);
    setErased(true);
  };

  /*
   * Crisis short-circuit (§4 safety clause; 6.0 §5.5, N-268): direct routes,
   * never rated. Declared HERE, above computeReading, because the rule the other
   * instruments inherit is an ordering rule — the safety route is checked before
   * the reading runs, in source and in the call graph, not merely painted above
   * it. C-8 asserts the order.
   */
  const crisisGate = (
    <aside className="board-crisis" aria-label="If something serious is happening">
      <p className="board-crisis-lead">
        Before anything else — if any of these is happening, this checklist is the wrong tool. Go
        straight here:
      </p>
      <ul className="board-crisis-list">
        {CRISIS_CHIPS.map((c) => (
          <li key={c.id}>
            <Link className="board-crisis-link" href={c.route}>
              {c.label} →
            </Link>
          </li>
        ))}
      </ul>
      <CrisisNote />
    </aside>
  );

  const reading = computeReading(sel);

  return (
    <div className="board">
      {crisisGate}

      <p className="board-privacy">
        These stay in this browser. Nothing is sent anywhere, put in the address bar, or scored. This
        walks one check — which pressure is actually binding — and names the row, never a number.
      </p>

      <ol className="board-steps">
        {CONSTRAINT_STEPS.map((step, i) => (
          <li key={step.id} className="board-step">
            <fieldset>
              <legend>
                <span className="board-step-num">{i + 1}</span>
                {step.question}
              </legend>
              {step.hint && <p className="board-step-hint">{step.hint}</p>}
              {step.kind === "level" ? (
                <div className="board-options">
                  {step.levels.map((l) => (
                    <label key={l.value} className="board-option">
                      <input
                        type="radio"
                        name={`board-${step.id}`}
                        checked={sel.levels[step.id] === l.value}
                        onChange={() => setLevel(step.id, l.value)}
                      />
                      {l.label}
                    </label>
                  ))}
                </div>
              ) : (
                <div className="board-options board-options-chips">
                  {step.chips.map((c) => (
                    <label key={c.id} className="board-option board-chip-option">
                      <input
                        type="checkbox"
                        checked={(sel.chips[step.id] ?? []).includes(c.id)}
                        onChange={() => toggleChip(step.id, c.id)}
                      />
                      {c.label}
                    </label>
                  ))}
                </div>
              )}
              {step.notListed && (
                <p className="board-not-listed">
                  Not listed? <Link href={step.notListed.route}>{step.notListed.label}</Link>.
                </p>
              )}
            </fieldset>
          </li>
        ))}
      </ol>

      <section className="board-reading" aria-live="polite">
        <h3>Which pressure is binding</h3>
        {reading ? (
          <div className="board-reading-result">
            <p className="board-reading-heading">{reading.heading}</p>
            <p>{reading.body}</p>
            <Link className="board-reading-pointer" href={reading.pointer}>
              {reading.pointerLabel} →
            </Link>
          </div>
        ) : (
          <p className="board-reading-empty">
            Answer at least the first two rows — your state and your buffer — and the reading appears
            here. It names the one constraint doing the most work, so you don&rsquo;t spend effort on the
            wrong row.
          </p>
        )}
      </section>

      <div className="board-controls">
        <button type="button" className="reset-button" onClick={erase}>
          Erase this board
        </button>
        {erased && (
          <span className="reset-done" role="status">
            Erased from this device.
          </span>
        )}
      </div>

      <noscript>
        <p className="board-privacy">
          This tool needs JavaScript to read back which pressure is binding. The order still works as a
          checklist by hand: check your state before your resources, your buffer before optimizing,
          whether a wall is real before pushing it, and whether you still want the goal before planning
          the route.
        </p>
      </noscript>
    </div>
  );
}
