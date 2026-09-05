import type { Metadata } from "next";
import Link from "next/link";
import {
  ReadingPage,
  PageHeader,
  Lede,
  Callout,
  MentorNote,
  PathwayStep,
  EvidenceDrawer,
  NextSteps,
  NextStep,
} from "@/components/primitives";
import { ROUTE_BY_PATH } from "@/content/routes";

export const metadata: Metadata = {
  title: "When a relationship ends",
  description:
    "Several parts of a life stop working on the same day — home, money, people, routine, the answer to who you are — which is why it hurts out of proportion to what anyone watching can see.",
};

/**
 * N-026 (6.0 §3.1, §3.3) — A RELATIONSHIP ENDING.
 *
 * The trunk covers a death, bereavement, low mood and being hurt, and had nothing
 * at all for the commonest catastrophic event in an adult life: the word did not
 * appear anywhere in app/, content/ or components/.
 *
 * TONE. This route is LOSS-ADJACENT (`LOSS_ADJACENT_ROUTES` in content/routes.ts):
 * light intensity, so it keeps the steps and the tag row, and graded at the bar
 * the set-down pages set. No cleverness, nothing arch, no comic register ever
 * (C-35), and none of the loss-tier vocabulary the exclusion lists reserve for
 * bereavement — a partnership ending is not that, and borrowing that vocabulary
 * would be both inaccurate and, on the page next door, unkind.
 *
 * NO TRY-IN-PLAY ENTRY. It is permitted here by the letter of N-235 — this is not
 * a set-down route — and it is not placed. An invitation to go and simulate this
 * is the wrong register for the page whatever word it wears.
 */
export default function BreakupPage() {
  return (
    <ReadingPage>
      <PageHeader
        eyebrow="Situation"
        title="When a relationship ends"
        intro="It is not one loss. It is a home, an income, a routine, a share of the people you both knew, and a legible answer to who you are — all of them stopping on the same day. That is why it hurts out of proportion to what anyone watching thinks has happened, and why the hurt is not evidence that you are handling it badly."
        systems={ROUTE_BY_PATH["/situations/breakup"]?.systems}
      />

      <Lede>
        The logistics are the part a page can help you carry. The rest of it is carried the way losses
        are carried — in waves, on no schedule, slowly becoming more survivable.
      </Lede>

      <h2 id="what-stops-working">What stops working, all at once</h2>
      <p>
        A long partnership is load-bearing in more places than either person usually notices while it is
        working. When it ends, several of them come apart together:
      </p>
      <ul>
        <li>
          <strong>Where you live,</strong> and often on somebody else&rsquo;s timetable rather than
          yours.
        </li>
        <li>
          <strong>Money,</strong> which was arranged around two people and now is not — shared accounts,
          a deposit, standing payments running against the wrong card.
        </li>
        <li>
          <strong>The people.</strong> Not only each other: a shared circle sorts itself out over
          months, mostly without either of you doing anything about it.
        </li>
        <li>
          <strong>The ordinary day.</strong> Meals, sleep, who does what, the small regulation that used
          to happen through conversation. None of it halves. Most of it lands on one person.
        </li>
        <li>
          <strong>The answer to who you are,</strong> which was partly &ldquo;half of us&rdquo; and now
          needs rebuilding while everything else is also being rebuilt.
        </li>
      </ul>
      <p>
        Expect the ordinary readouts to go wrong for a while. Sleep breaks up, concentration drops, and
        the composure holds for hours and then goes suddenly, over something that had nothing to do with
        it. That is what this does to a person. It is not a sign of weakness and it is not a verdict on
        how much you should have loved them.
      </p>

      <PathwayStep n={1} title="The first week: only what is actually urgent" primary="money">
        <p>
          Where you are sleeping tonight is tonight&rsquo;s problem. The lease is next month&rsquo;s
          problem wearing tonight&rsquo;s clothes, and it is worth refusing to answer it this week.
        </p>
        <p>
          Then the money entanglements, written calmly on one page: the shared accounts, the deposit,
          anything on automatic payment, the subscriptions. Untangle them administratively rather than
          punitively. Every entanglement is a future conversation, and what you want is fewer of those,
          not more leverage inside them.
        </p>
        <p>
          <strong>Decide the contact terms once, in daylight.</strong> Whatever you settle about talking,
          messaging and looking, settle it while you are as steady as you are going to be, write it
          somewhere you will see it, and let the late-evening version of you inherit a decision instead
          of making one. The late-evening version should not be trusted with this.
        </p>
        <p>
          <strong>What feels urgent and is not:</strong> managing the story. The shared circle will sort
          itself out over months whether or not you campaign, and campaigning mostly spends dignity you
          will want back. The belongings can wait in a box. The announcement can wait indefinitely.
        </p>
      </PathwayStep>

      <PathwayStep n={2} title="The first fortnight: rebuild the ordinary day first" primary="time">
        <p>
          This is the move that most reliably helps and least reliably gets made, because it looks far
          too small for the size of the thing. Before the large questions — whether you are unlovable,
          what the years meant, whether you should have seen it — stabilise the infrastructure. A sleep
          routine that works for one. Meals that happen. A shape to a weekday and a different shape to a
          Saturday. Something on the calendar with another person in it, at least once a week.
        </p>
        <p>
          The reason is not discipline and it is not distraction. It is that everything else recovers
          from a stable base and almost nothing recovers without one, and this is the only part of the
          situation currently inside your control.{" "}
          <Link href="/guidance/daily-plan">The worked daily plan</Link> is exactly this, laid out as a
          real Tuesday, and it has a minimum version for when capacity is the thing you do not have.
        </p>
      </PathwayStep>

      <PathwayStep n={3} title="What not to decide yet" primary="health">
        <p>
          Decisions made with depleted capacity are reliably worse, and your capacity is depleted right
          now — which explains most of the regrets people carry out of this period better than
          &ldquo;I was not thinking straight&rdquo; does. So, for a month or so: no move to another
          city, no resignation, no large sale, no permanent arrangement about the shared circle, and no
          conclusion about what kind of person this makes you.
        </p>
        <p>
          Two more that are specific to this. <strong>No conversation to get closure</strong> in the
          first weeks — the meeting sought for that reason is usually contact wearing insight&rsquo;s
          clothes, and closure is not a thing the other person can hand over anyway; it gets built
          later, slowly, mostly without your noticing. <strong>And no archaeology</strong> of the message
          history at two in the morning. That archive stored the highlights and deleted the reasons, so
          it is not a record of the relationship and it will not answer the question you are asking it.
        </p>
      </PathwayStep>

      <h2 id="common-mistakes">The three common mistakes</h2>
      <ul>
        <li>
          <strong>Filling the gap immediately.</strong> Another relationship, or frantic company, or
          anything at all that dulls the absence. It is understandable and it is nearly always early,
          because the gap is informative: it shows which needs that relationship was actually meeting,
          which of those you can meet yourself, and which will need a different arrangement entirely.
          Skip the gap and you lose the information, and generally pay for it later.
        </li>
        <li>
          <strong>Relitigating.</strong> The loop about what went wrong, whose fault it was, what you
          should have said. Some of that is necessary and it does real work. Past a point it stops
          producing new understanding and simply spends the energy the recovery is running on, and the
          tell is that you are reaching conclusions you have already reached.
        </li>
        <li>
          <strong>Scorched earth.</strong> Deleting everything, refusing to allow that any of it was
          good. This is loss-aversion running backwards — destroying the evidence of something real
          because it ended. It happened. Some of it was probably good. You can let it be over without
          having to pretend it never counted.
        </li>
      </ul>

      <Callout tone="warm" title="Why a shorter relationship can hurt as much as a long one">
        <p>
          Because two things ended, on different clocks. There is the person, who you knew and now do
          not see. And there is the future you had been building in that direction — where you would be
          living, who would be at the table, what the next several years were going to look like. The
          second one can be far larger than the length of the relationship suggests, because it existed
          mostly in draft and drafts can run a long way ahead.
        </p>
        <p>
          Naming that does not fix it. It does explain the weight, and unexplained weight is heavier than
          explained weight.
        </p>
      </Callout>

      <h2 id="routes-back">Routes back, beside each cost</h2>
      <p>
        Every one of the losses above has something on the other side of it, and they are worth stating
        beside the costs rather than after them:
      </p>
      <ul>
        <li>
          <strong>The household costs more to run alone.</strong> The route back is arithmetic and it is
          worth doing early, on paper, because a computed number is calmer than an uncomputed dread —
          see <Link href="/topics/money">money and slack</Link> for the runway version of it.
        </li>
        <li>
          <strong>The load that used to be shared is now yours.</strong> The route back is spreading it
          across several people rather than one — the friend who listens, the one who is good company
          without a conversation, the relative who is good at practical things.{" "}
          <Link href="/topics/relationships#asking-for-help">Asking well is a skill</Link>, and the
          specific ask is the one that gets answered.
        </li>
        <li>
          <strong>The shared plans no longer hold.</strong> The route back is that some of them were
          compromises rather than yours, and this is the first honest chance in a long time to sort which
          were which. That is not a consolation prize. It is the one thing here that only becomes
          available now.
        </li>
        <li>
          <strong>The daily shape is gone.</strong> The route back is step two, and it is genuinely
          available today.
        </li>
      </ul>

      <MentorNote provenance="experiential-pattern">
        <p>
          Almost nobody reports that the useful thing anyone said to them was the right thing. What they
          report is the people who kept turning up after the first fortnight, when the calls had thinned
          and it was still going on. If you are the person reading this for somebody else: that is the
          job, and it is available to you.
        </p>
      </MentorNote>

      <h2 id="when-this-is-not-the-page">When this is not the page</h2>
      <p>
        If the relationship involved someone frightening or controlling you, leaving is a different
        situation with different moves and a different risk profile, and{" "}
        <Link href="/situations/being-hurt">that page</Link> is the one to read instead — nothing here
        is written for it. If the flatness is not lifting at all over months, or was there before this
        happened, <Link href="/situations/depression">this is a different page too</Link>. And if today
        is as far as you can see, <Link href="/situations/getting-through-today">start there</Link>;
        nothing above is for tonight.
      </p>

      <NextSteps>
        <NextStep
          href="/guidance/daily-plan"
          relation="unlocks"
          why="Step two, worked through as a real Tuesday, with a minimum version for the days there is nothing spare."
        >
          A worked daily plan — the ordinary day, rebuilt.
        </NextStep>
        <NextStep
          href="/topics/relationships"
          relation="explains"
          why="Repair, the untallied ledger, and the four different things the word love is doing — the mechanisms under this page."
        >
          The people around you.
        </NextStep>
        <NextStep
          href="/character/board"
          relation="unlocks"
          why="Sorts which of the five things that failed is actually the one holding everything else still."
        >
          Lay the whole situation out.
        </NextStep>
        <NextStep
          href="/situations/getting-through-today"
          relation="protects"
          why="If there is nothing left tonight, none of this is today's problem."
        >
          If today is the whole horizon.
        </NextStep>
      </NextSteps>

      <EvidenceDrawer
        record={{
          status: "editorial",
          scope: "General patterns people repeatedly report, synthesised. Not measured outcomes, and not therapy.",
          lastReviewed: "2026-09-05",
          whatWouldChange:
            "No duration, rate or proportion appears on this page, because none was read on a fetched source: how long any of this takes varies enormously and a number here would be a false comfort in one direction or a false alarm in the other. Research on which of the first-fortnight moves actually helps, rather than which people report helping, would change the order of the steps.",
          whereThisFrameFails:
            "Taking a partnership apart into systems that failed is useful for the logistics and says nothing about the person. They were not a set of functions being provided, and the absence is not a gap in a schedule to be filled. The practical half of this page is the half a page can do; the rest is carried rather than solved.",
        }}
      />
    </ReadingPage>
  );
}
