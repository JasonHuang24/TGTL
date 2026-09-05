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

const LANES = [
  { lane: "Critical today", note: "The thing with a deadline or a signature on it.", example: "Return the benefits form before the window closes." },
  { lane: "Primary goal move", note: "One real step on the thing this stretch is actually about.", example: "Send the second of the three reality-check messages from the pilot." },
  { lane: "Maintenance", note: "One item off the upkeep list — not to clear it, just to keep it from accruing.", example: "Book the dentist you've deferred for two years." },
  { lane: "Health & recovery", note: "The thing that protects tomorrow's capacity.", example: "A walk, real food, and a hard stop on the search at 6pm." },
  { lane: "Relationships", note: "One turn toward a person, not an errand.", example: "Call your sister back — not about logistics." },
  { lane: "Buffer", note: "Deliberately unplanned. The margin that absorbs the day going sideways.", example: "An hour left empty on purpose." },
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
          </div>
        ))}
      </div>
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
        day.
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
