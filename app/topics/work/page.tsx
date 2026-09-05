import type { Metadata } from "next";
import {
  ReadingPage,
  PageHeader,
  Callout,
  MentorNote,
  StalenessStamp,
  EvidenceDrawer,
  NextSteps,
  NextStep,
  TryInPlay,
  ModelBreak,
} from "@/components/primitives";
import Link from "next/link";
import { Term } from "@/components/Term";
import { MechanicAnchor } from "@/components/reference/MechanicAnchor";
import { SingleHomeNote } from "@/components/SingleHomeNote";
import { PositionNote } from "@/components/PositionNote";
import { ROUTE_BY_PATH } from "@/content/routes";

export const metadata: Metadata = {
  title: "Education and career",
  description:
    "Credentials as access tokens, the unwritten local rules of a workplace, why popular strategies degrade, and what a mid-life change of direction actually costs.",
};

/**
 * Topic — Education and career (§6.7, ~1,000 words). Donors: Opus 4.6
 * respeccing, Fable 5 the-meta + patch-notes, Claude-family arena-workplace.
 * Carries a staleness stamp on the meta content, demonstrating G-12.
 */
export default function WorkPage() {
  return (
    <ReadingPage>
      <PageHeader
        eyebrow="Topic · work"
        title="Education and career"
        intro="A workplace looks like it runs on the written rules. It runs mostly on the unwritten ones, and the gap between the two is where careers are made and lost. Here are the parts that are most consistently mistaken for something they are not."
        systems={ROUTE_BY_PATH["/topics/work"]?.systems}
        perishable={ROUTE_BY_PATH["/topics/work"]?.perishable}
      />

      <MechanicAnchor ids={["readout"]} />

      <h2 id="credentials">Credentials are access tokens</h2>
      <p>
        A credential carries two kinds of value — the real capability it may represent, and the signal it
        sends to someone deciding whether to look at you at all. Entry tends to run on credential plus
        referral, in that order of screening and the reverse order of effectiveness: the credential gets
        you past the filter, the referral gets you the job. Some crowded roads stay correct anyway,
        because their value never depended on scarcity — a licence for a regulated profession still opens
        the door however many people hold one. But where value <em>did</em> depend on scarcity,
        inflation is real: the degree that once distinguished now merely qualifies.
      </p>

      <h2 id="unwritten-local-rules">The unwritten local rules</h2>
      <ul>
        <li>
          <strong>The org chart describes reporting, not influence.</strong> The real map is who can get
          a decision reversed — usually learnable by watching whose objections cause meetings to be
          rescheduled.
        </li>
        <li>
          <strong>A performance review is a budget document written in the language of feedback.</strong>{" "}
          The distribution of ratings is often fixed before anyone is assessed, which does not make the
          feedback false so much as non-diagnostic about you in particular.
        </li>
        <li>
          <strong>Surprise is the thing managers are actually punished for.</strong> Most of what is
          called &ldquo;managing up&rdquo; is simply never being the reason your manager was surprised in
          front of their manager.
        </li>
        <li>
          <strong>&ldquo;We&rsquo;re like a family here&rdquo; predicts worse severance, not better.</strong>{" "}
          Families do not have notice periods.
        </li>
      </ul>
      {/* N-139 — the part natives cannot enumerate because they run it on
          autopilot, which is exactly why it never gets written down and costs
          the most to learn slowly. */}
      <p>
        Two more are worth stating because they are the ones nobody says out loud. Almost every workplace
        has one person the chart undersells — not the most senior, but the one whose absence stops
        several things at once, usually because they hold context nobody wrote down. Finding out who that
        is, in your first month, is worth more than reading the handbook. And a complaint travels upward
        as information about the complainer at least as much as about the complaint, which is unjust and
        is also simply how the channel works: the person receiving it learns one new thing about the
        subject and one new thing about you. That is not an argument for silence. It is an argument for
        knowing the price before you pay it, and for choosing which complaints are worth it.
      </p>
      {/* N-140 — the marked lens switch, applied. Its home is the health guide. */}
      <p>
        And one switch worth marking, because it happens without an announcement: your employer is a
        place you work — colleagues, a craft, somewhere to be — right up to the moment it becomes a
        counterparty with its own incentives, which is usually a severance conversation, a grievance, or
        a contract. Both descriptions are true; only one of them is true at a time, and reading the
        second situation with the first one’s assumptions is expensive.{" "}
        <Link href="/topics/health#two-roles">The same switch, and how to notice it</Link>, is on the
        health guide, where the clearest case lives.
      </p>

      <h2 id="standing">Standing does not leave the building</h2>
      <p>
        The most valuable thing most workers own — credibility, the belief that your estimates are true —
        is entirely non-portable. It resets to zero at the boundary of the organisation. Knowing that the
        reset is structural, and not a sudden onset of incompetence, is what stops a capable person from
        concluding they have gone bad in the first six months of a new job. It is also why credibility is
        worth building before visibility: credibility buys attention reliably, and attention does not buy
        credibility at all, so spending the second before you have the first just makes it more expensive.
      </p>
      <p>
        A related trap is legibility. An organisation can see shipped work with your name on it and
        decisions attributed to you; it cannot see the escalation you defused, the outage that did not
        happen, or the colleague who did not quit because you talked to them on a Thursday. That work is
        real, load-bearing, invisible at review, and unevenly distributed — which turns an accounting
        problem into an equity one. Exit is asymmetric for the same structural reason: the organisation
        can end the relationship in an afternoon, and you generally cannot, because your side needs a next
        position that takes months. Slack is what flattens that asymmetry.
      </p>
      {/* N-280 (§3.11, C-45) — THE STRUCTURAL-CHANGE MOVE, at the point of use.
          Everything above this line describes conditions set above the reader's
          pay grade and then hands them personal moves, which is exactly where
          this frame's known break bites. Cited, not restated. */}
      <ModelBreak n={1}>
        Almost everything on this page is written as something you can do, because that is what this
        instrument can see. The invisible-work problem, the exit asymmetry and a workload set above
        your grade are not personal optimisation problems, and the moves that would actually change
        them &mdash; a union, a professional body, a regulator, a law &mdash; are ones nobody makes
        alone. Where that is the real answer, no amount of individual strategy substitutes for it,
        and a page that implied otherwise would be selling you your environment as your discipline.
      </ModelBreak>
      {/* N-116 — the model that generates the non-portability above, rather than
          just asserting it. One structural idea covering staleness, the reset,
          the invalidation asymmetry, and why an audience is not a network. */}
      <p>
        The reason the reset is structural becomes obvious once you stop thinking of a reputation as
        something you have. It is not a quantity attached to you; it is a set of copies held in other
        people’s heads, each written at whatever moment they last paid attention, and updated only when
        that person meets new evidence or hears from somebody who has. You have no write access to any of
        them. Four things follow immediately. <strong>Every copy is stale,</strong> which is why somebody
        who has genuinely changed keeps meeting the old version of themselves in other people’s
        expectations — the change has to be re-transmitted, not merely made.{" "}
        <strong>The copies do not travel.</strong> Cross an organisation or a border and there are no
        copies there at all — not bad ones, none — so every claim now needs evidence attached.{" "}
        <strong>Damage propagates faster than repair,</strong> because one vivid negative event updates
        many copies at once and positive evidence updates them one at a time. And{" "}
        <strong>most entries are written by third parties</strong> rather than from direct evidence, which
        means the people who talk about you shape more of it than the people who know you.
      </p>
      <p>
        This is also what separates an audience from a network. An audience is a large number of thin,
        stale copies held by people with no reason to act; a network is a small number of current ones
        held by people who might. They are different objects, they are acquired differently, and treating
        the first as though it were the second is the commonest disappointment in a career built online.
        The model describes how impressions travel — nothing more. It says nothing about whether any copy
        is accurate, and plenty of them are not.
      </p>

      <p>
        {/* N-136 — the personal-scale counterpart, whose home is the people guide. */}
        There is a matching effect on the social side, and it is the one people take personally: a
        capable adult moves to a new organisation and becomes, for a few months, socially clumsy — reading
        the room wrong with complete confidence, because the pattern library that was trained somewhere
        else keeps firing.{" "}
        <Link href="/topics/relationships#reading-a-room">Why that happens, and what retrains it.</Link>
      </p>

      <h2 id="the-meta">The meta, and why it degrades</h2>
      <p>
        <Term k="meta" define /> degrades by being followed: a popular strategy divides its returns among
        everyone running it. The crowding arrives in a recognisable order — the strategy gets a name, the
        name gets courses sold about it, and the courses get sold by people whose success came from
        selling courses; by then the returns have moved. What this does <em>not</em> license is reflexive
        contrarianism, which is just the second-most-crowded strategy wearing a leather jacket. The point
        is not to flee crowds but to price them. The two reliable exits from meta-chasing are strategies
        whose returns are internal — loving the work itself — and genuine comparative advantage: the
        intersection of what you specifically are, which no course can teach and no crowd can arbitrage
        away.
      </p>
      <Callout tone="quiet" title="Dated advice is versioned, not wrong">
        <p>
          Your parents&rsquo; strategy guide is not foolish so much as versioned — well-meant documentation
          of a patch that no longer runs. &ldquo;Walk in and ask for the manager&rdquo; was real advice,
          once, on a version where managers hired people. Each piece of inherited advice is a durable rule
          wrapped in a dated tactic: ask what rule made it true, check whether the rule still binds (rules
          mostly do), then re-derive the tactic for the current version. Discarding the tactic is hygiene;
          discarding the rule with it is how each generation pays full price to relearn the same lesson.
        </p>
        <p className="staleness-line">
          <StalenessStamp date="2026-08" /> — the specific examples on this page are dated on purpose,
          because a meta page without a date is a claim pretending not to have an expiry.
        </p>
      </Callout>

      {/* N-124 — three shapes, because setting the wrong expectation is what makes
          people conclude they are bad at something a few weeks in. */}
      <h2 id="learning-curves">Three shapes of a learning curve</h2>
      <p>
        &ldquo;Steep learning curve&rdquo; usually just means hard. The shape matters far more than the
        steepness, because it sets what the first few weeks are supposed to feel like.{" "}
        <strong>Front-loaded:</strong> fast early gains, then a long slow refinement — cooking, driving,
        conversational language, most practical skills. A modest investment gets you most of the useful
        part, and for a skill that serves something else that is genuinely enough.{" "}
        <strong>Threshold:</strong> nothing visible happens for a long time while foundations go in, and
        then it accelerates — reading music, an unfamiliar writing system, a whole new field.{" "}
        <strong>Step-function:</strong> flat stretches broken by sudden jumps, with the flat parts doing
        the structural work that makes the next jump possible.
      </p>
      <p>
        The common error is quitting during a threshold curve’s slow start, having read the absence of
        progress as evidence the thing does not respond to effort. It is the same error in a
        step-function’s plateau. Both are worth knowing before you start rather than after you stop.
        And skills compound: one that connects to what you already know is worth more than its face value,
        so what to learn next is better answered by &ldquo;what does this connect to&rdquo; than by
        &ldquo;what is most useful on its own&rdquo;. Note which part of this is reversible and which is
        not — stopping is entirely reversible, and the months are not, which is the real argument for
        finding out the shape early.
      </p>

      {/* N-137 — the correction most adults never explicitly make. */}
      <h2 id="the-schools-rules">The school’s rules that do not generalise</h2>
      <p>
        School teaches a set of rules by structure rather than by instruction, and they are local. That
        effort is assessed: it is there, and almost nowhere afterwards, where outcomes and visible
        artefacts are assessed and much of the effort is invisible. That work arrives from an authority,
        with a specified standard and a deadline: adult work usually has to be defined before it can be
        done, which is why people who were excellent at school so often find the transition harder than
        people who were not. That the criteria are published and honoured: rarely true elsewhere, where
        written criteria describe a decision rather than make it. That asking for help is a concession:
        structurally reinforced by individual assessment, and one of the more expensive habits to unlearn.
        And that your cohort is your comparison set: a fixed group of the same age, ranked continuously,
        which is not how any later setting works at all.
      </p>
      <p>
        None of that was a lie. It was accurate for one place, and the transition out is where most people
        first discover that the rules were local rather than general —{" "}
        <strong>which is the cheapest available fix for &ldquo;I was excellent there and I am struggling
        here&rdquo;.</strong>
      </p>

      <h2 id="changing-direction">Changing direction is not starting over</h2>
      <p>
        A career change is not a return to level one; your base stats come with you. What transfers almost
        fully are the operating-system capabilities — how you learn, how you handle stress, how you
        communicate, how you think about a problem — which is why an experienced person changing fields is
        dramatically faster than a true beginner. What does not transfer cleanly is domain-specific
        knowledge, institutional relationships, credentials tied to the old field, and — most painfully —
        the status and recognition you had earned. So the real questions are which of your skills transfer,
        and what the change costs, denominated in time, income during the gap, the energy of learning while
        carrying an identity change, and social capital that has to be rebuilt.
      </p>
      <p>
        Not every dissatisfaction is a signal to change: boredom can be a plateau, exhaustion can be broken
        energy management, restlessness can be a local-maximum problem where the way up first requires a
        step down. But sometimes the signal is real — a values mismatch that will not resolve, a ceiling
        that is structural rather than personal. The most reliable tell that a decision is being made by the
        past rather than the future is sunk cost. The question underneath all of it is whether the cost of
        staying now exceeds the cost of changing, and that calculation is personal.
      </p>

      {/* N-150 (C-42) — the cost of a change of direction is the clearest case
          on this guide of a move whose price is set by position, not by will. */}
      <PositionNote
        notes={{
          yes: "With a floor beneath a serious failure, a change of direction is a bounded experiment: the gap year of lower income is survivable, so the honest question is the one above — whether the cost of staying exceeds the cost of changing — and you get to answer it on the merits. That is a genuinely unusual position to be in, and it is worth knowing you are in it before reading anyone's advice about courage.",
          no: "Without a floor beneath a serious failure, the gap is the whole problem, and advice to just make the leap is written for somebody else's circumstances. The version that works from here is the overlapping one: build the new capability while the old income continues, get the first paid piece of the new work before leaving the old, and treat every month of overlap as buying down a risk you cannot afford to carry outright. Slower is not more timid; it is the same move, financed differently.",
          unsure: "How expensive a change of direction is depends far more on whether there is a floor beneath a serious failure than on how transferable your skills are. It decides whether the gap is an inconvenience or a cliff, so it is worth settling before weighing anything on this page.",
        }}
      />

      <MentorNote provenance="experiential-pattern">
        <p>
          &ldquo;I&rsquo;m a doctor&rdquo; is not only a job description; it is an answer to the question of
          who you are. When you change direction, you lose that answer before you have found a new one, and
          the hardest part of the change is almost never the tactics — it is the stretch in between, which
          is real, is not counted anywhere, and is worth planning for rather than being ambushed by.
        </p>
      </MentorNote>

      <NextSteps>
        <NextStep href="/situations/job-loss" relation="see-also" why="If the change of direction was not yours to make, the clocks come first.">If the change was not your choice.</NextStep>
        <NextStep href="/map/credential-decision" relation="precedes" why="The fork that comes before a career, with its costs set by your own position.">Choosing a first credential path.</NextStep>
        <NextStep href="/topics/money" relation="requires" why="A change of direction needs a runway, and that is where the runway is worked out.">The runway that makes a change survivable.</NextStep>
        <NextStep href="/history" relation="explains" why="How the rules of work have been rewritten before, and what that says about the current set.">How the rules of work have been rewritten before.</NextStep>
      </NextSteps>

      {/* N-235. A link at the end of the page, never above the fold and never
          a nudge. Never on a set-down route (C-24). */}
      <TryInPlay href="/play/campaign">the campaign runs twelve years of these tradeoffs under a budget that does not stretch.</TryInPlay>

      <SingleHomeNote />

      <EvidenceDrawer
        record={{
          status: "editorial",
          scope: "General workplace mechanics; specific instances are dated and go stale.",
          lastReviewed: "2026-08-26",
          whatWouldChange:
            "The direction of claims like 'internal raises lag external offers' is well attested; the magnitude varies by sector and period and is not stated as a number. Every dated instance here is meant to be re-checked, not trusted indefinitely.",
          whereThisFrameFails:
            "Framing careers as individual strategy underplays how much of the outcome is set by the labour market and by who you were when you started.",
        }}
      />
    </ReadingPage>
  );
}
