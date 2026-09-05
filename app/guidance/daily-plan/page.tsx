import type { Metadata } from "next";
import Link from "next/link";
import {
  ReadingPage,
  PageHeader,
  Callout,
  NextSteps,
  NextStep,
} from "@/components/primitives";

export const metadata: Metadata = {
  title: "A worked daily plan",
  description:
    "One plan turned into a real Tuesday — with a minimum viable day for when capacity is the constraint, and the anti-shame rules stated plainly.",
};

/*
 * N-077 (6.0 §3.4, C-38) — MINIMUM, ALTERNATIVE, STOP, per lane.
 *
 * Three cells that between them decide whether a plan can survive a bad day.
 * The minimum is what still counts when almost nothing is available, so a hard
 * day ends with the plan intact rather than with the plan as evidence against
 * you. The alternative is what to do instead when the planned form is blocked,
 * so a blocked lane does not become an empty one. And the stop condition is what
 * keeps a lane from becoming a stick: a task with no declared end has no state
 * in which it is finished, which means every state is a state of not enough.
 */
const LANES = [
  {
    lane: "Critical today",
    note: "The thing with a deadline or a signature on it.",
    example: "Return the benefits form before the window closes.",
    minimum: "Find out the actual deadline and write it down.",
    alternative: "If it cannot be finished, send the holding message that buys time.",
    stop: "When it is submitted, or when the office you need is shut.",
  },
  {
    lane: "Primary goal move",
    note: "One real step on the thing this stretch is actually about.",
    example: "Send the second of the three reality-check messages from the pilot.",
    minimum: "One message, or fifteen honest minutes on it.",
    alternative: "Prepare the next step so tomorrow starts warm.",
    stop: "When the step you named is done — not when the day runs out.",
  },
  {
    lane: "Maintenance",
    note: "One item off the upkeep list — not to clear it, just to keep it from accruing.",
    example: "Book the dentist you've deferred for two years.",
    minimum: "One phone call, or finding the number.",
    alternative: "Move the item to a day it is actually possible on.",
    stop: "When one item has moved. The list is not meant to be cleared.",
  },
  {
    lane: "Health & recovery",
    note: "The thing that protects tomorrow's capacity.",
    example: "A walk, real food, and a hard stop on the search at 6pm.",
    minimum: "Food, water, and going outside once.",
    alternative: "Rest that is not restful still counts; lying down is a legitimate version.",
    stop: "At the hard stop you set, whether or not the day went well.",
  },
  {
    lane: "Relationships",
    note: "One turn toward a person, not an errand.",
    example: "Call your sister back — not about logistics.",
    minimum: "A message that is not about admin.",
    alternative: "Answer someone who reached out to you instead of initiating.",
    stop: "When the conversation ends. This one is not a task and has no target.",
  },
  {
    lane: "Buffer",
    note: "Deliberately unplanned. The margin that absorbs the day going sideways.",
    example: "An hour left empty on purpose.",
    minimum: "Leave it empty. Spending it is what it is for.",
    alternative: "If the day did not go sideways, it is yours and nothing is owed.",
    stop: "It has no work in it, so there is nothing here to stop.",
  },
];

export default function DailyPlanPage() {
  return (
    <ReadingPage>
      <PageHeader
        eyebrow="A worked example"
        title="A plan is where a goal gets a Tuesday"
        intro="Here is one worked example: a single plan — the bounded pilot from the guidance flow — turned into an actual day. It is arranged in lanes, so the important moves survive contact with the day rather than being crowded out by whatever shouts loudest."
        status="illustrative"
      />

      <h2 id="the-lanes">The lanes</h2>
      <p>
        A day arranged only as a list becomes a race to the bottom of it. Arranged in lanes, each kind of
        thing gets protected from the others — the goal move does not get eaten by the urgent thing, and
        recovery is on the plan rather than being what is left if there is time.
      </p>
      <div className="lanes-table" role="table" aria-label="Daily plan lanes">
        {LANES.map((l) => (
          <div key={l.lane} className="lane-row" role="row">
            <span className="lane-name" role="cell">
              {l.lane}
            </span>
            <span className="lane-note" role="cell">
              {l.note}
            </span>
            <span className="lane-example" role="cell">
              {l.example}
            </span>
            <span className="lane-minimum" role="cell" data-lane-minimum>
              <span className="lane-cell-label">Minimum</span> {l.minimum}
            </span>
            <span className="lane-alternative" role="cell" data-lane-alternative>
              <span className="lane-cell-label">Alternative</span> {l.alternative}
            </span>
            <span className="lane-stop" role="cell" data-lane-stop>
              <span className="lane-cell-label">Stops</span> {l.stop}
            </span>
          </div>
        ))}
      </div>
      {/* N-077 — why the three extra cells are there, said once. */}
      <p>
        Each lane carries three things besides the example, and they are the part that decides whether
        this survives a bad week. The <strong>minimum</strong> is what still counts on a day when almost
        nothing is available, so the day ends with the plan intact rather than with the plan as evidence
        against you. The <strong>alternative</strong> is what to do when the planned form is blocked, so
        a blocked lane does not silently become an empty one. And the <strong>stop condition</strong> is
        what keeps a lane from becoming a stick: a task with no declared end has no state in which it is
        finished, which makes every state a state of not having done enough.
      </p>

      {/* N-091 (C-40) — the separation, stated. The closer the real planner and
          the fiction get, the more explicitly they have to look different. */}
      <p className="plan-separation" data-plan-separation>
        One thing about what this page is. This is a real day, not a fiction: there is no draw here,
        nothing is randomised, no outcome is generated, and nothing on it is a model of you. It is
        deliberately built to look nothing like the play surfaces elsewhere on this site, and that
        distance is a safety rule rather than a style choice — the moment a real Tuesday borrows the
        presentation of a simulation, the simulation starts reading as a claim about your life.
      </p>

      {/* N-411 — the caveat that has to travel with "look at where your time
          goes", because without it that advice blames a person for a constraint. */}
      <p>
        A plan will show you the gap between what you say matters and where the hours actually go, and
        that gap is worth looking at honestly. It is also worth reading carefully. Behaviour does not
        reveal values cleanly: obligation, illness, addiction, money, care for somebody else and plain
        lack of opportunity all override preference, and a person with no slack has almost no room in
        which a preference could show up at all. Where the hours go is evidence about your constraints at
        least as much as about your wants, and the honest reading names both.
      </p>
      {/* N-127 — the distinction the lanes are actually enforcing, said out
          loud: time and attention are not the same stat, and only one of them
          can be scheduled. The time diary is named as EXTERNAL instrumentation
          and is deliberately not something this site asks you to log here. */}
      <h2 id="attention">Attention is the thing the lanes are protecting</h2>
      <p>
        Time and attention are not the same resource and the day goes wrong at the join. You can have
        hours and nothing left to spend into them — ask anyone with a newborn, or anyone in the fortnight
        after something bad. Money can be stored and time can at least be scheduled. Attention can be
        neither: it exists only in the moment it is spent, so the only decision available is where it goes
        next, and it cannot be saved up for the evening.
      </p>
      <p>
        Two consequences run this page. Switching is not free, so a day made of fragments can spend the
        whole allocation and produce nothing; two unbroken hours is more attention than twelve interrupted
        ones. And every unfinished thing runs a background process — an open loop, an unresolved
        disagreement, a decision you are waiting on — which is why a day with nothing much in it can still
        end with none left. Lanes are a way of protecting whole pieces of attention rather than filling
        hours.
      </p>
      <p>
        The honest measurement problem is that you notice where attention went only once it comes back, so
        introspection reports the day you intended rather than the day you had. The external check is a
        time diary kept for a week, on paper or in whatever you already use — and it is worth saying
        plainly that <strong>this site is not the place to keep it and will never ask you to</strong>.
        Nothing you do here is recorded, and an instrument that measures how you spend yourself is exactly
        the kind of thing that should live somewhere you control.
      </p>

      <p className="lane-integration">
        The maintenance lane&rsquo;s contents are exactly the kind of thing your{" "}
        <Link href="/character/logs">upkeep list</Link> holds — a plan is where a list item finally gets a
        day. {/* N-371 — the debt, and its caveat, in the same breath. */}
        What is on that list is maintenance debt: deferred upkeep compounds quietly and tends to arrive
        as several things failing in the same month rather than as a bill. And in the same breath,
        because the two belong together: not every unmet need is neglect, and people deferring
        maintenance are frequently people without the money, time, health or help to do it.
      </p>

      <Callout tone="warm" title="The minimum viable day">
        <p>
          For the days when capacity itself is the constraint, the plan shrinks — on purpose — to almost
          nothing: safety, food, sleep, one small maintenance action, and one message that prevents an
          avoidable harm. That is the whole day, and it is the plan working, not the plan failing. Reduced
          scope on a hard day is a feature of a good plan, not evidence against you.
        </p>
      </Callout>

      <h2>The rules that keep it from becoming a stick</h2>
      <p>
        A plan is only useful if missing part of it is survivable, so a few rules are worth stating
        plainly. Skipping the optional lanes does not make a failed day; a day where the critical thing and
        one recovery thing happened is a day that worked. And when a particular task gets avoided over and
        over, that is diagnostic information — it usually means the task is mis-specified, too big, or
        pointed at a goal you no longer hold — and not a verdict on your character. The right response to
        repeated avoidance is curiosity about the task, not contempt for yourself.
      </p>
      <p>
        Nothing here is a validated productivity system, and there is deliberately no count, no streak, and
        no completion score attached to any of it — for the same reasons there is none anywhere on this
        site. A plan is a way of protecting what matters from the noise of a day, and that is all it needs
        to be.
      </p>

      <NextSteps>
        <NextStep href="/character/logs" relation="requires" why="The maintenance lane needs a list to draw from, and that is where the list is kept.">The upkeep list the maintenance lane draws from.</NextStep>
        <NextStep href="/guidance" relation="precedes" why="The one important move on this day comes out of a decision made there first.">The guidance flow the primary-goal move comes from.</NextStep>
        <NextStep href="/topics/health" relation="explains" why="Why the recovery lane is load-bearing rather than a reward for finishing the other two.">Why the recovery lane protects everything else.</NextStep>
      </NextSteps>
    </ReadingPage>
  );
}
