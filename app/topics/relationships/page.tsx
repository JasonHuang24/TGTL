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
import { MechanicAnchor } from "@/components/reference/MechanicAnchor";

export const metadata: Metadata = {
  title: "The people around you",
  description:
    "Trust built slowly and spent fast, repair that turns on changed behaviour, asking for help as a skill, and the load of care.",
};

/**
 * Topic — Relationships / the party (§6.7, ~1,000 words). Donors: Claude-family
 * player-repair + player-siblings, Fable 5 repair, Opus 5 moves-ask. The
 * symmetric-knowledge test is the page's ethic. "No other person is an NPC" is
 * rendered fresh, grounded in "their own board you cannot see" (not attributed).
 */
export default function RelationshipsPage() {
  return (
    <ReadingPage>
      <PageHeader
        eyebrow="Topic · relationships"
        title="The people around you"
        intro="Almost nothing you want is reachable without other people, and none of them are scenery. Everyone you meet is running a full life of their own, in which you are, at most, a supporting character — and whose situation you can never fully see. Most of what follows is about acting well inside that fact."
      />

      <MechanicAnchor ids={["party"]} />

      <h2>Trust is slow to build and fast to spend</h2>
      <p>
        Trust is collateral accumulated from kept promises: each one raises what others will stake on
        you, and a single betrayal converts a lot of it back into doubt. It rebuilds, but on worse terms
        than the original — which is the honest version. Knowing the asymmetry is most of what stops
        people from spending years of accumulated goodwill in an afternoon and expecting it to refill on
        schedule.
      </p>

      <h2>Repair is its own operation</h2>
      <p>
        Repair is not an apology, not a compromise, and not a negotiation, and confusing it with any of
        them is the usual way it fails. Negotiation assumes a divisible surplus and partly-opposed
        interests; repair assumes a shared thing that has been damaged and interests that are aligned.
        Run negotiation on a rupture and you convert a partner into a counterparty, which the other
        person feels instantly. The tell: after a good negotiation, both sides feel they got a reasonable
        deal; after a good repair, nobody is thinking about the deal.
      </p>
      <p>What repair actually consists of:</p>
      <ul>
        <li>
          <strong>Acknowledge the effect, not the intent.</strong> Defending what you meant is the most
          common failed move. &ldquo;I&rsquo;m sorry you felt that way&rdquo; names the feeling and
          disowns the effect, and the other person&rsquo;s ledger records it correctly even when they
          can&rsquo;t say why it made things worse.
        </li>
        <li>
          <strong>Change the mechanism, not just the outcome.</strong> Restitution addresses what
          happened; preventing a repeat means visibly changing the thing that produced the harm.
          Restitution without a changed mechanism is prepayment for the next incident, and they know it.
        </li>
        <li>
          <strong>Turn toward the attempt.</strong> What usually needs repairing is a chain of small
          failures to reconnect, and accepting a clumsy attempt does more than making a polished one.
        </li>
        <li>
          <strong>Time before content.</strong> Nothing useful is said while flooded. A pause with a
          stated return is a repair move; a pause without one reads as an exit.
        </li>
      </ul>
      <p>
        The part you do not control is the rebuild rate. The hurt person, not you, is the judge of when
        the matter closes, and asking to be forgiven on schedule is itself a fresh withdrawal — it makes
        your repair a demand that they manage your discomfort. Do the work, then stop performing the
        work. Some bonds close anyway; that can happen to an honest person who repaired well, and doing
        it well still matters, because of who it makes you for every relationship after this one.
      </p>

      <Callout tone="warm" title="The test that runs the whole page">
        <p>
          None of this works unless both people could know it. A repair move performed as a manipulation
          is not a repair move; its entire effect comes from being sincere. The honest check on anything
          here is simple: it should not embarrass you if the other person read it too. A page about a
          family imbalance that only worked as ammunition for one side would be a manipulation guide with
          a respectable subject.
        </p>
      </Callout>

      <h2>Load, and the untallied ledger</h2>
      <p>
        Where people share the care of someone — an ageing parent, a child, a household — the load
        distributes by proximity, availability, and disposition, not by agreement: whoever lives
        nearest or notices first does the most, a little at a time. Then two things run in parallel. The
        near person accumulates a silent tally, because families run on an untallied ledger and saying a
        number out loud is itself felt as a violation. The far person has no visibility of a load made of
        small unremarkable events nobody reports, and calibrates from the highlights. Both accounts are
        honest. The resentment is produced by the ledger rule, not by anyone&rsquo;s conduct — which is
        why it so often surfaces at an estate, the first time the accounting is made explicit and
        enforced.
      </p>
      <p>
        What helps: make the load visible before it is contested — a shared written record, offered as
        information rather than accusation, because most distant contributors revise once they see the
        actual list, and the near one usually wants the load acknowledged more than halved. Name the
        operation — acknowledgement before renegotiating the split; an offer of help that skips the
        acknowledgement frequently makes things worse. Ask for specific substitutions: &ldquo;help
        more&rdquo; cannot be acted on, but &ldquo;take the Tuesday appointments&rdquo; or &ldquo;handle
        the finances entirely&rdquo; can, and distance is no obstacle to the second. And aim for a split
        both people explicitly agree to, which is a different and more reachable target than a fair one.
      </p>

      <h2>Asking for help is a skill</h2>
      <p>
        Its binding constraint is almost never logistical, and almost all the folk wisdom about it is
        about phrasing, which is the smaller variable. Who you ask dominates how you ask: a polished
        request to someone with no discretion, resource, or interest returns nothing, while a clumsy
        request to someone who has the thing and is inclined to give it usually works. So the first move
        is finding who actually holds what you need — often a named role rather than the person you were
        routed to. A refusal is information about the person asked — their capacity, their constraints —
        not a verdict on whether you deserved the thing. And people reliably over-estimate the burden a
        modest request imposes, so the arithmetic favours asking more often than most of us do.
      </p>

      <MentorNote provenance="experiential-pattern">
        <p>
          The people who turn out to matter are rarely the ones who found the right words. They are the
          ones who stayed through the awkwardness — who kept turning up after the first rush, who could be
          in the room without an agenda. An apology without changed behaviour has a short shelf life; the
          quiet, repeated turning-up does not.
        </p>
      </MentorNote>

      <p className="topic-position-note">
        <strong>Where this does not apply.</strong> Someone with no family, a network dismantled by an
        abuser, or a recent arrival somewhere does not have a thin version of &ldquo;ask for help&rdquo;
        — they have none of it, and the real content is institutional and mutual-aid routes. And for
        anyone who is routinely disbelieved, a refusal is often about credibility rather than capacity,
        and &ldquo;a refusal is just information&rdquo; becomes false comfort; what they need is a
        witness, a document, or a different person to ask. None of this applies where the person you
        would ask is the source of the danger.
      </p>

      <NextSteps>
        <NextStep href="/situations/being-hurt">If a relationship has become controlling or unsafe.</NextStep>
        <NextStep href="/situations/a-death">If the load is care at the end of a life.</NextStep>
        <NextStep href="/character/board">Lay out who is actually around you.</NextStep>
      </NextSteps>

      <EvidenceDrawer
        record={{
          status: "editorial",
          lastReviewed: "2026-08-26",
          whatWouldChange:
            "These are patterns people repeatedly report, synthesised — not measured relationship outcomes. Any claim about how often repair succeeds, or how relationships end, would need its own evidence and is not asserted here.",
          whereThisFrameFails:
            "Treating repair as a skill can quietly imply that any rupture is repairable with enough craft, which is false where the pattern is control, contempt, or fear — there the operation does not apply.",
        }}
      />
    </ReadingPage>
  );
}
