import type { Metadata } from "next";
import { ReadingPage, PageHeader, CrisisNote } from "@/components/primitives";
import { SetDownNotice } from "@/components/SetDownNotice";

export const metadata: Metadata = {
  title: "Getting through today",
  description: "Six ordinary things, and permission to stop reading. Nothing else here is for you tonight.",
};

/**
 * N-023 (6.0 §3.1, §3.3, C-28) — REGISTER ZERO.
 *
 * Every other page on this site is written for somebody with a little capacity to
 * spend on thinking about their situation. This one is for the evening when there
 * is none, and its content is that reading the rest of the site is not a use of
 * what is left. It is intensity "down", so it joins SETDOWN_ROUTES by derivation
 * and inherits the quiet nav, the vocabulary lint, double-Escape and the ban on a
 * play entry without any of them being hand-listed.
 *
 * WHAT IS DELIBERATELY ABSENT, and what C-28 asserts: no evidence drawer, no
 * onward routing block, no analytical vocabulary, and no link to any instrument
 * above the first heading. A page that tells a depleted reader to stop, and then
 * offers them six more things to open, has not told them to stop.
 *
 * Under two hundred and fifty words, and that is a ceiling rather than a target.
 */
export default function GettingThroughTodayPage() {
  return (
    <ReadingPage setDown>
      <SetDownNotice />
      <PageHeader
        title="Getting through today"
        intro="Sometimes there is nothing larger to do, and doing nothing larger is right. This page is short on purpose."
      />

      <h2 id="what-is-worth-doing">What is worth doing when there is nothing left</h2>
      <ul className="today-list">
        <li>
          <strong>Eat something, and drink water.</strong> Unglamorous, and it changes the next few
          hours more than any thinking will.
        </li>
        <li>
          <strong>Sleep if you can.</strong> Whatever seems obvious at midnight will look different
          tomorrow, and not because anything will have changed.
        </li>
        <li>
          <strong>A shower, or clean clothes.</strong> One of the cheapest things on this list and one
          of the few that reliably works.
        </li>
        <li>
          <strong>Tell one person.</strong> Not for advice. So that one other human being is holding
          this too. It is the most protective thing here and the one people skip.
        </li>
        <li>
          <strong>Do the one thing that genuinely cannot wait until tomorrow</strong> — and only that
          one. Almost nothing else is actually today.
        </li>
        <li>
          <strong>Let something drop, deliberately.</strong> Something is going to. Choosing which is
          easier than finding out which.
        </li>
      </ul>

      <h2 id="and-then-stop">And then stop</h2>
      <p>
        That is the whole page. Nothing else on this site is for you right now. It will still be here
        next week, and none of it gets worse for being left.
      </p>
      <p>
        Getting through a day is not a failure to deal with the real thing. It is what is available,
        and stretches where nothing else is available are ordinary. They happen to capable people with
        good judgement, repeatedly.
      </p>

      <CrisisNote />
    </ReadingPage>
  );
}
