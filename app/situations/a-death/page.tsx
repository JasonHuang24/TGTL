import type { Metadata } from "next";
import Link from "next/link";
import { SetDownNotice } from "@/components/SetDownNotice";

export const metadata: Metadata = {
  title: "When someone has died",
  description:
    "The logistics of the first days, held apart from the grief, so almost nothing has to be decided today.",
};

/**
 * A death — logistics of the first days (blueprint §5.6). Donors: Fable 5
 * bestiary/death (72-hour window, do-not-decide list, funeral-pricing
 * protection) + Claude-family recently-bereaved (frozen estate funds,
 * reciprocity timer, delegation by named task). Plain prose; set-down. Flagged
 * for clinical review (§5.5, §15.3).
 */
export default function ADeathPage() {
  return (
    <article className="prose-page is-setdown">
      <SetDownNotice />
      <h1>When someone has died</h1>
      <p className="threshold-lede">
        Someone has died, and you are the one holding the phone. Here is the sentence that most needs
        saying first: almost nothing has to be decided today. Nearly everyone who will pressure you
        otherwise in the coming days is either mistaken or selling something. The grief has its own
        page; this one holds only the logistics, so that one can be about you.
      </p>

      <h2>The first days</h2>
      <p>
        If the death was at home and unexpected, the first call is emergency services; someone
        official has to pronounce it, and they will tell you what happens next. After that, a funeral
        home handles the transport — you do not have to solve that tonight or ever.
      </p>
      <p>
        Then the telling, where order matters more than speed. The people who should not learn this
        from a post come first, and you are allowed to deputize: each person you call can call
        others, and the ones who love you will ask to. You do not have to make every call yourself,
        and you do not have to be composed on any of them. Nothing goes online until the inner circle
        knows.
      </p>
      <p>
        Two administrative facts that are somehow never told to people in advance. First, order more
        copies of the death certificate than seems reasonable — banks, insurers, utilities, and
        registrars each want an original, and running out mid-process is a misery that a larger
        initial order simply deletes. Second, funeral pricing is more regulated than the showroom
        implies: in the US, homes must give prices over the phone and provide an itemized list. Bring
        one person to the arrangement meeting whose only job is to care about the prices, because you
        are currently in the worst negotiating condition of your life, and it is, among other things,
        a sales floor.
      </p>

      <h2>What only pretends to be urgent</h2>
      <p>
        The service does not have to happen this week. The belongings do not have to be sorted this
        month. The question of what they would have wanted does not have to be answered perfectly,
        because it cannot be. The estate has real deadlines, but very few of them fall in the first
        weeks; the paperwork will still be there when your hands are steadier, and it will go better
        then.
      </p>

      <h2>The do-not-decide list</h2>
      <p>
        While the ground is still moving, try not to: sell or move out of the house, distribute the
        belongings, accept any offer with money inside it, or make graveside promises you will be held
        to for decades — &ldquo;we&rsquo;ll never sell the cottage&rdquo; is a sentence that outlives
        its moment by thirty years. Judgement about large, irreversible things is unreliable for a
        while, and almost none of them get worse for waiting a fortnight.
      </p>

      <h2>One money trap, because it is common and almost never anticipated</h2>
      <p>
        It is common for funds to be frozen in an estate while bills keep arriving in the
        deceased&rsquo;s name, so a household can be technically solvent and practically unable to pay
        for anything for weeks. Knowing the trap is structural, and not a failure on your part, is
        most of what helps — that, and asking creditors for time in writing early rather than late.
      </p>

      <h2>Let people help, by task</h2>
      <p>
        Eat. Let people bring food. The ones who say &ldquo;anything you need&rdquo; mean it and
        cannot think of anything either; give them tasks — the airport run, the dog, the printer.
        Being helped is how they are surviving this too. Most of the administrative work does not
        require you specifically, and people who have offered are usually far more willing to take a
        named job than to be told there is nothing they can do. One more thing worth knowing: offers
        of help are numerous in the first fortnight and largely gone by the second month, so asking
        early is both easier and more welcome than asking late.
      </p>

      <p className="crisis-note">
        If you are struggling to stay safe, you do not have to read anything first.{" "}
        <Link href="/threshold">Here are phone numbers.</Link>
      </p>

      <nav className="next-steps" aria-label="Where this connects">
        <h2>Where this connects</h2>
        <ul>
          <li>
            <Link href="/situations/grief">The grief itself, held on its own page.</Link>
          </li>
          <li>
            <Link href="/threshold">
              Bereavement lines, including some you can call when nothing in particular is happening.
            </Link>
          </li>
          <li>
            <Link href="/threshold/supporting-someone">If you are supporting someone bereaved.</Link>
          </li>
        </ul>
      </nav>
    </article>
  );
}
