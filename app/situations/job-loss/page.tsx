import type { Metadata } from "next";
import Link from "next/link";
import {
  ReadingPage,
  PageHeader,
  Callout,
  MentorNote,
  PathwayStep,
  EvidenceDrawer,
  NextSteps,
  NextStep,
  TryInPlay,
} from "@/components/primitives";
import { Term } from "@/components/Term";
import { MechanicAnchor } from "@/components/reference/MechanicAnchor";
import { PositionNote } from "@/components/PositionNote";
import { ROUTE_BY_PATH } from "@/content/routes";

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
        systems={ROUTE_BY_PATH["/situations/job-loss"]?.systems}
      />

      <MechanicAnchor ids={["variance", "recovery"]} />

      {/* N-045 — the four phases this page already had, each now naming the
          system it belongs to, so a reader mid-crisis knows which instrument to
          pick up for THIS step instead of holding the whole map at once. The
          prose is unchanged; only the chrome around it is new. */}
      <PathwayStep n={1} title="The first days: find the clocks" primary="money" id="clocks">
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

      {/* N-046 — the horizon ladder. The page was editorially strong and hard
          to act from in the first hour; someone who has just been let go can
          hold three horizons, and the last rung is the one that restores a
          rhythm rather than adding a task. No digit, and no claim about any
          jurisdiction's deadlines — those are the clocks above, and they are
          local. */}
      <h3 id="three-horizons">Three horizons, if you want the short version</h3>
      <dl className="horizon-ladder">
        <dt>The first day</dt>
        <dd>
          Write down what was said, by whom, and when, while it is fresh. Keep lawful copies of your own
          records and anything you are entitled to hold. Sign nothing you do not understand, however
          urgent the room feels. Then tell one person, out loud.
        </dd>
        <dt>The first days</dt>
        <dd>
          Find the dates above and put each one somewhere you will see it. Work out the runway — what is
          coming in, what is going out, how long that lasts. Ask about anything continuing that has an
          election deadline. Decline every large decision that is not one of these.
        </dd>
        <dt>The first two weeks</dt>
        <dd>
          Tell the handful of people who might actually know something, with a specific ask rather than
          an announcement. Get one honest read on the severance terms if there are any. And put a shape
          back on the week — a fixed start, a fixed finish, one standing arrangement with other people
          that is neither the search nor the household. The rhythm is not a reward for having done the
          rest; it is what the rest runs on.
        </dd>
      </dl>
      </PathwayStep>

      <PathwayStep n={2} title="Stabilization: two injuries on two clocks" primary="health">
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

      {/* N-150 (C-42) — the runway arithmetic above is the same arithmetic for
          everybody and means something completely different depending on what
          sits under it. */}
      <PositionNote
        notes={{
          yes: "With a floor beneath a serious failure, the runway you just worked out is longer than the number says, and that changes what to do with it: you can afford to decline the first offer that ends the fear, and taking the fortnight before any large decision is genuinely available to you. The risk from here is not ruin; it is accepting something too quickly because the uncertainty is unpleasant.",
          no: "Without a floor beneath a serious failure, the runway is the whole picture and the advice to wait a fortnight has to bend around that. What still holds: the deadline-bearing items above come first, because a missed election window costs real money you will need. What changes: income sooner outranks income better, taking something interim is not a concession, and claiming everything you are entitled to claim is the single highest-return use of this week.",
          unsure: "Whether there is a floor beneath a serious failure changes what your runway means more than the figure itself does. It decides whether the fortnight before large decisions is available to you, and it is worth settling before deciding anything on the strength of the arithmetic above.",
        }}
      />

      <MentorNote provenance="editorial-synthesis">
        <p>
          A layoff is selected mostly by cost centre, tenure band, salary, your manager&rsquo;s own
          position in the reorganisation, visa status, and where you happened to be sitting when a target
          number was set. Individual performance enters the selection weakly and often not at all,
          particularly at scale. Being laid off licenses no inference about your competence — not
          downward, and not upward for the colleagues who were kept.
        </p>
      </MentorNote>

      </PathwayStep>

      <h2 id="what-this-was">What this was, mechanically</h2>
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

      <PathwayStep n={3} title="The search as a system" primary="party">
      <p>
        Hiring is an information problem, and the version of it you can act on is mostly about who knows
        what you can do. That is why network beats broadcast: most positions are still found through
        weak ties, not through the front door of an application portal. It is also the cruellest part,
        because shame suppresses asking at exactly the moment asking has its highest return.
      </p>
      {/* N-130 — the missing HOW, beside the trunk's existing "asking is a skill". */}
      <p>
        What separates an ask that works from one that does not is almost entirely how completable it
        is: &ldquo;do you know anyone hiring for this specific thing?&rdquo; hands the other person an
        action they can finish in a minute, where &ldquo;keep me in mind&rdquo; hands them a standing
        obligation with no end and no way to discharge it — which is why it is the one everybody sends
        and the one nothing comes back from.{" "}
        <Link href="/topics/relationships#asking-for-help">The craft of the ask</Link> is a page of its
        own.
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

      </PathwayStep>

      <PathwayStep n={4} title="Recovery routes" primary="work">
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

      </PathwayStep>

      <h2 id="what-this-touches">What this touches</h2>
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

      {/* N-047 — the board, filled in for this situation. A tool shown already
          worked through is understood; the same tool linked to as an empty form
          usually does not get opened. These are one plausible reader's answers,
          not a template to match. */}
      <h2 id="the-board-filled-in">The board, filled in for this</h2>
      <p>
        <Link href="/character/board">The guided pressure reading</Link> asks six questions in an order.
        Here is what one person&rsquo;s answers looked like a fortnight after a layoff — illustrative,
        and worth reading for the shape rather than the content, because the interesting part is that
        the binding row turned out not to be the money.
      </p>
      <dl className="worked-board">
        <dt>Pressure</dt>
        <dd>
          &ldquo;I have to take the first offer that comes or I will never get back to where I was.&rdquo;
        </dd>
        <dt>What binds</dt>
        <dd>
          Not the money, yet — there is a few months of runway. What binds is capacity: sleep has gone,
          and every decision made in the last week has had to be made twice.
        </dd>
        <dt>Wall or door</dt>
        <dd>
          &ldquo;Nobody hires at my level in this city&rdquo; was assumed and not checked. Two
          conversations found out it was a door. Cheap to test, and it had been treated as a wall for
          three weeks.
        </dd>
        <dt>Still want it</dt>
        <dd>
          Half. The role was fine and the field had stopped being interesting some time before the
          layoff, which is worth knowing before optimising the route back into it.
        </dd>
        <dt>Conflict</dt>
        <dd>
          Wanting to move quickly and wanting to change direction pull opposite ways. Both are real;
          there is no arrangement that satisfies both, so one of them gets chosen deliberately.
        </dd>
        {/* The board's sixth row is "resources and moves"; the label follows it
            rather than the shorter word, which is now a Game Guide term (N-322)
            and may not be hardcoded in a component (gate 3). */}
        <dt>Resources and moves</dt>
        <dd>
          The runway, one former colleague who owes nothing and would help anyway, and a skill that
          transfers further than it looks. Checked last, on purpose.
        </dd>
      </dl>

      <NextSteps>
        <NextStep href="/topics/money" relation="explains" why="The runway arithmetic this page keeps pointing at, worked through where it lives.">Money and slack — the runway arithmetic, and why the buffer matters.</NextStep>
        <NextStep href="/topics/work" relation="see-also" why="Standing, credentials and direction — for when the search stops being about this week.">Education and career — standing, credentials, and changing direction.</NextStep>
        <NextStep href="/guidance" relation="unlocks" why="If the next move is a real decision rather than a task with a deadline on it.">Choosing a path — if the next move is a real decision.</NextStep>
        <NextStep href="/character/logs" relation="protects" why="Writing down what you knew now is what stops hindsight rewriting it into a mistake.">Keep a record of what you knew, before the outcome arrives.</NextStep>
      </NextSteps>

      {/* N-235. A link at the end of the page, never above the fold and never
          a nudge. Never on a set-down route (C-24). */}
      <TryInPlay href="/play/lab">the Decision Lab has a run at getting hired, forked and compared.</TryInPlay>

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
