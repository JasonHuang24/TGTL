"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { STORAGE_KEYS, readJSON, writeJSON } from "@/lib/storage";
import { CRISIS_CHIPS } from "@/content/board";
import {
  PLANS,
  OBJECTIVES,
  VETOES,
  NO_RECOMMENDATION,
  type Plan,
  type Availability,
} from "@/content/guidance";

/**
 * The choosing-a-path walkthrough (§6.5). Optional and skippable; every step
 * teaches something true even if abandoned. Inputs are local-only and survive
 * navigation (gate 6). Outputs are illustrative, use qualitative bands (no bare
 * percentages), and include a complete no-recommendation state. The engine
 * re-resolves the ranking from real inputs (limited capacity → hold first;
 * unknown slack → Plan A availability unknown).
 */

type Health = "full" | "limited" | "unknown";
type Slack = "some" | "none" | "unknown";
type Inputs = {
  weights: Record<string, number>;
  health: Health;
  slack: Slack;
  vetoes: string[];
};

const DEFAULT: Inputs = {
  weights: { stability: 1, autonomy: 1, craft: 1, service: 0 },
  health: "unknown",
  slack: "unknown",
  vetoes: [],
};

const STEPS = ["Objectives", "Your cards", "Limits", "Result"] as const;

const AVAIL_LABEL: Record<Availability, string> = {
  available: "Available now",
  conditional: "Conditionally available",
  unlockable: "Unlockable",
  unknown: "Availability unknown",
};

function meetsMinimum(i: Inputs): boolean {
  const anyObjective = Object.values(i.weights).some((w) => w > 0);
  return anyObjective && i.health !== "unknown" && i.slack !== "unknown";
}

function rankPlans(i: Inputs): Plan[] {
  const a = { ...PLANS.find((p) => p.id === "plan-a")! };
  const b = PLANS.find((p) => p.id === "plan-b")!;
  const c = PLANS.find((p) => p.id === "plan-c")!;
  if (i.slack === "unknown") a.availability = "unknown";
  if (i.health === "limited" || i.slack === "none") return [c, a, b];
  const stability = i.weights.stability ?? 0;
  const autonomyCraft = Math.max(i.weights.autonomy ?? 0, i.weights.craft ?? 0);
  return stability > autonomyCraft ? [b, a, c] : [a, b, c];
}

export function Guidance() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULT);
  const [step, setStep] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setInputs(readJSON<Inputs>(STORAGE_KEYS.guidance, DEFAULT));
    setHydrated(true);
    const onReset = () => {
      setInputs(DEFAULT);
      setStep(0);
    };
    window.addEventListener("tgtl:reset", onReset);
    return () => window.removeEventListener("tgtl:reset", onReset);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEYS.guidance, inputs);
  }, [inputs, hydrated]);

  /*
   * N-268 (6.0 §5.5) — THE SAFETY ROUTE IS CHECKED BEFORE THE ORDERING RUNS.
   *
   * The board has short-circuited on the crisis routes since 3.0; this is the
   * same gate, from the same list (imported, never duplicated), on the other
   * instrument that ranks. It is declared above `rankPlans` deliberately: a
   * favourable reading must never be computed on the way to a safety route.
   *
   * The triage pattern — plain links to the real page, so it works with
   * JavaScript off, and choosing one records nothing. A safety route is not an
   * input to a ranking, so it is never stored, weighted, or read back.
   */
  const crisisGate = (
    <aside className="board-crisis" aria-label="If something serious is happening">
      <p className="board-crisis-lead">
        Before anything else — if any of these is happening, this walkthrough is the wrong tool. Go
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
    </aside>
  );

  const ranked = useMemo(() => rankPlans(inputs), [inputs]);
  const ok = meetsMinimum(inputs);
  const experiment = PLANS.find((p) => p.id === "experiment")!;
  const unlock = PLANS.find((p) => p.id === "unlock")!;

  const setWeight = (id: string, w: number) =>
    setInputs((s) => ({ ...s, weights: { ...s.weights, [id]: w } }));
  const toggleVeto = (id: string) =>
    setInputs((s) => ({
      ...s,
      vetoes: s.vetoes.includes(id) ? s.vetoes.filter((v) => v !== id) : [...s.vetoes, id],
    }));

  return (
    <div className="guidance">
      {crisisGate}
      <noscript>
        <p className="board-privacy">
          This walkthrough needs JavaScript to lay out and re-rank the plans as you answer. Without it, the
          same structure is readable as prose: decide what you are actually optimising for, write out what
          you hold and what your hard limits are, then compare two or three genuinely different plans by
          their costs, pivot triggers, and recovery routes. The{" "}
          <Link href="/guidance/daily-plan">worked daily plan</Link> shows one such plan turned into a real day,
          and the <Link href="/topics">topics</Link> carry the mechanisms underneath the choice.
        </p>
      </noscript>
      <p className="board-privacy">
        This is optional, and you can jump straight to the result. Your answers stay in this browser. They
        are not sent anywhere, not put in the address bar, and never scored.
      </p>

      <nav className="guidance-steps" aria-label="Steps">
        {STEPS.map((label, i) => (
          <button
            key={label}
            type="button"
            className={`guidance-step${i === step ? " is-current" : ""}`}
            aria-current={i === step ? "step" : undefined}
            onClick={() => setStep(i)}
          >
            <span className="guidance-step-num">{i + 1}</span>
            {label}
          </button>
        ))}
      </nav>

      {step === 0 && (
        <section className="panel guidance-panel">
          <h2>What are you actually optimising for?</h2>
          <p className="guidance-teach">
            This is the step most people skip, and it is the one that matters most. The trouble with a
            hard choice is rarely a shortage of options; it is that the objectives were never made
            explicit, so you end up optimising a life you picked by default. Zero is a real answer here —
            it means &ldquo;not part of <em>this</em> decision,&rdquo; not &ldquo;worthless.&rdquo;
          </p>
          {OBJECTIVES.map((o) => (
            <div key={o.id} className="weight-row">
              <label htmlFor={`w-${o.id}`}>
                <strong>{o.label}</strong> — {o.note}
              </label>
              <div className="weight-buttons" role="group" aria-label={o.label}>
                {[0, 1, 2, 3].map((w) => (
                  <button
                    key={w}
                    type="button"
                    id={w === 0 ? `w-${o.id}` : undefined}
                    aria-pressed={(inputs.weights[o.id] ?? 0) === w}
                    onClick={() => setWeight(o.id, w)}
                  >
                    {w === 0 ? "—" : w}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button type="button" className="guidance-next" onClick={() => setStep(1)}>
            Next: your cards →
          </button>
        </section>
      )}

      {step === 1 && (
        <section className="panel guidance-panel">
          <h2>Your cards</h2>
          <p className="guidance-teach">
            Two facts change the answer more than any preference does — and both are about your position,
            not your character. Every field here can be left as &ldquo;prefer not to say,&rdquo; and doing
            so is not a gap to be filled but information: it means the honest output may be to hold.
          </p>
          <fieldset>
            <legend>Health and energy right now</legend>
            {(
              [
                ["full", "Full enough to run something new"],
                ["limited", "Limited — capacity is the constraint"],
                ["unknown", "Prefer not to say"],
              ] as [Health, string][]
            ).map(([v, l]) => (
              <label key={v} className="position-option">
                <input type="radio" name="health" checked={inputs.health === v} onChange={() => setInputs((s) => ({ ...s, health: v }))} />
                {l}
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>Slack — the margin to absorb one unexpected demand</legend>
            {(
              [
                ["some", "Some — I could absorb a shock without something breaking"],
                ["none", "None — I'm at the edge"],
                ["unknown", "Prefer not to say"],
              ] as [Slack, string][]
            ).map(([v, l]) => (
              <label key={v} className="position-option">
                <input type="radio" name="slack" checked={inputs.slack === v} onChange={() => setInputs((s) => ({ ...s, slack: v }))} />
                {l}
              </label>
            ))}
          </fieldset>
          <button type="button" className="guidance-next" onClick={() => setStep(2)}>
            Next: limits →
          </button>
        </section>
      )}

      {step === 2 && (
        <section className="panel guidance-panel">
          <h2>Hard limits and vetoes</h2>
          <p className="guidance-teach">
            A veto is different from a low preference: it takes options off the table regardless of how
            well they score. Naming them stops an option you would never actually take from cluttering the
            result — and stops an assumed limit from silently becoming a command.
          </p>
          {VETOES.map((v) => (
            <label key={v.id} className="position-option">
              <input type="checkbox" checked={inputs.vetoes.includes(v.id)} onChange={() => toggleVeto(v.id)} />
              {v.label}
            </label>
          ))}
          <button type="button" className="guidance-next" onClick={() => setStep(3)}>
            See the result →
          </button>
        </section>
      )}

      {step === 3 && (
        <section className="guidance-result">
          <div className="panel guidance-disclosure">
            <p className="eyebrow">Illustrative · conditional, parallel options — not a universal best life</p>
            <p>
              These are the strongest available choices <em>given what you entered</em>, shown as
              meaningfully different trade-offs. None dominates every objective. What you weighted:{" "}
              {OBJECTIVES.filter((o) => (inputs.weights[o.id] ?? 0) > 0)
                .map((o) => o.label.toLowerCase())
                .join(", ") || "nothing yet"}
              . {inputs.vetoes.length > 0 && `Vetoes in force: ${inputs.vetoes.map((id) => VETOES.find((v) => v.id === id)?.label).join("; ")}.`}
            </p>
          </div>

          {!ok ? (
            <div className="panel no-recommendation">
              <h2>{NO_RECOMMENDATION.title}</h2>
              <p>{NO_RECOMMENDATION.body}</p>
              <h3>What would change the answer</h3>
              <ul>
                {NO_RECOMMENDATION.whatWouldChange.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
              <h3>In the meantime, worth sitting with</h3>
              <ul>
                {NO_RECOMMENDATION.reflective.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
              <button type="button" className="guidance-next" onClick={() => setStep(0)}>
                ← Fill in the minimum
              </button>
            </div>
          ) : (
            <>
              <PlanCard plan={experiment} rank="Do this first" avail={AVAIL_LABEL} />
              {ranked.map((p, i) => (
                <PlanCard key={p.id} plan={p} rank={`Ranked ${i + 1}`} avail={AVAIL_LABEL} />
              ))}
              <PlanCard plan={unlock} rank="Can reorder all of the above" avail={AVAIL_LABEL} />
            </>
          )}
        </section>
      )}

      <p className="guidance-foot">
        A pivot is a planned response, not proof of a failed person. To turn a chosen plan into a real
        day, see <Link href="/guidance/daily-plan">the worked daily plan</Link>.
      </p>
    </div>
  );
}

function PlanCard({
  plan,
  rank,
  avail,
}: {
  plan: Plan;
  rank: string;
  avail: Record<Availability, string>;
}) {
  return (
    <article className="panel plan-card" data-kind={plan.kind}>
      <div className="plan-card-head">
        <span className="plan-rank">{rank}</span>
        <span className="plan-avail" data-avail={plan.availability}>
          {avail[plan.availability]}
        </span>
      </div>
      <h3>
        {plan.kind}: {plan.title}
      </h3>
      <p className="plan-favors">Favours {plan.favors}.</p>
      <p className="plan-summary">{plan.summary}</p>
      <details className="plan-detail">
        <summary>Why it ranks here, its costs, and how to leave it</summary>
        <dl>
          <div>
            <dt>Why it ranks here</dt>
            <dd>{plan.rankReason}</dd>
          </div>
          <div>
            <dt>What would reorder it</dt>
            <dd>{plan.reorder}</dd>
          </div>
          <div>
            <dt>Benefits</dt>
            <dd>{plan.benefits.join("; ")}</dd>
          </div>
          <div>
            <dt>Costs, including the invisible ones</dt>
            <dd>{plan.costs.join("; ")}</dd>
          </div>
          <div>
            <dt>Variance</dt>
            <dd>{plan.variance}</dd>
          </div>
          <div>
            <dt>Reversibility</dt>
            <dd>{plan.reversibility}</dd>
          </div>
          <div>
            <dt>Pivot triggers</dt>
            <dd>{plan.pivotTriggers.join("; ")}</dd>
          </div>
          <div>
            <dt>Exit criteria</dt>
            <dd>{plan.exitConditions.join("; ")}</dd>
          </div>
          <div>
            <dt>Recovery route</dt>
            <dd>{plan.recovery}</dd>
          </div>
        </dl>
      </details>
    </article>
  );
}
