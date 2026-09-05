import type { Metadata } from "next";
import Link from "next/link";
import { SetDownNotice } from "@/components/SetDownNotice";

export const metadata: Metadata = {
  title: "When someone is hurting or controlling you",
  description:
    "Information, not instructions. Nothing here is conditional on what you decide, and nothing pushes you toward a move that can raise the danger.",
};

/**
 * Being hurt / coercive control (blueprint §5.6). Primary donor: Opus 5
 * partner-controlling-me, adapted nearly whole. Set-down; carries the quick-exit
 * control (§5.3, wired in SiteChrome). Never advises negotiation, disclosure,
 * joint counseling, or compliance where it can raise danger (§5.5).
 * Position-aware. Flagged for specialist domestic-abuse review (§5.5, §15.3).
 */
export default function BeingHurtPage() {
  return (
    <article className="prose-page is-setdown">
      <SetDownNotice />
      <h1>When someone you live with is controlling or hurting you</h1>
      <p className="threshold-lede">
        You do not have to have decided anything to read this. You do not have to be planning to
        leave. Nothing here is conditional on what you choose. What follows is information. What you do
        with it is yours.
      </p>

      <h2>Why this page is only information</h2>
      <p>
        The rest of this guide is organised around what a person could do. Here, that framing is not
        just unhelpful; it is dangerous. &ldquo;You have options, use them&rdquo; lands as pressure,
        lands as blame, and when acted on quickly and without preparation it can raise the risk of
        serious harm. So the framing is switched off. No analysis of your situation, no categories, no
        instructions.
      </p>

      <h2>Things that are true, and that people are often not told</h2>
      <p>
        <strong>Leaving is the most dangerous period, not the safe ending.</strong> The risk of severe
        violence rises around separation. That is a reason to plan carefully with someone who knows
        how, not a reason to stay, and not a reason to move quickly on your own.
      </p>
      <p>
        <strong>It does not have to be physical to be dangerous.</strong> Control of money, documents,
        transport, your phone, and who you are allowed to see is a recognised pattern. In several
        places it is a criminal offence in itself.
      </p>
      <p>
        <strong>Everything you would need in order to leave is often the exact thing that has been
        taken away.</strong> Money, ID, a car, friends who would notice, a private phone. That is not
        incidental. It is how the pattern works, and it means the difficulty is structural rather than
        a failure of resolve.
      </p>
      <p>
        <strong>Going back is common and is not failure.</strong> Most people who eventually leave,
        leave more than once. The returns are part of how it usually goes, not evidence against it.
      </p>
      <p>
        <strong>It is not your fault,</strong> and that sentence is doing more work than it sounds
        like. Being told repeatedly that you cause it is a component of the pattern, not an observation
        about you. And you are allowed to want it to stop without wanting them gone; those are
        different wants, and help does not require you to choose between them today.
      </p>

      <h2>What is worth having, whatever you decide</h2>
      <p>None of this commits you to anything.</p>
      <ul>
        <li>
          <strong>One person outside who knows.</strong> Not to advise you — just so that one other
          human holds the information. Isolation is the condition all of this depends on.
        </li>
        <li>
          <strong>A record, kept somewhere they cannot reach.</strong> Dates, what happened,
          photographs if there is anything to photograph. It matters later, in every direction things
          might go, and it is almost impossible to reconstruct afterward.
        </li>
        <li>
          <strong>Copies of documents.</strong> ID, immigration papers, birth certificates for
          children, bank details, prescriptions — held elsewhere or with someone.
        </li>
        <li>
          <strong>A conversation with a specialist service.</strong> They do risk assessment, which is
          a real skill and not something a website can do. Talking to one commits you to nothing at
          all, including to talking to them again.
        </li>
        <li>
          <strong>A safer-browsing habit.</strong> Private windows, clearing history, using a
          friend&rsquo;s phone. Most domestic-abuse services have a page on this and it is worth ten
          minutes.
        </li>
      </ul>

      <h2>What changes everything, and only you can see</h2>
      <p>
        Children, money, and immigration status change the whole picture — what is safe, what is
        possible, and how fast anything can move. A plan that fits one person is reckless for another,
        which is exactly why the one recommendation here is a specialist service that can assess your
        situation rather than a stranger writing for everyone at once.
      </p>

      <h2>If you are not going to leave</h2>
      <p>
        Then you should still have accurate information, and it should not come with a lecture
        attached. Help that is conditional on you making the recommended decision is not help; it is a
        transaction. Keeping the records and the copies, holding one outside contact, and knowing a
        specialist number before it is needed are all worth having whether or not you ever act on
        them.
      </p>

      <h2>What this page cannot do</h2>
      <p>
        It cannot assess your situation. Nothing written in advance for everybody can, and how much
        danger a specific person is in depends on things a page does not know. That is what specialist
        services are for, and it is the one recommendation here worth making twice. It also does not
        know where you are; the numbers are grouped by country on the help-now page, with an
        international directory.
      </p>

      <nav className="next-steps" aria-label="Where this connects">
        <h2>Where this connects</h2>
        <ul>
          <li>
            <Link href="/threshold">
              The numbers, including domestic-abuse lines and a note on browsing where a screen may be
              watched.
            </Link>
          </li>
          <li>
            <Link href="/threshold/supporting-someone">
              If you are the one trying to help someone in this.
            </Link>
          </li>
        </ul>
      </nav>
    </article>
  );
}
