import type { Metadata } from "next";
import {
  ReadingPage,
  PageHeader,
  Lede,
  Callout,
  EvidenceDrawer,
  NextSteps,
  NextStep,
  TryInPlay,
  NoWinner,
} from "@/components/primitives";
import Link from "next/link";
import { CredentialFilter } from "@/components/CredentialFilter";
import { MechanicAnchor } from "@/components/reference/MechanicAnchor";

export const metadata: Metadata = {
  title: "The credential decision",
  description:
    "College, trade, or work-first as a real decision structure: what each costs, when it pays, which choices lock, and the floor question only you can answer.",
};

/**
 * Deep branch — the credential decision (§6.3, ~1,200 words + the position
 * filter). Donors: Opus 5 doctor-or-music reasoning, Sol branch/consequence card
 * fields. Recommends nothing universally; demonstrates conditional recommendation
 * form. Carries the site's one interactive position filter.
 */
export default function CredentialDecisionPage() {
  return (
    <ReadingPage>
      <PageHeader
        eyebrow="Deep branch · a real decision"
        title="The credential decision"
        intro="College, a trade, or working first. The two standard answers — 'follow your passion' and 'be practical' — both work by picking a side and calling it wisdom. This page does something narrower: it names the facts that are actually decision-relevant, and then lets your own position resolve them."
        status="editorial"
      />

      {/* N-004 — position sensitivity in one sentence, at the head of the page
          whose whole argument is that the same move costs differently from a
          different start. The rest of this page is that sentence, slowly. */}
      <Lede>
        &ldquo;Just take the risk&rdquo; is sound advice for someone with a floor beneath failure and
        dangerous advice for someone without one. It is the same sentence either way, which is why
        advice about this decision is so often confidently wrong.
      </Lede>

      <MechanicAnchor ids={["position"]} />

      <h2 id="what-this-page-will-do">What this page will and will not do</h2>
      <p>
        It will not tell you which to want. That is not a dodge; it is a stated boundary. The model here
        can lay a decision out and show its structure, but it does not generate the aim behind it — what
        you value is yours to supply. What it can do is separate the three facts that most change the
        answer, and refuse to give you a confident recommendation that ignores the one thing only you know.
      </p>

      <h2 id="shapes">First fact: the shapes are different, and shape beats average</h2>
      <p>
        A steady credentialed path and a long-shot creative or entrepreneurial one are not the same bet at
        different volumes; they are differently shaped bets. The credentialed path has a high floor, a long
        lock-in, and low spread — its bad outcome is a career you find dull and a comfortable-enough life.
        The long-shot path has a brutal left tail where most of the probability actually sits: its typical
        outcome is not a modest version of success but no career of that kind at all. Comparing the averages
        of two shapes like that is close to meaningless. The right comparison is between the bad outcomes,
        because the bad outcome is what you are most likely to get.
      </p>

      <h2 id="reversibility">Second fact: reversibility runs opposite to how it feels</h2>
      <p>
        The &ldquo;safe&rdquo; credentialed path is the more locked-in one. It takes years, and each year
        raises the cost of leaving, because the sunk investment converts into identity. The &ldquo;risky&rdquo;
        path is, for the most part, not irreversible — a few years spent seriously on it cost those years and
        foreclose very little, except the age-graded entry window into the locked path, which is the one real
        asymmetry. Most people at the deciding age have this exactly backwards, and are being told so by
        everyone around them.
      </p>

      <Callout tone="neutral" title="Third fact: the floor question decides it, and only you can answer">
        <p>
          Is there a floor beneath failure — family who could take you in, a fallback qualification, a country
          with a safety net? With a floor, the low-probability path is a bounded experiment, and running it
          early is almost certainly right. Without a floor, the very same path has a ruin tail, and the identical
          advice becomes reckless. This is why generic advice is useless: it answers confidently without knowing
          the one thing that determines the answer. And because some outcomes remove you from the game entirely,
          survival dominates optimisation — much of what gets mistaken for cowardice here is just arithmetic.
        </p>
      </Callout>

      {/* N-094 — the rule the reversibility section above has always implied and
          never stated, put where a real one-way door is being considered. */}
      <p>
        Which gives the general rule, worth carrying past this page: apply rigour in proportion to how
        hard a decision is to undo. Spend the extra week, the third conversation and the question you are
        avoiding on the one-way doors; decide the two-way ones fast, because on those the deliberation
        costs more than the mistake would. Most people have this backwards, and agonise over the
        reversible choices while walking through the irreversible ones on momentum.
      </p>

      <p id="position">
        So set your position, and read each path&rsquo;s cost and risk note as it re-resolves. This is the
        one place the setting is made, and it changes every position note on the site. Nothing here is
        stored anywhere but this browser, and nothing is scored.
      </p>

      <CredentialFilter />

      {/* N-093 (C-41) — the comparison closes on the refusal, naming what each
          path emphasises rather than which is better. It renders after the
          paths, because a refusal placed anywhere else is a caption. */}
      <NoWinner
        sides={[
          {
            name: "College / university",
            emphasises:
              "a high floor and a durable signal, bought with years and often debt, spent up front and hardest to walk back once the sunk investment has converted into identity.",
          },
          {
            name: "Trade / apprenticeship",
            emphasises:
              "earning while learning and a skill that is hard to offshore, bought with a narrower field of entry and a longer-run dependence on the body holding up.",
          },
          {
            name: "Work first",
            emphasises:
              "immediate income and real information about what the work is actually like, bought by forgoing the ready-made network and by an entry window into credentialed paths that narrows with time.",
          },
        ]}
        note="The one thing that genuinely reorders them is not on this list: it is whether there is a floor beneath a serious failure, which is a fact about your position rather than about the paths."
      />

      {/* N-124 and N-137 — two one-line handoffs to mechanisms that belong on
          the work guide and are decision-relevant here. */}
      <p>
        Two things worth reading before you commit, both of which live on{" "}
        <Link href="/topics/work">the work guide</Link> rather than here. First,{" "}
        <Link href="/topics/work#learning-curves">what shape the learning curve is</Link>: a path whose
        early months feel like no progress at all may be a threshold curve rather than the wrong choice,
        and quitting in the flat part is the common and expensive error. Second,{" "}
        <Link href="/topics/work#the-schools-rules">which of school&rsquo;s rules do not generalise</Link>{" "}
        — effort is assessed there and almost nowhere afterwards, which changes what a credential is
        actually buying you.
      </p>

      <h2 id="the-part-about-your-family">The part about your family</h2>
      <p>
        This framing assumes the decision is yours to make. In many families it is not made alone, and describing
        it as an individual choice with an interfering audience misdescribes the situation — the audience may be
        a co-author, and pretending otherwise is its own kind of bad advice. It is also worth naming honestly that
        turning an identity question into a legible decision is a real loss: at the deciding age it does not feel
        like a choice between distribution shapes. It feels like a question about whether you are allowed to be who
        you are, and the analytical framing can read as not taking that seriously. It is meant to sit beside that
        question, not to replace it.
      </p>

      <NextSteps>
        <NextStep href="/map/launch" relation="see-also" why="The stage this decision sits inside, and what else is running at the same time.">The launch years — the stage this decision sits inside.</NextStep>
        <NextStep href="/topics/work" relation="explains" why="Credentials, standing and changing direction — the mechanisms this page is applying.">Education and career — credentials, standing, and changing direction.</NextStep>
        <NextStep href="/guidance" relation="unlocks" why="Turns the structure here into your decision, with your own objectives in it.">Choosing a path — lay out your own version of this decision.</NextStep>
      </NextSteps>

      {/* N-235. A link at the end of the page, never above the fold and never
          a nudge. Never on a set-down route (C-24). */}
      <TryInPlay href="/play/lab">the Decision Lab forks exactly this one and shows what separated the two branches.</TryInPlay>

      <EvidenceDrawer
        record={{
          status: "editorial",
          scope: "A decision structure, not a recommendation. The path notes are illustrative reasoning, not outcome data.",
          lastReviewed: "2026-08-26",
          whatWouldChange:
            "No path is endorsed and no probability is stated. What would change the notes is your own position, which the filter takes as input — and, for a real decision, local facts about specific programmes, costs, and labour markets that a page cannot hold.",
          whereThisFrameFails:
            "It assumes the chooser is an individual with a legible objective; for collectively-made decisions, or where the aim is an identity rather than an outcome, the decision-shaped framing describes only part of what is happening.",
        }}
      />
    </ReadingPage>
  );
}
