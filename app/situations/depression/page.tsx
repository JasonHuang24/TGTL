import type { Metadata } from "next";
import Link from "next/link";
import { SetDownNotice } from "@/components/SetDownNotice";

export const metadata: Metadata = {
  title: "Depression",
  description:
    "Orientation, not treatment: depression corrupts your readouts of yourself, which is exactly why outside readings are the move.",
};

/**
 * Depression (blueprint §5.6). Donors: Fable 5 character/depression (the one
 * retained insight — depression corrupts your readouts, which is why outside
 * readings are the move; explains-not-treats) + Claude-family condition-
 * depression. OPENS with the §5.4 crisis note before any other content. Never
 * presents mental illness as a solo strategic challenge (§5.5); never the
 * donor's search-suggestion pattern. Flagged for clinical review (§5.5, §15.3).
 */
export default function DepressionPage() {
  return (
    <article className="prose-page is-setdown">
      <p className="crisis-note">
        If you are in danger right now, contact your local emergency services.{" "}
        <Link href="/threshold">Here are phone numbers.</Link> In the US, you can call or text 988.
        This page can wait.
      </p>

      <SetDownNotice />
      <h1>Depression</h1>
      <p className="threshold-lede">
        This page explains; it does not treat, and it does not present depression as a challenge you
        could meet with the right approach — that framing would add a failure to a person already
        unusually willing to believe they have failed. There is one idea worth keeping, stated plainly
        and then left alone.
      </p>

      <h2>The one thing worth keeping</h2>
      <p>
        Depression corrupts the readouts. It systematically misreports your worth, your odds, the
        interest of everything you used to care about, and how much you matter to the people who love
        you — and it delivers every one of these misreadings with total confidence, as perception
        rather than opinion. That is why self-assessment under depression cannot be trusted, and why
        the move is outside your own instruments: other people, and professionals. Not because you are
        weak. Because your gauges are compromised, and no pilot flies on instruments known to be
        lying.
      </p>

      <h2>Onset</h2>
      <p>
        Sometimes it follows something — a loss, an illness, a long depletion — and sometimes it
        arrives without any reason a biography could supply. The second case deserves saying plainly,
        because people in it often spend their remaining strength hunting for a justification, or
        concluding that an unexplained misery must be a verdict on their character. It is not.
        Depression is a condition, not a conclusion; it can settle on a life that &ldquo;should&rdquo;
        be happy, and frequently does. Onset is usually gradual — less an event than a dimming — which
        is part of why the person inside is so often the last to date its beginning.
      </p>

      <h2>What it changes</h2>
      <p>
        Sleep, appetite, and energy, in either direction. Concentration — reading a page and holding
        none of it. A flattening in which things simply do not taste of anything. Time thickens; small
        tasks acquire impossible mass; the future shortens until it is hard to picture at all. And
        because it changes the readouts, it changes behaviour toward the exact people and activities
        that would help, by reporting them as pointless. Isolation is not a preference the condition
        reveals; it is a symptom the condition manufactures, and it feeds the condition that made it.
      </p>

      <h2>Duration, and one specific lie</h2>
      <p>
        For most people depression is episodic — it has arrived, and it can recede — and it is among
        the most treatable serious conditions there is, by several different routes, though finding
        the right one can take honest iteration. The condition reports otherwise. It presents itself
        as permanent, as the truth about you finally seen clearly, as how things simply are. That
        report comes from the corrupted instrument. It is the same misreading as the rest, and it has
        been wrong about a great many people who were certain it was right about them.
      </p>

      <h2>What description can honestly offer</h2>
      <p>
        Shrink the day to what can be done, and count what was done rather than what was not — under
        this condition, showering can be the whole day&rsquo;s work, and it counts. Tell one person
        the truth about how it actually is; secrecy is the condition&rsquo;s preferred habitat. Let
        external readings outvote internal ones — if the people who know you insist the situation is
        better than it looks from inside, they are reading undamaged instruments; borrow them. Make no
        large decisions on corrupted readouts. And see a professional — a doctor or a therapist — not
        as a last resort but as the standard move, the way you would for any other condition that
        changes sleep, appetite, and cognition for weeks. If cost or access is the obstacle, say that
        to a professional too; routes exist that people inside the condition are badly positioned to
        find alone.
      </p>

      <nav className="next-steps" aria-label="Where this connects">
        <h2>Where this connects</h2>
        <ul>
          <li>
            <Link href="/threshold">If it is worse than that, or you are unsure — the numbers.</Link>
          </li>
          <li>
            <Link href="/situations/grief">If a loss is underneath it.</Link>
          </li>
          <li>
            <Link href="/threshold/supporting-someone">If you are supporting someone through it.</Link>
          </li>
        </ul>
      </nav>
    </article>
  );
}
