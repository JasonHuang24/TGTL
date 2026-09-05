/**
 * The decision-card pool (blueprint 3.0 §3.5, §11.3, §11.4). Thin-arc layer —
 * every act reachable, every act with a recovery-bearing option so a failure
 * always has a route back (§3.5, gate S-3). Density is added in Phase 3.
 *
 * Rules baked in here (gate-enforced):
 *   - setups ≤ 60 words, outcome lines ≤ 40 words, edition-neutral (§11.4).
 *   - 2–3 bands per option, at most one `failure` (§3.5).
 *   - NO numbers/percentages/odds-digits (§8, gate S-2).
 *   - NO loss-tier or crisis-tier content anywhere in a card (§7.1, gate S-1) —
 *     loss lives only in scripted beats (content/play/beats.ts).
 *   - endurance options name a support route via supportLink (gate S-3).
 */

import type { DecisionCard } from "@/content/play/schema";
import { DENSITY_CARDS } from "@/content/play/cards/density";

/* ============================ ACT 1 — Birth & dependency (watched) ============================ */

const ACT1: DecisionCard[] = [
  {
    id: "card-birth-childcare",
    act: 1,
    family: "home",
    setup:
      "Before you can weigh in on anything, the adults settle how you'll be looked after while they work — from the options their address and budget allow. You are the subject of the decision, never a party to it.",
    options: [
      {
        id: "opt-family-care",
        label: "cared for within the family",
        chips: { costs: ["someone's own plans, quietly shelved"], variance: "narrow", reversibility: "reversible" },
        bands: [
          { name: "strong", weight: 3, outcome: { line: "Someone who loves you is always the one who's there. It leaves a mark you'll spend decades either trusting or missing.", effects: { gauge: { connection: 1 } } } },
          { name: "solid", weight: 2, outcome: { line: "It works, mostly. The people doing it are tired in a way you won't understand until much later.", effects: {} } },
        ],
      },
      {
        id: "opt-paid-care",
        label: "cared for in a paid arrangement",
        chips: { costs: ["a real dent in a thin budget"], variance: "moderate", reversibility: "reversible" },
        bands: [
          { name: "solid", weight: 3, outcome: { line: "A steady room, other small hands, a routine that isn't yours but holds. It costs the household more than it looks like from down there.", effects: { gauge: { connection: 1 } } } },
          { name: "mixed", weight: 2, outcome: { line: "It's fine and it's a stretch, and the stretch shows up elsewhere in ways nobody connects to you.", effects: { gauge: { money: -1 } } } },
        ],
      },
    ],
  },
];

/* ============================ ACT 2 — Early childhood (watched) ============================ */

const ACT2: DecisionCard[] = [
  {
    id: "card-early-school",
    act: 2,
    family: "school",
    setup:
      "The adults choose where you'll start school — from what the address and the budget actually allow. It will decide who is around you for years. Nobody asks you, because there is nothing you could yet say.",
    options: [
      {
        id: "opt-local-school",
        label: "the nearby school everyone here attends",
        chips: { costs: ["the ceiling of the local option"], variance: "moderate", reversibility: "costly to undo" },
        bands: [
          { name: "solid", weight: 3, outcome: { line: "You grow up among the kids from your streets. It's ordinary in the good way and the limiting way at once.", effects: { gauge: { connection: 1 } } } },
          { name: "mixed", weight: 2, outcome: { line: "Some good teachers, some worn-out ones, a building doing its best. You won't know what you didn't get.", effects: {} } },
        ],
      },
      {
        id: "opt-reach-school",
        label: "a school they reach for, further out",
        chips: { costs: ["a long commute", "being the outsider a while"], variance: "wide", reversibility: "costly to undo" },
        bands: [
          { name: "strong", weight: 2, outcome: { line: "More doors, more expectation, a longer bus. You start collecting a different map of what's possible.", effects: { gauge: { timeStructure: -1 }, skills: ["reads-a-room"] } } },
          { name: "mixed", weight: 3, outcome: { line: "The reach costs the household and costs you some belonging. Whether it pays comes clear only years on.", effects: { gauge: { connection: -1 } } } },
        ],
      },
    ],
  },
];

/* ============================ ACT 3 — Tutorial years ============================ */

const ACT3: DecisionCard[] = [
  {
    id: "card-tutorial-readout",
    act: 3,
    family: "school",
    mechanicLink: "readout",
    setup:
      "A project comes back marked lower than you thought, and the teacher has clearly sorted the room by it. There's a week before the next one. You could shrug it off, grind, or find out what the mark was actually measuring.",
    options: [
      {
        id: "opt-grind",
        label: "put the real work in",
        chips: { costs: ["evenings", "some time with friends"], variance: "moderate", reversibility: "reversible" },
        sensitivity: { skill: "sticks-with-hard-things" },
        bands: [
          { name: "strong", weight: 3, outcome: { line: "The next mark climbs, and — more quietly — so does the actual skill, which was never the same thing as the mark.", effects: { skills: ["sticks-with-hard-things"] } } },
          { name: "mixed", weight: 2, outcome: { line: "The mark barely moves; the skill did, though. The ruler and the thing it measures were never aligned.", effects: {} } },
          { name: "poor", weight: 1, failure: true, outcome: { line: "You burn a week and the number doesn't budge. It stings more than it should, because you took the number personally.", effects: { gauge: { healthEnergy: -1 } } } },
        ],
      },
      {
        id: "opt-shrug",
        label: "shrug it off; it's one project",
        chips: { costs: ["a habit, if it becomes one"], variance: "narrow", reversibility: "reversible" },
        bands: [
          { name: "solid", weight: 3, outcome: { line: "Nothing breaks. You keep your evenings. Whether this was wisdom or avoidance depends on what you do next time.", effects: {} } },
          { name: "mixed", weight: 2, outcome: { line: "The gap quietly widens. No single shrug is the problem; the pattern would be.", effects: {} } },
        ],
      },
      {
        id: "opt-ask-readout",
        label: "ask the teacher what the mark actually measured",
        chips: { costs: ["a moment of looking uncertain"], variance: "narrow", reversibility: "reversible" },
        flags: ["recovery"],
        bands: [
          { name: "strong", weight: 3, outcome: { line: "Turns out it graded one narrow thing, not you. Knowing what a readout does and doesn't see is worth more than the readout.", effects: { skills: ["reads-the-fine-print"] } } },
          { name: "solid", weight: 2, outcome: { line: "You get a shrug back, but you asked — and asking early is a muscle you'll be glad you built.", effects: { skills: ["asks-for-help"] } } },
        ],
      },
    ],
  },
  {
    id: "card-tutorial-friend",
    act: 3,
    family: "people",
    mechanicLink: "party",
    setup:
      "A close friendship hits a rough patch over something small that grew. You could patch it, wait it out, or quietly let it fade.",
    options: [
      {
        id: "opt-patch",
        label: "go and patch it up",
        chips: { costs: ["some pride", "an awkward hour"], variance: "moderate", reversibility: "reversible" },
        flags: ["recovery"],
        bands: [
          { name: "strong", weight: 3, outcome: { line: "You say the plain true thing and it holds. Repair, done early, is cheap — and it's a skill, not a personality trait.", effects: { skills: ["tells-the-truth-early"], relationships: [{ id: "rel-childhood-friend", label: "a childhood friend", quality: 1 }] } } },
          { name: "mixed", weight: 2, outcome: { line: "It's clumsy and half-lands. Still — the reaching mattered, even where the words didn't.", effects: { relationships: [{ id: "rel-childhood-friend", label: "a childhood friend", quality: 1 }] } } },
        ],
      },
      {
        id: "opt-fade",
        label: "let it quietly fade",
        chips: { costs: ["a bond you don't get back at the same rate"], variance: "moderate", reversibility: "costly to undo" },
        bands: [
          { name: "solid", weight: 2, outcome: { line: "It fades without drama. Some friendships are meant to; you'll learn to tell those from the ones worth the awkwardness.", effects: {} } },
          { name: "poor", weight: 2, failure: true, outcome: { line: "It fades, and later you notice it was one worth keeping. Trust is built slowly and lost fast.", effects: { gauge: { connection: -1 } } } },
        ],
      },
    ],
  },
  {
    id: "card-tutorial-setback",
    act: 3,
    family: "inner",
    mechanicLink: "recovery",
    recoveryCard: true,
    setup:
      "Something you tried in front of everyone didn't work, and it's the kind of small public flop that feels enormous at this age. How you handle the next hour matters more than the flop.",
    options: [
      {
        id: "opt-hide",
        label: "hide it and hope it's forgotten",
        chips: { costs: ["carrying it alone"], variance: "moderate", reversibility: "reversible" },
        bands: [
          { name: "solid", weight: 2, outcome: { line: "It's forgotten by everyone but you. You keep the ache; most people never notice they were the only one still thinking about it.", effects: {} } },
          { name: "mixed", weight: 2, outcome: { line: "Hiding it teaches a small wrong lesson — that mistakes are to be concealed. Cheap now, expensive later.", effects: {} } },
        ],
      },
      {
        id: "opt-tell-someone",
        label: "tell someone you trust and move on",
        chips: { costs: ["admitting it out loud"], variance: "narrow", reversibility: "reversible" },
        flags: ["recovery"],
        bands: [
          { name: "strong", weight: 3, outcome: { line: "Said out loud to the right person, it shrinks to its actual size. Recovery isn't undoing the flop; it's not letting it set the terms.", effects: { skills: ["recovers-fast"], gauge: { connection: 1 } } } },
          { name: "solid", weight: 2, outcome: { line: "They shrug kindly and the world keeps turning. You file away that this is what asking is for.", effects: { skills: ["asks-for-help"] } } },
        ],
      },
    ],
  },
];

/* ============================ ACT 4 — Adolescence ============================ */

const ACT4: DecisionCard[] = [
  {
    id: "card-adolescence-experiment",
    act: 4,
    family: "inner",
    mechanicLink: "variance",
    setup:
      "There's a chance to try something risky and yours — a stage, a team, a scene — that could go brilliantly or flop in public. The real question underneath it: is there a floor beneath a bad landing?",
    options: [
      {
        id: "opt-leap",
        label: "take the leap",
        chips: {
          costs: ["exposure", "time from the safe path"],
          variance: "wide",
          reversibility: "reversible",
          positionNotes: [
            { when: "floor", text: "With a floor beneath you, this is a bounded experiment — the cheapest thing to run while time is abundant." },
            { when: "no-floor", text: "Without a floor, the same leap carries a longer tail; make it small and reversible before you make it bold." },
          ],
        },
        sensitivity: { skill: "reads-a-room", penaltyFlags: ["no-floor"] },
        bands: [
          { name: "strong", weight: 3, outcome: { line: "It lands. You learn the specific joy of a good draw on a sound bet — and that the bet was sound whether or not it landed.", effects: { skills: ["reads-a-room"], gauge: { connection: 1 } } } },
          { name: "mixed", weight: 2, outcome: { line: "It half-works. You're a little exposed and a lot more capable. The experiment paid in information, not applause.", effects: {} } },
          { name: "poor", weight: 2, failure: true, outcome: { line: "It flops, publicly. It was still a good bet — a sound decision met a bad draw, and the two are not the same thing.", effects: { gauge: { connection: -1 } } } },
        ],
      },
      {
        id: "opt-hold-back",
        label: "sit this one out",
        chips: { costs: ["a door that doesn't stay open forever"], variance: "narrow", reversibility: "reversible" },
        flags: ["recovery"],
        bands: [
          { name: "solid", weight: 3, outcome: { line: "You stay comfortable and a little unstretched. Fine — as long as sitting out doesn't quietly become the whole strategy.", effects: {} } },
          { name: "mixed", weight: 2, outcome: { line: "Later you wonder about it. Not every skipped experiment is a loss, but this is how you find out which ones were.", effects: {} } },
        ],
      },
    ],
  },
  {
    id: "card-adolescence-crowd",
    act: 4,
    family: "people",
    setup:
      "The group is heading somewhere you're not sure about, and going along is the frictionless move. Holding your line means being the odd one for an evening.",
    options: [
      {
        id: "opt-go-along",
        label: "go along with it",
        chips: { costs: ["a bit of yourself, if it's a habit"], variance: "moderate", reversibility: "reversible" },
        bands: [
          { name: "solid", weight: 2, outcome: { line: "Nothing happens; it was fine. Most of the time going along is harmless, which is exactly why the habit is hard to see.", effects: {} } },
          { name: "poor", weight: 2, failure: true, outcome: { line: "It goes further than you wanted and you didn't say stop. The cost isn't the evening; it's practising not having a line.", effects: { gauge: { healthEnergy: -1 } } } },
        ],
      },
      {
        id: "opt-hold-line",
        label: "hold your line, quietly",
        chips: { costs: ["being the odd one out tonight"], variance: "narrow", reversibility: "reversible" },
        flags: ["recovery"],
        bands: [
          { name: "strong", weight: 3, outcome: { line: "You bow out without a lecture and it costs less than you feared. Knowing where your line is turns out to be a kind of freedom.", effects: { skills: ["tells-the-truth-early"] } } },
          { name: "solid", weight: 2, outcome: { line: "A little friction, no disaster. The people worth keeping barely blink; you note who they were.", effects: {} } },
        ],
      },
    ],
  },
  {
    id: "card-adolescence-regroup",
    act: 4,
    family: "inner",
    mechanicLink: "recovery",
    recoveryCard: true,
    setup:
      "A run of things went wrong at once — the ordinary pile-up of a hard year. You're tired and behind, and the move is less about fixing everything than about not making it worse.",
    options: [
      {
        id: "opt-push-through",
        label: "push through on willpower",
        chips: { costs: ["running the tank low"], variance: "wide", reversibility: "reversible" },
        bands: [
          { name: "mixed", weight: 3, outcome: { line: "You get through it, frayed. Willpower works until it doesn't; you haven't hit that wall yet, so you don't believe in it.", effects: { gauge: { healthEnergy: -1 } } } },
          { name: "poor", weight: 2, failure: true, outcome: { line: "You push past where you should have stopped and something small gives. The bill for ignored maintenance always arrives.", effects: { gauge: { healthEnergy: -1 }, conditionsSet: ["run-down"] } } },
        ],
      },
      {
        id: "opt-triage-rest",
        label: "cut scope and actually rest",
        chips: { costs: ["letting some things slide on purpose"], variance: "narrow", reversibility: "reversible" },
        flags: ["recovery"],
        bands: [
          { name: "strong", weight: 3, outcome: { line: "You drop the optional load, sleep, and let the rest wait. Reduced scope isn't the plan failing — it's the plan working.", effects: { gauge: { healthEnergy: 1 }, skills: ["recovers-fast"] } } },
          { name: "solid", weight: 2, outcome: { line: "You steady out. Nothing dramatic recovers, but nothing else breaks, which was the whole job this week.", effects: {} } },
        ],
      },
    ],
  },
];

/* ============================ ACT 5 — Launch ============================ */

const ACT5: DecisionCard[] = [
  {
    id: "card-launch-credential",
    act: 5,
    family: "school",
    mechanicLink: "position",
    setup:
      "The fork the whole culture points at: a long credential, a shorter trade route, or straight into work. Each costs differently and pays on a different clock. The honest variable underneath is a positional one — is there a floor beneath a failure?",
    options: [
      {
        id: "opt-credential",
        label: "take the long credential",
        chips: {
          costs: ["years", "often debt", "near-term flexibility"],
          variance: "moderate",
          reversibility: "locks in",
          positionNotes: [
            { when: "floor", text: "With a floor, the debt-financed version is a bounded experiment; the bad case is dull, not ruinous." },
            { when: "no-floor", text: "Without a floor, new high debt turns the bad case into a long tail — look for funded or part-time routes to the same place." },
          ],
        },
        sensitivity: { gauge: "money", penaltyFlags: ["no-floor"] },
        bands: [
          { name: "strong", weight: 2, outcome: { line: "It opens a credentialed field and a network, slowly. The signal is real; so was the cost, and so is the debt you'll carry a while.", effects: { skills: ["sticks-with-hard-things"], gauge: { money: -1 } } } },
          { name: "solid", weight: 2, outcome: { line: "A comfortable-but-unremarkable path opens. A high floor, low ceiling — the safe fork, and quietly the more locked-in one.", effects: { gauge: { money: -1 } } } },
          { name: "poor", weight: 2, failure: true, outcome: { line: "The field shifts under the credential before it pays. You played a reasonable hand into a bad draw — not a character verdict.", effects: { gauge: { money: -1 }, flagsSet: ["credential-underwater"] } } },
        ],
      },
      {
        id: "opt-trade",
        label: "take the shorter trade route",
        chips: { costs: ["a narrower first door", "the body doing the work"], variance: "moderate", reversibility: "costly to undo" },
        flags: ["recovery"],
        bands: [
          { name: "strong", weight: 3, outcome: { line: "You earn while you learn and reach licensed, hard-to-offshore work sooner. Solid floor, real skills, less exposure to credential inflation.", effects: { skills: ["makes-things", "handles-money"], gauge: { money: 1 } } } },
          { name: "solid", weight: 2, outcome: { line: "Steady, useful, yours. The ceiling is lower than some, the floor higher than most, and the skills transfer sideways.", effects: { skills: ["makes-things"] } } },
        ],
      },
      {
        id: "opt-work-first",
        label: "go straight into work",
        chips: {
          costs: ["forgoing the signal and the ready-made network"],
          variance: "wide",
          reversibility: "reversible",
          positionNotes: [
            { when: "no-floor", text: "Without a floor, income now beats the right income later — this fork stabilises the thing to stabilise first." },
          ],
        },
        sensitivity: { skill: "reads-a-room" },
        bands: [
          { name: "strong", weight: 2, outcome: { line: "You land somewhere skills genuinely accumulate, and get a two-year head start on people still in lecture halls.", effects: { skills: ["handles-money"], gauge: { money: 1 } } } },
          { name: "mixed", weight: 3, outcome: { line: "Income now, and a job that teaches you mostly what you don't want. Reversible early — the entry window into credentials just narrows with time.", effects: { gauge: { money: 1 } } } },
        ],
      },
    ],
  },
  {
    id: "card-launch-firstplace",
    act: 5,
    family: "money",
    mechanicLink: "slack",
    setup:
      "Your first place of your own. You can stretch for the one that's better-located and barely affordable, or take the plain one that leaves a margin. The margin is the thing you can least perceive the value of right now.",
    options: [
      {
        id: "opt-stretch-rent",
        label: "stretch for the better place",
        chips: { costs: ["most of the buffer", "one bad month from trouble"], variance: "wide", reversibility: "costly to undo" },
        sensitivity: { gauge: "money" },
        bands: [
          { name: "strong", weight: 2, outcome: { line: "It's great, and being near things pays in ways that compound. You've also spent your slack — fine, until the month something breaks.", effects: { gauge: { connection: 1, timeStructure: -1 } } } },
          { name: "mixed", weight: 2, outcome: { line: "You make it work by watching every penny. The location helps; the tightness is a low hum under everything.", effects: { gauge: { money: -1 } } } },
          { name: "poor", weight: 2, failure: true, outcome: { line: "One unlucky month lands with no buffer under it, and a small shock becomes a scramble. Slack was the thing that would have absorbed it.", effects: { gauge: { money: -1, timeStructure: -1 } } } },
        ],
      },
      {
        id: "opt-plain-place",
        label: "take the plain place, keep the margin",
        chips: { costs: ["a duller address", "a longer commute"], variance: "narrow", reversibility: "reversible" },
        flags: ["recovery"],
        bands: [
          { name: "strong", weight: 3, outcome: { line: "Nothing exciting, and a buffer intact — which quietly means the next shock is an inconvenience, not a cascade.", effects: { gauge: { money: 1 }, skills: ["handles-money"] } } },
          { name: "solid", weight: 2, outcome: { line: "It's fine. You bank the margin. The payoff is a thing that doesn't happen, which is why it's so easy to undervalue.", effects: {} } },
        ],
      },
    ],
  },
  {
    id: "card-launch-network",
    act: 5,
    family: "people",
    mechanicLink: "party",
    setup:
      "Getting established is partly an information problem, and information travels through people. You can keep your head down and let the work speak, or spend energy keeping a network actually warm.",
    options: [
      {
        id: "opt-heads-down",
        label: "keep your head down; let the work speak",
        chips: { costs: ["being invisible when rooms you're not in decide things"], variance: "moderate", reversibility: "reversible" },
        bands: [
          { name: "solid", weight: 3, outcome: { line: "The work is good and mostly goes unseen. Merit matters; it just doesn't distribute itself, which you'll relearn a few times.", effects: {} } },
          { name: "mixed", weight: 2, outcome: { line: "You're passed over for something by someone better-known, not better. Hiring is an information problem; you gave it no information.", effects: {} } },
        ],
      },
      {
        id: "opt-keep-warm",
        label: "keep a handful of ties genuinely warm",
        chips: { costs: ["time", "the discomfort of reaching out first"], variance: "moderate", reversibility: "reversible" },
        flags: ["recovery"],
        bands: [
          { name: "strong", weight: 3, outcome: { line: "A quiet network turns out to be where the real doors are — offered, not applied for. Network beats broadcast, most of the time.", effects: { skills: ["keeps-a-network"], gauge: { connection: 1 } } } },
          { name: "solid", weight: 2, outcome: { line: "A few warm ties, kept without agenda. Nothing pays off today; the point is that something can, later.", effects: { skills: ["keeps-a-network"] } } },
        ],
      },
    ],
  },
  {
    id: "card-launch-regroup",
    act: 5,
    family: "work",
    mechanicLink: "recovery",
    recoveryCard: true,
    setup:
      "A first real attempt at the thing you wanted didn't take. It's the ordinary, unglamorous kind of not-working. The industry, the timing, the luck — plenty of it wasn't yours to control. Now what?",
    options: [
      {
        id: "opt-double-down",
        label: "double down on the same door",
        chips: { costs: ["more of the same, betting the draw turns"], variance: "wide", reversibility: "reversible" },
        bands: [
          { name: "mixed", weight: 3, outcome: { line: "Sometimes persistence is the answer and sometimes it's just sunk cost wearing its coat. This time it's honestly hard to tell.", effects: {} } },
          { name: "poor", weight: 2, failure: true, outcome: { line: "The same door, the same result. Trying again at a wall isn't grit; it's a wall. The information was worth having, even so.", effects: { gauge: { healthEnergy: -1 } } } },
        ],
      },
      {
        id: "opt-adjacent",
        label: "step to an adjacent door your skills already fit",
        chips: { costs: ["letting go of the exact original picture"], variance: "moderate", reversibility: "reversible" },
        flags: ["recovery"],
        bands: [
          { name: "strong", weight: 3, outcome: { line: "The base skills come with you; only the label changes. A later launch is still a launch, and this one has real ground under it.", effects: { skills: ["recovers-fast"], gauge: { money: 1 } } } },
          { name: "solid", weight: 2, outcome: { line: "Sideways turns out to be forward. You keep what transferred and quietly drop what was only ever the plan's costume.", effects: {} } },
        ],
      },
    ],
  },
];

/* ============================ ACT 6 — Build & establish ============================ */

const ACT6: DecisionCard[] = [
  {
    id: "card-build-shock",
    act: 6,
    family: "money",
    mechanicLink: "slack",
    shock: true,
    setup:
      "A sudden, unavoidable expense lands this month — the kind that doesn't ask whether it's convenient. What happens next depends less on the expense than on whether there was a margin under it.",
    options: [
      {
        id: "opt-cover-from-buffer",
        label: "cover it, and see what the buffer does",
        chips: { costs: ["whatever margin you'd built"], variance: "wide", reversibility: "reversible" },
        sensitivity: { gauge: "money" },
        flags: ["recovery"],
        bands: [
          { name: "strong", weight: 3, outcome: { line: "The margin absorbs it and closes over the gap. You barely feel it — which is precisely what slack is for, and why it's so easy to undervalue.", effects: {} } },
          { name: "mixed", weight: 2, outcome: { line: "It stings but holds. You're a little thinner for a while, and nothing downstream breaks — the buffer did its quiet job.", effects: { gauge: { money: -1 } } } },
          { name: "poor", weight: 2, failure: true, outcome: { line: "With no buffer under it, the shock knocks over the next thing, and the next. A small expense became a scramble — not because it was large, but because there was no margin.", effects: { gauge: { money: -1, timeStructure: -1 }, conditionsSet: ["stretched-thin"] } } },
        ],
      },
      {
        id: "opt-borrow-shock",
        label: "put it on credit and deal with it later",
        chips: { costs: ["interest", "a curve now bending the wrong way"], variance: "moderate", reversibility: "costly to undo" },
        bands: [
          { name: "mixed", weight: 3, outcome: { line: "It's handled, and it follows you — the same compounding you'd want on your side now runs quietly against you.", effects: { gauge: { money: -1 } } } },
          { name: "poor", weight: 2, failure: true, outcome: { line: "Borrowing to absorb a shock with no buffer starts a curve bending downward. Manageable for now; the danger is that 'for now' becomes the shape of things.", effects: { gauge: { money: -1 }, conditionsSet: ["stretched-thin"] } } },
        ],
      },
    ],
  },
  {
    id: "card-build-slack",
    act: 6,
    family: "money",
    mechanicLink: "compounding",
    setup:
      "Some room in the budget, finally. You can start a small automatic buffer that quietly compounds, or put it toward a fuller life now. The same math runs in both directions, which is easy to forget when it's running for you.",
    options: [
      {
        id: "opt-build-buffer",
        label: "start the quiet automatic buffer",
        chips: { costs: ["a little less now, every month"], variance: "narrow", reversibility: "reversible" },
        flags: ["recovery"],
        sensitivity: { gauge: "money" },
        bands: [
          { name: "strong", weight: 3, outcome: { line: "Small and boring and automatic, it bends a curve upward for years without your attention. Compounding rewards the choice you stop having to make.", effects: { gauge: { money: 1 }, skills: ["handles-money"] } } },
          { name: "solid", weight: 2, outcome: { line: "It grows slowly enough to feel pointless and fast enough to matter later. You mostly forget it's there, which is the design.", effects: { gauge: { money: 1 } } } },
        ],
      },
      {
        id: "opt-spend-now",
        label: "put it toward a fuller life now",
        chips: { costs: ["the buffer that isn't building"], variance: "moderate", reversibility: "reversible" },
        bands: [
          { name: "solid", weight: 3, outcome: { line: "Real richness now — trips, a nicer table, time with people. Not wrong; just a curve you chose not to start bending yet.", effects: { gauge: { connection: 1 } } } },
          { name: "mixed", weight: 2, outcome: { line: "Lovely, and the years pass, and the buffer you didn't start is a buffer you don't have when the weather turns.", effects: {} } },
        ],
      },
    ],
  },
  {
    id: "card-build-overtime",
    act: 6,
    family: "work",
    mechanicLink: "slack",
    setup:
      "There's a stretch of extra work on offer that pays and gets noticed — and eats the evenings and the maintenance you keep meaning to do. Health is the capacity everything else is spent from, and it invoices late.",
    options: [
      {
        id: "opt-take-grind",
        label: "take the grind while it's offered",
        chips: { costs: ["sleep", "the gym you'll 'restart soon'", "the low hum of depletion"], variance: "wide", reversibility: "reversible" },
        bands: [
          { name: "strong", weight: 2, outcome: { line: "It pays and it's seen, and you bank both. You also spend health you're not tracking; whether that's a loan or a gift depends on how long it runs.", effects: { gauge: { money: 1, healthEnergy: -1 } } } },
          { name: "mixed", weight: 2, outcome: { line: "Good money, tired body. Fine as a sprint. The danger is a sprint that forgets it was supposed to end.", effects: { gauge: { money: 1, healthEnergy: -1 } } } },
          { name: "poor", weight: 2, failure: true, outcome: { line: "You run it too long and the body sends the invoice with interest. Recovering costs far more than maintaining would have.", effects: { gauge: { healthEnergy: -1 }, conditionsSet: ["run-down"] } } },
        ],
      },
      {
        id: "opt-protect-health",
        label: "protect the maintenance, take less",
        chips: { costs: ["money left on the table", "not being the one who said yes"], variance: "narrow", reversibility: "reversible" },
        flags: ["recovery"],
        bands: [
          { name: "strong", weight: 3, outcome: { line: "You keep sleeping and moving, and the counterfactual you'll never see is the breakdown that didn't happen. Maintenance is cheap; its payoff is invisible.", effects: { gauge: { healthEnergy: 1 }, conditionsSet: ["well-tended"] } } },
          { name: "solid", weight: 2, outcome: { line: "Less money, more you. It feels like nothing, which is exactly how a good maintenance decision is supposed to feel.", effects: {} } },
        ],
      },
    ],
  },
  {
    id: "card-build-repair",
    act: 6,
    family: "people",
    mechanicLink: "recovery",
    recoveryCard: true,
    setup:
      "A rupture with someone who matters — not dramatic, just a slow drift that hardened. An apology is on the table, but only a real one, the kind with changed behaviour behind it, is worth anything.",
    options: [
      {
        id: "opt-cheap-apology",
        label: "smooth it over and move on",
        chips: { costs: ["the thing under it, still there"], variance: "moderate", reversibility: "reversible" },
        bands: [
          { name: "mixed", weight: 3, outcome: { line: "Surface peace, unchanged pattern. An apology without changed behaviour has a short shelf life, and this one is already curling.", effects: {} } },
          { name: "poor", weight: 2, failure: true, outcome: { line: "The same rupture, deeper, because now there's a broken repair on top of it. Trust spent twice costs more than trust spent once.", effects: { gauge: { connection: -1 } } } },
        ],
      },
      {
        id: "opt-real-repair",
        label: "do the real repair, changed behaviour and all",
        chips: { costs: ["ego", "sitting in the awkwardness", "actually changing"], variance: "moderate", reversibility: "reversible" },
        flags: ["recovery"],
        bands: [
          { name: "strong", weight: 3, outcome: { line: "You name it plainly and then act differently, and it holds. The people who stay through the awkwardness are the ones who were always the point.", effects: { skills: ["tells-the-truth-early"], relationships: [{ id: "rel-close-person", label: "someone close", quality: 1 }], gauge: { connection: 1 } } } },
          { name: "solid", weight: 2, outcome: { line: "It's slow and partial and real. Repair is a skill, not a personality; you just used it, and it left ground you can build on.", effects: { conditionsSet: ["in-repair"] } } },
        ],
      },
    ],
  },
];

/* ============================ ACT 7 — Midgame & caregiving ============================ */

const ACT7: DecisionCard[] = [
  {
    id: "card-midgame-care",
    act: 7,
    family: "people",
    mechanicLink: "slack",
    setup:
      "Someone you love needs looking after now, and the days that were yours are suddenly shared. There's no clean answer here — only how you carry it, and whether you let anyone help carry it.",
    options: [
      {
        id: "opt-carry-alone",
        label: "carry it yourself, quietly",
        chips: { costs: ["your slack", "your own maintenance", "the help you didn't ask for"], variance: "wide", reversibility: "reversible" },
        bands: [
          { name: "solid", weight: 2, outcome: { line: "You hold it together and it holds you together less. Doing it alone is honourable and slowly unsustainable; both are true.", effects: { gauge: { timeStructure: -1 }, conditionsSet: ["care-load"] } } },
          { name: "poor", weight: 2, failure: true, outcome: { line: "You run yourself down to nothing trying to be everything. You can't hold someone up from underwater; the load needed sharing.", effects: { gauge: { healthEnergy: -1 }, conditionsSet: ["care-load", "run-down"] } } },
        ],
      },
      {
        id: "opt-share-load",
        label: "share the load — ask, arrange, delegate by task",
        chips: { costs: ["admitting you can't do it all", "the coordination"], variance: "moderate", reversibility: "reversible" },
        flags: ["recovery"],
        sensitivity: { skill: "asks-for-help" },
        bands: [
          { name: "strong", weight: 3, outcome: { line: "You hand out named tasks and let people show up, and they do. The care gets better and you stay standing. Asking was the whole skill.", effects: { skills: ["asks-for-help", "steadies-others"], conditionsSet: ["care-load"], gauge: { connection: 1 } } } },
          { name: "solid", weight: 2, outcome: { line: "Partial help, real relief. You're still stretched, but the load has more than one shoulder under it now.", effects: { conditionsSet: ["care-load"] } } },
        ],
      },
      {
        id: "opt-endure-care",
        label: "when there's no good move, tend it and find who can hold you",
        chips: { costs: ["accepting a hard thing you can't fix"], variance: "narrow", reversibility: "reversible" },
        flags: ["endurance"],
        supportLink: "/topics/relationships",
        bands: [
          { name: "solid", weight: 3, outcome: { line: "Some stretches aren't problems to solve, only to get through with company. You find the people who can hold you, and you let them.", effects: { conditionsSet: ["care-load"], skills: ["steadies-others"] } } },
          { name: "mixed", weight: 2, outcome: { line: "It stays hard, because it is hard. What changes is that you stop carrying it as if being unable to fix it were a failure.", effects: { conditionsSet: ["care-load"] } } },
        ],
      },
    ],
  },
  {
    id: "card-midgame-aims",
    act: 7,
    family: "inner",
    setup:
      "You catch yourself still chasing a goal you set a long time ago, out of momentum more than wanting. People revise their aims; the question is whether you'll do it on purpose or by drift.",
    options: [
      {
        id: "opt-keep-goal",
        label: "recommit to the old goal, eyes open",
        chips: { costs: ["what you're saying no to by saying yes again"], variance: "moderate", reversibility: "reversible" },
        bands: [
          { name: "solid", weight: 3, outcome: { line: "You choose it again, and chosen-again is different from never-questioned. The goal is the same; your relationship to it isn't.", effects: {} } },
          { name: "mixed", weight: 2, outcome: { line: "You keep it partly from habit, partly from fear of the empty space if you dropped it. Honest, at least, about which is which.", effects: {} } },
        ],
      },
      {
        id: "opt-revise-goal",
        label: "revise what you're aiming at",
        chips: { costs: ["the sunk years", "admitting the map changed"], variance: "moderate", reversibility: "reversible" },
        flags: ["recovery"],
        bands: [
          { name: "strong", weight: 3, outcome: { line: "You update the aim to the person you actually are now. A respec isn't starting over — the base stats come with you.", effects: { skills: ["recovers-fast"] } } },
          { name: "solid", weight: 2, outcome: { line: "The new aim fits better, even if it's smaller. Off your old schedule isn't behind; there was never a schedule, only a story about one.", effects: {} } },
        ],
      },
    ],
  },
  {
    id: "card-midgame-tend",
    act: 7,
    family: "health",
    mechanicLink: "recovery",
    recoveryCard: true,
    setup:
      "In the middle of carrying everyone else, your own maintenance has quietly lapsed. Nothing alarming yet — just the accumulation that becomes alarming if it keeps accumulating.",
    options: [
      {
        id: "opt-defer-self",
        label: "keep deferring; others come first",
        chips: { costs: ["the invoice, still compounding"], variance: "moderate", reversibility: "reversible" },
        bands: [
          { name: "mixed", weight: 3, outcome: { line: "You keep everyone afloat and let your own upkeep slide. Noble and shortsighted; the person holding others up needs holding too.", effects: { gauge: { healthEnergy: -1 } } } },
          { name: "poor", weight: 2, failure: true, outcome: { line: "The deferral catches up in a way you can't ignore, and now recovery is the expensive project maintenance would have prevented.", effects: { gauge: { healthEnergy: -1 }, conditionsSet: ["run-down"] } } },
        ],
      },
      {
        id: "opt-tend-self",
        label: "put your own upkeep back on the list",
        chips: { costs: ["taking time you feel you can't spare"], variance: "narrow", reversibility: "reversible" },
        flags: ["recovery"],
        bands: [
          { name: "strong", weight: 3, outcome: { line: "You put the oxygen mask on first, and everyone you're carrying is steadier for it. The counterfactual collapse simply doesn't come.", effects: { gauge: { healthEnergy: 1 }, conditionsClear: ["run-down"], conditionsSet: ["well-tended"] } } },
          { name: "solid", weight: 2, outcome: { line: "A small, unglamorous return to upkeep. It won't feel like an achievement, which is precisely why it usually gets skipped.", effects: { gauge: { healthEnergy: 1 } } } },
        ],
      },
    ],
  },
];

/* ============================ ACT 8 — Later life ============================ */

const ACT8: DecisionCard[] = [
  {
    id: "card-late-transmit",
    act: 8,
    family: "people",
    mechanicLink: "party",
    setup:
      "You've got something worth passing on — a craft, a story, a way of doing a thing well. You can hoard it, or take the time and patience to actually hand it over to someone coming up.",
    options: [
      {
        id: "opt-hold-knowledge",
        label: "keep it; there's never quite time",
        chips: { costs: ["something that ends with you"], variance: "narrow", reversibility: "costly to undo" },
        bands: [
          { name: "solid", weight: 2, outcome: { line: "It stays yours, complete and unshared. Nothing is lost that anyone can see, which is the quiet tragedy of the thing.", effects: {} } },
          { name: "mixed", weight: 2, outcome: { line: "You mean to pass it on someday. Someday is a place a lot of good things go to wait, and then not get done.", effects: {} } },
        ],
      },
      {
        id: "opt-pass-on",
        label: "take the time to hand it over",
        chips: { costs: ["patience", "watching them do it worse before better"], variance: "moderate", reversibility: "reversible" },
        flags: ["recovery"],
        bands: [
          { name: "strong", weight: 3, outcome: { line: "You teach it slowly and badly and then well, and it outlives you in someone else's hands. This is a kind of winning the package never listed.", effects: { skills: ["steadies-others"], relationships: [{ id: "rel-someone-younger", label: "someone coming up", quality: 2 }], gauge: { connection: 1 } } } },
          { name: "solid", weight: 2, outcome: { line: "Some of it lands, some doesn't, and the trying itself is the gift. What's passed on was never only the technique.", effects: { relationships: [{ id: "rel-someone-younger", label: "someone coming up", quality: 1 }] } } },
        ],
      },
    ],
  },
  {
    id: "card-late-letgo",
    act: 8,
    family: "inner",
    setup:
      "A role you've held for years — the one people call you for, the one you're 'the person who' — is asking to be set down. Holding on is comfortable. Letting go makes room, and admits time is finite.",
    options: [
      {
        id: "opt-hold-role",
        label: "hold on to the role",
        chips: { costs: ["the room it takes up", "the person who could grow into it"], variance: "moderate", reversibility: "reversible" },
        bands: [
          { name: "solid", weight: 2, outcome: { line: "You keep it, and the identity it gives you. Fair — as long as holding on isn't quietly refusing to let the next stretch begin.", effects: {} } },
          { name: "mixed", weight: 2, outcome: { line: "You hold it a little past its time, and the grip starts to cost more than the role gives. Hard to feel from the inside.", effects: {} } },
        ],
      },
      {
        id: "opt-let-go",
        label: "set it down, on purpose",
        chips: { costs: ["a loss of standing", "sitting with who you are without it"], variance: "moderate", reversibility: "costly to undo" },
        flags: ["recovery"],
        bands: [
          { name: "strong", weight: 3, outcome: { line: "You hand it over cleanly and find there's a person underneath the role, intact. Making room turns out to be its own kind of generosity.", effects: { skills: ["steadies-others"], gauge: { timeStructure: 1 } } } },
          { name: "solid", weight: 2, outcome: { line: "It's a smaller life and a lighter one. The standing you lose you don't miss as much as you feared; the room you gain is real.", effects: { gauge: { timeStructure: 1 } } } },
        ],
      },
    ],
  },
  {
    id: "card-late-mend",
    act: 8,
    family: "people",
    mechanicLink: "recovery",
    recoveryCard: true,
    setup:
      "There's an old estrangement you could still do something about — a bridge left unrepaired long enough that repairing it means going first, with no promise it lands. Some doors close on their own if you wait.",
    options: [
      {
        id: "opt-leave-it",
        label: "leave it; too much water under it",
        chips: { costs: ["the door quietly closing"], variance: "narrow", reversibility: "costly to undo" },
        bands: [
          { name: "solid", weight: 2, outcome: { line: "You let it lie, and there's a peace in accepting some things stay unmended. Not every bridge is yours alone to rebuild.", effects: {} } },
          { name: "mixed", weight: 2, outcome: { line: "You leave it, and a small window closes that you half-wanted open. Whether that's acceptance or avoidance, only you know.", effects: {} } },
        ],
      },
      {
        id: "opt-reach-out",
        label: "reach out first, no guarantee",
        chips: { costs: ["pride", "the risk of no reply"], variance: "wide", reversibility: "reversible" },
        flags: ["recovery"],
        bands: [
          { name: "strong", weight: 2, outcome: { line: "You go first, and something long-frozen thaws a little. It doesn't fix everything; it opens the door, which is all reaching out can do.", effects: { relationships: [{ id: "rel-estranged", label: "someone once close", quality: 1 }], gauge: { connection: 1 } } } },
          { name: "solid", weight: 3, outcome: { line: "The reply is cool or absent, and still — you did the reaching, and that's yours to keep regardless of how it was received.", effects: { skills: ["recovers-fast"] } } },
        ],
      },
    ],
  },
];

/* ============================ END OF LIFE — the quiet phase (act 9) ============================ */

const EOL: DecisionCard[] = [
  {
    id: "card-eol-unfinished",
    act: 9,
    family: "inner",
    setup:
      "Near the end there's usually one small unfinished thing that's yours to choose about — not a problem to solve, just a last unhurried gesture. A word to someone, or simply some rest.",
    options: [
      {
        id: "opt-say-it",
        label: "say the thing you'd regret leaving unsaid",
        chips: { costs: ["being open one more time"], variance: "narrow", reversibility: "reversible" },
        flags: ["recovery"],
        bands: [
          { name: "strong", weight: 3, outcome: { line: "You say it plainly, and it's received, and it was worth the openness. Some things only get lighter once they're finally out loud.", effects: { relationships: [{ id: "rel-someone-close-eol", label: "someone who stayed", quality: 1 }] } } },
          { name: "solid", weight: 2, outcome: { line: "You say it as best you can. However it lands, it's out of you now, and that was the part that was yours to do.", effects: {} } },
        ],
      },
      {
        id: "opt-rest",
        label: "let it be, and rest",
        chips: { costs: ["nothing left to prove"], variance: "narrow", reversibility: "reversible" },
        flags: ["recovery"],
        bands: [
          { name: "solid", weight: 3, outcome: { line: "You let the last unfinished thing stay unfinished, on purpose, and rest. Not everything needs completing; some things need only stopping.", effects: {} } },
        ],
      },
    ],
  },
];

/* ============================ Aggregate + helpers ============================ */

export const ALL_CARDS: DecisionCard[] = [
  ...ACT1,
  ...ACT2,
  ...ACT3,
  ...ACT4,
  ...ACT5,
  ...ACT6,
  ...ACT7,
  ...ACT8,
  ...EOL,
  ...DENSITY_CARDS,
];

export const CARD_BY_ID: Record<string, DecisionCard> = Object.fromEntries(
  ALL_CARDS.map((c) => [c.id, c]),
);

export function cardsForAct(actNumber: number): DecisionCard[] {
  return ALL_CARDS.filter((c) => c.act === actNumber);
}
