import type { Metadata } from "next";
import Link from "next/link";
import {
  ReadingPage,
  PageHeader,
  Callout,
  MentorNote,
  EvidenceDrawer,
  NextSteps,
  NextStep,
} from "@/components/primitives";
import { Term } from "@/components/Term";
import { MechanicAnchor } from "@/components/reference/MechanicAnchor";

export const metadata: Metadata = {
  title: "Losing a job",
  description:
    "A decision sequence: the first days, stabilization, the search as a system, and recovery routes — with the clocks that actually matter found in week one.",
};

/**
 * Job loss — the flagship situation pathway (§6.4, ~1,400 words). Structured as
 * a decision sequence (Opus 4.6's pathway pattern). Donors: Fable 5 layoff,
 * Opus 5 losing-a-job + laid-off-at-47, Claude-family event-layoff cascade. The
 * variance doctrine (G-09) is stated here in full. No invented statistics: every
 * research-grounded claim is carried without a number, as the donors do.
 */
export default function JobLossPage() {
  return (
    <ReadingPage>
      <PageHeader
        eyebrow="Situation · a decision sequence"
        title="Losing a job"
        intro="A job is not one thing. It is an income, a daily structure, a set of people you saw without arranging to, a legible answer to what you do, and a quiet source of standing — and losing it removes entries from several parts of your life on the same day. Treating that as one problem is what makes it feel unmanageable."
      />

      <MechanicAnchor ids={["variance", "recovery"]} />

      <h2>The first days: find the clocks</h2>
      <p>
        In the first days, almost the only thing worth doing is finding the things that run on someone
        else&rsquo;s clock — anything with a signature or a deadline attached. Those are urgent. Most
        of what feels urgent is not.
      </p>
      <p>
        <strong>Do not sign the severance agreement in the room.</strong> Nearly every jurisdiction and
        most agreements give you days to review, and the terms are more negotiable than the folder makes
        them look. If the document has an unusually short deadline, that is information about the
        employer, not about your position. Write down what was said and who said it while it is fresh.
      </p>
      <p>Then find the dates, because each is a door that closes:</p>
      <ul>
        <li>
          <strong>Health cover.</strong> Where insurance is tied to the job, continuation usually has an
          election deadline measured in weeks, and there is often no remedy for missing it.
        </li>
        <li>
          <strong>Immigration status,</strong> if your right to remain depends on the job. This is often
          the shortest clock running and the one people discover last.
        </li>
        <li>
          <strong>Unemployment filing,</strong> which frequently has a start-date rule rather than a
          generous window — the clock runs whether or not you feel ready.
        </li>
        <li>
          <strong>Equity, if you have any.</strong> Exercise windows are short and the tax treatment is
          unforgiving; this one usually needs a number rather than an instinct.
        </li>
      </ul>
      <p>
        What only pretends to be urgent: updating your profile tonight, announcing anything, answering
        the &ldquo;what happened??&rdquo; messages, rewriting the whole CV by morning, deciding whether
        to change careers, or working out what this says about you. It says very little. The first-week
        flurry of applications is the classic wasted move — sent by the least clear-headed version of
        you, into the void, without the referrals that actually work.
      </p>

      <h2>Stabilization: two injuries on two clocks</h2>
      <p>
        Once the deadlines are handled, resist the large decisions for a couple of weeks. Do not move
        cities, sell investments, take the first offer to end the fear, deliver relationship ultimatums,
        or decide what kind of person this makes you. Every one of these is a large trade executed at
        your worst prices, and almost nothing on the list gets more expensive by waiting a fortnight.
        Decisions made with depleted capacity are reliably worse, and your capacity to decide is badly
        depleted right now — which explains most bad choices in this period better than &ldquo;low
        energy&rdquo; does.
      </p>
      <p>
        It helps to separate two injuries that heal on different clocks. The <strong>income hit</strong>{" "}
        is arithmetic: runway, burn rate, benefit dates — computable in an evening, and computing it
        usually shrinks the fear to its actual size, because a number is calmer than a dread and this
        particular dread inflates without one. The <strong>identity hit</strong> is not arithmetic, and
        pretending the spreadsheet fixed it is how people get ambushed months later. Do the arithmetic{" "}
        <em>and</em> name the other thing; confusing them makes both worse.
      </p>

      <MentorNote provenance="editorial-synthesis">
        <p>
          A layoff is selected mostly by cost centre, tenure band, salary, your manager&rsquo;s own
          position in the reorganisation, visa status, and where you happened to be sitting when a target
          number was set. Individual performance enters the selection weakly and often not at all,
          particularly at scale. Being laid off licenses no inference about your competence — not
          downward, and not upward for the colleagues who were kept.
        </p>
      </MentorNote>

      <h2>What this was, mechanically</h2>
      <p>
        This is the place to state the doctrine plainly, because it is doing real work here.{" "}
        <Term k="variance" define /> is not an excuse; it is an accurate description. Skill sets the
        distribution of outcomes a decision can draw from; luck draws the actual result from it. Both
        halves are always true at once. A sound decision can meet a bad draw, and a reckless one can
        meet a lucky result, and neither outcome rewrites the decision that preceded it. So &ldquo;I did
        everything right and still lost&rdquo; is not a contradiction to be resolved by finding your
        error. Your decision was sound on the information you had; the draw was structural and bad; both
        are true. The belief that you erred sends you hunting for the mistake instead of looking at the
        board.
      </p>

      <h2>The search as a system</h2>
      <p>
        Hiring is an information problem, and the version of it you can act on is mostly about who knows
        what you can do. That is why network beats broadcast: most positions are still found through
        weak ties, not through the front door of an application portal. It is also the cruellest part,
        because shame suppresses asking at exactly the moment asking has its highest return.
      </p>
      <p>Two structural habits do most of the work:</p>
      <ul>
        <li>
          <strong>Impose an arbitrary structure in the first week</strong> — a fixed start, a fixed end,
          fixed days off. The content matters less than the fixity. A job supplies dozens of small
          decisions for free; when it is gone they come back as choices, and a made-up timetable is far
          cheaper to run than a continuously re-decided day.
        </li>
        <li>
          <strong>Treat the search as a job with hours, and stop at the end of them.</strong> A search
          that expands to fill the whole day produces less searching, not more, and eats the recovery the
          search runs on. Protect one standing arrangement with other people each week that is neither
          the search nor the household — it keeps a social field, a timetable, and a source of
          information all at once.
        </li>
      </ul>
      <p>
        Expect a scheduled low point somewhere around the second month, when three things tend to arrive
        together: the buffer has visibly, not theoretically, shortened; contact from former colleagues
        thins; and the search has produced enough silence to feel like a verdict. It is usually a queue,
        not a judgement. The low point is roughly scheduled and structural, which means that when it
        comes, it is information about the shape of the transition — not about how you are doing. People
        who expect it read it correctly; people who do not read it as a verdict.
      </p>
      <p>
        And a small thing worth doing in week one: write down what you knew and what you expected, now,
        before the outcome arrives. Hindsight will otherwise manufacture an account in which this was
        foreseeable and you should have moved sooner. That account is generated after the fact.{" "}
        <Link href="/character/logs">There is a place to keep that kind of record.</Link>
      </p>

      <h2>Recovery routes</h2>
      <p>
        There are routes back from here, and they belong beside every hard fact rather than as an
        afterthought. Convert a specific skill into its adjacent, more general form — the part of your
        expertise that transfers is usually the part you undervalue. Position toward sectors where your
        specificity is an asset rather than a liability. Acquire one legible credential and one contact
        outside your old field. Protect the runway. And, where it is true, accept that a particular arc
        is over, which is a different thing from accepting that arcs are.
      </p>
      <Callout tone="caution" title="What decides which of these applies: the floor">
        <p>
          With eighteen months of buffer, this is a hard transition you can run deliberately. With two
          months, it is closer to a survival situation, and the correct strategy inverts: take the
          available job, protect the floor, and treat the question of the right career as a later problem.
          With dependents, tolerance for variance drops sharply. None of that is a failure of nerve; it is
          arithmetic about a buffer. The honest reframe here is accurate, and it does not pay a mortgage —
          what would actually fix the hardest cases is at the level of policy and enforcement, above the
          scale a page like this works at.
        </p>
      </Callout>

      <h2>What this touches</h2>
      <p>
        A single shock becomes several when its fast edges are missed, so it helps to see the whole map
        at once. The cheap places to intervene are the fast ones:
      </p>
      <ul>
        <li>
          <strong>Health cover → deferred care.</strong> A fast edge; the deferred-care leg compounds.
          One of the two cheapest places to act early.
        </li>
        <li>
          <strong>Immigration status → right to remain.</strong> The fastest edge here, sometimes measured
          in days. The other cheap intervention.
        </li>
        <li>
          <strong>Structure → sleep and movement → mood → search capacity.</strong> A loop, not a line: it
          feeds back into the very thing that would fix it.
        </li>
        <li>
          <strong>Identity → willingness to ask peers for help.</strong> The edge where shame does the most
          damage, because asking has the highest return exactly when it feels hardest.
        </li>
        <li>
          <strong>Income → housing,</strong> where rent or mortgage is close to income. Lenders and
          landlords generally have hardship processes that are far easier to reach <em>before</em> a missed
          payment than after.
        </li>
      </ul>

      <NextSteps>
        <NextStep href="/topics/money">Money and slack — the runway arithmetic, and why the buffer matters.</NextStep>
        <NextStep href="/topics/work">Education and career — standing, credentials, and changing direction.</NextStep>
        <NextStep href="/guidance">Choosing a path — if the next move is a real decision.</NextStep>
        <NextStep href="/character/logs">Keep a record of what you knew, before the outcome arrives.</NextStep>
      </NextSteps>

      <EvidenceDrawer
        record={{
          status: "editorial",
          scope: "General patterns; specific clocks (severance, benefits, immigration) are local and change.",
          lastReviewed: "2026-08-26",
          whatWouldChange:
            "Nothing here is legal, tax, or immigration advice. The one universal claim is that the clocks exist and that finding yours in week one is worth more than anything else you could do in week one. The displacement and wellbeing effects referenced are well supported in the research but are carried here without a number, because the magnitude varies.",
          whereThisFrameFails:
            "Individual navigation is a small answer to a large thing; for many people the binding constraints are set by labour markets and policy, which this page can describe but not move.",
        }}
      />
    </ReadingPage>
  );
}
