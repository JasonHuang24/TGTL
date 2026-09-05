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

let counter = 0;
const nextId = () => `id-${counter++}-${(counter * 2654435761) % 100000}`;

export function Logs() {
  const [state, setState] = useState<LogsState>({ decisions: [], ledger: [] });
  const [hydrated, setHydrated] = useState(false);

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

  return (
    <div className="logs">
      <DecisionForm
        onAdd={(d) => setState((s) => ({ ...s, decisions: [d, ...s.decisions] }))}
      />
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

      <LedgerForm onAdd={(l) => setState((s) => ({ ...s, ledger: [l, ...s.ledger] }))} />
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
              </dl>
            </li>
          ))}
        </ul>
      )}

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
  });
  const set = (k: keyof LedgerItem, v: string) => setL((x) => ({ ...x, [k]: v }));
  return (
    <form
      className="log-form panel"
      onSubmit={(e) => {
        e.preventDefault();
        if (!l.thing) return;
        onAdd({ ...l, id: nextId() });
        setL({ id: "", thing: "", since: "", cost: "", kind: KIND_OPTIONS[0], cycle: CYCLE_OPTIONS[0] });
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
      <button type="submit" className="reset-button">
        Add to the list
      </button>
    </form>
  );
}
