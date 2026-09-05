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
  WAITING_SHAPE,
  RANKING_RULESET,
  REVERSIBILITY_RULE,
  OPPORTUNITY_COST,
  SCORECARD_KINDS,
  SCORECARD_LEAD,
  SCORECARD_CLOSE,
  CHEAPEST_QUESTION,
  type Plan,
  type Availability,
} from "@/content/guidance";
import { MOVES_LINE } from "@/content/board";
import { BEHAVIOUR_LABEL, BEHAVIOUR_MEANING } from "@/content/evidence";
import { PositionNote, type PositionNotes } from "@/components/PositionNote";

/** N-150 — written for this page's voice: what position does to a ranking. */
const GUIDANCE_POSITION_NOTES: PositionNotes = {
  yes: "With a floor beneath a serious failure, the ranking below is doing what rankings do best: comparing genuinely available options. The bounded pilot is a real experiment rather than a gamble, and the honest advice is to run the reversible thing early, while time is the resource you have most of.",
  no: "Without a floor beneath a serious failure, read the ranking with one correction in mind. Anything whose downside is unbounded is not a bounded experiment for you, whatever its label says, and protecting the floor is not a preliminary to the decision — it is the decision, and holding is a legitimate first plan rather than a failure to choose.",
  unsure: "Whether there is a floor beneath a serious failure changes this ranking more than any preference you can enter on it, and only you can answer it. It is worth settling before weighing the options, because the same plan is an experiment from one starting position and an unbounded risk from another.",
};

/**
 * The choosing-a-path walkthrough (§6.5). Optional and skippable; every step
 * teaches something true even if abandoned. Inputs are local-only and survive
 * navigation (gate 6). Outputs are illustrative, use qualitative bands (no bare
 * percentages), and include a complete no-recommendation state. The engine
 * re-resolves the ranking from real inputs (limited capacity → hold first;
 * unknown slack → Plan A availability unknown).
 */

/**
 * N-073 — `borderline` is a fourth value, distinct from `unknown`. "Prefer not
 * to say" and "it depends on the context" are different facts about a reader,
 * and collapsing them loses the more useful of the two.
 */
type Health = "full" | "limited" | "borderline" | "unknown";
type Slack = "some" | "none" | "borderline" | "unknown";
type Inputs = {
  weights: Record<string, number>;
  health: Health;
  slack: Slack;
  vetoes: string[];
  /** N-072 (C-36) — plan ids the reader has set aside. Inside the existing key. */
  rejected?: string[];
  /** N-072 — the reader said none of the set fits. */
  noneFit?: boolean;
};

const DEFAULT: Inputs = {
  weights: { stability: 1, autonomy: 1, craft: 1, service: 0 },
  health: "unknown",
  slack: "unknown",
  vetoes: [],
  rejected: [],
  noneFit: false,
};

const BORDERLINE_LABEL = "Borderline / depends on the context";

/** N-073 — a borderline answer is answered and non-binding, and says so. */
const BORDERLINE_NOTE =
  "Borderline is treated as non-binding: it does not push the ranking either way, and the plan that depends on it is marked as having unknown availability rather than being quietly demoted. It is not the same as preferring not to say, and it is not a half-point.";

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

/**
 * N-088 — which of the four inputs are still missing, in the reader's words.
 * A refusal that names what it is missing is a refusal the reader can act on.
 */
function missingInputs(i: Inputs): string[] {
  const out: string[] = [];
  if (!Object.values(i.weights).some((w) => w > 0))
    out.push("What you are optimising for — at least one objective above zero, so there is something to weigh against.");
  if (i.health === "unknown")
    out.push("Your health and energy right now, even roughly — a limited capacity changes which plan is runnable at all.");
  if (i.slack === "unknown")
    out.push("Whether you have any slack, because most active moves need some margin to execute.");
  if (i.vetoes.length === 0)
    out.push("Your hard limits, if you have any. None is a real answer here, and it is worth entering on purpose rather than by omission.");
  return out;
}

function rankPlans(i: Inputs): Plan[] {
  const a = { ...PLANS.find((p) => p.id === "plan-a")! };
  const b = PLANS.find((p) => p.id === "plan-b")!;
  const c = PLANS.find((p) => p.id === "plan-c")!;
  // N-073: borderline joins unknown here — neither is a value the availability
  // of a pilot can be asserted from, and neither is rounded to "none".
  if (i.slack === "unknown" || i.slack === "borderline") a.availability = "unknown";
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

  /* N-072 (C-36) — rejection lives inside the existing guidance value. */
  const isPlanRejected = (id: string) => (inputs.rejected ?? []).includes(id);
  const toggleReject = (id: string) =>
    setInputs((s) => {
      const cur = s.rejected ?? [];
      return { ...s, rejected: cur.includes(id) ? cur.filter((r) => r !== id) : [...cur, id] };
    });
  const setNoneFit = (v: boolean) => setInputs((s) => ({ ...s, noneFit: v }));

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
          {/* N-003 — the stake, beside the instruction. The trunk states the
              mechanic (you set the objective) and never says why it matters. */}
          <p className="guidance-teach">
            It matters more than it looks. The most reliable source of misery is not losing; it is
            spending years playing someone else&rsquo;s game without noticing that you never chose it.
            Whatever you put here, put it here on purpose.
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
          {/* N-408 — a taxonomy, read and never selected. The moment it became
              a control it would be an assessment of the reader. */}
          <div className="guidance-scorecard" data-scorecard>
            <h3>Whose scorecard is this?</h3>
            <p className="guidance-teach">{SCORECARD_LEAD}</p>
            <dl className="scorecard-list">
              {SCORECARD_KINDS.map((k) => (
                <div key={k.name}>
                  <dt>{k.name}</dt>
                  <dd>{k.what}</dd>
                </div>
              ))}
            </dl>
            <p className="guidance-teach">{SCORECARD_CLOSE}</p>
          </div>
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
                ["borderline", BORDERLINE_LABEL],
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
                ["borderline", BORDERLINE_LABEL],
                ["unknown", "Prefer not to say"],
              ] as [Slack, string][]
            ).map(([v, l]) => (
              <label key={v} className="position-option">
                <input type="radio" name="slack" checked={inputs.slack === v} onChange={() => setInputs((s) => ({ ...s, slack: v }))} />
                {l}
              </label>
            ))}
          </fieldset>
          {/* N-073 — what borderline does, said where it is offered. */}
          <p className="guidance-teach guidance-borderline-note" data-borderline-note>
            {BORDERLINE_NOTE}
          </p>
          {/* N-150 (C-42) — the position note, re-resolved from the one setting. */}
          <PositionNote notes={GUIDANCE_POSITION_NOTES} />
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
          {/*
           * N-080 (C-39) — THE DISCLOSURE HEADER, ABOVE EVERY RANKED OUTPUT.
           *
           * It renders unconditionally and before any `.plan-rank`, so the
           * reader can never meet an order without the rule that produced it.
           * It updates live from the same inputs the ranking reads.
           */}
          <div className="panel guidance-disclosure" data-guidance-disclosure>
            <p className="eyebrow">Illustrative · conditional, parallel options — not a universal best life</p>
            <p>
              These are the strongest available choices <em>given what you entered</em>, shown as
              meaningfully different trade-offs. None dominates every objective.
            </p>
            <dl className="disclosure-scope">
              <div>
                <dt data-disclosure-objectives>Objectives in force</dt>
                <dd>
                  {OBJECTIVES.filter((o) => (inputs.weights[o.id] ?? 0) > 0)
                    .map((o) => o.label.toLowerCase())
                    .join(", ") || "none yet — nothing has been weighted above zero"}
                </dd>
              </div>
              <div>
                <dt data-disclosure-constraints>Constraints and vetoes in force</dt>
                <dd>
                  {[
                    inputs.health === "full"
                      ? "capacity full enough to run something new"
                      : inputs.health === "limited"
                        ? "limited capacity, which promotes holding above every active plan"
                        : inputs.health === "borderline"
                          ? "capacity borderline, treated as non-binding"
                          : "capacity not entered",
                    inputs.slack === "some"
                      ? "some slack to absorb a shock"
                      : inputs.slack === "none"
                        ? "no slack, which promotes holding above every active plan"
                        : inputs.slack === "borderline"
                          ? "slack borderline, treated as non-binding"
                          : "slack not entered",
                    inputs.vetoes.length > 0
                      ? `vetoes: ${inputs.vetoes.map((id) => VETOES.find((v) => v.id === id)?.label).join("; ")}`
                      : "no vetoes entered",
                  ].join(" · ")}
                </dd>
              </div>
              <div>
                <dt data-disclosure-horizon>Horizon and ruleset</dt>
                <dd>
                  {RANKING_RULESET.horizon}
                  <ul className="disclosure-rules">
                    {RANKING_RULESET.rules.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                  {RANKING_RULESET.note}
                  {/* N-299 (6.0 §3.11) — the ordering behaviour's own label, inside
                      the disclosure beside the ruleset it describes. It is not a
                      content label and never becomes one: what is being labelled
                      is how this instrument arranges plans, not a claim about how
                      lives go. */}
                  <p className="behaviour-label-line" data-behaviour-label="design-hypothesis">
                    <span className="status-label" title={BEHAVIOUR_MEANING["design-hypothesis"]}>
                      <span className="status-dot" aria-hidden="true" />
                      {BEHAVIOUR_LABEL["design-hypothesis"]}
                    </span>{" "}
                    {BEHAVIOUR_MEANING["design-hypothesis"]} This ordering has not been validated
                    against how anyone&rsquo;s decisions actually turn out, and it is labelled apart
                    from the evidence labels on the content it orders.
                  </p>
                </dd>
              </div>
            </dl>
          </div>

          {!ok ? (
            <div className="panel no-recommendation">
              <h2>{NO_RECOMMENDATION.title}</h2>
              <p>{NO_RECOMMENDATION.body}</p>
              {/* N-088 — the visible ledger of what is missing, from the same
                  inputs the ranking would have read. */}
              <h3>What is still missing</h3>
              <ul data-missing-inputs>
                {missingInputs(inputs).map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
              <h3>{NO_RECOMMENDATION.movesTitle}</h3>
              <ol data-moves-anyway>
                {NO_RECOMMENDATION.movesAnyway.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ol>
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
          ) : inputs.noneFit ? (
            /* N-072 — the reader said none of the set fits. The honest output is
               the no-recommendation state, not the next-best guess. */
            <div className="panel no-recommendation" data-none-fit-state>
              <h2>None of these fit — so there is no recommendation here</h2>
              <p>
                You have said the set is wrong for you, and the set is what this page had. Rather than
                offering the least-wrong item from a list you have rejected, it stops. The plans are
                authored fixtures; if none of them describes a real option in your situation, the fixtures
                are the thing that is wrong.
              </p>
              <h3>{NO_RECOMMENDATION.movesTitle}</h3>
              <ol>
                {NO_RECOMMENDATION.movesAnyway.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ol>
              <button type="button" className="guidance-next" onClick={() => setNoneFit(false)}>
                Bring the plans back
              </button>
            </div>
          ) : (
            <>
              {/* N-095 — the framing on the walkthrough, before the options. */}
              <aside className="panel guidance-opportunity" data-opportunity-cost>
                <h3>{OPPORTUNITY_COST.title}</h3>
                <p>{OPPORTUNITY_COST.body}</p>
                <p>{OPPORTUNITY_COST.shutoff}</p>
              </aside>
              {/* N-094 — the rule the per-plan reversibility field sits under. */}
              <aside className="panel guidance-reversibility" data-reversibility-rule>
                <h3>{REVERSIBILITY_RULE.title}</h3>
                <p>{REVERSIBILITY_RULE.body}</p>
                <p>{REVERSIBILITY_RULE.caveat}</p>
              </aside>
              {/* N-062 — the moves the campaign guarantees, on the reading side. */}
              <p className="guidance-moves-line" data-moves-line>
                One thing before the list. {MOVES_LINE}
              </p>
              <PlanCard
                plan={experiment}
                rank="Do this first"
                avail={AVAIL_LABEL}
                rejected={isPlanRejected(experiment.id)}
                onReject={() => toggleReject(experiment.id)}
              />
              {ranked.map((p, i) => (
                <PlanCard
                  key={p.id}
                  plan={p}
                  rank={`Ranked ${i + 1}`}
                  avail={AVAIL_LABEL}
                  rejected={isPlanRejected(p.id)}
                  onReject={() => toggleReject(p.id)}
                />
              ))}
              <PlanCard
                plan={unlock}
                rank="Can reorder all of the above"
                avail={AVAIL_LABEL}
                rejected={isPlanRejected(unlock.id)}
                onReject={() => toggleReject(unlock.id)}
              />
              <p className="guidance-none-fit">
                <button type="button" className="board-reject" data-reject="set" onClick={() => setNoneFit(true)}>
                  None of these fit
                </button>{" "}
                — and saying so stops the page rather than moving you down the list.
              </p>
              {/* N-036 — a shape rather than an option. It is not ranked, because
                  it is not chosen and competes with nothing. */}
              <aside className="panel guidance-shape-note" data-plan-shape={WAITING_SHAPE.id}>
                <h3>{WAITING_SHAPE.title}</h3>
                <p>{WAITING_SHAPE.body}</p>
                <p className="guidance-shape-cost">{WAITING_SHAPE.note}</p>
                <p>
                  <Link href={WAITING_SHAPE.href}>{WAITING_SHAPE.linkLabel}</Link>
                </p>
              </aside>
            </>
          )}
        </section>
      )}

      {/* N-130 and N-124 — two one-line handoffs to mechanisms that belong on
          the guides and change how these options get executed. */}
      <p className="guidance-foot">
        Two things worth knowing before executing any of these. Almost all of them involve asking
        somebody for something, and{" "}
        <Link href="/topics/relationships#asking-for-help">a specific ask is answered where a vague one
        is not</Link> — the difference is whether the other person can finish it. And where an option
        means learning something new,{" "}
        <Link href="/topics/work#learning-curves">the shape of the curve sets what the first weeks
        should feel like</Link>, which is what stops a threshold skill being abandoned in its flat part.
      </p>
      {/* N-089 — the prudent next move. One sentence that is a whole decision
          method, and the one this site is most trying to teach. */}
      <aside className="panel guidance-next-move" data-cheapest-question>
        <h3>A prudent next move</h3>
        <p className="guidance-next-move-line">{CHEAPEST_QUESTION}</p>
        <p>
          Most stuck decisions are stuck because the next step being considered is large, and a large
          step needs a confidence nobody has yet. There is almost always a smaller one available whose
          answer would genuinely move the decision — a phone call, a form read properly, one honest
          conversation with somebody who has done it. If the answer to a question would not change what
          you do, it is not the question; find the one that would, and pick the cheapest of those.
        </p>
      </aside>

      {/* N-084 — the pivot strip. The reader's likeliest self-accusation,
          converted into a mechanic, in the owner's register. */}
      <aside className="panel guidance-pivot-strip" data-pivot-strip>
        <h3>Pivoting</h3>
        <p className="guidance-pivot-line">A pivot is a planned response, not proof of a failed person.</p>
        <p>
          Every plan above carries its own pivot triggers, written down in advance precisely so that
          acting on one is a decision made earlier by a calmer version of you, rather than a judgement
          made in the week it goes wrong. A trigger firing is the plan working. To turn a chosen plan
          into a real day, see <Link href="/guidance/daily-plan">the worked daily plan</Link>.
        </p>
      </aside>
    </div>
  );
}

function PlanCard({
  plan,
  rank,
  avail,
  rejected,
  onReject,
}: {
  plan: Plan;
  rank: string;
  avail: Record<Availability, string>;
  /** N-072 — the reader set this one aside; it renders struck and unweighted. */
  rejected: boolean;
  onReject: () => void;
}) {
  return (
    <article className={`panel plan-card${rejected ? " is-rejected" : ""}`} data-kind={plan.kind}>
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
            {/* N-094 — the field, under the rule stated above the list. */}
            <dt>Reversibility — rigour on one-way doors, speed on two-way</dt>
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
      {/* N-072 (C-36) — per-card rejection, honoured in the rendering. */}
      <button
        type="button"
        className="board-reject"
        data-reject={plan.id}
        aria-pressed={rejected}
        onClick={onReject}
      >
        {rejected ? "Put this option back" : "This does not fit"}
      </button>
      {rejected && (
        <p className="board-reject-note" data-reject-note>
          Set aside, on your say-so. It stays here struck through and carries no weight in the order —
          nothing about you was recorded, and the same control puts it back.
        </p>
      )}
    </article>
  );
}
