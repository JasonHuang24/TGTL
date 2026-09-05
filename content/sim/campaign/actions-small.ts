/**
 * THE SMALL MOVES (blueprint 4.0 §3.4, §7.5) — one cheap, unconditional action
 * in each of the nine families.
 *
 * WHY THESE EXIST, on the record. S-10's per-season telemetry, once it learned to
 * count affordable options BEYOND the free floor set, found seasons in which a
 * depleted character's only affordable moves were rest, wait and ask. The floor
 * gate passed — three actions across three families, floor set complete — and the
 * season was still rails, because everything the pool actually offered cost more
 * than the season had. Nothing in the authored pool cost less than two pips.
 *
 * The fix is not a cheaper floor or a more generous budget. It is that a life at
 * its thinnest still contains small moves, and a model that says otherwise is
 * lying about the thing it is hardest and most important to be honest about. So:
 * one action per family, one pip, no prerequisites, the whole window. Small
 * enough to be affordable at the bottom, and real enough to be worth taking —
 * each of them compounds if you keep doing it and does very little if you do it
 * once, which is what small moves are.
 *
 * They are NOT floor actions: they cost something, they can go wrong, and they
 * are not guaranteed. What they guarantee is that the sandbox has a floor above
 * the floor.
 */

import type { SimAction } from "@/content/sim/schema";

const smallContract = (variance: SimAction["contract"]["variance"], currency: "timeStructure" | "energy" | "money") =>
  ({
    costs: { [currency]: 1 } as SimAction["contract"]["costs"],
    reversibility: "reversible" as const,
    variance,
    evidenceLabel: "illustrative" as const,
  });

export const SMALL_ACTIONS: SimAction[] = [
  {
    id: "act-small-sort-one-room",
    family: "home",
    domains: ["housing", "stability"],
    label: "Sort out one room",
    scene:
      "Not the whole apartment. One room, or one corner of one room, taken from the state it has drifted into back to the state it is supposed to be in.",
    contract: { ...smallContract("narrow", "energy"), opportunityNote: "An evening, and the thing you would rather have done with it." },
    readRef: "/topics/health",
    seasonBands: [[1, 24]],
    repeatable: true,
    recoveryRefs: ["act-rest-maintain"],
    outcomeVariants: {
      solid: [
        "You clear the front room on a Tuesday, and on the Friday someone comes over without you having to tidy first.",
        "The kitchen counter is clear by nine. You cook properly twice that week, standing up, with the radio on.",
        "You do the corner by the door — coats, post, shoes in a row. Coming in stops being a small negotiation.",
        "Rain all Sunday, so it is the bedroom. You work with the window open and the room smells of wet street for days.",
        "Behind the same chair you find the charger you replaced, a letter you meant to answer in March, and the good scissors.",
        "You put the desk back the way it was when you moved in. That night you sit at it and finish something that had been sliding.",
        "The bathroom takes an hour and most of the hot water. For a couple of weeks you keep noticing the tiles are white.",
      ],
      mixed: [
        "The room is right and the cupboard you shoved half of it into is not. You know exactly what is behind that door.",
        "The room is done and the hallway now looks worse beside it. You have made yourself another evening's work.",
        "It takes the whole evening instead of the hour you promised it, and the thing you meant to do after does not happen.",
        "You get most of it, then move a box out of the way and agree with yourself to deal with it later. It is still there weeks on.",
        "Halfway through you stop to sort the papers properly, and lose the rest of the night to reading them. The room ends up half right.",
        "It looks right for four days. By the following weekend the surfaces are back to being where things land.",
        "You run out of bags halfway. Two full ones and a half-full one sit by the door until you next get to the shop.",
      ],
    },
    options: [
      {
        id: "opt-small-room-do-it",
        label: "Get it done",
        chips: { costs: ["an evening"], variance: "narrow", reversibility: "reversible" },
        flags: ["recovery"],
        sensitivity: { capability: "execution", strength: 0.3 },
        bands: [
          {
            name: "solid",
            weight: 3,
            outcome: {
              line: "One room is right. You keep noticing it for about a week, and the week is better for it.",
              effects: { maintenanceDebt: -1, capability: { execution: 1 } },
            },
          },
          {
            name: "mixed",
            weight: 2,
            outcome: { line: "It is sorted and it does not feel like anything. Sometimes the reward is late.", effects: { maintenanceDebt: -1 } },
          },
        ],
      },
      {
        id: "opt-small-room-throw-out",
        label: "Get rid of things instead",
        chips: { costs: ["an evening", "things you might have wanted"], variance: "moderate", reversibility: "locks in" },
        sensitivity: { capability: "regulation", strength: 0.3 },
        bands: [
          {
            name: "solid",
            weight: 3,
            outcome: { line: "Two bags out. The room is emptier and so, slightly, are you, in the good way.", effects: { gauge: { timeStructure: 1 } } },
          },
          {
            name: "mixed",
            weight: 2,
            outcome: { line: "You get rid of a few things and keep the ones that were the problem.", effects: {} },
          },
        ],
      },
    ],
  },
  {
    id: "act-small-read-one-thing",
    family: "school",
    domains: ["skill", "learning"],
    label: "Read one thing properly",
    scene:
      "One article, one chapter, one manual — read all the way through with the phone somewhere else, rather than half-read in four sittings.",
    contract: { ...smallContract("narrow", "timeStructure"), opportunityNote: "An hour that will not feel like it produced anything." },
    readRef: "/walkthrough",
    seasonBands: [[1, 24]],
    repeatable: true,
    recoveryRefs: ["act-rest-maintain"],
    outcomeVariants: {
      solid: [
        "Read once, properly. It stays.",
        "One sitting on a wet Sunday, the kettle on twice. By the end you could say what the argument actually is, in your own words.",
        "Two chapters in, you find you have been doing something at work the long way round for months. On Monday you do it the short way.",
        "You get to the section everyone skips. The thing that has quietly annoyed you all year turns out to have a setting.",
        "It argues, carefully, against a thing you had half decided to do. By the end you have dropped the idea and cannot see the case for it any more.",
        "It makes sense of something you read months ago and could not follow at the time. The two lock together and both stay.",
        "The apartment is quiet for an hour and you give the hour to this. You come away knowing where to find the part you will need again.",
      ],
      mixed: [
        "You read it twice across two weeks and most of it will not go in. In the middle is the one paragraph you actually came for.",
        "It is drier than it looked. You finish it out of stubbornness and could not tell anyone what was in the middle of it.",
        "The phone is in the other room and your attention wanders off without it. You get the shape of the thing and none of the detail.",
        "You mean to give it an hour and give it two. Some of it lands and the rest goes past as words.",
        "It is pitched at someone who already knows more than you do, and it contradicts something you were fairly sure of. You finish with no way of telling which is wrong.",
        "It turns out to be the wrong article; the right one is cited inside it. You read it through anyway and note where the other lives.",
        "You read it on a hot afternoon with the window open and the street loud underneath. It goes in about as well as that suggests.",
      ],
    },
    options: [
      {
        id: "opt-small-read-through",
        label: "All the way through",
        chips: { costs: ["an hour that produces nothing visible"], variance: "narrow", reversibility: "reversible" },
        sensitivity: { capability: "learning", strength: 0.35 },
        bands: [
          {
            name: "solid",
            weight: 3,
            outcome: { line: "You finish it and something in it turns out to be useful within the month.", effects: { capability: { learning: 1 } } },
          },
          { name: "mixed", weight: 2, outcome: { line: "You read it. Most of it is gone by Thursday and one line is not.", effects: {} } },
        ],
      },
      {
        id: "opt-small-read-notes",
        label: "Read it and write it down",
        chips: { costs: ["the hour, and then some"], variance: "narrow", reversibility: "reversible" },
        sensitivity: { capability: "execution", strength: 0.35 },
        bands: [
          {
            name: "solid",
            weight: 3,
            outcome: { line: "Written down, it turns from something you read into something you know.", effects: { capability: { learning: 1, execution: 1 } } },
          },
          { name: "mixed", weight: 2, outcome: { line: "The notes are good and you do not look at them again.", effects: { capability: { learning: 1 } } } },
        ],
      },
    ],
  },
  {
    id: "act-small-one-message",
    family: "people",
    domains: ["relationships", "support"],
    label: "Send one message",
    scene:
      "To the person you keep meaning to message. Not a conversation, not a plan — a message, sent, today, about nothing in particular.",
    contract: { ...smallContract("moderate", "energy"), opportunityNote: "Very little, which is the point of it." },
    readRef: "/topics/relationships",
    seasonBands: [[1, 24]],
    repeatable: true,
    recoveryRefs: ["act-seek-help"],
    outcomeVariants: {
      solid: [
        "A short exchange about nothing. The thread is open again.",
        "They ring instead of typing. Twenty minutes on the bus home, and neither of you mentions how long it has been.",
        "They send back a photograph of a half-painted kitchen, and the evening goes on arguing about the color.",
        "They answer while you are in the queue at the shop, and you keep answering one-handed, in the rain.",
        "It turns out they had been meaning to message you. You get there first, and they say so.",
        "They answer, then ask when you are next around. You give them a week that works.",
        "The reply is waiting when you wake up, and it is longer than what you sent.",
      ],
      mixed: [
        "They send back a thumbs-up and nothing else. Something went across, but not much of it.",
        "The answer is cheerful and could have been sent to anyone. You cannot tell whether you caught a bad week.",
        "You get four sentences, three of them about work. Still, four sentences.",
        "They apologize for being slow before they say anything else, and that takes up most of the message.",
        "It goes well for three exchanges and then trails off on a Thursday. Neither of you closes it.",
        "They answer from an airport, distracted and kind, and say properly soon. Soon is not a date.",
        "The reply is warm and arrives a week late, by which time the thing you wanted to say has gone stale.",
      ],
      poor: [
        "Nothing comes back. The message sits at the top of the thread all week, read on Monday.",
        "No reply. You check on Tuesday, and again on Friday, and then stop checking.",
        "It goes out late and lands under whatever else arrived that night. Nothing surfaces it.",
        "Silence. You draft a follow-up on Sunday, decide it is too soon, and leave it unsent.",
        "Their phone has been off for days, as far as you can tell. The message is delivered and nothing more.",
        "Someone else mentions them on Wednesday, seen at the weekend and fine. They still have not written back.",
        "No answer. Something buzzes on Thursday evening and you notice yourself hoping it is them.",
      ],
    },
    options: [
      {
        id: "opt-small-message-nothing",
        label: "About nothing in particular",
        chips: { costs: ["the small effort of going first"], variance: "moderate", reversibility: "reversible" },
        flags: ["recovery"],
        sensitivity: { capability: "socialNavigation", strength: 0.3 },
        bands: [
          {
            name: "solid",
            weight: 3,
            outcome: {
              line: "They answer within the hour and it is easy, the way it used to be.",
              effects: { gauge: { connection: 1 } },
            },
          },
          { name: "mixed", weight: 2, outcome: { line: "They answer two days later and warmly. Two days is not a verdict.", effects: {} } },
          { name: "poor", weight: 1, outcome: { line: "No answer this week. People are busy, and you did the part that was yours.", effects: {} } },
        ],
      },
      {
        id: "opt-small-message-ask",
        label: "Ask them how they actually are",
        chips: { costs: ["the answer, if it is a long one"], variance: "wide", reversibility: "reversible" },
        flags: ["recovery"],
        sensitivity: { gauge: "connection", capability: "socialNavigation", strength: 0.4 },
        bands: [
          {
            name: "solid",
            weight: 3,
            outcome: { line: "It turns into a real conversation, and they needed it more than you did.", effects: { gauge: { connection: 1 }, capability: { socialNavigation: 1 } } },
          },
          { name: "mixed", weight: 2, outcome: { line: "Fine, they say, and then a bit of the real answer at the end.", effects: {} } },
        ],
      },
    ],
  },
  {
    id: "act-small-one-shift-more",
    family: "work",
    domains: ["work", "income"],
    label: "Pick up one extra shift",
    scene: "One. Not a pattern, not a conversation about hours — a single shift someone else could not do.",
    contract: { ...smallContract("moderate", "energy"), opportunityNote: "One weekend, and the tiredness that follows it into Monday." },
    readRef: "/topics/work",
    seasonBands: [[1, 24]],
    repeatable: true,
    recoveryRefs: ["act-rest-maintain"],
    outcomeVariants: {
      solid: [
        "The schedule goes up on Thursday with no gap in it, and nobody has to chase anybody about the weekend.",
        "The duty manager takes your answer without making anything of it, then moves straight on to the delivery times.",
        "Weekend rate is the only reason the question is ever a question, and you had your answer in before the schedule went up.",
        "Somebody in the break room weighed the same weekend against the same pay and answered it the other way. By Monday neither answer is news.",
        "It does not turn into a standing arrangement. The next time the schedule is short, the ask goes round the whole group and not straight to you.",
        "Monday starts on time and stays that way. Somebody has finally fixed the coffee machine, and the day goes by.",
        "Payday comes and the month lands about where you had it in your head.",
      ],
      mixed: [
        "Nobody says anything either way. You cannot tell whether it registered with anyone but the person who had to sort the cover, and by Thursday you stop wondering.",
        "The schedule comes out filled. Someone in the break room makes a remark about it that you turn over twice on the way home.",
        "You work out what the difference actually comes to. It is real money and not much of it, and knowing that does not settle the question.",
        "Somebody assumes you answered the other way, and you leave it. Correcting it would take longer than it is worth.",
        "Your name comes up first the next time it happens. You cannot tell whether that is the answer you gave or whether it was always going to be you.",
        "It is settled by Friday, and the same question comes round again the Friday after, phrased more hopefully. You leave it until the morning.",
        "You explain the answer to somebody who did not ask for the reasons, and hear yourself going on longer than the thing deserved.",
      ],
    },
    options: [
      {
        id: "opt-small-shift-take",
        label: "Take it",
        chips: { costs: ["a weekend", "the Monday afterwards"], variance: "moderate", reversibility: "reversible" },
        sensitivity: { gauge: "healthEnergy", strength: 0.4 },
        bands: [
          { name: "solid", weight: 3, outcome: { line: "The money lands and it covers the thing it was for.", effects: { gauge: { money: 1 } } } },
          {
            name: "mixed",
            weight: 2,
            outcome: { line: "The money helps and you are still catching up on the sleep two weeks later.", effects: { gauge: { money: 1, healthEnergy: -1 } } },
          },
        ],
      },
      {
        id: "opt-small-shift-decline-well",
        label: "Say no, and say it early",
        chips: { costs: ["the money you did not take"], variance: "narrow", reversibility: "reversible" },
        sensitivity: { capability: "socialNavigation", strength: 0.3 },
        bands: [
          {
            name: "solid",
            weight: 3,
            outcome: { line: "You give them enough notice to fill it. Saying no early is a thing people remember kindly.", effects: { capability: { socialNavigation: 1 }, gauge: { healthEnergy: 1 } } },
          },
          { name: "mixed", weight: 2, outcome: { line: "You decline. It costs nothing and it is noted.", effects: {} } },
        ],
      },
    ],
  },
  {
    id: "act-small-check-the-numbers",
    family: "money",
    domains: ["money", "stability"],
    label: "Actually look at the numbers",
    scene:
      "Open the account, read it, and write down what is going out and when. Half an hour of the thing you have been avoiding for a month.",
    contract: { ...smallContract("narrow", "timeStructure"), opportunityNote: "Knowing, which is not always the comfortable option." },
    readRef: "/topics/money",
    seasonBands: [[1, 24]],
    repeatable: true,
    recoveryRefs: ["act-seek-help"],
    outcomeVariants: {
      solid: [
        "Half an hour, and the shape of the month stops being a rumour.",
        "A price you never agreed to went up in the spring. One phone call, hold music, and it goes back down, with the difference owed to you.",
        "Two things are still going out that you had forgotten about. One stops the same afternoon. The other you note for when the term is up.",
        "Sunday morning, rain on the glass, the whole month on one page. It fits on one page, which is the part that surprises you.",
        "A refund you were owed has been sitting unclaimed since last year. It takes ten minutes and a password reset to start it moving.",
        "You set the account to tell you when it drops below a line you pick. It is the first time the bank finds out after you do.",
        "You work backwards from the last payday and find the same tight week every month. You move one bill off it and the week loosens.",
      ],
      mixed: [
        "You get most of it down. Two payments you cannot place at all, and the bank's own description for them is three letters and a date.",
        "Nothing in it shocks you, and nothing in it is slack either. The things still going out are all things you actually use.",
        "The month reads fine until you remember the yearly one that lands in spring. It goes on the list, and the list stops looking tidy.",
        "It takes the whole evening rather than half an hour. The dates get written down; you are too tired by then to do anything with them.",
        "You cancel one thing and sign up for another the same week without quite deciding to. The month comes out about level.",
        "You do the reading, then leave the paper face down on the table for two weeks. It is still there, still true, when you come back.",
        "The shared account is the part you cannot read on your own. You write down what is yours and leave the rest for a conversation you have not had yet.",
      ],
    },
    options: [
      {
        id: "opt-small-numbers-look",
        label: "Read it and write it down",
        chips: { costs: ["half an hour", "finding out"], variance: "narrow", reversibility: "reversible" },
        flags: ["recovery"],
        sensitivity: { skill: "budgeting", capability: "execution", strength: 0.35 },
        bands: [
          {
            name: "solid",
            weight: 3,
            outcome: { line: "It is roughly what you thought, and two things are cancellable.", effects: { gauge: { money: 1 }, skills: ["budgeting"] } },
          },
          {
            name: "mixed",
            weight: 2,
            outcome: { line: "It is worse than you thought in one place and better in another.", effects: { skills: ["budgeting"] } },
          },
        ],
      },
      {
        id: "opt-small-numbers-cancel",
        label: "Cancel the smallest thing",
        chips: { costs: ["the thing, which you did use sometimes"], variance: "narrow", reversibility: "reversible" },
        sensitivity: { strength: 0.3 },
        bands: [
          { name: "solid", weight: 3, outcome: { line: "Gone, and unmissed. A small permanent improvement to every month.", effects: { gauge: { money: 1 } } } },
          { name: "mixed", weight: 2, outcome: { line: "Cancelled. You notice it twice and then stop noticing it.", effects: {} } },
        ],
      },
    ],
  },
  {
    id: "act-small-one-walk",
    family: "health",
    domains: ["health", "capacity"],
    label: "Get out of the building",
    scene: "A walk, at a time you would not normally take one, without deciding first that it is the start of anything.",
    contract: { ...smallContract("narrow", "energy"), opportunityNote: "Forty minutes." },
    readRef: "/topics/health",
    seasonBands: [[1, 24]],
    repeatable: true,
    recoveryRefs: ["act-rest-maintain"],
    outcomeVariants: {
      solid: [
        "Frost on the cars and air sharp enough to feel in your teeth. Everything you pass is very clear-edged, and you go faster than you meant to just to stay warm.",
        "You take the long way, past the reservoir. Cold air off the water, the light going orange, and by the turn you have stopped walking like you are late for something.",
        "Rain that never quite commits. You go out under it anyway and come back with damp shoulders and an appetite you have not had since morning.",
        "Early, before the shops open. Delivery vans, someone hosing the sidewalk, one bakery already warm. You are back before the apartment has properly woken up.",
        "Dusk, and a street you have never been down — front gardens, a cat on a wall, scales being practiced badly through an open window. You go the long way home.",
        "The hill you always drive past. Your legs complain halfway up and then stop, and the whole town lies out flat and small behind you.",
        "Nothing notable. Sidewalk, lights, the bridge, the same again backwards. Your shoulders are down by the time you get in, and they stay down.",
      ],
      mixed: [
        "It turns into an errand halfway through — the shop, the parcel place, home. Air and daylight, technically, taken at the speed of a list.",
        "Wind against you on the way out and somehow against you on the way back. You are glad to be indoors and mildly glad you went.",
        "You set off later than you meant to and turn back at the corner. Still outside, still air, just less of it than you had in mind.",
        "Wrong shoes, and you know it inside the first ten minutes. The whole loop gets done anyway, and your heels are still saying so at bedtime.",
        "Roadworks the whole length of the park road, so you walk beside the noise. You get the air and none of the quiet.",
        "You keep half an eye on the time, working out what is left of the evening. Your legs are looser at the end of it, at any rate.",
        "A call that cannot wait comes in twenty minutes along, and most of the rest of it happens standing at a corner. The last stretch home is brisk and a bit grim.",
      ],
    },
    options: [
      {
        id: "opt-small-walk-alone",
        label: "On your own",
        chips: { costs: ["forty minutes"], variance: "narrow", reversibility: "reversible" },
        flags: ["recovery"],
        sensitivity: { strength: 0.25 },
        bands: [
          {
            name: "solid",
            weight: 3,
            outcome: { line: "You come back different from how you left, in the small way that keeps being true.", effects: { gauge: { healthEnergy: 1 }, capability: { vitality: 1 } } },
          },
          { name: "mixed", weight: 2, outcome: { line: "It is a walk. It is fine. You are slightly better for it than not.", effects: { capability: { vitality: 1 } } } },
        ],
      },
      {
        id: "opt-small-walk-with",
        label: "With someone",
        chips: { costs: ["forty minutes", "arranging it"], variance: "moderate", reversibility: "reversible" },
        flags: ["recovery"],
        sensitivity: { gauge: "connection", strength: 0.3 },
        bands: [
          {
            name: "solid",
            weight: 3,
            outcome: { line: "Two things at once, and neither of them worse for it.", effects: { gauge: { healthEnergy: 1, connection: 1 } } },
          },
          { name: "mixed", weight: 2, outcome: { line: "They cancel. You go anyway, which counts.", effects: { capability: { vitality: 1 } } } },
        ],
      },
    ],
  },
  {
    id: "act-small-one-form",
    family: "civic",
    domains: ["institutions", "stability"],
    label: "Deal with one piece of paperwork",
    scene:
      "The letter on the side. The form with the deadline that has not arrived yet. One item off the pile that grows quietly whether you look at it or not.",
    contract: { ...smallContract("narrow", "timeStructure"), opportunityNote: "An afternoon on hold, possibly." },
    readRef: "/topics/money",
    seasonBands: [[1, 24]],
    repeatable: true,
    recoveryRefs: ["act-seek-help"],
    outcomeVariants: {
      solid: [
        "Sorted, and it was less than you had been imagining.",
        "An hour at the kitchen table with the radio on. The deadline you had been dreading turns out to be a month further off than you thought.",
        "You find the reference number on the back of an older letter, and the thing that had been stuck comes unstuck.",
        "Someone picks up on the second ring and does the whole thing at their end while you are still reading out the address.",
        "Rain all afternoon, so you stay in with it. By the time it stops you are further along than you had planned to get.",
        "Two of them want nothing from you at all — a notice, a duplicate. The pile was heavier than what was actually in it.",
        "You write every date in one place, on paper, somewhere you will see it. That turns out to be most of the work.",
      ],
      mixed: [
        "You get most of it done and then need a document you do not have. It is in a drawer somewhere, probably.",
        "The website logs you out twice. You get there in the end, later than the afternoon you had set aside for it.",
        "Half the afternoon goes on the wrong form. The right one is shorter, and by then you have no appetite left for it.",
        "You handle the one with the date on it and leave the rest where it is. That is progress, and it is not the pile.",
        "It goes fine until a question you cannot answer without asking someone. You leave it open on the table.",
        "Sorted enough to know what is in there. What is in there includes something you were happier not knowing about.",
        "You do it, and afterwards you are not sure you have done it. No confirmation comes, and there is nothing to check it against.",
      ],
      poor: [
        "The office closes at four and you get there at ten past. The same journey again, another day.",
        "The form wants a document you cannot get without a different form first. Both go back in the envelope.",
        "You send it off, and it comes back the following week — wrong address, unsigned page, start again.",
        "Their system is down all afternoon. Call back tomorrow, the recorded voice says, and tomorrow is a work day.",
        "You fill it in and then see that the version you printed is out of date. The current one wants things you would have to look up.",
        "An hour of the afternoon goes on it and the pile looks exactly as it did. Whatever you moved, you moved sideways.",
        "You give up somewhere in the third section and put the television on. The letter stays where it was, face down.",
      ],
    },
    options: [
      {
        id: "opt-small-form-do-it",
        label: "Just do it",
        chips: { costs: ["an afternoon, possibly on hold"], variance: "moderate", reversibility: "reversible" },
        flags: ["recovery"],
        sensitivity: { capability: "execution", systemicFlags: ["waitlist"], strength: 0.35 },
        bands: [
          {
            name: "solid",
            weight: 3,
            outcome: { line: "Done in one sitting. The pile is one shorter and you know what is in it now.", effects: { maintenanceDebt: -1, capability: { execution: 1 } } },
          },
          { name: "mixed", weight: 2, outcome: { line: "Half done. They need something you have to request from someone else first.", effects: {} } },
          {
            name: "poor",
            weight: 1,
            outcome: { line: "Forty minutes on hold and then the line drops. The letter goes back on the side.", effects: { maintenanceDebt: 1 } },
          },
        ],
      },
      {
        id: "opt-small-form-sort-the-pile",
        label: "Sort the pile instead",
        chips: { costs: ["the afternoon", "not actually finishing anything"], variance: "narrow", reversibility: "reversible" },
        sensitivity: { capability: "execution", strength: 0.3 },
        bands: [
          {
            name: "solid",
            weight: 3,
            outcome: { line: "Nothing is finished and everything is now in an order. Half the weight of a pile is not knowing what is in it.", effects: { gauge: { timeStructure: 1 } } },
          },
          { name: "mixed", weight: 2, outcome: { line: "You sort it. Two things in there are more urgent than you knew.", effects: { maintenanceDebt: 1, gauge: { timeStructure: 1 } } } },
        ],
      },
    ],
  },
  {
    id: "act-small-make-one-thing",
    family: "inner",
    domains: ["creative", "making", "meaning"],
    label: "Make one thing badly",
    scene:
      "Whatever it is you do not do because you would not be good at it. One attempt, kept small enough that being bad at it costs nothing.",
    contract: { ...smallContract("moderate", "timeStructure"), opportunityNote: "An evening, and the discomfort of being a beginner." },
    readRef: "/walkthrough",
    seasonBands: [[1, 24]],
    repeatable: true,
    recoveryRefs: ["act-rest-maintain"],
    outcomeVariants: {
      solid: [
        "The bowl comes off the wheel thick-walled and slightly off-centre. Nothing about it is even. It holds water, which was the whole of the requirement.",
        "One evening, one thing that did not exist on Tuesday.",
        "You get flour on the radio and the loaf comes out dense. It gets eaten anyway, two slices while it is still warm and the rest wrapped for the week.",
        "The shelf is level at one end. You load it with books anyway and it holds, and you know which cut went wrong.",
        "You take the jacket sleeve in by hand. The stitches wander where you rushed, and the sleeve sits right for the first time since you got it.",
        "You draw the chair by the window. The legs come out wrong in a way you can now name, which you could not have done on Monday.",
        "You look up and it is half past eleven. The thing on the table is lopsided and it is yours.",
      ],
      mixed: [
        "The glue lets go while you are still holding the thing together. It stands for about a minute. Whatever you try next, it will not be with this glue.",
        "You get the shape of it down and then the evening goes elsewhere. It sits on the table for a week, unfinished and not thrown out.",
        "It goes wrong early and you carry on out of stubbornness. What is on the table at the end is mostly a record of where it went wrong.",
        "Halfway through you remember why you stopped doing this. You finish it anyway and it is exactly as bad as you expected.",
        "Most of the evening goes on finding the right thing to make it with. The last of it goes on making. What exists is small.",
        "The first attempt is unusable. The second is going better when you run out of evening.",
        "Someone needs the kitchen table back. You clear it away half done, and the mood does not come round again that week.",
      ],
    },
    options: [
      {
        id: "opt-small-make-finish",
        label: "Finish it, badly",
        chips: { costs: ["an evening", "being a beginner"], variance: "moderate", reversibility: "reversible" },
        sensitivity: { capability: "execution", strength: 0.3 },
        bands: [
          {
            name: "solid",
            weight: 3,
            outcome: { line: "It is bad and you made it, and those turn out to be different facts.", effects: { capability: { execution: 1, learning: 1 } } },
          },
          { name: "mixed", weight: 2, outcome: { line: "You make about half of it and stop. Half is more than none.", effects: { capability: { learning: 1 } } } },
        ],
      },
      {
        id: "opt-small-make-show",
        label: "Show it to one person",
        chips: { costs: ["being seen doing something badly"], variance: "wide", reversibility: "reversible" },
        sensitivity: { capability: "regulation", strength: 0.35 },
        bands: [
          {
            name: "solid",
            weight: 2,
            outcome: { line: "They are kind about it and specific about one part. The specific part is the useful half.", effects: { capability: { learning: 1 }, gauge: { connection: 1 } } },
          },
          { name: "mixed", weight: 3, outcome: { line: "They say it is nice. You wanted more and it was still worth showing.", effects: { capability: { regulation: 1 } } } },
        ],
      },
    ],
  },
  {
    id: "act-small-ask-one-question",
    family: "threshold",
    domains: ["support", "institutions"],
    label: "Ask one question",
    scene:
      "Not for help with the whole thing — for one specific answer, from one person or one desk who might have it. The smallest possible version of asking.",
    contract: { ...smallContract("narrow", "energy"), opportunityNote: "Very little, and it still takes something to do." },
    readRef: "/threshold",
    seasonBands: [[1, 24]],
    repeatable: true,
    recoveryRefs: ["act-seek-help"],
    outcomeVariants: {
      solid: [
        "You catch the supervisor between meetings and put it in one sentence. She answers on her way to the stairs, and the answer is the one you wanted.",
        "The woman at the counter turns her screen round so you can see it. The form you needed was the other one, and she prints it for you.",
        "You send four lines of email on a Tuesday. The reply comes back Thursday, short, and settles the thing entirely.",
        "The man on the loading dock has done this twice. He tells you what order to do it in and which part not to bother with.",
        "You ask the pharmacist instead of guessing. Two minutes at the end of the counter and you stop turning it over at night.",
        "You call at nine, when the line opens. Someone picks up, hears the whole question out, and gives you the date you needed.",
        "You ask the tutor after class while she is packing her bag. She writes the deadline on the back of your handout.",
      ],
      mixed: [
        "You get an answer and it is not the one you were hoping for. At least you can stop planning around a maybe.",
        "The desk has closed by the time you reach it. A sign gives an email address, so you write it down and walk back out into the rain.",
        "She answers confidently and the man beside her disagrees with her. You leave holding two versions of the same rule.",
        "He says he will find out and call you back. He does not call, but the question is out of your head and into someone else's.",
        "The answer arrives with three more forms attached. Something you wanted to know is now something you have to do.",
        "You get through after twenty minutes of hold music. The answer covers most of it and skirts the part you actually asked about.",
        "You ask the wrong person and they answer anyway, from memory, and you cannot tell how much of it to trust.",
      ],
    },
    options: [
      {
        id: "opt-small-ask-person",
        label: "Ask the person who would know",
        chips: { costs: ["the small discomfort of not knowing out loud"], variance: "moderate", reversibility: "reversible" },
        flags: ["recovery"],
        sensitivity: { capability: "socialNavigation", strength: 0.3 },
        bands: [
          {
            name: "solid",
            weight: 3,
            outcome: { line: "They answer it in a sentence. You had been carrying it for a month.", effects: { flagsSet: ["knows-the-route"], capability: { socialNavigation: 1 } } },
          },
          { name: "mixed", weight: 2, outcome: { line: "They half-answer it and point you at whoever has the other half.", effects: {} } },
        ],
      },
      {
        id: "opt-small-ask-desk",
        label: "Ask the desk whose job it is",
        chips: { costs: ["the queue", "explaining it twice"], variance: "moderate", reversibility: "reversible" },
        flags: ["recovery", "endurance"],
        supportLink: "/triage",
        sensitivity: { systemicFlags: ["waitlist", "coverage-gap"], strength: 0.35 },
        bands: [
          {
            name: "solid",
            weight: 2,
            outcome: { line: "It is their job and they are good at it. You leave knowing something you did not know.", effects: { flagsSet: ["knows-the-route"] } },
          },
          { name: "mixed", weight: 3, outcome: { line: "You get a leaflet and a reference number. It is a start and it is not an answer.", effects: {} } },
        ],
      },
    ],
  },
];
