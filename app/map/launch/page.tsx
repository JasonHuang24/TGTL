import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "The launch years",
  description:
    "Roughly your late teens to late twenties: agency rising, resources gated, what compounds and what doesn't, and why a later launch is still a launch.",
};

/**
 * Deep stage — the launch years (§6.3, ~1,400 words). Donors: Claude-family
 * new-graduate, Opus 5 board/layout-new-graduate. Variance doctrine stated in
 * full. The floor question is the hinge. No milestone ages beyond the broad
 * window named in the intro; no statistics.
 */
export default function LaunchPage() {
  return (
    <ReadingPage>
      <PageHeader
        eyebrow="Deep stage · the launch years"
        title="The launch years"
        intro="The stretch, roughly from your late teens to your late twenties, when you first run your own life. Its defining feature is not scarcity of any one thing. It is that you are holding more open options than you ever will again, with less information than you will ever have about which of them is yours — and that combination is the whole shape of the stage."
        status="editorial"
      />

      <h2>The most valuable thing you hold is the one you can&rsquo;t see as valuable</h2>
      <p>
        Time is abundant here and almost everything else is not — and time is experienced as emptiness,
        as an absence of structure, rather than as a non-renewable, compounding resource. So it gets
        spent on whatever is nearest, and spending it on nothing in particular does not feel like
        spending anything. That is the central trap of the stage: the most valuable holding you have is
        the one you are least equipped to perceive as valuable.
      </p>
      <p>
        Agency is genuinely rising — you can make more of your own moves than at any earlier point — but
        it is still strongly gated by resources and institutions, and needing help here is ordinary
        interdependence, not failure. The unusual thing about the position, if you laid it out, is that
        no part of it is at zero. Every row has something in it; several are crowded. The problem is not
        that anything is missing. It is that the board cannot yet be read.
      </p>

      <h2>Several of your resources are borrowed, and read as owned</h2>
      <p>
        Much of what you are running on at this stage is a loan you have mistaken for a possession.
        Standing comes from an institution and a family; it is real and it is on loan, and it can be
        withdrawn by a change in someone else&rsquo;s circumstances or opinion. <Term k="slack" define />{" "}
        is often family-provided and therefore conditional. Your skill has been certified but not yet
        tested — and the certificate and the capability are different assets, with a gap between them
        that is invisible from inside. Even your relationships, dense as they are, tend to be weak on the
        one dimension that will matter soon: they are mostly the same age as you, so nobody in the network
        can open a door yet.
      </p>
      <p>
        This is also why referrals and weak ties dominate here more than they will later. The credential
        certifies eligibility, not ability; it screens rather than trains; and employers, holding only
        thin proxies for what you can do, lean on who will vouch for you. Reputation, for now, is
        essentially empty — not damaged, absent — which means every claim you make currently requires
        evidence you may not have had a chance to build.
      </p>

      <h2>What compounds, and what only feels permanent</h2>
      <p>
        Because the runway ahead is the longest you will ever have, the highest-return moves are the ones
        whose payoff compounds over decades: the skill you build now and the relationships you actually
        invest in. Positions you take at this stage are weighted more heavily than they feel in the
        moment — and they are not determinative. That last clause matters, because the reverse belief does
        real damage.
      </p>
      <p>
        First jobs, first cities, first fields feel like verdicts and are mostly cheap to undo. Reversibility
        is the dominant mechanic here, and most decisions are considerably cheaper to reverse than they
        feel. The genuine irreversibilities at this stage are narrow and specific — debt, dependents, and
        health — and they attract far less deliberation than the job title does, which is close to exactly
        backwards.
      </p>

      <Callout tone="neutral" title="The doctrine that governs every outcome here">
        <p>
          <Term k="variance" caps /> — <Term k="variance" define />. Skill sets the distribution of
          outcomes; luck draws the result from it. Effort matters, and effort does not determine outcomes,
          and both halves are always true at once. Entering a labour market in a bad year has documented,
          persistent effects on lifetime earnings that then substantially fade — and none of it is a verdict
          on the people it happened to. A cohort that launched into a bad year will be told, and will tend
          to believe, that the result was about them. It was not. An outcome licenses no inference about the
          decision that preceded it — not upward, not downward, not about you, and not about the people you
          are comparing yourself to.
        </p>
      </Callout>

      <h2>How the whole thing changes with the floor beneath you</h2>
      <p>
        Almost everything above assumes something that is not evenly distributed: a floor beneath failure —
        family who could take you in, a fallback qualification, a country with a safety net. With a floor,
        the advice to keep options open and take cheap risks early is close to correct. Advice about taking
        risks early is written for readers with a floor, and it is close to malpractice for readers without
        one.
      </p>
      <p>
        For a graduate supporting a parent, repaying a family debt, holding a visa that requires continuous
        employment, or working two jobs to stay housed, the whole analysis inverts. The binding constraint
        is no longer information; it is <Term k="slack" />. The right move is not to preserve optionality;
        it is to stabilise the floor first, because a person without one cannot afford the experiments the
        stage is otherwise built for. Some readers, meanwhile, inherit standing that never expires because
        it was never the institution&rsquo;s to withdraw — and it is worth being honest with yourself about
        which of those you are, because the correct strategy is different for each.
      </p>

      <h2>If your launch is late, or went wrong</h2>
      <p>
        A paused route is not an abandoned one. Later training, bridge work, shared housing, community
        support, and changes of direction all remain legitimate, and a launch that happens later is still a
        launch. The stage is defined by the position — high options, low information, a long runway — not by
        an age, and people arrive at that position on very different timetables, for reasons that are mostly
        not about them.
      </p>

      <MentorNote provenance="editorial-synthesis">
        <p>
          The single row most worth auditing is the one people almost never look at: what you are actually
          aiming at. It tends to be overfull and unexamined — a career shape you mostly inherited, a version
          of financial independence you may be confusing with it, someone else&rsquo;s expectation (often
          whoever paid), a default life shape absorbed rather than chosen, and, with the least evidence and
          the lowest standing, something you actually want. The highest-leverage move of the stage is to
          audit that row. It is also where effort almost never goes.
        </p>
      </MentorNote>

      <NextSteps>
        <NextStep href="/map/credential-decision" relation="unlocks" why="The first big fork of this stage, with a position filter that re-resolves its costs.">The credential decision — the first big fork, with a position filter.</NextStep>
        <NextStep href="/topics/money" relation="explains" why="Why the floor question is really a question about the buffer underneath it.">Money and slack — why the floor question is really about the buffer.</NextStep>
        <NextStep href="/guidance" relation="unlocks" why="If you are standing at the fork now rather than reading about it.">Choosing a path — if you are standing at the fork now.</NextStep>
      </NextSteps>

      <EvidenceDrawer
        record={{
          status: "editorial",
          scope: "A historically recent, geographically narrow position, over-represented among readers of sites like this.",
          lastReviewed: "2026-08-26",
          whatWouldChange:
            "The central advice — keep options reversible, spend time on compounding assets — is nearly unfalsifiable and impossible to time precisely; followed too well it produces someone who arrives at the end of the stage with excellent optionality and nothing built. There is no principled account here of when optionality should be spent.",
          whereThisFrameFails:
            "The whole picture assumes a floor and a long runway that many readers do not have; for them the honest content is shorter, harder, and more about survival than about optionality.",
        }}
      />
    </ReadingPage>
  );
}
