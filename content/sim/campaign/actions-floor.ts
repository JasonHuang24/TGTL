/**
 * THE FLOOR SET (blueprint 4.0 §3.4, LITERAL) — rest/maintain, wait, and
 * seek-help.
 *
 * These three are available and affordable in EVERY campaign state, at zero pips,
 * in every season, from every hand, in every mode. They carry `floor: true`, which
 * makes `availability()` return true unconditionally and `seasonBands` irrelevant,
 * and they cost nothing, so they remain playable at a completely drained budget.
 *
 * Why this is written down rather than assumed: the failure mode of a life
 * simulation is a state where the honest moves have all been priced out and the
 * only affordable thing left is the thing that hurts. S-10 and S-13 assert the
 * floor across whole fleets, drained states included; this file is what they are
 * asserting about.
 *
 * Voice rules that bind all three: rest is a real action and never "skip turn";
 * asking for help is a normal strategic move and never a penalty; waiting is a
 * choice with its own cost and its own upside, not a forfeit.
 */

import type { SimAction } from "@/content/sim/schema";

export const FLOOR_ACTIONS: SimAction[] = [
  {
    id: "act-rest-maintain",
    family: "health",
    domains: ["health", "capacity"],
    label: "Rest and maintain",
    scene:
      "Nothing this season has to be advanced. Sleep, food, the appointment you keep putting off, the room you keep meaning to sort out. The unglamorous half of staying able to do things.",
    contract: {
      costs: {},
      reversibility: "reversible",
      variance: "narrow",
      opportunityNote: "A season spent holding the floor is a season not spent building on it.",
      evidenceLabel: "evidence-informed",
    },
    readRef: "/topics/health",
    seasonBands: [[1, 24]],
    repeatable: true,
    floor: true,
    outcomeVariants: {
      solid: [
        "The backlog of small maintenance gets cleared. The week stops feeling like it is chasing you.",
        "A quiet season. You come out of it with more to spend than you went in with.",
        "You cook most nights instead of ordering in. Cheaper, and you stop hitting the wall at four in the afternoon.",
        "The appointment you kept moving happens on a wet Tuesday morning. It takes under an hour, and then it is behind you.",
        "You sort the room out. Two bags gone, a lamp that works, a floor you can see across.",
        "You walk in the evenings, nothing ambitious about it. By the end of the season the stairs at work stop registering.",
        "You drop the thing you had agreed to and did not want. The evenings come back, and nobody minds as much as you expected.",
      ],
      mixed: [
        "Some of the season goes to recovery, some to the things that would not wait.",
        "You sleep well most nights. Some nights you are awake at two with a list you cannot put down.",
        "The appointment gets booked, moved twice, and finally kept in the last week of the season.",
        "Half the room gets sorted. The other half moves into a corner and stays there, tidier and no smaller.",
        "Proper food for the first month, then a run of late shifts and the old habits come back. Not all the way back.",
        "The repair holds for most of the season and then goes again, smaller. You know the fix now.",
        "You go through the accounts and find where the money has been leaking. Knowing does not stop it this season, but you stop being surprised.",
      ],
    },
    options: [
      {
        id: "opt-rest-hold",
        label: "Hold the floor",
        chips: {
          costs: ["a season not spent advancing anything"],
          variance: "narrow",
          reversibility: "reversible",
        },
        flags: ["recovery", "floor"],
        sensitivity: { strength: 0.3 },
        bands: [
          {
            name: "solid",
            weight: 3,
            outcome: {
              line: "You sleep properly for the first time in a while. Nothing in the world changes; you change.",
              effects: { gauge: { healthEnergy: 1 }, capability: { vitality: 2 }, maintenanceDebt: -2 },
            },
          },
          {
            name: "mixed",
            weight: 1,
            outcome: {
              line: "You rest, and rest does not fix everything. It fixes some of it.",
              effects: { gauge: { healthEnergy: 1 }, maintenanceDebt: -1 },
            },
          },
        ],
      },
      {
        id: "opt-rest-repair",
        label: "Fix the thing that keeps breaking",
        chips: {
          costs: ["the season's attention goes to one problem, not to you"],
          variance: "moderate",
          reversibility: "reversible",
        },
        flags: ["recovery", "floor"],
        sensitivity: { capability: "execution", strength: 0.4 },
        bands: [
          {
            name: "solid",
            weight: 2,
            outcome: {
              line: "The recurring problem stops recurring. A small, permanent reduction in what every week costs.",
              effects: { gauge: { timeStructure: 1 }, maintenanceDebt: -2 },
            },
          },
          {
            name: "mixed",
            weight: 2,
            outcome: {
              line: "You get most of the way through it. The rest is still there, but smaller.",
              effects: { maintenanceDebt: -1 },
            },
          },
        ],
      },
    ],
  },
  {
    id: "act-wait",
    family: "inner",
    domains: ["meaning", "optionality"],
    label: "Wait, and keep your options",
    scene:
      "You do not have to move this season. Some situations resolve themselves, some information arrives on its own, and some doors are cheaper to walk through later than now.",
    contract: {
      costs: {},
      reversibility: "reversible",
      variance: "moderate",
      opportunityNote: "Waiting is free in pips and not free in time. Some doors do close.",
      evidenceLabel: "illustrative",
    },
    readRef: "/walkthrough",
    seasonBands: [[1, 24]],
    repeatable: true,
    floor: true,
    outcomeVariants: {
      solid: [
        "Something you would have decided badly this season becomes obvious next season.",
        "The pressure comes off from the other side. Whoever wanted an answer by the spring stops asking for one, and the question sits there unasked for the rest of the season.",
        "Someone who took the same decision six weeks ahead of you tells you exactly how it went, over a bad phone line, in more detail than you asked for.",
        "The deadline you were braced for moves. What would have been a scramble in October is a thing you can now do properly, on a weekday, awake.",
        "The price on the thing you nearly committed to goes up, then down, then settles lower than it started. You are still standing where you can reach it.",
        "Two of the options you were weighing turn out to be one option under different names. Nobody points this out. You just stop confusing them.",
        "An email arrives in August answering the question you had been turning over since the spring. It reads as though it was never a question.",
      ],
      mixed: [
        "The season passes. You are where you were, with a little more information.",
        "You draft the message and leave it unsent. You come back to it in the summer and improve it, and leave it unsent again. Nothing has been lost and nothing has been said.",
        "You check on it twice, out of habit, and both times it is exactly as it was. The second check takes less out of you than the first.",
        "Someone asks what you are doing about it. You give an answer that is honest and vague, and the conversation moves on to their car.",
        "One piece of news arrives and it settles nothing. You know the timing now and not the outcome, which is half of a thing.",
        "The season goes by in shifts and dishes. When you sit down at the end of it the situation is where it was, and so, roughly, are you.",
        "Nothing you were watching moves. Something next to it does — a colleague leaves, a bus route changes — and you cannot tell yet whether that matters.",
      ],
      poor: [
        "The window you were watching closes while you are still watching it.",
        "The listing comes down. It was up for most of the season, and you looked at it every week, and now it is not there.",
        "The person you were going to ask has moved on by the time you ask. The new one does not know you and starts from nothing.",
        "The terms change while you are deciding. What was on offer in the spring is not what is on offer now, and the difference is not in your favour.",
        "Somebody else says yes to it inside a week. You hear afterwards, from them, and they are pleased, and you say the right things.",
        "The deadline you thought was soft turns out to have been the actual deadline. The email confirming this is polite and three lines long.",
        "Your name comes off a list you did not know you were on. Nobody tells you. You find out in the autumn, when you go looking.",
      ],
    },
    options: [
      {
        id: "opt-wait-hold",
        label: "Wait, and keep watching",
        chips: {
          costs: ["a season of your twelve years", "the attention it takes to keep watching"],
          variance: "moderate",
          reversibility: "reversible",
        },
        flags: ["floor"],
        sensitivity: { capability: "adaptability", strength: 0.3 },
        bands: [
          {
            name: "solid",
            weight: 2,
            outcome: {
              line: "The situation moves without you. What you did not commit is still yours to commit, and you saw it move.",
              effects: { capability: { adaptability: 1 } },
            },
          },
          {
            name: "mixed",
            weight: 3,
            outcome: { line: "Nothing much happens. That is what waiting is, most of the time.", effects: {} },
          },
          {
            name: "poor",
            weight: 1,
            failure: true,
            outcome: {
              line: "Something you were waiting on moved without you, and moved away.",
              effects: { gauge: { timeStructure: -1 } },
            },
          },
        ],
      },
      {
        id: "opt-wait-put-down",
        label: "Put it down for now",
        chips: {
          costs: ["the thread, if it needed you to hold it"],
          variance: "narrow",
          reversibility: "reversible",
        },
        flags: ["recovery", "floor"],
        sensitivity: { capability: "regulation", strength: 0.3 },
        bands: [
          {
            name: "solid",
            weight: 3,
            outcome: {
              line: "You stop turning it over. The season is quieter for it and the thing is exactly where you left it.",
              effects: { capability: { regulation: 2 }, gauge: { healthEnergy: 1 } },
            },
          },
          {
            name: "mixed",
            weight: 2,
            outcome: {
              line: "You put it down, and it comes back at odd hours anyway. Less often than it was.",
              effects: { capability: { regulation: 1 } },
            },
          },
        ],
      },
    ],
  },
  {
    id: "act-seek-help",
    family: "threshold",
    domains: ["support", "relationships", "institutions"],
    label: "Ask someone for help",
    scene:
      "Naming the problem out loud to someone who might be able to do something about it — a person you know, or a service whose whole job this is. It costs something to ask. It is a normal move, not a last one.",
    contract: {
      costs: {},
      reversibility: "reversible",
      variance: "wide",
      switchingCost: "Asking and then not following through costs a little of the credit you spent asking.",
      opportunityNote: "Help is not automatic and not free of what it costs to ask. It is still usually cheaper than not asking.",
      evidenceLabel: "evidence-informed",
    },
    readRef: "/threshold",
    seasonBands: [[1, 24]],
    repeatable: true,
    floor: true,
    outcomeVariants: {
      strong: [
        "You ask, and it turns out you were not the first — they know exactly what to do.",
        "They make one call on your behalf. Whatever was stuck comes unstuck by the end of the week.",
        "They say yes before you have finished the sentence, and then they do the part you were dreading.",
        "They read the letter properly, twice, and tell you which sentence in it is the one that matters.",
        "They have the thing you need sitting unused in a cupboard. You go home with it in a carrier bag.",
        "You catch them on a wet Sunday and they give you the afternoon. By the time the rain stops, the worst of it is handled.",
        "They know someone, and the someone turns out to be real — a name, a number, and a door that opens.",
      ],
      solid: [
        "They put it in writing for you — one paragraph, their name at the bottom — and the paragraph does what two weeks of your phone calls could not.",
        "It takes three conversations and two weeks of waiting, and then the thing you asked about is actually handled.",
        "You explain it badly the first time and properly the second. The second time gets you what you came for.",
        "The deadline moves. Not cancelled, moved, and the new one is far enough out that you can actually meet it.",
        "You come away with the practical half: what to say, who to say it to, and which day they actually answer.",
        "Nothing about it is dramatic. The problem is smaller on Friday than it was on Monday.",
        "They spot the error. It is theirs, months old, and undoing it takes one phone call. What is left afterwards is still yours to sort.",
      ],
      mixed: [
        "The help comes with a condition attached, and the condition is fair enough. It is also one more thing you now have to keep on top of.",
        "Half of what you needed turns up. The other half belongs to someone else, and nobody has their number.",
        "They mean well and they are wrong about the specifics. You act on it for a week before you notice.",
        "You wait most of the afternoon for a conversation that lasts ten minutes. The ten minutes are useful. The afternoon is gone.",
        "They give you the whole process, start to finish, in order. The first step needs a document you do not have and cannot get before the season turns.",
        "It goes fine and nothing follows. The offer stays an offer, warm and unused, for the rest of the season.",
        "They deal with the immediate thing and hand you a list of what caused it. The list is accurate. You do not have the season for the list.",
      ],
      poor: [
        "The form comes back wanting something you have already sent. You send it again.",
        "You get through to someone who is not the right someone, and the right someone is not in this week.",
        "You spend the season on hold. The hold music becomes familiar and nothing else about the situation does.",
        "You are eligible for the help you do not need and not for the help you do. No one can tell you why.",
        "The appointment lands on a Tuesday you cannot get out of work for. The next opening is in the spring.",
        "You explain it from the beginning to a fourth person, and the call drops halfway through.",
        "The letter arrives after the date it was about, in an envelope with your name spelled wrong.",
      ],
    },
    options: [
      {
        id: "opt-help-person",
        label: "Ask a person you know",
        chips: {
          costs: ["some of the credit you have with them", "the discomfort of asking"],
          variance: "wide",
          reversibility: "reversible",
        },
        flags: ["recovery", "floor"],
        sensitivity: { gauge: "connection", capability: "socialNavigation", strength: 0.5 },
        bands: [
          {
            name: "strong",
            weight: 2,
            outcome: {
              line: "They can help, and they do. The problem is smaller by the end of the conversation.",
              effects: { gauge: { connection: 1 }, maintenanceDebt: -1, capability: { regulation: 1 } },
            },
          },
          {
            name: "solid",
            weight: 3,
            outcome: {
              line: "They cannot fix it, but they can carry part of it. That turns out to be most of what you needed.",
              effects: { gauge: { connection: 1 }, capability: { regulation: 1 } },
            },
          },
          {
            name: "mixed",
            weight: 2,
            outcome: {
              line: "They listen. They cannot do much. Something in you is lighter anyway, and the problem is the same size.",
              effects: { capability: { regulation: 1 } },
            },
          },
        ],
      },
      {
        id: "opt-help-service",
        label: "Go to a service whose job this is",
        chips: {
          costs: ["forms, waiting, and explaining yourself to a stranger"],
          variance: "wide",
          reversibility: "reversible",
          positionNotes: [
            { when: "start:place-bound", text: "Getting there is the hard part from where you are." },
            { when: "start:no-backstop", text: "There is no one else to ask first, which makes this the first move rather than the third." },
          ],
        },
        flags: ["recovery", "endurance", "floor"],
        supportLink: "/triage",
        sensitivity: { capability: "execution", systemicFlags: ["waitlist", "coverage-gap"], strength: 0.5 },
        bands: [
          {
            name: "solid",
            weight: 2,
            outcome: {
              line: "It is slow and it is bureaucratic and at the end of it something real has changed.",
              effects: { gauge: { money: 1 }, maintenanceDebt: -1 },
            },
          },
          {
            name: "mixed",
            weight: 3,
            outcome: {
              line: "You get pointed somewhere else. It is not nothing, and it is not what you wanted.",
              effects: { flagsSet: ["knows-the-route"] },
            },
          },
          {
            name: "poor",
            weight: 2,
            failure: true,
            outcome: {
              line: "The queue is long and you are on it. Nothing changes this season except that you are now in the system.",
              effects: { flagsSet: ["waitlist"] },
            },
          },
        ],
      },
    ],
  },
];

/** The ids the floor assertion checks for. Changing this list changes the floor. */
export const FLOOR_ACTION_IDS = FLOOR_ACTIONS.map((a) => a.id);
