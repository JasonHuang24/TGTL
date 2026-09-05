/**
 * Methodology content (blueprint §6.9). The corrections register format is live
 * from day one (G-12); the first entries are the build's own decisions. Known
 * breaks are seeded from the corpus (§6.9) and grown as breaks are found.
 */
import type { CorrectionEntry, RetractionEntry } from "./evidence";
import type { RoutePath } from "./routes";

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

/**
 * N-281 (6.0 §3.11, §7.1, C-45) — THE DISANALOGY REGISTER.
 *
 * What used to be `KNOWN_BREAKS`: four honest paragraphs that nothing on the site
 * pointed at. Humility written once and never cited rots independently of the
 * pages it was about, and every page that strains the frame improvises its own
 * apology instead of inheriting one. So the list is numbered, anchored, and
 * INHERITED: a page that leans on a break carries a `ModelBreak` citing the entry
 * by number, and the entry names the pages that lean on it. C-45 asserts both
 * directions, so neither half can drift without the build noticing.
 *
 * Every existing entry's `detail` is carried VERBATIM. The four that were here
 * before are the four that shipped; nothing was tidied on the way through.
 *
 * SEVERITY is about where the failure lives, not how bad it feels:
 *   structural — the frame itself is wrong here, and better writing cannot fix it
 *   material   — the content and presentation decide how badly it bites
 *   edge       — it bites at a boundary this site has not reached yet
 *
 * STATUS is what we did about it:
 *   open      — no fix, and we would rather say so
 *   mitigated — built against, not solved
 *   accepted  — the cost of the position, and we are keeping it
 */
export type DisanalogyEntry = {
  /** The published number. Stable: pages cite it, and the anchor is `#break-n`. */
  n: number;
  id: string;
  title: string;
  detail: string;
  severity: "structural" | "material" | "edge";
  status: "open" | "mitigated" | "accepted";
  /** What would actually reduce it, where anything would. Absent is honest. */
  candidateFix?: string;
  /** Every route that leans on this break and cites it. Never empty (C-45). */
  inheritedBy: RoutePath[];
};

export const DISANALOGIES: DisanalogyEntry[] = [
  {
    n: 1,
    id: "no-collective-subject",
    title: "The frame has no collective subject",
    detail:
      "Every part of the model takes a single person as its subject. It has almost nothing to say about the things that only move when many people act together — a union, a movement, a polity — and it will quietly misfile a collective constraint as a personal one if you let it. Any advice that treats a structural obstacle as a private optimisation problem is making a promise the model cannot keep.",
    severity: "structural",
    status: "open",
    candidateFix:
      "Name the collective move wherever the personal one is the smaller half, as the work and burnout pages now do. That is a mitigation and not a fix: the frame would have to take a group as its subject to actually hold this, and that is a different instrument.",
    inheritedBy: ["/topics/work", "/situations/burnout", "/situations/job-loss"],
  },
  {
    n: 2,
    id: "no-respawn-no-pause",
    title: "There is no respawn, no pause, and no designer",
    detail:
      "A game is built by somebody, for somebody, to be winnable and to be fair enough to be worth playing. None of that is true here. Nobody balanced your starting hand, nothing guarantees a route out of where you are, and there is no difficulty setting anyone chose for you. You cannot pause while you think, you cannot reload the save from before, and the run is not a rehearsal for a later one. Everything the game vocabulary lends this site — the legibility, the separation of a decision from its outcome — it lends on the condition that you keep hold of this.",
    severity: "structural",
    status: "accepted",
    candidateFix:
      "None. It is the price of the whole vocabulary, and the only honest response is to say it out loud where the vocabulary is being taught.",
    inheritedBy: ["/walkthrough"],
  },
  {
    n: 3,
    id: "emotional-gap",
    title: "It is better at describing what to do than at understanding what you feel",
    detail:
      "The model is built out of resources, moves, costs and constraints, and those are the parts of a life it can actually hold. Feeling is in here only as something that changes what other things cost — which is a real part of the truth and nowhere near all of it. So a page can tell you what a fortnight of this will take out of you and lay out what is open; it cannot know what any of it is like from the inside, and it is not the thing that understands you. Where that is what you need, a person is the move, and this site says so rather than filling the gap with more structure.",
    severity: "structural",
    status: "open",
    candidateFix:
      "Nothing in the model closes it. What helps is keeping the routes to people short and unconditional, and refusing to let a well-organised page pass itself off as having been understood.",
    inheritedBy: ["/guidance"],
  },
  {
    n: 4,
    id: "coherence-illusion",
    title: "The map is tidy and the territory is not",
    detail:
      "Everything here is arranged: named mechanisms, four guides, ordered steps, a page for each situation. Real life arrives unsorted, several things at once, out of order, and mostly not matching any of the shapes. A well-organised site quietly implies that the underlying thing is well organised too, and that if your life does not fit the arrangement then the failure is yours. It is not. The tidiness is a property of the writing, chosen because unstructured writing is unreadable, and it is the single most misleading thing about the whole instrument.",
    severity: "structural",
    status: "mitigated",
    candidateFix:
      "Keep saying which pages are worked examples rather than descriptions, and keep writing the sections that admit a situation is not solvable, only navigable. Neither makes the arrangement less tidy than the life.",
    inheritedBy: ["/topics/concepts"],
  },
  {
    n: 5,
    id: "navigation-not-destination",
    title: "It models navigation, not destination",
    detail:
      "The instrument is good at helping you see where you are and which moves are open. It is silent on where you should be going. It can lay out a decision; it cannot tell you what to want, and it does not generate a life worth wanting.",
    severity: "structural",
    status: "accepted",
    candidateFix:
      "None wanted. An instrument that supplied the destination would be doing the one thing this site has decided it has no standing to do.",
    inheritedBy: ["/orientation"],
  },
  {
    n: 6,
    // NEW IN 5.0 (§6.3). Named because it is true of the timeline specifically and
    // no amount of labelling fully prevents it.
    id: "windows-read-as-schedule",
    title: "A timeline of windows can still be read as a schedule",
    detail:
      "The timeline shows windows — wide ranges that populations move through — and labels every one of them with what kind of thing it is, states that common is not required, and says at the top that being off the common path is not being behind. A reader under pressure will still, sometimes, read a row of ranges as a list of deadlines they are measured against. We have built against it with the kinds, the standing lines, the drawn ranges and the refusal to score anything. We do not claim to have solved it, and if the page ever reads that way to you, the page is wrong and not you.",
    severity: "material",
    status: "mitigated",
    candidateFix:
      "The kinds, the standing lines and the drawn ranges are the mitigation and they are already in place. What would actually move it is a reader telling us which page read as a deadline, which is what the corrections register is for.",
    inheritedBy: ["/map"],
  },
  {
    n: 7,
    id: "achievement-and-meaning",
    title: "Achievement does not produce meaning",
    detail:
      "A game rewards completion, and a strategy frame keeps pointing at stronger moves. But most of what makes a life feel worth living is not an achievement and does not sit on a progression curve, and the frame has no way to represent that — which is one reason there is no score anywhere on this site.",
    severity: "structural",
    status: "accepted",
    inheritedBy: ["/character"],
  },
  {
    n: 8,
    id: "compound-situations",
    title: "One thing at a time is the exception, and every page assumes it",
    detail:
      "The hard events here are written one to a page, because that is the only way to write them. Lives do not deliver them that way. A job goes at the same time as a parent gets ill and a relationship is failing, and the three are not three problems: each one takes the slack the others needed, and the moves that would work for any of them alone stop being available. Reading three of these pages does not add up to the page for that, and the arithmetic of the compound case — where the little that is left should go — is the part this site is least able to do for you.",
    severity: "material",
    status: "open",
    candidateFix:
      "The pressure reading is the nearest thing to an answer, because it asks which constraint is actually binding rather than which subject you are in. It is not the same as a page written for two shocks at once, and nobody should pretend it is.",
    inheritedBy: ["/situations"],
  },
  {
    n: 9,
    id: "instrument-risks",
    title: "The instruments here have their own failure modes",
    detail:
      "Each one can be read as the thing it was built not to be. A tier board ranks what a ruleset did to a position, and can be read as a ranking of the people in it, which is prejudice with a letter attached. Anything that says your situation resembles a pattern can be read the way a horoscope is read, as a description of you rather than of a shape. And laying a decision out with its costs makes some values legible and leaves others unstated, so an optimisation can quietly launder a choice about what matters into a calculation about what is efficient. The construction fights all three; none of them is fully closed by construction.",
    severity: "structural",
    status: "mitigated",
    candidateFix:
      "Keep the unit of every ranking stated above it, keep every resemblance unscored, and keep the objective visible above any ordering. All three are in place and all three depend on a reader actually reading them.",
    inheritedBy: ["/history"],
  },
  {
    n: 10,
    id: "self-generated-amendments",
    title: "Every correction here so far was written by the people who wrote the site",
    detail:
      "The corrections register, this register, and the list of open questions were all produced by the same hands that produced the pages. That is the weakest possible form of review: it can only catch the errors we are already capable of seeing, and a frame's worst failures are exactly the ones invisible from inside it. The professional reviews that would supply an outside reading are named as open gates rather than done, and the route for a reader to tell us we are wrong exists as a record shape and not yet as a working path. Until one of those changes, treat the self-critique as the beginning of the work.",
    severity: "structural",
    status: "open",
    candidateFix:
      "The two things that would actually change it are the outstanding professional reviews and a working correspondence path for readers. Both are named on this page; neither is finished.",
    inheritedBy: ["/methodology"],
  },
  {
    n: 11,
    // N-253 (§5.4), folded in from the hand-written section that used to sit beside
    // this list. A rule adopted before the thing it governs belongs in the register
    // with the rest of the humility, not in a section of its own next to it.
    id: "graphical-layer",
    title: "Rules adopted for a picture that does not exist yet",
    detail:
      "Nothing on this site is drawn. If a scene layer is ever built, these rules were adopted before it, so the first picture inherits them instead of arguing with them: a safety transition replaces the scene with calm, plain help and never animates damage or failure; health is shown through capacity, symptoms, support, access and accommodation, never through grotesque visuals; discrimination and systemic exclusion are never drawn as penalties attached to a person, because they are properties of a ruleset; parenthood and childlessness are never scored; appearance never determines worth; and colour never encodes a verdict. Writing them down now is the point — a rule adopted after the first picture is a rule argued against a picture someone has already made.",
    severity: "edge",
    status: "accepted",
    candidateFix:
      "Nothing to fix until something is drawn. The entry exists so that the day something is, the rules are older than the picture.",
    inheritedBy: ["/play"],
  },
];

/**
 * What's coming (§6.9) — the ONLY place unbuilt scope is named, and 6.0 §2.3.2
 * keeps that true: N-302's inline "planned" cards on the index pages are GENERATED
 * from this list, so nothing is named anywhere else.
 *
 * N-437 — THE ORDER IS THE OWNER'S, NOT THE BUILD'S. It follows the research
 * priority order in the project brief, adolescence first, and each entry carries
 * the reason that ordering gives. Paraphrased, because the brief is rationale and
 * never build authority; the sequence is his.
 *
 * `area` is the index page where a reader meets the hole in context. `methodology`
 * means there is no such index yet and this list is the entry's only home — which
 * is the pre-N-302 state, kept honest rather than papered over.
 */
export type ComingArea = "topics" | "situations" | "play" | "history" | "methodology" | "timeline";

export type ComingEntry = {
  id: string;
  text: string;
  area: ComingArea;
};

export const WHATS_COMING: ComingEntry[] = [
  {
    id: "wc-adolescence",
    area: "topics",
    text: "Adolescence, first — the owner's own first research priority, because it is the join between a childhood nobody chose and the first decisions anyone makes for themselves, and because attributes, identity, risk, mental health and the first real relationships all arrive at once there. Nothing on this site currently covers it.",
  },
  {
    id: "wc-relationships",
    area: "topics",
    text: "Relationships and the people around you, in depth — second, because they move health, work, money, difficulty and what a life leaves behind more than anything else here does, and the guide currently names the mechanisms without modelling how a household or a friendship actually holds together.",
  },
  {
    id: "wc-money",
    area: "topics",
    text: "Money and material life, in depth — third, because it is what makes class, education, housing, family and later life concrete instead of abstract, and because it gives every other part of the guide one shared way of talking about what a move costs.",
  },
  {
    id: "wc-health",
    area: "topics",
    text: "Health as a continuous system rather than a list of conditions — fourth, because it connects capacity, ageing, load and everything they gate, and because health that appears only as separate problems misses the ordinary maintenance that most of it actually is.",
  },
  {
    id: "wc-midlife-care",
    area: "topics",
    text: "Midlife, ageing and caregiving — fifth, and the largest gap in the whole guide by span of years. It is where careers plateau, parents need care, bodies change and the run stops being open-ended, and it is the stretch the site currently jumps over.",
  },
  {
    id: "wc-time-maintenance",
    area: "topics",
    text: "Time, attention and maintenance as their own subject — sixth, because it explains why plans that look workable fail under real constraints, and it is where the daily plan and the upkeep list should finally meet: the maintenance you are already tracking flowing into a realistic day, instead of the two living side by side.",
  },
  {
    id: "wc-crisis-recovery",
    area: "situations",
    text: "Crisis and recovery as a system rather than page by page — seventh, because the guide has to serve the reader whose life has left the common route, and because recovery deserves to be described mechanically rather than moralised about.",
  },
  {
    id: "wc-worldview-civic",
    area: "topics",
    text: "The rest of a life beyond work and family — worldview and meaning, civic life and housing, place, identity, sexuality, technology and leisure. Eighth in the owner's order and parked as areas of their own: each is a version's worth of work, and none of them is a subsection of an existing guide.",
  },
  {
    id: "wc-social-manual",
    area: "topics",
    text: "The social manual — the unwritten rules nobody is taught and everybody is assumed to know, from what an invitation actually obliges to how a favour is repaid. Parked as an area of its own, because doing it badly would produce etiquette, and etiquette is not what is missing.",
  },
  {
    id: "wc-atlas",
    area: "topics",
    text: "An atlas of the places a life is actually lived — the school, the workplace, the clinic, the courtroom, the queue — each with its own rules, its own currencies and its own ways of going wrong. Parked as an area beside the world map, not harvested piecemeal into the guides.",
  },
  {
    id: "wc-years-between",
    area: "play",
    text: "A written story campaign, provisionally The Years Between — an authored run with a beginning and an end, rather than a generated one. Parked as its own version: an authored story is a different craft from a simulation and would need its own review.",
  },
  {
    id: "wc-living-scene",
    area: "play",
    text: "A living scene layer — somewhere a decision is met in a place rather than in a panel. Parked entire, and the presentation rules it would have to inherit are already written down, in the register above, before anything is drawn.",
  },
  {
    id: "wc-ethics-meaning",
    area: "topics",
    text: "Ethics and meaning — how to decide what is worth doing, told as something other than an optimisation. Parked as an area, because the site can lay out a decision and has no standing to supply the destination, and that boundary needs writing before the content does.",
  },
  {
    id: "wc-archetype-comparison",
    area: "situations",
    text: "Archetype comparison and resemblance — seeing which patterns a situation resembles, with resemblance, prevalence, confidence and viability kept firmly separate, and never used to assign anyone a destiny. Behind a research gate, because a resemblance read as a destiny is the failure mode.",
  },
  {
    id: "wc-archetype-creation",
    area: "play",
    text: "Archetype resemblance at character creation — deferred behind the same research gate as archetype comparison; a hard start is never a destiny.",
  },
  {
    id: "wc-evidence-pass",
    area: "methodology",
    text: "An evidence pass over the whole site — claim grades, an open-questions register, published editorial standards, a record of what each research review found, and a check that every open assertion could actually be shown to be wrong. Accepted and scheduled as the next version; none of it is partly built.",
  },
  {
    id: "wc-history-eras",
    area: "history",
    text: "More eras of history, done to the same standard as the first — no gallery of promises.",
  },
  {
    id: "wc-era-play",
    area: "play",
    text: "Era-play in the Playthrough — replaying the same hand under a different historical ruleset, so you can feel how much of an outcome was the patch and how much was the play. Named here, not yet built.",
  },
  {
    id: "wc-daily-plan-upkeep",
    area: "methodology",
    text: "Deeper integration between the daily plan and the upkeep list — so the maintenance you are tracking can flow into a realistic day, rather than the two living side by side.",
  },
  {
    id: "wc-field-reports",
    area: "methodology",
    text: "Reader field reports and corrections — a way for people to send first-person accounts and flag errors, treated as primary sources. The record shape exists now; the submission path is deliberately not built yet.",
  },
];

export const COMING_BY_ID: Record<string, ComingEntry> = Object.fromEntries(
  WHATS_COMING.map((w) => [w.id, w]),
);

export const comingForArea = (area: ComingArea): ComingEntry[] =>
  WHATS_COMING.filter((w) => w.area === area);

/** Corrections register (G-12). First entries are the build's own decisions. */
export const CORRECTIONS: CorrectionEntry[] = [
  {
    id: "cor-hotline-verified",
    date: "2026-09-04",
    kind: "source-change",
    // N-291 — this correction changed a page, so the page says so. The summary is
    // rendered on /threshold by `RevisionNote`, which is why the deixis was fixed:
    // "the launch gate below" was written for the register's own position on
    // /methodology and is false anywhere else (and was already false there, since
    // the gate list is above the register). The claim is unchanged.
    pages: ["/threshold"],
    summary: "Hotline numbers verified against their official sources; the verification gate is closed.",
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

/**
 * N-290 (6.0 §3.11, §7.1, C-46) — THE RETRACTIONS REGISTER, PUBLISHED EMPTY.
 *
 * A retraction mechanism invented after the first error is not a mechanism. It is
 * a decision made under pressure, by people who would rather not be making it, at
 * the exact moment they have the strongest reason to make it small. So the format
 * is fixed here, before there is anything in it: what was said, what replaced it,
 * why, and the page it was on — with the original TEXT KEPT AND STRUCK THROUGH
 * rather than deleted, because a retraction that removes the sentence removes the
 * evidence that the site was ever wrong in that particular way.
 *
 * A retraction is also a CORRECTIONS row of kind "retraction": the mixed register
 * stays the chronological record of everything, and this is the permanent one for
 * the subset that matters most.
 *
 * IT IS EMPTY, AND THE SECTION STILL RENDERS. C-46 asserts exactly that, because
 * the cheap failure here is a section that hides itself when it has nothing to
 * show and quietly comes into existence with its first entry.
 */
export const RETRACTIONS: RetractionEntry[] = [];
