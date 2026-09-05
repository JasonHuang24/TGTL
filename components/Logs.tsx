"use client";

import { useEffect, useState } from "react";
import { STORAGE_KEYS, readJSON, writeJSON } from "@/lib/storage";

/**
 * Decision record + upkeep list (§6.6). Local-only (G-11). The no-scores rule is
 * enforced in this render code, not just in policy: there are NO counts, NO
 * streaks, NO completion states, and nothing is marked "done" — the ledger's
 * whole point is not to be cleared. Entries can be removed; nothing is scored.
 */

type Decision = {
  id: string;
  date: string;
  title: string;
  known: string;
  unknown: string;
  expect: string;
  rev: string;
};

type LedgerItem = {
  id: string;
  thing: string;
  since: string;
  cost: string;
  kind: string;
  cycle: string;
  /**
   * N-077 (6.0 §3.4, C-38) — THE STOP CONDITION.
   *
   * A task with no declared stop becomes a stick: there is no state in which it
   * is finished, so every state is a state of not having done enough. Declaring
   * where it ends — in advance, from a closed list — is what stops a maintenance
   * item turning into a standing accusation. Enumerated, like every input here.
   * Optional in the type so an item saved by an older build still loads.
   */
  stop?: string;
};

type LogsState = { decisions: Decision[]; ledger: LedgerItem[] };

const REV_OPTIONS = [
  "cheap and reversible",
  "costly but reversible",
  "reversible in principle, not in practice",
  "one-way",
  "unknown",
];
const KIND_OPTIONS = [
  "accruing — worse or more expensive while deferred",
  "accruing, with a cliff — fine until it very much is not",
  "static — waiting costs nothing, it's just not done",
  "cuttable — on the list out of habit; can come off it",
  "unknown — and finding out is cheap",
];
const CYCLE_OPTIONS = ["daily", "weekly", "seasonal", "annual", "one-off, and overdue"];
/** N-077 — where the item ends. Enumerated; the reader picks, nothing is inferred. */
const STOP_OPTIONS = [
  "when it is done for today",
  "when the time I set aside for it runs out",
  "when it starts costing more than it gives",
  "when the person it is for says it is enough",
  "never — this is upkeep, and upkeep does not finish",
];

/** N-078 — the anti-streak sentence, on every empty local-state surface. */
const BLANK_STATE_LINE = "The blank state is private, not incomplete.";

/** N-084 — the reader's likeliest self-accusation, converted into a mechanic. */
const PIVOT_LINE = "A pivot is a planned response, not proof of a failed person.";

let counter = 0;
const nextId = () => `id-${counter++}-${(counter * 2654435761) % 100000}`;

/**
 * N-074 (6.0 §3.4, C-37) — THE COPY-OUT.
 *
 * 2.0's own `KNOWN_LIMITATIONS.md` named this and did nothing about it: the
 * decision record is most useful years later, which is exactly the horizon over
 * which browser storage tends not to survive. Doing something about it looked
 * like breaking local-only. It is not: this composes a string in the page and
 * hands it to the clipboard, or shows it in a read-only textarea when the
 * clipboard is unavailable. NOTHING LEAVES THE DEVICE — no fetch, no form, no
 * URL, no download. C-37 asserts the network silence at runtime.
 *
 * The textarea is READ-ONLY and is never read back or interpreted: it is a way
 * of showing the reader their own text so they can select it, not an input.
 */
function plainText(state: LogsState): string {
  const lines: string[] = ["The Guidebook to Life — your records", ""];
  lines.push("DECISION RECORD");
  if (state.decisions.length === 0) lines.push("  (nothing recorded)");
  for (const d of state.decisions) {
    lines.push("");
    lines.push(`  ${d.title || "Untitled decision"}${d.date ? ` — ${d.date}` : ""}`);
    if (d.known) lines.push(`    Knew: ${d.known}`);
    if (d.unknown) lines.push(`    Couldn't know: ${d.unknown}`);
    if (d.expect) lines.push(`    Expected: ${d.expect}`);
    if (d.rev) lines.push(`    Reversibility: ${d.rev}`);
  }
  lines.push("");
  lines.push("UPKEEP LIST");
  if (state.ledger.length === 0) lines.push("  (nothing on the list)");
  for (const l of state.ledger) {
    lines.push("");
    lines.push(`  ${l.thing || "Untitled item"}${l.since ? ` — deferred ${l.since}` : ""}`);
    if (l.cost) lines.push(`    Costs when it goes: ${l.cost}`);
    if (l.kind) lines.push(`    Kind: ${l.kind}`);
    if (l.cycle) lines.push(`    Cycle: ${l.cycle}`);
    if (l.stop) lines.push(`    Stops: ${l.stop}`);
  }
  lines.push("");
  lines.push("Nothing here was counted, scored, or marked complete.");
  return lines.join("\n");
}

export function Logs() {
  const [state, setState] = useState<LogsState>({ decisions: [], ledger: [] });
  const [hydrated, setHydrated] = useState(false);
  /** N-074 — the fallback view, shown only when the reader asks for it or the
   *  clipboard refuses. Read-only; never read back. */
  const [copyText, setCopyText] = useState<string | null>(null);
  const [copyNotice, setCopyNotice] = useState("");

  useEffect(() => {
    setState(readJSON<LogsState>(STORAGE_KEYS.logs, { decisions: [], ledger: [] }));
    setHydrated(true);
    const onReset = () => setState({ decisions: [], ledger: [] });
    window.addEventListener("tgtl:reset", onReset);
    return () => window.removeEventListener("tgtl:reset", onReset);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEYS.logs, state);
  }, [state, hydrated]);

  /*
   * N-074 (C-37) — copy out, on this device. The whole handler: build a string
   * from state already in memory, hand it to the clipboard, and show it in a
   * read-only box if that fails. There is no network call in this path and there
   * is nowhere for one to hide; C-37 watches for one at runtime anyway, because
   * "there is obviously no fetch here" is how a fetch gets added later.
   */
  const copyOut = async () => {
    const text = plainText(state);
    try {
      await navigator.clipboard.writeText(text);
      setCopyNotice("Copied. It is on your clipboard and nowhere else.");
      setCopyText(null);
    } catch {
      setCopyNotice("This browser would not let the page use the clipboard, so here it is to select and copy yourself.");
      setCopyText(text);
    }
  };

  return (
    <div className="logs">
      {/* N-084 — beside the decision record, where the reader is most likely to
          be writing down a change of direction and reading it as a failure. */}
      <p className="logs-pivot-line" data-pivot-line>
        {PIVOT_LINE} A record of a decision that was later reversed is a record of somebody paying
        attention, not evidence against them; what it is for is telling a bad decision from a bad draw,
        and both of those happen to people who are doing this well.
      </p>

      <DecisionForm
        onAdd={(d) => setState((s) => ({ ...s, decisions: [d, ...s.decisions] }))}
      />
      {state.decisions.length === 0 && (
        <p className="log-empty" data-blank-state>
          {BLANK_STATE_LINE} There is nothing here because you have not written anything here, which is
          not the same as having nothing to write.
        </p>
      )}
      {state.decisions.length > 0 && (
        <ul className="log-list">
          {state.decisions.map((d) => (
            <li key={d.id} className="log-entry">
              <div className="log-entry-head">
                <strong>{d.title || "Untitled decision"}</strong>
                <span className="log-entry-date">{d.date}</span>
                <button
                  type="button"
                  className="log-remove"
                  aria-label="Remove this record"
                  onClick={() =>
                    setState((s) => ({ ...s, decisions: s.decisions.filter((x) => x.id !== d.id) }))
                  }
                >
                  Remove
                </button>
              </div>
              <dl>
                {d.known && (
                  <div>
                    <dt>Knew</dt>
                    <dd>{d.known}</dd>
                  </div>
                )}
                {d.unknown && (
                  <div>
                    <dt>Couldn&rsquo;t know</dt>
                    <dd>{d.unknown}</dd>
                  </div>
                )}
                {d.expect && (
                  <div>
                    <dt>Expected</dt>
                    <dd>{d.expect}</dd>
                  </div>
                )}
                {d.rev && (
                  <div>
                    <dt>Reversibility</dt>
                    <dd>{d.rev}</dd>
                  </div>
                )}
              </dl>
            </li>
          ))}
        </ul>
      )}

      <hr className="logs-divider" />

      {/* N-371 — the debt concept, named, with the caveat in the same breath so
          the two are never read apart. No count: naming a debt is not scoring it. */}
      <p className="logs-debt-note" data-maintenance-debt>
        What accumulates on the list below is maintenance debt: upkeep deferred does not stay the same
        size, it compounds quietly, and it usually arrives as several things failing in the same month
        rather than as a bill. And in the same breath, because the two belong together: not every unmet
        need is neglect. People deferring maintenance are frequently people without the money, time,
        health or help to perform it, and a list of undone things is a description of a situation before
        it is anything about a person. Nothing here is counted, and nothing here is owed to this site.
      </p>

      {/* N-075 — the quest-alignment question, beside the list, asked and never
          answered here. Nothing records what you decide. */}
      <p className="logs-alignment-question" data-alignment-question>
        One question worth running down this list, item by item:{" "}
        <strong>if you weren&rsquo;t already doing this, would you start it today?</strong> It separates
        the things kept alive by momentum from the things kept alive by mattering, and the two are
        indistinguishable from the inside. Nothing on this page stores or judges your answer — the point
        is that you hear it.
      </p>

      <LedgerForm onAdd={(l) => setState((s) => ({ ...s, ledger: [l, ...s.ledger] }))} />
      {state.ledger.length === 0 && (
        <p className="log-empty" data-blank-state>
          {BLANK_STATE_LINE} An empty upkeep list is not a claim that nothing is deferred, and a full one
          is not a charge sheet.
        </p>
      )}
      {state.ledger.length > 0 && (
        <ul className="log-list">
          {state.ledger.map((l) => (
            <li key={l.id} className="log-entry">
              <div className="log-entry-head">
                <strong>{l.thing || "Untitled item"}</strong>
                {l.since && <span className="log-entry-date">deferred {l.since}</span>}
                <button
                  type="button"
                  className="log-remove"
                  aria-label="Remove this item"
                  onClick={() =>
                    setState((s) => ({ ...s, ledger: s.ledger.filter((x) => x.id !== l.id) }))
                  }
                >
                  Remove
                </button>
              </div>
              <dl>
                {l.cost && (
                  <div>
                    <dt>Costs when it goes</dt>
                    <dd>{l.cost}</dd>
                  </div>
                )}
                {l.kind && (
                  <div>
                    <dt>Kind</dt>
                    <dd>{l.kind}</dd>
                  </div>
                )}
                {l.cycle && (
                  <div>
                    <dt>Cycle</dt>
                    <dd>{l.cycle}</dd>
                  </div>
                )}
                {/* N-077 (C-38) — always rendered. An item with no declared stop
                    renders the fact that it has none, rather than rendering
                    nothing, because a silently absent stop is the failure mode. */}
                <div data-stop-condition>
                  <dt>Stops</dt>
                  <dd>{l.stop || STOP_OPTIONS[0]}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      )}

      {/* N-074 (C-37) — the two ways out of the browser, both of which keep
          every byte on this device. */}
      <div className="logs-export" data-logs-export>
        <p className="eyebrow">Getting these off the browser</p>
        <p>
          These records are most useful years from now, and that is exactly the horizon over which
          browser storage does not survive — a new device, a cleared cache, a private window closing. So
          take a copy. Both of these keep every byte on this device: nothing is uploaded, and there is
          nothing to upload it to.
        </p>
        <div className="logs-export-controls">
          <button type="button" className="reset-button" data-copy-out onClick={copyOut}>
            Copy as text
          </button>
          <button
            type="button"
            className="reset-button"
            data-copy-show
            onClick={() => {
              setCopyText(copyText === null ? plainText(state) : null);
              setCopyNotice("");
            }}
          >
            {copyText === null ? "Show as plain text" : "Hide the plain text"}
          </button>
          <button type="button" className="reset-button" data-print onClick={() => window.print()}>
            Print this page
          </button>
        </div>
        {copyNotice && (
          <p className="reset-done" role="status">
            {copyNotice}
          </p>
        )}
        {copyText !== null && (
          <label className="logs-export-text">
            <span>Your records, as plain text — select it and copy. Nothing typed here is read.</span>
            <textarea readOnly rows={12} value={copyText} data-copy-text />
          </label>
        )}
      </div>

      <p className="board-privacy">
        Saved to this browser only. Nothing is sent anywhere, counted, scored, or marked complete — the
        upkeep list is not a to-do list, and the point is not to clear it.
      </p>
    </div>
  );
}

function DecisionForm({ onAdd }: { onAdd: (d: Decision) => void }) {
  const [d, setD] = useState<Decision>({
    id: "",
    date: "",
    title: "",
    known: "",
    unknown: "",
    expect: "",
    rev: REV_OPTIONS[0],
  });
  const set = (k: keyof Decision, v: string) => setD((x) => ({ ...x, [k]: v }));
  return (
    <form
      className="log-form panel"
      onSubmit={(e) => {
        e.preventDefault();
        if (!d.title && !d.known && !d.expect) return;
        onAdd({ ...d, id: nextId() });
        setD({ id: "", date: "", title: "", known: "", unknown: "", expect: "", rev: REV_OPTIONS[0] });
      }}
    >
      <p className="eyebrow">Decision record — write it before the outcome arrives</p>
      <div className="log-field-row">
        <label>
          <span>The decision</span>
          <input value={d.title} onChange={(e) => set("title", e.target.value)} placeholder="Taking the role in Manchester" />
        </label>
        <label className="log-field-narrow">
          <span>Date</span>
          <input type="date" value={d.date} onChange={(e) => set("date", e.target.value)} />
        </label>
      </div>
      <label>
        <span>What I knew — facts actually in my possession</span>
        <textarea value={d.known} onChange={(e) => set("known", e.target.value)} rows={2} />
      </label>
      <label>
        <span>What I could not know — the genuinely unknowable parts (this matters most later)</span>
        <textarea value={d.unknown} onChange={(e) => set("unknown", e.target.value)} rows={2} />
      </label>
      <label>
        <span>What I expected — including how confident I am</span>
        <textarea value={d.expect} onChange={(e) => set("expect", e.target.value)} rows={2} />
      </label>
      <label>
        <span>Reversibility</span>
        <select value={d.rev} onChange={(e) => set("rev", e.target.value)}>
          {REV_OPTIONS.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </label>
      <button type="submit" className="reset-button">
        Save this record
      </button>
    </form>
  );
}

function LedgerForm({ onAdd }: { onAdd: (l: LedgerItem) => void }) {
  const [l, setL] = useState<LedgerItem>({
    id: "",
    thing: "",
    since: "",
    cost: "",
    kind: KIND_OPTIONS[0],
    cycle: CYCLE_OPTIONS[0],
    stop: STOP_OPTIONS[0],
  });
  const set = (k: keyof LedgerItem, v: string) => setL((x) => ({ ...x, [k]: v }));
  return (
    <form
      className="log-form panel"
      onSubmit={(e) => {
        e.preventDefault();
        if (!l.thing) return;
        onAdd({ ...l, stop: l.stop || STOP_OPTIONS[0], id: nextId() });
        setL({ id: "", thing: "", since: "", cost: "", kind: KIND_OPTIONS[0], cycle: CYCLE_OPTIONS[0], stop: STOP_OPTIONS[0] });
      }}
    >
      <p className="eyebrow">Upkeep list — the recurring things you are currently not doing</p>
      <div className="log-field-row">
        <label>
          <span>The item</span>
          <input value={l.thing} onChange={(e) => set("thing", e.target.value)} placeholder="the dentist; the boiler service; calling Dan; my own GP appointment" />
        </label>
        <label className="log-field-narrow">
          <span>How long deferred</span>
          <input value={l.since} onChange={(e) => set("since", e.target.value)} placeholder="about two years" />
        </label>
      </div>
      <label>
        <span>What it costs when it goes — not how urgent it feels</span>
        <textarea value={l.cost} onChange={(e) => set("cost", e.target.value)} rows={2} placeholder="the money, the pain, the friendship, the week off work" />
      </label>
      <div className="log-field-row">
        <label>
          <span>Cuttable or accruing</span>
          <select value={l.kind} onChange={(e) => set("kind", e.target.value)}>
            {KIND_OPTIONS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Cycle</span>
          <select value={l.cycle} onChange={(e) => set("cycle", e.target.value)}>
            {CYCLE_OPTIONS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
      </div>
      {/* N-077 (C-38) — enumerated, and required in practice because the field
          defaults to a real answer rather than to nothing. */}
      <label>
        <span>Stop condition — where this ends, decided now rather than on the day</span>
        <select value={l.stop ?? STOP_OPTIONS[0]} onChange={(e) => set("stop", e.target.value)}>
          {STOP_OPTIONS.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </label>
      <button type="submit" className="reset-button">
        Add to the list
      </button>
    </form>
  );
}
