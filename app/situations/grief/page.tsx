import type { Metadata } from "next";
import Link from "next/link";
import { SetDownNotice } from "@/components/SetDownNotice";

export const metadata: Metadata = {
  title: "Grief and bereavement",
  description:
    "What grief is like, what is not true about it, what people report helped, and what a page cannot do.",
};

/**
 * Grief (blueprint §5.6). Primary donor: Claude-family condition-grieving;
 * secondary: Fable 5 grief imagery, Opus 5 states-grief (five-stages correction,
 * physical-vulnerability note). Set-down. Never implies grief has stages to
 * complete or a schedule to meet (§5.5). Flagged for clinical review (§5.5, §15.3).
 */
export default function GriefPage() {
  return (
    <article className="prose-page is-setdown">
      <SetDownNotice />
      <h1>Grief</h1>
      <p className="threshold-lede">
        Grief is not tangled and it is not obscure. It is exactly what it appears to be, and there is
        nothing in it that taking it apart would make clearer. So this page does not try to. It
        offers what people who have been through it report, in case any of it is useful, and it ends
        with the practical matters held somewhere else, so nothing here has to be read as a task.
      </p>

      <h2>What it is like</h2>
      <p>
        People who have been through it describe waves rather than a decline. Long stretches in which
        you are functional and even cheerful, interrupted without warning by something small — a jar
        they opened for you once, their handwriting on the back of an envelope, someone with the same
        walk crossing the road ahead of you. The intensity in those moments is not evidence that you
        are going backwards. It is the ordinary shape of the thing.
      </p>
      <p>
        The first year contains a series of firsts, and most people find the anticipation of each one
        worse than the day itself — the birthday, the anniversary, the first time you have to say it
        out loud to a stranger who asked a normal question.
      </p>
      <p>
        There are secondary losses that nobody warns you about, and they can be as heavy as the
        central one: the loss of the person who knew your history, the loss of the routine that was
        built around them, the loss of the role you had — someone&rsquo;s daughter, someone&rsquo;s
        husband — which has no obvious replacement and which other people cannot see is gone. And
        there is the administrative cruelty of it: the letters arriving in their name, the calls that
        require you to say the sentence again. It arrives during the worst weeks, not after them, and
        it is nobody&rsquo;s fault and still outrageous.
      </p>

      <h2>What is not true</h2>
      <p>
        That it comes in stages, in order, and that you can tell how you are doing by which one you
        are in. The five stages were drawn from work with dying patients rather than bereaved ones,
        and as an account of how mourning proceeds they are widely believed and not supported. Being
        assessed against a sequence that does not exist is a common and entirely unnecessary injury.
        There is no schedule you are behind on.
      </p>
      <p>
        That there is a correct duration. That it ends, in the sense of finishing — most people
        describe it as changing shape rather than concluding, becoming something you carry rather than
        something you are inside of. That being functional means you are over it, or that falling
        apart means you are not coping. That there is a way to do this well.
      </p>

      <h2>One physical thing, because people are rarely told it</h2>
      <p>
        You are more physically vulnerable than usual for a while; bereavement raises the risk of
        illness in the following year. This is not here to alarm you and there is nothing you need to
        do about it as such. It is here because people in this situation routinely treat looking
        after themselves as an optional extra, and this is the period when it is least optional. Eat
        something. Take the medication you were already taking. Let someone drive.
      </p>

      <h2>What people say helped</h2>
      <p>
        Not advice — just what gets reported. People who stayed: not the people who said the right
        thing, because there is no right thing, and the ones who tried hardest to find it were often
        the hardest to be around. The ones who helped were usually the ones who kept turning up after
        the first fortnight, when everyone else had gone back to their own lives.
      </p>
      <p>
        Specific help rather than open offers. &ldquo;Let me know if you need anything&rdquo; asks the
        bereaved person to do the work of asking; &ldquo;I&rsquo;m bringing dinner on Thursday and
        I&rsquo;ll leave it on the step if you don&rsquo;t want to talk&rdquo; does not. Eating
        something. Sleeping when it is available. Not deciding large, irreversible things this year if
        they can wait — selling the house, leaving the job, ending or beginning a relationship. And
        saying the person&rsquo;s name out loud, and hearing other people say it; many report the
        silence around the name as one of the worst parts, and that most people in their life are
        avoiding it out of a misplaced kindness.
      </p>

      <h2>What this page cannot do</h2>
      <p>
        Some of this is not fixable and will not be improved by anything written down. Saying so
        plainly seems more respectful than pretending otherwise. This is not a substitute for a doctor
        or a therapist, and grief that has stopped moving at all — months of being unable to function,
        or a conviction that it would be better not to be here — is worth taking to one, not because
        something is wrong with you but because that is what they are for.
      </p>
      <p className="crisis-note">
        If you are thinking about ending your life, please talk to someone today.{" "}
        <Link href="/threshold">Here are phone numbers.</Link> In the US, call or text 988.
      </p>

      <nav className="next-steps" aria-label="Where this connects">
        <h2>Where this connects</h2>
        <ul>
          <li>
            <Link href="/situations/a-death">
              The certificates, notifications, and estate are held separately, so nothing here has to
              read as a checklist.
            </Link>
          </li>
          <li>
            <Link href="/threshold/supporting-someone">If you are the one trying to help.</Link>
          </li>
          <li>
            <Link href="/threshold">If you need to talk to a person now.</Link>
          </li>
        </ul>
      </nav>
    </article>
  );
}
