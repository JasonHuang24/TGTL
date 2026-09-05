"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { STORAGE_KEYS, readJSON, writeJSON, removeKey } from "@/lib/storage";
import { CrisisNote, StatusLabel } from "@/components/primitives";
import {
  CRISIS_CHIPS,
  CONSTRAINT_STEPS,
  computeReading,
  borderlineRows,
  isRejected,
  BORDERLINE_READING_NOTE,
  type BoardSelections,
  type StepHelp,
} from "@/content/board";

/**
 * The guided pressure reading (blueprint 3.0 §4). Every input is enumerated —
 * radios and multi-select chips, no free text the site interprets. Crisis-domain
 * routes sit at the top as direct links to the real pages (the short-circuit,
 * working with or without JS); they are never rated or folded into the reading.
 * The reading names WHICH row binds, never how bad — no score, meter, or tier.
 * Local-only; visible erase.
 */

const EMPTY: BoardSelections = { levels: {}, chips: {}, rejected: [] };

/**
 * N-064, N-066, N-075, N-411 — the procedure beside the question, as help text
 * inside the step's existing shape. It takes no input and stores nothing.
 */
function StepHelpBlock({ help }: { help: StepHelp }) {
  return (
    <aside className="board-step-help" data-board-help>
      <p className="board-step-help-title">{help.title}</p>
      <ol className="board-step-help-list">
        {help.points.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ol>
      {help.note && <p className="board-step-help-note">{help.note}</p>}
      {help.warning && <p className="board-step-help-warning">{help.warning}</p>}
      {help.status && <StatusLabel status={help.status} />}
    </aside>
  );
}

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
   * N-072 (C-36) — the reader says the reading does not fit. It is a toggle,
   * not a report: the flag lives inside the existing board value, changes only
   * how the reading renders, and can be taken back with the same control.
   */
  const toggleReject = (rowId: string) => {
    setErased(false);
    setSel((s) => {
      const cur = s.rejected ?? [];
      return {
        ...s,
        rejected: cur.includes(rowId) ? cur.filter((r) => r !== rowId) : [...cur, rowId],
      };
    });
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
  const borderline = borderlineRows(sel);
  const rejected = reading ? isRejected(sel, reading.rowId) : false;

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
              {step.help && <StepHelpBlock help={step.help} />}
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
        {/* N-073 — a borderline row is answered and not binding, and the reading
            says which rows it is treating as still open. */}
        {borderline.length > 0 && (
          <p className="board-borderline-note" data-board-borderline>
            {BORDERLINE_READING_NOTE}
          </p>
        )}
        {reading ? (
          <div className={`board-reading-result${rejected ? " is-rejected" : ""}`}>
            <p className="board-reading-heading">{reading.heading}</p>
            <p>{reading.body}</p>
            <Link className="board-reading-pointer" href={reading.pointer}>
              {reading.pointerLabel} →
            </Link>
            {/* N-072 (C-36) — the control that lets the reader say the site is
                wrong about them, and be believed by the rendering. */}
            <button
              type="button"
              className="board-reject"
              data-reject={reading.rowId}
              aria-pressed={rejected}
              onClick={() => toggleReject(reading.rowId)}
            >
              {rejected ? "Put this reading back" : "This does not fit"}
            </button>
            {rejected && (
              <p className="board-reject-note" data-reject-note>
                Set aside, on your say-so. It stays struck through rather than vanishing, so you can see
                what you turned down and take it back. Nothing about you was recorded: this changes what
                is shown, not what the board thinks.
              </p>
            )}
          </div>
        ) : (
          <p className="board-reading-empty">
            Answer at least the first two rows — your state and your buffer — and the reading appears
            here. It names the one constraint doing the most work, so you don&rsquo;t spend effort on the
            wrong row.
          </p>
        )}
        {reading && rejected && (
          <div className="board-reading-none" data-reject-none>
            <p className="board-reading-heading">No reading stands — and that is a complete answer.</p>
            <p>
              With this one set aside there is nothing the board is prepared to say. That is a better
              outcome than the next-best guess: an instrument that always has an answer is an instrument
              whose answer means nothing. Either change a row above, or take the reading back and argue
              with it instead.
            </p>
          </div>
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
