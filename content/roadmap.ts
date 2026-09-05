/**
 * Roadmap fixture (blueprint §6.3). Eight overlapping stages across parallel
 * domain tracks. Stage cards are content-status `editorial`, obey G-13 (windows,
 * not norms), and carry NO milestone ages, percentages, or statistics — only
 * orientation, what commonly changes, and questions. Launch and the credential
 * branch open their own deep pages; the other stages show these short cards.
 */

import type { AgencyKind } from "@/content/play/acts";

export type Stage = {
  id: string;
  label: string;
  gameLabel: string;
  short: string;
  /** 150–250 words of true, general orientation. No ages, no numbers. */
  card: string[];
  /** If set, selecting this stage routes to a deep page instead of showing a card. */
  deepLink?: { href: string; label: string };
  /**
   * N-366 (6.0 §3.9) — what kind of agency a person has in this stretch:
   * happens to · decided for · decided with · decided by. Set on the EARLY
   * stages, where the map is most at risk of reading as a set of choices a child
   * was offered and did not take. It is deliberately absent from the later
   * stages: by then the answer is "decided by" everywhere the map goes, and
   * stamping it on every card would turn a correction into decoration.
   */
  agency?: AgencyKind;
};

export type Domain = {
  id: string;
  label: string;
  gameLabel: string;
  note: string;
};

export const CONTEXT_BREADCRUMB = "United States · reference 2025 · illustrative";

export const DOMAINS: Domain[] = [
  { id: "learning", label: "Learning", gameLabel: "Learning", note: "acquiring and updating what you can do" },
  { id: "health", label: "Health", gameLabel: "Vitality", note: "the capacity that gates the rest" },
  { id: "work", label: "Work", gameLabel: "Work", note: "what you trade your time and skill for" },
  { id: "relationships", label: "Relationships & family", gameLabel: "The party", note: "the people running this stretch with you" },
  { id: "money", label: "Money", gameLabel: "Resources", note: "the buffer, and what it converts into" },
  { id: "meaning", label: "Meaning", gameLabel: "Meaning", note: "what the whole thing is for, as you define it" },
  { id: "priorities", label: "Chosen priorities", gameLabel: "Main quest", note: "the aims you actually picked" },
];

export const STAGES: Stage[] = [
  {
    id: "stage-birth",
    label: "Birth and dependency",
    gameLabel: "The opening",
    short: "carried entirely",
    agency: "happens to",
    card: [
      "You arrive able to signal need and almost nothing else, and the entire stretch is carried by other people. Nothing here is chosen and nearly everything here matters later: whether the care was reliable enough that the world came to feel safe, whether there was enough of what a body needs, whether the people holding you had any margin of their own.",
      "This is the clearest case on the whole map of a position that is assigned rather than earned. What happens here shapes the baseline a person launches from, and it is the part of a life for which no one can be given credit or blame. What tends to change from here is that signalling slowly becomes doing — the first small conversions of need into action.",
      "The useful questions are not about milestones. They are about the ground: what was steady, what was missing, and which of those a person is still, quietly, building around.",
    ],
  },
  {
    id: "stage-early-childhood",
    label: "Early childhood",
    gameLabel: "Early game",
    short: "the rules go in first",
    agency: "decided for",
    card: [
      "Language arrives, and with it the strange fact that the world can be named before it can be questioned. The rules of how things work — what is normal, who is safe, what happens when you reach — are absorbed long before there is any apparatus to examine them, which is why they later feel less like beliefs than like weather.",
      "Play is the real work of the stage: it is how a person runs cheap experiments on a world whose costs are still mostly borne by someone else. Attachment and safety do most of the load-bearing; competence is being assembled underneath, unevenly and out of sight.",
      "What commonly changes is the widening of the circle — from a couple of faces to a small world with its own weather. The questions worth holding are about what was learned before it could be chosen, and which of those early rules are still running unexamined.",
    ],
  },
  {
    id: "stage-tutorial",
    label: "The tutorial years",
    gameLabel: "The tutorial",
    short: "taught, and sorted",
    agency: "decided with",
    card: [
      "Formal systems begin — a school, a set of expectations, the first institutions that will rate a person against others. Two things arrive together and are easily confused: being taught, and being sorted. A great deal of what feels like a verdict on ability at this stage is really the system doing its filing.",
      "Competence and comparison show up hand in hand. A person learns that they can get better at things, and simultaneously that there is a ladder and a place on it — and the second lesson often lands harder than the first, especially where the ladder was steeper for some children than others before any of them arrived.",
      "What tends to change is the growing weight of the external readout: grades, teams, groups. The useful questions are about which of those readouts measured something real, which measured only the starting position, and what a person came to believe about themselves from being ranked before they could argue back.",
    ],
  },
  {
    id: "stage-adolescence",
    label: "Adolescence",
    gameLabel: "Mid-tutorial",
    short: "the self becomes a project",
    agency: "decided with",
    card: [
      "The self stops being a given and becomes something to be worked on, tested, and argued about. Peers move to the centre of the reference frame and often outweigh parents there, which is developmentally ordinary rather than a betrayal. Identity gets built by trying versions on, which requires room to be wrong.",
      "Judgement is under construction while the stakes and the freedoms both rise, so risk is not a malfunction here; it is the cost of the experiments the stage exists to run. The body and the social rules are both changing faster than the equipment for reading them, which is exhausting from the inside and easy to mistake for a character flaw.",
      "What commonly changes is the first real authorship — a person starting to choose, badly and then better. The questions are about which of the experiments were theirs and which were borrowed, and what it would take to keep a floor under the ones still to come.",
    ],
  },
  {
    id: "stage-launch",
    label: "The launch years",
    gameLabel: "The launch",
    short: "agency up, resources gated",
    card: [],
    deepLink: { href: "/map/launch", label: "Open the launch years" },
  },
  {
    id: "stage-build",
    label: "Build and establishment",
    gameLabel: "The build",
    short: "the base gets set",
    card: [
      "The decisions get fewer and heavier. Where the launch years were about keeping options open, this stretch is where some of them get spent — a direction, sometimes a place, sometimes people whose lives become bound to yours. Compounding takes over as the dominant force: skill, relationships, and resources that were seeded earlier begin, or fail, to bend upward.",
      "The characteristic danger is not failure but drift: optimising a life you chose by default, getting very good at a route you never actually picked. The base being set here is real and load-bearing, and it is also more reversible than it feels in the middle of it — most of what looks like a life sentence at this stage is a long lease.",
      "What commonly changes is the shift from acquiring options to committing them. The questions worth keeping open are whether the aims are still yours, what the current build quietly assumes will always be true, and where a buffer is thin enough that one shock would cascade.",
    ],
  },
  {
    id: "stage-midgame",
    label: "Midgame and caregiving",
    gameLabel: "The midgame",
    short: "peak load, peak competence",
    card: [
      "Care tends to flow in both directions at once — toward children, toward ageing parents, sometimes toward both in the same week — and it arrives on top of whatever was already being carried. It is common to reach peak competence and peak load in the same stretch, which is why the period can feel simultaneously like mastery and like drowning.",
      "The first real losses usually land here, and with them the first honest re-examination of aims set long ago under different assumptions. Some of what was built turns out to fit; some of it was chosen by a person who no longer exists in quite the same form.",
      "What commonly changes is that the horizon stops being infinite and starts being a shape. The useful questions are about which of the current loads are genuinely yours to carry, which could be shared or set down, and whether the route still leads somewhere you want to arrive.",
    ],
  },
  {
    id: "stage-later",
    label: "Later life and legacy",
    gameLabel: "The late game",
    short: "the shape becomes visible",
    card: [
      "The shape of a life becomes visible in a way it never was from inside the building of it. What reliably still compounds at this stage is not acquisition but relationships and meaning — the things that were maintained, and the things that were passed on. Capacity narrows in some directions and, sometimes, widens in others; the trade is real and not only a loss.",
      "The characteristic work is transmission and letting go: handing on what can be handed on, and releasing what cannot be kept. Regret, where it shows up, tends to gather around the conversions that never happen at any price — time with specific people at specific stages that has already passed.",
      "What commonly changes is that the questions turn from getting to giving, and from the next move to the whole game. The useful ones are about what a person wants to have been true, who they want to have held, and what they would still like to set down before the end of the run.",
    ],
  },
];

export type Branch = {
  id: string;
  label: string;
  short: string;
  href: string;
  /** Which stage this branch sits nearest, for placement on the spine. */
  nearStage: string;
};

export const BRANCHES: Branch[] = [
  {
    id: "branch-credential-decision",
    label: "The credential decision",
    short: "college · trade · work-first",
    href: "/map/credential-decision",
    nearStage: "stage-launch",
  },
];

export const stageIndex = (id: string) => STAGES.findIndex((s) => s.id === id);
