"use client";

import { useGuide, type Floor, type Dependents, type Debt, type Position } from "@/lib/guide-context";

/**
 * The site's position control and the credential comparison it was built for.
 *
 * N-150 (6.0 §3.6, C-42): until this version the reader's position lived here
 * and nowhere else — one page read the key, and every other page's position
 * sensitivity was prose the reader had to apply to themselves. The state has
 * moved to `lib/guide-context.tsx` (the SAME `STORAGE_KEYS.credentialPosition`
 * key — §7.1 adds none), the control below is exported as `PositionControl` for
 * any page that wants to offer the setting, and `PositionNote` re-resolves prose
 * from it everywhere else.
 *
 * What did NOT change: it is enumerated, local-only, never in a URL, and it
 * produces no rank, band, score or comparison between readers. It selects which
 * authored paragraph is true for this reader; that is all it has ever done and
 * all it may ever do.
 */

type Path = {
  id: string;
  name: string;
  costs: string;
  pays: string;
  reversibility: string;
  variance: string;
  recovery: string;
};

const PATHS: Path[] = [
  {
    id: "college",
    name: "College / university",
    costs: "Years, money (often debt), and near-term flexibility, spent up front.",
    pays: "Access to credentialed fields, a durable signal, and a network — over a long horizon, not soon.",
    reversibility:
      "Feels like the safe choice and is the more locked-in one: it takes years, and each year raises the cost of leaving because the sunk investment quietly converts into identity.",
    variance: "A high floor and low variance. The bad outcome is a comfortable-but-dull career, not ruin.",
    recovery: "Transfer credit, a part-time return, or a shorter bridge credential later.",
  },
  {
    id: "trade",
    name: "Trade / apprenticeship",
    costs: "A shorter training period, often earning while you learn, with less debt.",
    pays: "Sooner — access to licensed, skilled work that is harder to offshore or inflate away.",
    reversibility: "Moderately reversible; the core skills transfer to adjacent trades.",
    variance:
      "A solid floor and a moderate ceiling, less exposed to credential inflation — but more dependent on the body holding up.",
    recovery: "Re-certify, move to an adjacent trade, or step into a supervisory or business route.",
  },
  {
    id: "work-first",
    name: "Work first",
    costs: "You forgo the credential signal and the ready-made network.",
    pays: "Immediately, in income and in real experience of what the work is actually like.",
    reversibility:
      "Highly reversible early; the one real asymmetry is the age-graded entry window into credentialed paths, which narrows with time.",
    variance:
      "Depends heavily on the field: a bounded experiment where skills genuinely accumulate, a dead-end where they do not.",
    recovery: "Return to a credential later through a smaller qualification or a hybrid role; the experience transfers.",
  },
];

function resolveNote(pos: Position, path: Path): string {
  const parts: string[] = [];
  if (pos.floor === "yes") {
    if (path.id === "work-first" || path.id === "college") {
      parts.push(
        "With a floor beneath failure, the riskier or debt-financed version of this path is a bounded experiment — and a reversible experiment is cheapest to run early, while time is abundant.",
      );
    } else {
      parts.push(
        "With a floor beneath failure, this steady path is a fine choice and not the only safe one; you can afford to test a bolder route first and fall back to this.",
      );
    }
  } else if (pos.floor === "no") {
    if (path.id === "college") {
      parts.push(
        "Without a floor, the debt-financed version of this path carries a ruin tail rather than a bounded downside. Protect the floor first: funded, part-time, or employer-sponsored routes into the same field, not new high debt.",
      );
    } else if (path.id === "work-first") {
      parts.push(
        "Without a floor, paths that pay income sooner move up, and any income now beats the right income later. Treat the identity question as a genuinely later problem.",
      );
    } else {
      parts.push(
        "Without a floor, this path's early income and lower debt are exactly what stabilises the floor — which is the first job before any optimisation.",
      );
    }
  } else {
    parts.push(
      "The single fact that most changes this note is whether there is a floor beneath failure. It is positional, and only you can answer it — so answer it first.",
    );
  }
  if (pos.dependents === "yes") {
    parts.push("Because someone depends on your income now, tolerance for variance drops sharply and income-sooner paths weigh more.");
  }
  if (pos.debt === "none" && path.id === "college") {
    parts.push("With new high debt off the table, the debt-financed route is out; look at funded or part-time ways into the same destination.");
  }
  return parts.join(" ");
}

/**
 * N-150 — THE SHARED POSITION CONTROL.
 *
 * The same three enumerated questions, reading and writing the one shared
 * position. `eyebrow` lets a host page say what re-resolves nearby without the
 * control claiming to be about that page's own content.
 */
export function PositionControl({
  eyebrow = "Your position — set this once, and every position note on the site re-resolves",
}: {
  eyebrow?: string;
}) {
  const { position: pos, setPosition } = useGuide();
  const setPos = (fn: (p: Position) => Position) => setPosition(fn(pos));

  return (
    <div className="position-controls panel" role="group" aria-label="Your position" data-position-control>
      <p className="eyebrow">{eyebrow}</p>
      <p className="position-privacy">
        These stay in this browser. Nothing is sent anywhere, put in the address bar, or scored — this
        chooses which paragraph is true for you, and it never compares you to anybody.
      </p>

      <fieldset>
          <legend>Is there a floor beneath a serious failure?</legend>
          {(
            [
              ["yes", "Yes — family or a safety net could catch a real failure"],
              ["no", "No — a serious failure would be mine alone to absorb"],
              ["unsure", "I'm not sure"],
            ] as [Floor, string][]
          ).map(([val, label]) => (
            <label key={val} className="position-option">
              <input
                type="radio"
                name="floor"
                checked={pos.floor === val}
                onChange={() => setPos((p) => ({ ...p, floor: val }))}
              />
              {label}
            </label>
          ))}
        </fieldset>

        <fieldset>
          <legend>Does anyone depend on your income right now?</legend>
          {(
            [
              ["no", "No"],
              ["yes", "Yes"],
            ] as [Dependents, string][]
          ).map(([val, label]) => (
            <label key={val} className="position-option">
              <input
                type="radio"
                name="dependents"
                checked={pos.dependents === val}
                onChange={() => setPos((p) => ({ ...p, dependents: val }))}
              />
              {label}
            </label>
          ))}
        </fieldset>

        <fieldset>
          <legend>New high debt is…</legend>
          {(
            [
              ["some", "…something I could take on if it paid off"],
              ["none", "…off the table"],
            ] as [Debt, string][]
          ).map(([val, label]) => (
            <label key={val} className="position-option">
              <input
                type="radio"
                name="debt"
                checked={pos.debt === val}
                onChange={() => setPos((p) => ({ ...p, debt: val }))}
              />
              {label}
            </label>
          ))}
        </fieldset>
    </div>
  );
}

/** The credential comparison — the one page that also renders the control itself. */
export function CredentialFilter() {
  const { position: pos } = useGuide();

  return (
    <div className="credential-filter">
      <PositionControl eyebrow="Your position — set this, and the notes below (and every position note on the site) re-resolve" />

      <div className="credential-paths">
        {PATHS.map((path) => (
          <section key={path.id} className="credential-path panel">
            <h3>{path.name}</h3>
            <dl>
              <div>
                <dt>What it costs</dt>
                <dd>{path.costs}</dd>
              </div>
              <div>
                <dt>When it pays</dt>
                <dd>{path.pays}</dd>
              </div>
              <div>
                <dt>Reversibility</dt>
                <dd>{path.reversibility}</dd>
              </div>
              <div>
                <dt>Variance shape</dt>
                <dd>{path.variance}</dd>
              </div>
              <div>
                <dt>Recovery route</dt>
                <dd>{path.recovery}</dd>
              </div>
            </dl>
            <p className="credential-position-note" aria-live="polite">
              <span className="credential-position-note-label">For your position:</span>{" "}
              {resolveNote(pos, path)}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
