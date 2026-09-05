/**
 * Methodology content (blueprint §6.9). The corrections register format is live
 * from day one (G-12); the first entries are the build's own decisions. Known
 * breaks are seeded from the corpus (§6.9) and grown as breaks are found.
 */
import type { CorrectionEntry } from "./evidence";

/** The internal model in plain language (§3.4) — for the curious, one screen. */
export const INTERNAL_MODEL: { type: string; plain: string }[] = [
  { type: "Resources", plain: "what you have to spend — time, money, energy, attention, health, skill, standing, slack" },
  { type: "States / conditions", plain: "what condition you are in, which changes what everything else costs" },
  { type: "Skills", plain: "what you can reliably do, and how cheaply" },
  { type: "Relationships", plain: "the people around you, and what runs between you" },
  { type: "Environments / institutions", plain: "the systems you are inside — a labour market, a family, a bureaucracy" },
  { type: "Constraints", plain: "what is genuinely not movable, versus a wall you have not found the door in" },
  { type: "Goals / horizons", plain: "what you are aiming at, including the aims you never chose on purpose" },
  { type: "Moves", plain: "what you can actually do from where you stand, and what each costs" },
  { type: "Events", plain: "what happens to you that you did not choose" },
  { type: "Uncertainty", plain: "what you genuinely cannot know — kept separate from what you simply have not looked up" },
  { type: "Outcomes", plain: "how it turns out — which is a different object from the decision that preceded it" },
];

/** Known breaks in the model (§6.9). Public, honest, grown as breaks are found. */
export const KNOWN_BREAKS: { id: string; title: string; detail: string }[] = [
  {
    id: "no-collective-subject",
    title: "The frame has no collective subject",
    detail:
      "Every part of the model takes a single person as its subject. It has almost nothing to say about the things that only move when many people act together — a union, a movement, a polity — and it will quietly misfile a collective constraint as a personal one if you let it. Any advice that treats a structural obstacle as a private optimisation problem is making a promise the model cannot keep.",
  },
  {
    id: "navigation-not-destination",
    title: "It models navigation, not destination",
    detail:
      "The instrument is good at helping you see where you are and which moves are open. It is silent on where you should be going. It can lay out a decision; it cannot tell you what to want, and it does not generate a life worth wanting.",
  },
  {
    // NEW IN 5.0 (§6.3). Named because it is true of the timeline specifically and
    // no amount of labelling fully prevents it.
    id: "windows-read-as-schedule",
    title: "A timeline of windows can still be read as a schedule",
    detail:
      "The timeline shows windows — wide ranges that populations move through — and labels every one of them with what kind of thing it is, states that common is not required, and says at the top that being off the common path is not being behind. A reader under pressure will still, sometimes, read a row of ranges as a list of deadlines they are measured against. We have built against it with the kinds, the standing lines, the drawn ranges and the refusal to score anything. We do not claim to have solved it, and if the page ever reads that way to you, the page is wrong and not you.",
  },
  {
    id: "achievement-and-meaning",
    title: "Achievement does not produce meaning",
    detail:
      "A game rewards completion, and a strategy frame keeps pointing at stronger moves. But most of what makes a life feel worth living is not an achievement and does not sit on a progression curve, and the frame has no way to represent that — which is one reason there is no score anywhere on this site.",
  },
];

/** What's coming (§6.9) — the ONLY place unbuilt scope is named. */
export const WHATS_COMING: string[] = [
  "Archetype comparison and resemblance — seeing which patterns a situation resembles, with resemblance, prevalence, confidence, and viability kept firmly separate, and never used to assign anyone a destiny.",
  "Deeper integration between the daily plan and the upkeep list — so the maintenance you are tracking can flow into a realistic day, rather than the two living side by side.",
  "More eras of history, done to the same standard as the first — no gallery of promises.",
  "Era-play in the Playthrough — replaying the same hand under a different historical ruleset, so you can feel how much of an outcome was the patch and how much was the play. Named here, not yet built.",
  "Archetype resemblance at character creation — deferred behind the same research gate as archetype comparison; a hard start is never a destiny.",
  "Reader field reports and corrections — a way for people to send first-person accounts and flag errors, treated as primary sources. The record shape exists now; the submission path is deliberately not built yet.",
];

/** Corrections register (G-12). First entries are the build's own decisions. */
export const CORRECTIONS: CorrectionEntry[] = [
  {
    id: "cor-hotline-verified",
    date: "2026-09-04",
    kind: "source-change",
    summary: "Hotline numbers verified against their official sources; the launch gate below is closed.",
    detail:
      "Every number on the help-now page was checked on 2026-09-04 against the official page for that service, and every number held. Five of the source addresses recorded on 2026-08-26 had gone stale or never stated the number — a council-finder page for 999, a retired usa.gov page for 911, a retired EU page for 112, a federation site that does not print 116 123, and a bereavement filter that no longer exists — and each was replaced by the page that does state it: the NHS on 999, the National 911 Program, the EU’s own 112 page, the Commission decision that reserves 116 123 for emotional-support lines, and the directory’s grief-and-loss listing. The fixture now says verified, with the date.",
  },
  {
    id: "cor-hotline-verify",
    date: "2026-08-26",
    kind: "decision",
    summary: "Hotline numbers ship stamped “verify before launch.”",
    detail:
      "Every number on the help-now page is one of the widely published official lines, but this preview has not had each one independently re-verified against its official source with a sign-off. That verification is a launch gate. The page itself says plainly that numbers change and that findahelpline.com is maintained continuously while this page is not.",
  },
  {
    id: "cor-position-filter",
    date: "2026-08-26",
    kind: "decision",
    summary: "Position sensitivity is mostly inline; one interactive filter, on the credential page.",
    detail:
      "The strongest version of this site would let you set your position once and have every cost and risk note re-resolve everywhere. This build implements that as an interactive control on the credential-decision page, and as written-in position notes elsewhere. That is a recorded simplification, not the final shape.",
  },
  {
    id: "cor-history-scope",
    date: "2026-08-26",
    kind: "decision",
    summary: "History covers one era properly rather than many thinly.",
    detail:
      "The history section builds out industrialization as a single, complete example — a patch note and a before-and-after tier board — rather than a gallery of eras named but not written. More eras are listed above under what's coming.",
  },
  {
    id: "cor-engine-illustrative",
    date: "2026-08-26",
    kind: "engine-change",
    summary: "The simulator's weights are authored, and published in full above.",
    detail:
      "The Playthrough runs on internal weight and outcome tables — the Birth RNG's conditional structure, the difficulty bands, the resolution widths. Every one is authored, not measured, and none is claimed as researched. They are disclosed in readable form under “How the engine works,” so a rebalanced weight or a re-authored card is an auditable change, not a hidden one. This entry marks the category; specific rebalances will be logged here as they happen.",
  },
];
