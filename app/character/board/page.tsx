import type { Metadata } from "next";
import {
  InstrumentPage,
  PageHeader,
  Callout,
  NextSteps,
  NextStep,
} from "@/components/primitives";
import { Board } from "@/components/Board";
import { Term } from "@/components/Term";

export const metadata: Metadata = {
  title: "Guided pressure reading",
  description:
    "Walk the constraint check through curated options and read which pressure is actually binding — which row, never how bad. Kept only on this device.",
};

/**
 * The guided pressure reading (§4, §6.6). Rebuilt under the input doctrine: every
 * answer is a choice from a list, nothing is typed or scored, crisis routes sit at
 * the top as direct links. The interactive flow walks the binding-constraint check;
 * the prose below explains why the order works.
 */
export default function BoardPage() {
  return (
    <InstrumentPage>
      <PageHeader
        eyebrow="Pressure reading"
        title="Which pressure is actually binding?"
        intro="People chronically work the wrong row — money moves when the problem is exhaustion, effort when the problem is a goal they no longer hold. Walk the check below: every answer is a choice from a list, nothing is typed, nothing is scored, and the reading names the one constraint doing the most work — which row, never how bad."
      />

      <Board />

      <section className="prose-in-instrument">
        <h2>
          Reading the board: which <Term k="pressure" /> is binding
        </h2>
        <p>
          When you look at it, the useful question is not &ldquo;what should I fix?&rdquo; but
          &ldquo;which row is actually binding right now?&rdquo; Most people misidentify this and then
          work the wrong problem, with great diligence, for a long time. The reason is simple: you work
          the thing you can see. Money is legible, so people work money; effort is always available, so
          people apply more effort. But the binding constraint is disproportionately one of the three
          things you cannot see from inside — your own condition, whether a wall is really a wall, and
          whether you still want the thing you are aiming at.
        </p>
        <p>So it is worth checking in an order, because skipping a step quietly invalidates the ones below it:</p>
        <ol className="pressure-steps">
          <li>
            <strong>Is a condition active?</strong> Burnout, depression, acute grief, exhaustion, danger.
            If so, stabilise before optimising — resource work done inside an unaddressed condition gets
            undone. If it is danger, stop here and get to the help-now page.
          </li>
          <li>
            <strong>Is there any <Term k="slack" />?</strong> Not money — margin. Would one unexpected
            demand break something? If there is none, the buffer is the binding constraint, because almost
            every improvement move needs some slack to execute.
          </li>
          <li>
            <strong>Is it a wall or a door?</strong> If it is genuinely a wall, more effort is not a
            strategy — adapt, redesign around it, or accept it, which frees everything you were spending
            on it. If you are not sure, finding out is usually a cheap move.
          </li>
          <li>
            <strong>Do you still hold the aim?</strong> Before optimising a route, confirm the
            destination. People improve their execution of a goal they would no longer choose, and
            experience the result as meaninglessness.
          </li>
          <li>
            <strong>Is the aim in conflict with another you also hold?</strong> If so, that conflict is
            the problem, and it will have been presenting itself as a time-management complaint. No
            calendar resolves a conflict between two things you both want.
          </li>
          <li>
            <strong>Only now: resources and moves.</strong> Which is where nearly everyone starts, and it
            is the sixth thing to check, not the first.
          </li>
        </ol>

        <Callout tone="caution" title="The expensive direction of the error">
          <p>
            Calling a wall a door produces years of effort, self-blame, and exhaustion. Calling a door a
            wall produces a smaller life, unclaimed entitlements, and exits never attempted. Advice
            cultures push people toward the first error; fatalism pushes them toward the second. Both are
            worth guarding against, in that order.
          </p>
        </Callout>

        <p>
          One honest limit, because it changes how to use all of this: a board filled in while burnt out
          is a board filled in <em>by</em> burnout. It will reliably under-report the condition row and
          over-report the stuck row — and then hand the reading back to you with the borrowed authority of
          something written down. The only real correction is external. If you can, show it to one person
          who knows you well and is standing outside the situation, and let their reading of your condition
          outvote your own.
        </p>
      </section>

      <NextSteps>
        <NextStep href="/character/logs">Keep a record of what you knew, and the upkeep you're not doing.</NextStep>
        <NextStep href="/guidance">Turn the binding row into a decision, with real options.</NextStep>
        <NextStep href="/threshold">If a condition on the board is danger — the numbers.</NextStep>
      </NextSteps>
    </InstrumentPage>
  );
}
