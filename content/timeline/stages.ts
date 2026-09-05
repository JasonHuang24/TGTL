/**
 * The stage spine (5.0 blueprint §3.3).
 *
 * Eight stages sharing their ids and labels with `content/roadmap.ts`, plus a
 * ninth terminal card — *dying and closure* — which is not a stage a person is
 * "in" but the place the timeline's last material lives (§5.4).
 *
 * THE AGE BANDS CLAIM NOTHING. They are typed `kind: "navigation-convention"`
 * and rendered with the line "a convention for finding your way, not a
 * measurement". That is precisely why they are the only ages on the page that
 * need no external source, and T-1 exempts them BY THIS TYPE and by nothing else.
 * The brief's own caveat on the stage skeleton it proposes says the same thing:
 * "Age ranges are provisional, overlap, and must vary by era, country, health,
 * culture, and individual development" — and that skeleton is itself stamped
 * "Provisional inference, not user-confirmed project direction".
 *
 * The bands are executor latitude, chosen to match the brief §14A ranges where
 * they exist and the roadmap's eight stages where they differ.
 *
 * The intros are editorial prose, 120–220 words, adapted (never pasted — 2.0 §0.3)
 * from the 4.0 map's stage cards and the brief's §14A modules. No digits appear
 * in any of them: the band is the only number a stage carries.
 */
import type { Stage } from "./schema.ts";

export const STAGES_TL: Stage[] = [
  {
    id: "stage-birth",
    label: "Birth and dependency",
    shortLabel: "Birth",
    short: "carried entirely",
    ageBand: [0, 2],
    kind: "navigation-convention",
    intro: [
      "This stretch is carried by other people. A person arrives able to signal need and almost nothing else, and everything that happens is done for them or around them. Nothing here is chosen, and a great deal of it matters later: whether the care was steady enough that the world came to feel safe, whether there was enough of what a body needs, whether the people doing the holding had any margin of their own.",
      "It is the clearest case on the whole timeline of a position that is assigned rather than earned. What is being assembled underneath is the baseline a person later launches from, and it is the part of a life for which nobody can be given credit or blame.",
      "What the records below describe are windows in bodies and the first institutional appointments — things that commonly run through these years across a population. They are not a checklist, and no child is late against them.",
    ],
  },
  {
    id: "stage-early-childhood",
    label: "Early childhood",
    shortLabel: "Early years",
    short: "the rules go in first",
    ageBand: [3, 5],
    kind: "navigation-convention",
    intro: [
      "Language arrives, and with it the strange fact that the world can be named long before it can be questioned. The rules of how things work — what is ordinary, who is safe, what happens when you reach — are absorbed well before there is any apparatus for examining them, which is why they later feel less like beliefs than like weather.",
      "Play is the real work of the stretch. It is how a person runs cheap experiments on a world whose costs are still mostly carried by somebody else. Attachment and safety do most of the load-bearing; competence is being built underneath, unevenly and out of sight.",
      "The developmental windows shown here are population ranges drawn from what a public-health body publishes about what most children do. They are wide, they overlap, and children move through them at different speeds. A range is not a screening threshold, and the route for a worried parent is a clinician rather than a website.",
    ],
  },
  {
    id: "stage-tutorial",
    label: "The tutorial years",
    shortLabel: "Tutorial",
    short: "taught, and sorted",
    ageBand: [6, 11],
    kind: "navigation-convention",
    intro: [
      "Formal systems begin. A school, a set of expectations, and the first institutions that will rate a person against other people. Two things arrive together here and are easily confused: being taught, and being sorted. Much of what feels like a verdict on ability at this point is really an institution doing its filing.",
      "Competence and comparison show up hand in hand. A person learns both that they can get better at things and that there is a ladder with a place on it, and the second lesson often lands harder — especially where the ladder was steeper for some children than others before any of them arrived.",
      "This is where the timeline carries the most institutional sequence and the fewest hard rules. An institution keeps a schedule, and institutions have side doors: the sequence below describes the schedule, not a requirement about any particular child.",
    ],
  },
  {
    id: "stage-adolescence",
    label: "Adolescence",
    shortLabel: "Adolescence",
    short: "the self becomes a project",
    ageBand: [12, 17],
    kind: "navigation-convention",
    rendersCrisisNote: true,
    intro: [
      "The self stops being a given and becomes something to be worked on, tested, and argued about. Peers move to the middle of the reference frame and often outweigh parents there, which is developmentally ordinary rather than a betrayal. Identity gets built by trying versions on, and that requires room to be wrong.",
      "Judgement is still under construction while both the stakes and the freedoms rise, so risk is not a malfunction here; it is the cost of the experiments this stretch exists to run. The body and the social rules change faster than the equipment for reading them, which is exhausting from the inside and easy to mistake for a character flaw.",
      "Two different kinds of thing run through these years and the timeline keeps them apart. There are bodies moving through wide biological windows, and there are rules with ages written into them. Only the second kind is an actual line.",
    ],
  },
  {
    id: "stage-launch",
    label: "The launch years",
    shortLabel: "Launch",
    short: "agency up, resources gated",
    ageBand: [18, 24],
    kind: "navigation-convention",
    intro: [
      "More rules change here than anywhere else on the timeline. Legal adulthood arrives, and with it a dense cluster of thresholds written into statute: what a person may sign, vote in, be tried as, buy, and be required to register for. These are the one kind of age that is genuinely a line, and the timeline draws them as crisp ticks for exactly that reason.",
      "Everything else in this stretch is far looser than the rules make it look. Leaving home, entering work, starting or not starting a credential, first independent housing, first long-term partnership — these are wide windows that a population moves through over many years, and how long the stretch takes has changed across generations.",
      "The gap between the two is the point. A rule can arrive on a birthday. A life does not.",
    ],
  },
  {
    id: "stage-build",
    label: "Build and establishment",
    shortLabel: "Build",
    short: "the base gets set",
    ageBand: [25, 39],
    kind: "navigation-convention",
    intro: [
      "Commitments start to accumulate and to become expensive to reverse — credentials, specialization, debt, partnership, children, housing, location, reputation. That is the ordinary physics of the stretch rather than a warning about it, and it cuts both ways: the same accumulation that narrows options is also what compounds.",
      "This is the part of the timeline where the windows are widest and the variation between people is largest. The common ages for partnership, for a first child, for a first home, for settling into a line of work are medians in a population that has been shifting for decades, and every one of them has long tails in both directions.",
      "A median is a description of a group. It says nothing about whether any particular sequence is the right one, and the timeline is not able to say that.",
    ],
  },
  {
    id: "stage-midgame",
    label: "Midgame and caregiving",
    shortLabel: "Midgame",
    short: "peak load, peak competence",
    ageBand: [40, 59],
    kind: "navigation-convention",
    intro: [
      "Load and capability tend to peak together. This is commonly the stretch of most responsibility in several directions at once — work, children if there are any, and increasingly the generation above — and also the stretch of most accumulated skill and standing. Reducing it to a crisis misses most of what is in it.",
      "Several slow things become visible here that were running quietly before. Bodies change in ways that are ordinary and gradual. Caregiving for an older relative commonly begins somewhere in this range. Earnings for many people flatten out rather than continuing to climb.",
      "The timeline shows these as windows because that is what they are: not events with dates, but long overlapping stretches that people enter at very different points, and some never enter at all.",
    ],
  },
  {
    id: "stage-later",
    label: "Later life and legacy",
    shortLabel: "Later life",
    short: "the shape becomes visible",
    ageBand: [60, 100],
    kind: "navigation-convention",
    intro: [
      "The rules come back. After a long stretch in which almost nothing changed by statute, a second dense cluster of thresholds arrives: when benefits can be claimed, when they stop growing by waiting, when public health coverage begins, when money has to start coming out of the accounts it went into.",
      "Retirement is not one event and the timeline does not draw it as one. It is planned, partial, forced, deferred, declined, or never available, and people move between those. Alongside it run the things this stretch is actually made of for most people: continued work by choice or by need, unpaid care, grandparenthood for some, relocation, new learning, and changes in what a body will do.",
      "Later life can contain growth, romance, creativity, leadership and learning, and the records here are chosen so that it visibly does.",
    ],
  },
  {
    id: "dying-and-closure",
    label: "Dying and closure",
    shortLabel: "Closure",
    short: "the practical matters, plainly",
    // Not a band a person is "in": the terminal card sits past the spine's end.
    ageBand: [100, 100],
    kind: "navigation-convention",
    sensitivity: "dying",
    readRefs: ["/situations/a-death", "/situations/grief"],
    intro: [
      "This card is not a stage anyone is in. It is where the timeline's last material lives, because the practical matters have to sit somewhere and burying them inside a year would be worse than naming them plainly.",
      "If you are here because someone has died, or because someone is dying now, the pages written for that are the right place and this is not it. They are named at the top of this card and they come first.",
      "The practical matters here are mostly legal: the documents that state what a person wants for their own care, the arrangements that decide what happens afterward, and the kinds of care that exist for the end of a life. A few of them carry an age at which a person becomes able to make them, and those sit in the years above, sourced like every other rule on this timeline. Most carry no age at all, which is why they are not on the spine: they are simply available, and the pages named at the top of this card are where they are explained properly.",
      "Nothing here is a schedule and none of it is a countdown.",
    ],
  },
];

/** Which stage a given age falls in. The terminal card is not returned. */
export function stageForAge(age: number): Stage | undefined {
  return STAGES_TL.find(
    (s) => s.id !== "dying-and-closure" && age >= s.ageBand[0] && age <= s.ageBand[1],
  );
}

/** The terminal card (§3.3). */
export const TERMINAL_STAGE = STAGES_TL.find((s) => s.id === "dying-and-closure")!;
