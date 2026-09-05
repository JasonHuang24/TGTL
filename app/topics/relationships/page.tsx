import type { Metadata } from "next";
import {
  ReadingPage,
  PageHeader,
  Callout,
  MentorNote,
  EvidenceDrawer,
  NextSteps,
  NextStep,
  TryInPlay,
} from "@/components/primitives";
import Link from "next/link";
import { Term } from "@/components/Term";
import { MechanicAnchor } from "@/components/reference/MechanicAnchor";
import { SingleHomeNote } from "@/components/SingleHomeNote";
import { ROUTE_BY_PATH } from "@/content/routes";

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
        systems={ROUTE_BY_PATH["/topics/relationships"]?.systems}
      />

      <MechanicAnchor ids={["party"]} />

      <h2 id="trust">Trust is slow to build and fast to spend</h2>
      <p>
        Trust is collateral accumulated from kept promises: each one raises what others will stake on
        you, and a single betrayal converts a lot of it back into doubt. It rebuilds, but on worse terms
        than the original — which is the honest version. Knowing the asymmetry is most of what stops
        people from spending years of accumulated goodwill in an afternoon and expecting it to refill on
        schedule.
      </p>
      {/* N-116, the boundary clause. The cache model is a good account of a
          reputation and a poor account of a close relationship, and saying where
          it stops is what keeps it from being applied everywhere. */}
      <p>
        It is worth separating this from a reputation, which behaves differently and is explained{" "}
        <Link href="/topics/work#standing">where standing is explained</Link>. A reputation is a set of copies
        other people hold, most of them written from hearsay and all of them stale. Trust between two
        people who actually see each other is not a copy: it is updated continuously, from direct
        evidence, by someone who will notice within a week if you have changed. That is why repair works
        at close range and rarely works at a distance, and why the strategies for managing a reputation
        are the wrong strategies for a friendship.
      </p>

      <h2 id="repair">Repair is its own operation</h2>
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

      <h2 id="load">Load, and the untallied ledger</h2>
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
      {/* N-119 — the mechanism under the section above, and under the ask-craft
          below: one rule paying for two things this page already asserts. The
          donor's "across every culture yet measured" is SOFTENED here to what
          the site can honestly say without a source, and labelled our judgement
          in the drawer rather than dressed as a finding. */}
      <p>
        Underneath all of that is a rule so ordinary it is easy to miss. A favour received creates a pull
        toward returning it — uninvited as readily as invited, wanted as readily as not — and the pull
        works below deliberation, wherever anyone has looked for it. The strange and important property is
        that <strong>this ledger is not supposed to balance.</strong> Open balances running in both
        directions are what closeness is made of: I owe you a dinner, you owe me a favour, neither of us is
        counting and both of us are counting.
      </p>
      <p>
        Which is why paying somebody back immediately and exactly reads as coldness bordering on insult.
        Settlement closes the account, and closing the account is how relationships end. The rule runs on
        flow, not on settlement — and that is the same fact underneath both halves of this page: why exact
        fairness between two people is a partnership already winding itself up, and why a well-made ask
        <em>strengthens</em> a bond rather than taxing it. The ask opens a balance, the balance creates
        future traffic, and the traffic is the friendship.
      </p>
      <p>
        Two limits worth stating. The pull is a force and not a contract: some people take and keep
        taking, and the only enforcement available is your willingness to stop extending credit — which is
        the rule telling you something rather than the rule failing. And institutions feel none of it. A
        company registers your loyalty as a retention statistic, not as a debt, so extending person-rules
        to an organisation is a reliable way to be quietly farmed.
      </p>

      <h2 id="asking-for-help">Asking for help is a skill</h2>
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
      {/* N-130 — the missing HOW. The trunk names asking as a skill and makes it
          a free move; the trainable core was never stated. */}
      <p>
        The trainable core is <strong>specificity</strong>, and it is close to the whole of the craft.
        &ldquo;Do you know anyone who has done this specific thing?&rdquo; hands the other person a
        completable action — they either do or they do not, and either way they are finished in a minute.
        &ldquo;Keep me in mind&rdquo; hands them a standing obligation with no end and no way to discharge
        it, which is why it is the ask everybody sends and the ask nothing comes back from. Script it
        before you make it; the script is the practice. Ask early, while the ask is still small and the
        answer can still change your route, rather than at the point where only a rescue would help.
      </p>
      <p>
        And it decays fastest in exactly the people who most need it: the competent one, the strong one,
        the one others lean on. Every promotion, every year of seniority, every caring role raises the felt
        cost of asking — which is backwards, since the stakes those roles carry make an outside view more
        valuable rather than less.
      </p>

      {/* N-131 — the carve. Four objects with different rules, and most bad
          advice about love is one object's rules aimed at another. */}
      <h2 id="four-things-called-love">Four different things called love</h2>
      <p>
        One word is doing four jobs, and they behave nothing like each other. <strong>The search</strong>{" "}
        is <Term k="quest" define />: it has a next move, it responds to effort and to where you spend your
        time, and it can be gone about well or badly. <strong>The falling</strong> is an event — it happens
        to you, it is not an achievement, and it is not evidence about anything except that it happened.{" "}
        <strong>The being-in</strong> is a condition: it changes how everything else looks while it lasts,
        and it is not sustained by trying harder. <strong>The building</strong> is the long shared project,
        which is the only one of the four that runs on the things the rest of this page is about —
        repair, an untallied ledger, load that has to be divided.
      </p>
      <p>
        Most bad advice about love is one kind&rsquo;s rules aimed at another: search tactics offered to
        someone in a condition, event-hunger applied to a decade-long build, or the build&rsquo;s patience
        recommended to somebody who has not started the search. Sorting which of the four you are actually
        in is usually more useful than any advice about any of them.
      </p>

      {/* N-136 — a widely felt experience usually attributed to personal decline.
          The home of this mechanism; /topics/work links here. */}
      <h2 id="reading-a-room">Reading a room is a local skill</h2>
      <p>
        What a skilled reader of a room is extracting is not, mostly, emotions. It is the group&rsquo;s
        local rule set: who defers to whom, which subjects are live and which are closed, whether
        disagreement is said out loud or expressed by silence, what a request looks like here, and whether
        &ldquo;we should do that sometime&rdquo; is a plan or a courtesy. It is the same object a workplace
        calls its unwritten rules, learned in twenty minutes rather than written down.
      </p>
      <p>
        Its defining property is that the pattern library is <em>local</em>. Move country, industry, class
        setting or generation and the inferences keep firing at full confidence and are now wrong — which
        is worse than having no skill at all, because the wrongness is invisible from inside. That is the
        mechanism under one of the most reported and least anticipated experiences there is: a competent
        adult moves, and becomes socially clumsy overnight, and concludes something has happened to them.
        Nothing has. A local cache was invalidated at a boundary. What retrains it is exposure plus
        correction, in that order — a stated prediction, then watching what actually happened. Exposure on
        its own trains confidence rather than accuracy, because the room almost never tells you when you
        have misread it.
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
        <NextStep href="/situations/being-hurt" relation="protects" why="None of this page applies where the person you would ask is the source of the danger.">If a relationship has become controlling or unsafe.</NextStep>
        <NextStep href="/situations/a-death" relation="see-also" why="When the load described here is care at the end of a life.">If the load is care at the end of a life.</NextStep>
        <NextStep href="/character/board" relation="unlocks" why="Lays out who is actually around you, rather than who you assume is.">Lay out who is actually around you.</NextStep>
      </NextSteps>

      {/* N-235. A link at the end of the page, never above the fold and never
          a nudge. Never on a set-down route (C-24). */}
      <TryInPlay href="/play/campaign">the campaign has people in it who can refuse, drift and leave, and no way to command any of it.</TryInPlay>

      <SingleHomeNote />

      <EvidenceDrawer
        record={{
          status: "editorial",
          lastReviewed: "2026-08-26",
          whatWouldChange:
            "These are patterns people repeatedly report, synthesised — not measured relationship outcomes. Any claim about how often repair succeeds, or how relationships end, would need its own evidence and is not asserted here. The reciprocity rule in particular is stated as 'wherever it has been looked for' rather than as a universal finding: the stronger claim would need a survey of the cross-cultural work, which this version has not done, and no figure is given for any of it.",
          whereThisFrameFails:
            "Treating repair as a skill can quietly imply that any rupture is repairable with enough craft, which is false where the pattern is control, contempt, or fear — there the operation does not apply.",
        }}
      />
    </ReadingPage>
  );
}
