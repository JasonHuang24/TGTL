import type { Metadata } from "next";
import Link from "next/link";
import { ReadingPage, PageHeader, Callout } from "@/components/primitives";
import { WalkthroughMechanics } from "@/components/reference/WalkthroughMechanics";

export const metadata: Metadata = {
  title: "Learn the game",
  description:
    "The staged manual: the three ways to play, the half-year loop, the controls, the mechanics indexed with their pictures, and the advanced metagame.",
};

/**
 * The walkthrough (blueprint 3.0 §6.2) — three tiers, visual-first, modelled on
 * how real game walkthroughs are read: basics skimmed by everyone, advanced read
 * when the player knows enough to have questions. Nothing is locked; this only
 * stages the *default* sequencing.
 */
export default function WalkthroughPage() {
  return (
    <ReadingPage>
      <PageHeader
        eyebrow="The walkthrough"
        title="Learn the game"
        intro="Like any good walkthrough: the basics up top for everyone, the mechanics in the middle, and the metagame at the end for when you've played enough to have questions. You never have to read it to play — the run teaches as you go — but it's here when you want to know why."
      />

      {/* ---- Basics ---- */}
      <section className="wt-tier" id="basics">
        <h2>Basics</h2>
        <p>
          There are three ways to play, and they run on one engine. <strong>A Whole Life</strong> is the
          short one: a single life from before its start to its close, in eight acts, in about twenty
          minutes — the recommended first play, because it shows you the whole shape.{" "}
          <strong>Launch Window</strong> is the long one: twelve years, ages eighteen to thirty, in
          twenty-four half-year turns you allocate yourself. <strong>The Decision Lab</strong> is neither —
          it is one decision, played both ways, so you can see what actually separated the two.
        </p>
        <p>
          All three begin the same way: you say what would make it a good life <em>by your own lights</em>,
          because the package ships with no win condition — and then a starting position is dealt to you
          that you did not choose. What it makes expensive is shown to you axis by axis. There is no
          overall grade, because a life is not one number and this instrument refuses to pretend otherwise.
        </p>
        <p>
          Every choice sets a <em>range</em> of outcomes, and then a draw lands somewhere inside it. That
          split — the move you make versus the luck you draw — is shown every time, and it is the whole
          lesson: you can play well and still land badly.
        </p>

        <p>
          Underneath all three sits the reading layer, and the part of it that runs alongside a played
          life is <Link href="/timeline">the timeline</Link>: every year from birth to one hundred, with
          what commonly runs through it in a real population, each age traced to a source we fetched and
          quoted. It is not a schedule and nothing on it is a target.
        </p>

        <h3 id="the-season-loop">The half-year loop</h3>
        <p>
          The long campaign runs on one loop, twenty-four times. It is worth knowing before you start,
          because the loop <em>is</em> the game:
        </p>
        <ol className="wt-loop">
          <li>
            <strong>Where things stand</strong> — what is pressing, what is going unmet, and what you have
            already set in motion that has not landed yet.
          </li>
          <li>
            <strong>What you are aiming at</strong> — shown, and revisable. Changing it is recorded as
            adaptation, which is what it is.
          </li>
          <li>
            <strong>Allocate</strong> — the heart of it. You have a limited budget of time, energy and
            money for this half-year, and an open menu of things you could do with it. Two to four things
            is a full turn. Every yes spends something and delays something else.
          </li>
          <li>
            <strong>Resolve</strong> — your choices land, in a fixed order, mixed in with whatever arrived
            on its own. Life happening <em>to</em> you and you happening <em>to</em> life, in the same turn.
          </li>
          <li>
            <strong>Consequences</strong> — what changed now, and what has been queued to land later, with
            the half-year it lands in named.
          </li>
          <li>
            <strong>Why this happened</strong> — the factors that actually went into it, computed rather
            than narrated, with a way through to the reading behind it.
          </li>
          <li>
            <strong>Adapt</strong> — carry on, recover, change what you are aiming at, ask for help, or
            branch and try the other line.
          </li>
        </ol>
        <p>
          Three things are free and available in <em>every</em> half-year of every campaign, whatever state
          you are in: <strong>rest and maintain</strong>, <strong>wait</strong>, and{" "}
          <strong>ask someone for help</strong>. Resting is a real move with a real effect, not a skipped
          turn. Asking is a normal strategic option, not a last resort. That is a promise the test suite
          checks against every turn of several hundred simulated runs, including ones deliberately started
          with nothing left.
        </p>

        <h3>The controls</h3>
        <p>
          The whole game is played with these, and it teaches them by encounter — you do not need to learn
          them first:
        </p>
        <ul className="controls-list">
          <li>
            <strong>Choose</strong> — pick an option.
          </li>
          <li>
            <strong>Resolve</strong> — confirm, and watch the draw land on the range.
          </li>
          <li>
            <strong>Why this happened</strong> — open what was behind an outcome. Optional, never blocking.
          </li>
          <li>
            <strong>Skip this beat</strong> — on the quiet, scripted parts, always available and always
            first.
          </li>
          <li>
            <strong>Pause &amp; exit</strong> — leave any time; it waits indefinitely, and says so.
          </li>
          <li>
            <strong>Allocate</strong> — spend the half-year&rsquo;s budget across what you choose to do
            with it. (Campaign.)
          </li>
          <li>
            <strong>Adapt</strong> — revise what you are aiming at, at any turn boundary. (Campaign.)
          </li>
          <li>
            <strong>Branch</strong> — fork from here into a second line. The run you branched from is
            untouched and still playable. (Campaign and Lab.)
          </li>
          <li>
            <strong>Inspect</strong> — look at what is pending and at the years walked so far. (Campaign.)
          </li>
          <li>
            <strong>Name and resume a save</strong> — keep runs on this device, see the seed and the
            version each was made with, and delete any of them completely. (Campaign.)
          </li>
        </ul>
        <Callout tone="quiet">
          You can stop any time. Nothing you do is recorded off this device, nothing is scored about you,
          and the help pages are in the header of every screen — including mid-run.
        </Callout>
        <p>
          <Link href="/play" className="wt-cta">
            Three ways to play &rarr;
          </Link>
        </p>
      </section>

      {/* ---- Playing well ---- */}
      <section className="wt-tier" id="playing-well">
        <h2>Playing well</h2>
        <p>
          Seven mechanics carry almost everything. The run introduces them one at a time; here they are
          together, each with its picture, one paragraph, and the door to where it&rsquo;s explained in
          full. The topic page is always the real home — this is the one-screen version.
        </p>
        <WalkthroughMechanics />
      </section>

      {/* ---- Advanced ---- */}
      <section className="wt-tier" id="advanced">
        <h2>Advanced — the metagame</h2>
        <p>
          Late-game knowledge, for when the basics are second nature:
        </p>
        <ul className="advanced-list">
          <li>
            <strong>Position math.</strong> The same move costs differently from a different start; a floor
            beneath failure turns a ruin tail into a bounded experiment. The{" "}
            <Link href="/map/credential-decision">credential fork</Link> lets you set a position and watch
            the costs re-resolve.
          </li>
          <li>
            <strong>Metas and crowding.</strong> Popular strategies degrade by being popular; dated advice
            is often accurate documentation of a previous patch. See{" "}
            <Link href="/topics/work">education and career</Link>.
          </li>
          <li>
            <strong>Era thinking.</strong> The ruleset itself gets rewritten over time — what a patch did
            to a position is not a measure of the people in it. See{" "}
            <Link href="/history">history and change</Link>.
          </li>
          <li>
            <strong>The aims audit.</strong> People revise what they&rsquo;re aiming at; the run asks you
            mid-life whether you still hold the goal you chose. Doing it on purpose beats doing it by drift.
          </li>
          <li>
            <strong>Where this frame fails.</strong> The game metaphor strains in real places — it has no
            collective subject, it models navigation not destination, and achievement does not produce
            meaning. The honest list lives on{" "}
            <Link href="/methodology#known-breaks">the methodology page</Link>, not hidden.
          </li>
        </ul>
      </section>
    </ReadingPage>
  );
}
