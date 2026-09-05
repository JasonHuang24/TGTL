/**
 * THE DECISION LAB'S CONTENT (blueprint 4.0 §3.8, Phase 1).
 *
 * Standalone situations authored under the FULL schemas — this is the engine's
 * proving content, and it is deliberately written to the same bar as the campaign
 * so that "the engine works" and "the content is good" are the same claim.
 *
 * THE CURATION RULES, honored structurally (§3.8, LITERAL, checked by S-1):
 *   - No loss-tier beat is contained or scheduled in any window, on any branch.
 *     Lab content never touches the beat channel; there is no field here for it.
 *   - Every window stays VALID on every branch under every declared axis. That is
 *     why every Lab action below carries NO prerequisites, NO requiresFlags, NO
 *     excludesFlags, and the full season range: a draw-vary or position-vary
 *     branch cannot render a committed choice unavailable mid-window. The window
 *     is curated, never fizzled.
 *   - Every position named in `positions` is a real preset, so position-vary
 *     compares two authored starting positions rather than an invented one.
 */

import type { LabSituation, SimAction } from "@/content/sim/schema";

/* =========================================================================
   Lab actions
   ========================================================================= */

const A = (a: SimAction): SimAction => a;

export const LAB_ACTIONS: SimAction[] = [
  /* ---- Situation 1: the offer and the course ---- */
  A({
    id: "lab-take-the-offer",
    family: "work",
    domains: ["work", "income", "optionality"],
    label: "The offer, and the course",
    scene:
      "A job comes up that you could start on Monday. It pays now and teaches you nothing. The course you were going to do starts the same week, costs money you would rather keep, and pays nothing for two years.",
    contract: {
      costs: { timeStructure: 2, energy: 1 },
      reversibility: "costly to undo",
      switchingCost: "Leaving either one partway costs you the time you put in and some of the goodwill.",
      variance: "moderate",
      opportunityNote: "Whichever you take, the other one is not sitting there waiting at the same price.",
      evidenceLabel: "evidence-informed",
    },
    readRef: "/map/credential-decision",
    seasonBands: [[1, 24]],
    options: [
      {
        id: "lab-opt-take-job",
        label: "Take the job",
        chips: { costs: ["the course place, at this price", "two years of not compounding a skill"], variance: "narrow", reversibility: "costly to undo" },
        sensitivity: { capability: "execution", strength: 0.4 },
        bands: [
          {
            name: "solid",
            weight: 3,
            outcome: {
              line: "You start Monday. Money comes in from the first week and the work is exactly what it looked like.",
              effects: { gauge: { money: 1 }, flagsSet: ["employed"], capability: { execution: 1 } },
            },
          },
          {
            name: "mixed",
            weight: 2,
            outcome: {
              line: "The job is smaller than it sounded. It pays, and it is not going anywhere in particular.",
              effects: { gauge: { money: 1 }, flagsSet: ["employed"] },
            },
          },
        ],
      },
      {
        id: "lab-opt-take-course",
        label: "Take the course",
        chips: { costs: ["the money, up front", "two years before it pays anything"], variance: "wide", reversibility: "costly to undo" },
        sensitivity: { capability: "learning", skill: "study-habits", strength: 0.5 },
        bands: [
          {
            name: "strong",
            weight: 2,
            outcome: {
              line: "You enroll. It is harder than the brochure and better than it looked, and by the end of term you can do something you could not do.",
              effects: { gauge: { money: -1 }, skills: ["formal-training"], capability: { learning: 2 }, flagsSet: ["enrolled"] },
            },
          },
          {
            name: "mixed",
            weight: 3,
            outcome: {
              line: "You enroll. Some of it is what you wanted and some of it is admin, and the money is gone either way.",
              effects: { gauge: { money: -1 }, capability: { learning: 1 }, flagsSet: ["enrolled"] },
            },
          },
          {
            name: "poor",
            weight: 1,
            failure: true,
            outcome: {
              line: "The course is not the one that was advertised. You are in it now, and the fee is not coming back.",
              effects: { gauge: { money: -1 }, flagsSet: ["enrolled"] },
            },
          },
        ],
      },
      {
        id: "lab-opt-both",
        label: "Try to do both",
        chips: { costs: ["the week, entirely", "doing neither of them properly"], variance: "wide", reversibility: "reversible" },
        sensitivity: { gauge: "healthEnergy", capability: "regulation", strength: 0.6 },
        bands: [
          {
            name: "solid",
            weight: 2,
            outcome: {
              line: "It fits, barely. Both things happen and nothing else does.",
              effects: { gauge: { money: 1, healthEnergy: -1 }, flagsSet: ["employed", "enrolled"], capability: { execution: 1 } },
            },
          },
          {
            name: "poor",
            weight: 3,
            failure: true,
            outcome: {
              line: "Something has to give and it is the course. You are still in the job, and the fee is spent.",
              effects: { gauge: { money: -1, healthEnergy: -1 }, flagsSet: ["employed"] },
            },
          },
        ],
      },
    ],
  }),
  A({
    id: "lab-follow-through",
    family: "school",
    domains: ["skill", "practice", "work"],
    label: "The middle of it",
    scene:
      "Four months in. The novelty is gone and the thing is just work now. This is the part nobody photographs, and it is the part that decides whether any of it compounds.",
    contract: {
      costs: { timeStructure: 1, energy: 2 },
      reversibility: "reversible",
      variance: "moderate",
      evidenceLabel: "evidence-informed",
    },
    readRef: "/walkthrough",
    seasonBands: [[1, 24]],
    options: [
      {
        id: "lab-opt-grind",
        label: "Keep showing up",
        chips: { costs: ["the energy, every week, with nothing to show weekly"], variance: "narrow", reversibility: "reversible" },
        sensitivity: { capability: "execution", strength: 0.5 },
        bands: [
          {
            name: "solid",
            weight: 3,
            outcome: {
              line: "Nothing dramatic. By the end of it you are noticeably better at the thing than you were, which is how that works.",
              effects: { capability: { execution: 2, learning: 1 }, skills: ["deliberate-practice"] },
            },
          },
          {
            name: "mixed",
            weight: 2,
            outcome: {
              line: "You keep at it and the progress is slower than you expected. It is still progress.",
              effects: { capability: { execution: 1 } },
            },
          },
        ],
      },
      {
        id: "lab-opt-ask-for-help",
        label: "Get someone to look at it",
        chips: { costs: ["admitting the middle is hard", "some of the credit you have with them"], variance: "wide", reversibility: "reversible" },
        flags: ["recovery"],
        sensitivity: { gauge: "connection", capability: "socialNavigation", strength: 0.5 },
        bands: [
          {
            name: "strong",
            weight: 2,
            outcome: {
              line: "They spot in ten minutes what you have been going round for a month. The month was not wasted; it is why you could hear the answer.",
              effects: { capability: { learning: 2 }, gauge: { connection: 1 }, skills: ["deliberate-practice"] },
            },
          },
          {
            name: "mixed",
            weight: 3,
            outcome: {
              line: "They are generous and not much use. You are where you were, and less alone in it.",
              effects: { gauge: { connection: 1 } },
            },
          },
        ],
      },
      {
        id: "lab-opt-ease-off",
        label: "Ease off for a while",
        chips: { costs: ["momentum, which is expensive to restart"], variance: "moderate", reversibility: "reversible" },
        flags: ["recovery"],
        sensitivity: { gauge: "healthEnergy", strength: 0.4 },
        bands: [
          {
            name: "solid",
            weight: 2,
            outcome: {
              line: "You stop pushing and something in you unclenches. When you come back, you come back able.",
              effects: { gauge: { healthEnergy: 1 }, capability: { vitality: 2 } },
            },
          },
          {
            name: "mixed",
            weight: 3,
            outcome: {
              line: "You ease off. Getting going again turns out to cost more than you saved.",
              effects: { gauge: { healthEnergy: 1 }, capability: { execution: -1 } },
            },
          },
        ],
      },
    ],
  }),
  A({
    id: "lab-the-review",
    family: "threshold",
    domains: ["work", "recognition", "optionality"],
    label: "Where it got you",
    scene:
      "The end of the stretch. Somebody senior is going to give you an assessment, and it is going to be based partly on what you did and partly on things that were never yours.",
    contract: {
      costs: { energy: 1 },
      reversibility: "reversible",
      variance: "wide",
      evidenceLabel: "illustrative",
    },
    readRef: "/topics/work",
    seasonBands: [[1, 24]],
    options: [
      {
        id: "lab-opt-make-the-case",
        label: "Make the case for yourself",
        chips: { costs: ["being visible about it, which not everyone enjoys"], variance: "wide", reversibility: "reversible" },
        sensitivity: { capability: "socialNavigation", constraintFlags: ["start:no-backstop"], strength: 0.5 },
        bands: [
          {
            name: "strong",
            weight: 2,
            outcome: {
              line: "You say what you did, plainly, with the evidence. It lands, and it is remembered next time something comes up.",
              effects: { flagsSet: ["known-quantity"], gauge: { connection: 1 }, capability: { socialNavigation: 2 } },
            },
          },
          {
            name: "mixed",
            weight: 3,
            outcome: {
              line: "You make the case. It is heard and filed, and the decision had already been made elsewhere.",
              effects: { capability: { socialNavigation: 1 } },
            },
          },
          {
            name: "poor",
            weight: 1,
            failure: true,
            outcome: {
              line: "It comes out as more than you meant and lands as less than you hoped. The room adjusts its read of you slightly.",
              effects: { gauge: { connection: -1 } },
            },
          },
        ],
      },
      {
        id: "lab-opt-let-work-speak",
        label: "Let the work speak",
        chips: { costs: ["the chance that nobody is listening to it"], variance: "wide", reversibility: "reversible" },
        sensitivity: { capability: "execution", strength: 0.5 },
        bands: [
          {
            name: "solid",
            weight: 2,
            outcome: {
              line: "Someone who was paying attention noticed. It counts for exactly as much as their attention is worth.",
              effects: { flagsSet: ["known-quantity"], capability: { execution: 1 } },
            },
          },
          {
            name: "mixed",
            weight: 3,
            outcome: {
              line: "The work was good and the room was busy. It goes down as fine.",
              effects: {},
            },
          },
        ],
      },
    ],
  }),

  /* ---- Situation 2: the move ---- */
  A({
    id: "lab-the-move",
    family: "home",
    domains: ["housing", "place", "optionality"],
    label: "Whether to move for it",
    scene:
      "The thing you want is four hundred miles away. Going means a deposit you would have to find, a network you would have to rebuild, and being somewhere the openings actually are. Staying means keeping what you have built and taking what is local.",
    contract: {
      costs: { timeStructure: 2, money: 2 },
      reversibility: "costly to undo",
      switchingCost: "Coming back costs another deposit and another year of being the new one.",
      variance: "wide",
      opportunityNote: "Every person who would answer your call at two in the morning is currently where you are.",
      evidenceLabel: "evidence-informed",
    },
    readRef: "/map/launch",
    seasonBands: [[1, 24]],
    options: [
      {
        id: "lab-opt-go",
        label: "Go",
        chips: { costs: ["the deposit", "everyone who knows you"], variance: "wide", reversibility: "costly to undo",
          positionNotes: [
            { when: "start:place-bound", text: "There is a reason you are here, and it does not move with you." },
            { when: "start:no-backstop", text: "If it does not work, there is no spare room to come back to." },
          ] },
        sensitivity: { gauge: "money", capability: "adaptability", constraintFlags: ["start:place-bound", "start:caring-duty"], strength: 0.6 },
        bands: [
          {
            name: "strong",
            weight: 2,
            outcome: {
              line: "It works. Within a season you are somewhere things happen, and the things start happening to you.",
              effects: { gauge: { money: -1, connection: -1 }, flagsSet: ["relocated"], capability: { adaptability: 2 } },
            },
          },
          {
            name: "mixed",
            weight: 3,
            outcome: {
              line: "You are there. The openings are real and so is the fact that you know nobody.",
              effects: { gauge: { money: -1, connection: -1 }, flagsSet: ["relocated"], capability: { adaptability: 1 } },
            },
          },
          {
            name: "poor",
            weight: 2,
            failure: true,
            outcome: {
              line: "The deposit is gone, the thing you moved for did not hold, and the network you had is four hundred miles behind you.",
              effects: { gauge: { money: -2, connection: -1 }, flagsSet: ["relocated"] },
            },
          },
        ],
      },
      {
        id: "lab-opt-stay",
        label: "Stay, and work the local ground",
        chips: { costs: ["the openings that are somewhere else"], variance: "moderate", reversibility: "reversible" },
        sensitivity: { gauge: "connection", constraintFlags: ["start:place-bound"], strength: 0.5 },
        bands: [
          {
            name: "solid",
            weight: 3,
            outcome: {
              line: "You stay. What you have here keeps compounding, and it is a smaller pond than the one you were looking at.",
              effects: { gauge: { connection: 1 }, capability: { socialNavigation: 1 } },
            },
          },
          {
            name: "mixed",
            weight: 2,
            outcome: {
              line: "You stay and the local ground turns out to be thinner than it looked. Nothing is lost; nothing much moves.",
              effects: {},
            },
          },
        ],
      },
    ],
  }),
  A({
    id: "lab-first-season-there",
    family: "people",
    domains: ["relationships", "support", "place"],
    label: "The first season anywhere new",
    scene:
      "Whether you moved or stayed, this season is about who is around you. Building a bench takes time you would rather spend on the work, and not building one is a bill that arrives later.",
    contract: {
      costs: { timeStructure: 1, energy: 1 },
      reversibility: "reversible",
      variance: "moderate",
      evidenceLabel: "evidence-informed",
    },
    readRef: "/topics/relationships",
    seasonBands: [[1, 24]],
    options: [
      {
        id: "lab-opt-build-bench",
        label: "Put the time into people",
        chips: { costs: ["hours that would otherwise be the work"], variance: "moderate", reversibility: "reversible" },
        sensitivity: { capability: "socialNavigation", strength: 0.5 },
        bands: [
          {
            name: "solid",
            weight: 3,
            outcome: {
              line: "By the end of the season there are three people who would answer. That is not a small thing, and it took the whole season.",
              effects: { gauge: { connection: 1 }, capability: { socialNavigation: 1 } },
            },
          },
          {
            name: "mixed",
            weight: 2,
            outcome: {
              line: "You put yourself about. Some of it takes, most of it is politeness, and it is a start.",
              effects: { capability: { socialNavigation: 1 } },
            },
          },
        ],
      },
      {
        id: "lab-opt-head-down",
        label: "Head down on the work",
        chips: { costs: ["a bench you will want later"], variance: "moderate", reversibility: "reversible" },
        sensitivity: { capability: "execution", strength: 0.5 },
        bands: [
          {
            name: "solid",
            weight: 3,
            outcome: {
              line: "You get a great deal done. The room stays a room full of strangers.",
              effects: { capability: { execution: 2 }, gauge: { connection: -1 } },
            },
          },
          {
            name: "mixed",
            weight: 2,
            outcome: {
              line: "The work goes fine and the isolation costs more energy than you budgeted for.",
              effects: { capability: { execution: 1 }, gauge: { healthEnergy: -1, connection: -1 } },
            },
          },
        ],
      },
    ],
  }),
  A({
    id: "lab-the-bill-arrives",
    family: "money",
    domains: ["money", "stability", "support"],
    label: "The unexpected bill",
    scene:
      "Something breaks that has to be fixed. It is not a catastrophe and it is not optional, and how much it hurts depends almost entirely on things you decided months ago.",
    contract: {
      costs: { money: 1 },
      reversibility: "reversible",
      variance: "moderate",
      evidenceLabel: "evidence-informed",
    },
    readRef: "/topics/money",
    seasonBands: [[1, 24]],
    options: [
      {
        id: "lab-opt-absorb",
        label: "Absorb it",
        chips: { costs: ["whatever the buffer was for"], variance: "narrow", reversibility: "reversible" },
        sensitivity: { gauge: "money", constraintFlags: ["start:no-backstop"], strength: 0.7 },
        bands: [
          {
            name: "solid",
            weight: 3,
            outcome: {
              line: "You pay it and move on. It registers as an annoyance rather than an event.",
              effects: { gauge: { money: -1 } },
            },
          },
          {
            name: "poor",
            weight: 2,
            failure: true,
            outcome: {
              line: "There was nothing to absorb it with. Paying it means not paying something else, and that becomes next season's problem.",
              effects: { gauge: { money: -1 }, maintenanceDebt: 2 },
            },
          },
        ],
      },
      {
        id: "lab-opt-ask",
        label: "Ask someone to cover it",
        chips: { costs: ["the asking", "the ledger it starts"], variance: "wide", reversibility: "reversible" },
        flags: ["recovery"],
        sensitivity: { gauge: "connection", constraintFlags: ["start:no-backstop"], strength: 0.6 },
        bands: [
          {
            name: "solid",
            weight: 3,
            outcome: {
              line: "Someone covers it. It is genuinely fine, and there is now a thing between you that was not there before.",
              effects: { gauge: { connection: -1 }, flagsSet: ["owes-someone"] },
            },
          },
          {
            name: "mixed",
            weight: 2,
            outcome: {
              line: "The person you ask cannot. They are sorry about it and it does not change the bill.",
              effects: { maintenanceDebt: 1 },
            },
          },
        ],
      },
    ],
  }),

  /* ---- Situation 3: the run of interviews ---- */
  A({
    id: "lab-apply-widely",
    family: "work",
    domains: ["work", "income"],
    label: "Putting the applications out",
    scene:
      "Twelve applications, or three that are properly tailored. Both take the same evenings. One of them is a numbers game and one of them is a craft, and neither of them is the whole story.",
    contract: {
      costs: { timeStructure: 1, energy: 1 },
      reversibility: "reversible",
      variance: "very wide",
      evidenceLabel: "evidence-informed",
    },
    readRef: "/topics/work",
    seasonBands: [[1, 24]],
    repeatable: true,
    outcomeVariants: {
      strong: [
        "One reply, and it is the one you would have picked.",
        "Two replies, and the one you wanted least turns out to be the interesting one.",
      ],
      solid: [
        "Two come back. One of them is worth a Tuesday afternoon.",
        "One reply, and it is the one you would have picked.",
      ],
      mixed: ["A reply arrives from the one you cared about least. You take the interview anyway."],
      poor: ["Nothing comes back. There is no information in that, which is the hardest part of it."],
    },
    options: [
      {
        id: "lab-opt-volume",
        label: "Send twelve",
        chips: { costs: ["the evenings", "twelve chances to be generic"], variance: "very wide", reversibility: "reversible" },
        sensitivity: { capability: "execution", strength: 0.35 },
        bands: [
          { name: "solid", weight: 2, outcome: { line: "Two come back. One of them is worth a Tuesday afternoon.", effects: { flagsSet: ["interview-pending"] } } },
          { name: "mixed", weight: 3, outcome: { line: "A reply arrives from the one you cared about least. You take the interview anyway.", effects: { flagsSet: ["interview-pending"] } } },
          { name: "poor", weight: 2, failure: true, outcome: { line: "Nothing comes back. There is no information in that, which is the hardest part of it.", effects: { gauge: { healthEnergy: -1 } } } },
        ],
      },
      {
        id: "lab-opt-tailor",
        label: "Send three, properly",
        chips: { costs: ["the evenings", "nine chances you did not take"], variance: "wide", reversibility: "reversible" },
        sensitivity: { capability: "learning", skill: "academic-writing", strength: 0.5 },
        bands: [
          { name: "strong", weight: 2, outcome: { line: "One reply, and it is the one you would have picked.", effects: { flagsSet: ["interview-pending"] } } },
          { name: "mixed", weight: 3, outcome: { line: "One polite no and two silences. The letters were good; the timing was not.", effects: {} } },
          { name: "poor", weight: 2, failure: true, outcome: { line: "Three noes. Well-written applications to three roles that were already filled internally.", effects: { gauge: { healthEnergy: -1 } } } },
        ],
      },
    ],
  }),
  A({
    id: "lab-the-interview",
    family: "work",
    domains: ["work", "recognition"],
    label: "The room itself",
    scene:
      "Forty-five minutes with two people who have already read four applications today. You can prepare for most of it and not for the part where they decide whether they like you.",
    contract: {
      costs: { energy: 1 },
      reversibility: "reversible",
      variance: "very wide",
      evidenceLabel: "evidence-informed",
    },
    readRef: "/topics/work",
    seasonBands: [[1, 24]],
    options: [
      {
        id: "lab-opt-prepare-hard",
        label: "Prepare properly",
        chips: { costs: ["the week before it"], variance: "wide", reversibility: "reversible" },
        sensitivity: { capability: "execution", strength: 0.5 },
        bands: [
          { name: "strong", weight: 2, outcome: { line: "You know the answers to the questions they ask, and you are calm enough to give them. It goes as well as it can go.", effects: { flagsSet: ["offer-pending"], capability: { execution: 1 } } } },
          { name: "solid", weight: 3, outcome: { line: "Solid. Nothing goes wrong, nothing catches fire, and it comes down to the other candidates.", effects: { capability: { socialNavigation: 1 } } } },
          { name: "poor", weight: 2, failure: true, outcome: { line: "It goes to someone with three years on you. Nothing you did in the room changed that.", effects: {} } },
        ],
      },
      {
        id: "lab-opt-go-in-cold",
        label: "Go in on what you know",
        chips: { costs: ["the margin, if a question goes sideways"], variance: "very wide", reversibility: "reversible" },
        sensitivity: { capability: "adaptability", strength: 0.5 },
        bands: [
          { name: "strong", weight: 2, outcome: { line: "You are loose and specific and it reads as confidence. They liked you.", effects: { flagsSet: ["offer-pending"], capability: { socialNavigation: 2 } } } },
          { name: "mixed", weight: 2, outcome: { line: "Fine in the parts you knew, thin in the parts you did not.", effects: {} } },
          { name: "poor", weight: 3, failure: true, outcome: { line: "A question you could have answered with an evening's work, answered badly. It decides it.", effects: { gauge: { healthEnergy: -1 } } } },
        ],
      },
    ],
  }),
  A({
    id: "lab-what-comes-back",
    family: "threshold",
    domains: ["work", "recovery"],
    label: "What comes back",
    scene:
      "The answer arrives, or it does not. Either way there is a next move, and the next move is the part that is actually yours.",
    contract: {
      costs: { energy: 1 },
      reversibility: "reversible",
      variance: "moderate",
      evidenceLabel: "illustrative",
    },
    readRef: "/situations/job-loss",
    seasonBands: [[1, 24]],
    options: [
      {
        id: "lab-opt-ask-why",
        label: "Ask them what was missing",
        chips: { costs: ["hearing it"], variance: "moderate", reversibility: "reversible" },
        flags: ["recovery"],
        sensitivity: { capability: "regulation", strength: 0.4 },
        bands: [
          { name: "solid", weight: 3, outcome: { line: "They tell you, more or less honestly. It is one specific gap, and it is closable.", effects: { skills: ["reads-feedback"], capability: { adaptability: 2 } } } },
          { name: "mixed", weight: 2, outcome: { line: "You get a form letter with a sentence of encouragement in it. Not nothing, not much.", effects: { capability: { regulation: 1 } } } },
        ],
      },
      {
        id: "lab-opt-move-on",
        label: "Put it down and go again",
        chips: { costs: ["whatever there was to learn from it"], variance: "narrow", reversibility: "reversible" },
        flags: ["recovery"],
        sensitivity: { capability: "regulation", strength: 0.4 },
        bands: [
          { name: "solid", weight: 3, outcome: { line: "You do not spend two weeks on it. The next application goes out on Thursday.", effects: { capability: { regulation: 2 } } } },
          { name: "mixed", weight: 2, outcome: { line: "You move on, carrying the same gap into the next one without having looked at it.", effects: { capability: { regulation: 1 } } } },
        ],
      },
    ],
  }),

  /* ---- Situation 4: the falling-out ---- */
  A({
    id: "lab-the-falling-out",
    family: "people",
    domains: ["relationships", "repair"],
    label: "After the falling-out",
    scene:
      "Something was said, or not said, and it has been three weeks. They have not been in touch and neither have you. Whatever happens next is not going to happen by itself.",
    contract: {
      costs: { energy: 1 },
      reversibility: "reversible",
      switchingCost: "Reaching out and then going quiet again costs more than not reaching out.",
      variance: "wide",
      opportunityNote: "You can decide what you do. You cannot decide what they do with it.",
      evidenceLabel: "evidence-informed",
    },
    readRef: "/topics/relationships",
    seasonBands: [[1, 24]],
    options: [
      {
        id: "lab-opt-go-first",
        label: "Go first",
        chips: { costs: ["being the one who went first, with no guarantee"], variance: "wide", reversibility: "reversible" },
        flags: ["recovery"],
        sensitivity: { capability: "socialNavigation", strength: 0.45 },
        bands: [
          {
            name: "solid",
            weight: 3,
            outcome: {
              line: "You say the specific thing rather than the general one. They take a day, and then they answer.",
              effects: { relationships: [{ id: "arc-friend-mo", quality: 1 }], companions: [{ arcId: "arc-friend-mo", repair: 1 }] },
            },
          },
          {
            name: "mixed",
            weight: 3,
            outcome: {
              line: "You make the attempt. They read it and do not reply this month. What you did was still the thing to do.",
              effects: { companions: [{ arcId: "arc-friend-mo", repair: 1 }] },
            },
          },
        ],
      },
      {
        id: "lab-opt-name-it",
        label: "Say what actually bothered you",
        chips: { costs: ["the argument you have been avoiding"], variance: "very wide", reversibility: "costly to undo" },
        sensitivity: { capability: "regulation", strength: 0.5 },
        bands: [
          {
            name: "strong",
            weight: 2,
            outcome: {
              line: "It is a difficult hour and at the end of it you both know what the actual disagreement was. That is worth more than three weeks of quiet.",
              effects: { relationships: [{ id: "arc-friend-mo", quality: 1 }], capability: { socialNavigation: 2 }, companions: [{ arcId: "arc-friend-mo", repair: 1 }] },
            },
          },
          {
            name: "mixed",
            weight: 3,
            outcome: {
              line: "You name it. They hear a different sentence than the one you said, and it takes a while to sort out which.",
              effects: { companions: [{ arcId: "arc-friend-mo", repair: 1 }] },
            },
          },
          {
            name: "poor",
            weight: 2,
            failure: true,
            outcome: {
              line: "It comes out sharper than you meant. They ask for some space, and asking for space is theirs to ask for.",
              effects: { relationships: [{ id: "arc-friend-mo", quality: -1 }] },
            },
          },
        ],
      },
      {
        id: "lab-opt-leave-it",
        label: "Leave it where it is",
        chips: { costs: ["the friendship, slowly, if this is the pattern"], variance: "moderate", reversibility: "reversible" },
        sensitivity: { strength: 0.3 },
        bands: [
          { name: "mixed", weight: 3, outcome: { line: "Nothing happens. In four months you will both refer to it as one of those things that fizzled.", effects: {} } },
          { name: "poor", weight: 2, outcome: { line: "The silence sets. Neither of you did anything unforgivable, and it is over anyway.", effects: { relationships: [{ id: "arc-friend-mo", quality: -1 }], companions: [{ arcId: "arc-friend-mo", neglect: 1 }] } } },
        ],
      },
    ],
  }),
  A({
    id: "lab-the-next-month",
    family: "people",
    domains: ["relationships", "reliability"],
    label: "The month after",
    scene:
      "Whatever you did, there is a month after it, and what happens in that month is mostly about whether you keep doing the ordinary maintenance or whether the gesture was the whole of it.",
    contract: {
      costs: { timeStructure: 1 },
      reversibility: "reversible",
      variance: "moderate",
      evidenceLabel: "evidence-informed",
    },
    readRef: "/topics/relationships",
    seasonBands: [[1, 24]],
    options: [
      {
        id: "lab-opt-keep-showing-up",
        label: "Keep showing up",
        chips: { costs: ["a standing hour a week, indefinitely"], variance: "narrow", reversibility: "reversible" },
        sensitivity: { capability: "execution", strength: 0.45 },
        bands: [
          { name: "solid", weight: 3, outcome: { line: "Nothing dramatic. You are the person who turns up, and after a few months that is a fact about you rather than an effort.", effects: { relationships: [{ id: "arc-friend-mo", quality: 1 }], gauge: { connection: 1 } } } },
          { name: "mixed", weight: 2, outcome: { line: "You keep at it and they are busy. The turning up counts anyway; it just does not show yet.", effects: { companions: [{ arcId: "arc-friend-mo", repair: 1 }] } } },
        ],
      },
      {
        id: "lab-opt-let-it-settle",
        label: "Let it settle on its own",
        chips: { costs: ["the momentum you had"], variance: "moderate", reversibility: "reversible" },
        sensitivity: { strength: 0.3 },
        bands: [
          { name: "solid", weight: 2, outcome: { line: "It settles. Some things do, without anyone doing anything, and it is a real outcome.", effects: {} } },
          { name: "mixed", weight: 3, outcome: { line: "It does not so much settle as go quiet, which looks the same from the outside.", effects: { companions: [{ arcId: "arc-friend-mo", neglect: 1 }] } } },
        ],
      },
    ],
  }),
];

export const LAB_ACTION_BY_ID: Record<string, SimAction> = Object.fromEntries(LAB_ACTIONS.map((a) => [a.id, a]));

/* =========================================================================
   The situations
   ========================================================================= */

export const LAB_SITUATIONS: LabSituation[] = [
  {
    id: "lab-offer-or-course",
    title: "The offer and the course",
    sourceRefs: ["/map/credential-decision", "/topics/work"],
    window: ["lab-take-the-offer", "lab-follow-through", "lab-the-review"],
    face: "school",
    axes: ["choice-vary", "draw-vary"],
    seeds: { handSeed: "lab-offer-hand", drawSeed: "lab-offer-draw-a", altDrawSeed: "lab-offer-or-course-alt-0" },
    positions: ["preset-supported-explorer", "preset-working-under-pressure"],
    startPresetId: "preset-supported-explorer",
    noPredictionNote: true,
    evidenceLabel: "evidence-informed",
  },
  {
    id: "lab-move-or-stay",
    title: "Whether to move for it",
    sourceRefs: ["/map/launch", "/topics/relationships"],
    window: ["lab-the-move", "lab-first-season-there", "lab-the-bill-arrives"],
    face: "home",
    axes: ["position-vary", "choice-vary", "draw-vary"],
    seeds: { handSeed: "lab-move-hand", drawSeed: "lab-move-draw-a", altDrawSeed: "lab-move-or-stay-alt-0" },
    positions: ["preset-supported-explorer", "preset-care-constrained-builder"],
    startPresetId: "preset-supported-explorer",
    noPredictionNote: true,
    evidenceLabel: "evidence-informed",
  },
  {
    id: "lab-the-search",
    title: "A run at getting hired",
    sourceRefs: ["/topics/work", "/situations/job-loss"],
    window: ["lab-apply-widely", "lab-the-interview", "lab-what-comes-back"],
    face: "work",
    axes: ["draw-vary", "choice-vary", "position-vary"],
    seeds: { handSeed: "lab-search-hand", drawSeed: "lab-search-draw-a", altDrawSeed: "lab-the-search-alt-0" },
    positions: ["preset-credential-route", "preset-recovery-and-relaunch"],
    startPresetId: "preset-credential-route",
    noPredictionNote: true,
    evidenceLabel: "evidence-informed",
  },
  {
    id: "lab-the-repair",
    title: "After the falling-out",
    sourceRefs: ["/topics/relationships"],
    window: ["lab-the-falling-out", "lab-the-next-month"],
    face: "people",
    axes: ["choice-vary", "draw-vary"],
    seeds: { handSeed: "lab-repair-hand", drawSeed: "lab-repair-draw-a", altDrawSeed: "lab-the-repair-alt-0" },
    positions: ["preset-supported-explorer", "preset-working-under-pressure"],
    startPresetId: "preset-supported-explorer",
    noPredictionNote: true,
    evidenceLabel: "evidence-informed",
  },
];

export const LAB_SITUATION_BY_ID: Record<string, LabSituation> = Object.fromEntries(
  LAB_SITUATIONS.map((s) => [s.id, s]),
);
