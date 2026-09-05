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
} from "@/components/primitives";
import { Term } from "@/components/Term";
import { MechanicAnchor } from "@/components/reference/MechanicAnchor";

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
      />

      <MechanicAnchor ids={["readout"]} />

      <h2>Credentials are access tokens</h2>
      <p>
        A credential carries two kinds of value — the real capability it may represent, and the signal it
        sends to someone deciding whether to look at you at all. Entry tends to run on credential plus
        referral, in that order of screening and the reverse order of effectiveness: the credential gets
        you past the filter, the referral gets you the job. Some crowded roads stay correct anyway,
        because their value never depended on scarcity — a licence for a regulated profession still opens
        the door however many people hold one. But where value <em>did</em> depend on scarcity,
        inflation is real: the degree that once distinguished now merely qualifies.
      </p>

      <h2>The unwritten local rules</h2>
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

      <h2>Standing does not leave the building</h2>
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

      <h2>The meta, and why it degrades</h2>
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

      <h2>Changing direction is not starting over</h2>
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

      <MentorNote provenance="experiential-pattern">
        <p>
          &ldquo;I&rsquo;m a doctor&rdquo; is not only a job description; it is an answer to the question of
          who you are. When you change direction, you lose that answer before you have found a new one, and
          the hardest part of the change is almost never the tactics — it is the stretch in between, which
          is real, is not counted anywhere, and is worth planning for rather than being ambushed by.
        </p>
      </MentorNote>

      <NextSteps>
        <NextStep href="/situations/job-loss">If the change was not your choice.</NextStep>
        <NextStep href="/map/credential-decision">Choosing a first credential path.</NextStep>
        <NextStep href="/topics/money">The runway that makes a change survivable.</NextStep>
        <NextStep href="/history">How the rules of work have been rewritten before.</NextStep>
      </NextSteps>

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
