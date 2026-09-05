import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "If you are trying to help someone",
  description:
    "Ask directly, keep your help unconditional, and remember you are not the risk assessor. Where the cases differ.",
};

/**
 * Supporting someone (blueprint §5.1b). Adapted closely from Opus 5's
 * supporting-someone donor. Set-down in full; the §5.5 prohibitions apply
 * explicitly. Flagged for specialist domestic-abuse / crisis review before
 * public launch (§5.5, §15.3).
 */
export default function SupportingSomeonePage() {
  return (
    <article className="prose-page is-setdown">
      <p className="crisis-note">
        If it is urgent, the numbers are on <Link href="/threshold">the help-now page</Link>. Several
        of those lines will talk to you about someone else, not only about yourself.
      </p>

      <h1>If you are trying to help someone</h1>
      <p className="threshold-lede">
        Short, because you are probably reading this in a hurry. The first part applies whatever is
        happening. The last part is where the cases differ.
      </p>

      <h2>A few things that hold in every case</h2>
      <p>
        <strong>Ask directly.</strong> If you think someone may be considering suicide, ask them
        plainly. The belief that asking increases the risk is widespread and wrong, and acting on it
        is one of the more costly folk beliefs there is. The question does not plant the idea.
      </p>
      <p>
        <strong>Do not make your help conditional on their decision.</strong> Support that is
        withdrawn if they stay, or keep using, or do not do the recommended thing, is not support —
        and the moment it is withdrawn is the moment they stop telling you anything. Being the person
        who still knows is worth more than being the person who was right.
      </p>
      <p>
        <strong>Make specific offers, not general ones.</strong> &ldquo;Tell me if you need
        anything&rdquo; produces nothing. &ldquo;I can take Wednesday evenings&rdquo; or
        &ldquo;I&rsquo;ll drive you and wait outside&rdquo; produces Wednesdays and a lift. It is the
        single highest-yield change in how most people offer help.
      </p>
      <p>
        <strong>You are not the risk assessor.</strong> Specialist services do that, with training
        and information you do not have. Calling one to ask how to help someone is a normal and
        intended use of them.
      </p>
      <p>
        <strong>Presence is not the same as advice,</strong> and it is frequently the thing that
        mattered — sitting with someone, doing something practical, being in the room without an
        agenda.
      </p>
      <p>
        <strong>Your own upkeep is the arrangement&rsquo;s infrastructure.</strong> If you break,
        their situation gets worse too. You cannot hold someone up from underwater. Protecting your
        own capacity is not a claim you are making against them.
      </p>

      <h2>One thing not to do</h2>
      <p>
        Do not do their thinking for them out loud. People in difficulty are usually being told what
        their situation means by everyone around them, and the effect is that they stop describing it
        accurately — to you, and eventually to themselves. Asking what it is like is more useful than
        explaining what it is.
      </p>

      <h2>Where the cases differ</h2>
      <p>
        <strong>If they may be in immediate danger from themselves.</strong> Try not to leave them
        alone, and do not agree to keep it secret from everyone — you can promise to tell them who
        you are telling, which is a promise you can keep. If there are pills, a weapon, or a specific
        means they have mentioned, it is reasonable and helpful to ask whether they will let you hold
        it or move it for now. Reducing access to a specific method is one of the better-supported
        things a person who is not a professional can do. Then call a line, with them or for advice.
      </p>
      <p>
        <strong>If someone is being controlled or hurt by a partner.</strong> Do not tell them to
        leave, and do not confront the other person. The risk of serious violence rises around the
        period of separation, so leaving is not automatically the safe option and pushing it can move
        a timetable they were managing. What helps: staying in contact; saying once, plainly, that
        what is happening is not normal and not their fault; keeping a dated note of what you are
        told; and knowing the number of a specialist service before it is needed. If they go back, do
        not treat that as the end of your involvement — most people leave more than once.{" "}
        <Link href="/situations/being-hurt">The page written for them is here.</Link>
      </p>
      <p>
        <strong>If someone has died.</strong> Most support arrives in the first fortnight and then
        stops, which is the opposite of what is needed. Put a date in your calendar for six weeks,
        six months, and the anniversary. Use the dead person&rsquo;s name; people avoid it and the
        avoidance is felt. Do not measure how they are doing against any schedule.
      </p>

      <nav className="next-steps" aria-label="Where this connects">
        <h2>Where this connects</h2>
        <ul>
          <li>
            <Link href="/threshold">The numbers, grouped by what is happening.</Link>
          </li>
          <li>
            <Link href="/situations/grief">If the person is grieving.</Link>
          </li>
          <li>
            <Link href="/situations/being-hurt">If the person is being controlled or hurt.</Link>
          </li>
        </ul>
      </nav>
    </article>
  );
}
