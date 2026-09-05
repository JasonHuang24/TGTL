/**
 * COMPANION ARCS (blueprint 4.0 §3.7) — other people have agency.
 *
 * These are authored characters with wants, limits, and STATE-CONDITIONED
 * trajectories. The distinction that matters: a trajectory node is *selected by
 * the relationship*, not scripted regardless of it. Every node declares entry
 * conditions keyed to relationship-mark state, what the player has actually done,
 * and neglect/repair history — so an arc's path is a reading of the relationship,
 * never a story that plays out around the player.
 *
 * THE NEVER-COMMAND FIVE (LITERAL, §3.7, and checked by the S-1 human pass):
 * the player influences COMMUNICATION, RELIABILITY, REPAIR, BOUNDARIES, and
 * EXPOSURE. The player never commands ATTRACTION, CONSENT, FORGIVENESS, LOYALTY,
 * or COMMITMENT. Read that in the trajectory nodes: `repair-response` nodes are
 * about the player having *made the attempt*, and what follows is the other
 * person's decision — a repair attempt can be received, deferred, or declined,
 * and declining is not a failure band, it is a person. `refuse` and `leave` nodes
 * are reachable from every arc (S-3 asserts it), because a companion who cannot
 * refuse or leave is inventory, not a person.
 *
 * No compatibility scores. No archetype matching. MBTI is never a mechanic here
 * or anywhere.
 */

import type { CompanionArc } from "@/content/sim/schema";

export const COMPANION_ARCS: CompanionArc[] = [
  /* ===================================================================== */
  {
    id: "arc-parent-diane",
    label: "Diane, your mother",
    wants: [
      "to still be needed for something specific, not just in general",
      "to know where you are without having to ask",
      "for the help she gives to be used, not stored",
    ],
    limits: [
      "she will not keep offering something you keep declining",
      "she has her own week and it is fuller than you think",
      "she says yes to things she cannot really afford, and then it sits between you",
    ],
    refusalBehaviors: [
      "she says no to the money, and does not explain why",
      "she asks for a season before she answers",
      "she tells you plainly that she cannot be the person you are asking her to be",
    ],
    readRef: "/topics/relationships",
    evidenceLabel: "illustrative",
    trajectory: [
      {
        stage: 0,
        label: "the default distance",
        kind: "steady",
        entryConditions: {},
        eventRefs: ["evt-diane-check-in"],
        exitBehaviors: [],
      },
      {
        stage: 1,
        label: "she is going quiet",
        kind: "neglect-response",
        entryConditions: { minNeglect: 2, maxQuality: 1 },
        eventRefs: ["evt-diane-quiet"],
        exitBehaviors: ["she stops initiating", "the calls get shorter"],
      },
      {
        stage: 2,
        label: "you made the attempt",
        kind: "repair-response",
        entryConditions: { minRepair: 1 },
        eventRefs: ["evt-diane-repair"],
        exitBehaviors: ["she takes it in", "she needs longer than you wanted"],
      },
      {
        stage: 2,
        label: "she says no to this one",
        kind: "refuse",
        entryConditions: { minSeason: 4, maxQuality: 2 },
        eventRefs: ["evt-diane-refuses"],
        exitBehaviors: ["the ask is declined and the relationship survives it"],
      },
      {
        stage: 3,
        label: "something closer",
        kind: "deepen",
        entryConditions: { minQuality: 2, maxNeglect: 1, minSeason: 6 },
        eventRefs: ["evt-diane-deepen"],
        exitBehaviors: ["she starts telling you things she used not to"],
      },
      {
        stage: 4,
        label: "she stops trying",
        kind: "leave",
        entryConditions: { minNeglect: 5, maxQuality: -1 },
        eventRefs: ["evt-diane-withdraws"],
        exitBehaviors: ["contact becomes formal", "she is still there and no longer in it"],
      },
    ],
  },

  /* ===================================================================== */
  {
    id: "arc-friend-mo",
    label: "Mo, from school",
    wants: [
      "to keep the friendship without either of you having to be impressive about it",
      "someone who answers on the same day",
      "to be told the real version, not the version that is easy to hear",
    ],
    limits: [
      "Mo will not be the one who always texts first, and will stop",
      "Mo has a life that is also getting complicated",
      "Mo forgives slowly, or not at all, depending on Mo",
    ],
    refusalBehaviors: [
      "Mo says the timing does not work, and means it",
      "Mo declines the apology and stays civil",
      "Mo asks for space and takes it",
    ],
    readRef: "/topics/relationships",
    evidenceLabel: "illustrative",
    trajectory: [
      {
        stage: 0,
        label: "still easy",
        kind: "steady",
        entryConditions: {},
        eventRefs: ["evt-mo-invite"],
        exitBehaviors: [],
      },
      {
        stage: 1,
        label: "the drift",
        kind: "neglect-response",
        entryConditions: { minNeglect: 2 },
        eventRefs: ["evt-mo-drift"],
        exitBehaviors: ["messages get slower", "the group thread carries it instead"],
      },
      {
        stage: 2,
        label: "you went first",
        kind: "repair-response",
        entryConditions: { minRepair: 1 },
        eventRefs: ["evt-mo-repair"],
        exitBehaviors: ["it lands", "it lands late", "it does not land"],
      },
      {
        stage: 2,
        label: "Mo says no",
        kind: "refuse",
        entryConditions: { minSeason: 3, maxQuality: 1 },
        eventRefs: ["evt-mo-refuses"],
        exitBehaviors: ["the invitation is declined without a fight"],
      },
      {
        stage: 3,
        label: "the friendship that survived the twenties",
        kind: "deepen",
        entryConditions: { minQuality: 2, maxNeglect: 1, minSeason: 8 },
        eventRefs: ["evt-mo-deepen"],
        exitBehaviors: ["Mo is the one who knows the whole story"],
      },
      {
        stage: 4,
        label: "Mo lets it go",
        kind: "leave",
        entryConditions: { minNeglect: 4, maxQuality: 0 },
        eventRefs: ["evt-mo-leaves"],
        exitBehaviors: ["no argument, no announcement — the thread just ends"],
      },
    ],
  },

  /* ===================================================================== */
  {
    id: "arc-coworker-ray",
    label: "Ray, who trains you in",
    wants: [
      "the work done properly, and to not have to check",
      "someone to talk to on the long shifts",
      "to be asked, occasionally, rather than only told",
    ],
    limits: [
      "Ray will cover for you twice and not a third time",
      "Ray does not mix work and the rest of life, and will say so",
      "Ray is loyal to the job before the friendship, and is honest about that",
    ],
    refusalBehaviors: [
      "Ray declines to swap the shift and does not soften it",
      "Ray tells you to take it to the manager instead",
      "Ray keeps it professional and stops there",
    ],
    readRef: "/topics/work",
    evidenceLabel: "illustrative",
    trajectory: [
      {
        stage: 0,
        label: "colleagues",
        kind: "steady",
        entryConditions: {},
        eventRefs: ["evt-ray-shift-swap"],
        exitBehaviors: [],
      },
      {
        stage: 1,
        label: "you have been unreliable",
        kind: "neglect-response",
        entryConditions: { minNeglect: 2 },
        eventRefs: ["evt-ray-cools"],
        exitBehaviors: ["Ray stops offering the good shifts"],
      },
      {
        stage: 2,
        label: "you put it right",
        kind: "repair-response",
        entryConditions: { minRepair: 1 },
        eventRefs: ["evt-ray-repair"],
        exitBehaviors: ["Ray takes the point", "Ray notes it and moves on"],
      },
      {
        stage: 2,
        label: "Ray will not cover this",
        kind: "refuse",
        entryConditions: { minSeason: 2 },
        eventRefs: ["evt-ray-refuses"],
        exitBehaviors: ["the answer is no and the shift is still yours"],
      },
      {
        stage: 3,
        label: "the reference",
        kind: "deepen",
        entryConditions: { minQuality: 2, maxNeglect: 1, minSeason: 5 },
        eventRefs: ["evt-ray-reference"],
        exitBehaviors: ["Ray vouches for you somewhere it counts"],
      },
      {
        stage: 4,
        label: "Ray moves on",
        kind: "leave",
        entryConditions: { minSeason: 10, maxQuality: 0 },
        eventRefs: ["evt-ray-leaves"],
        exitBehaviors: ["Ray takes another job and the connection does not survive the building"],
      },
    ],
  },

  /* ===================================================================== */
  {
    id: "arc-mentor-okonkwo",
    label: "Dr Okonkwo, who teaches your seminar",
    wants: [
      "to see the work get better, not to be thanked",
      "students who read the thing before asking about the thing",
      "to spend her limited advocacy on someone who will use it",
    ],
    limits: [
      "her time is genuinely scarce and she rations it",
      "she will not write a reference she cannot write honestly",
      "she does not do pastoral care, and will hand you on to someone who does",
    ],
    refusalBehaviors: [
      "she declines to write the letter and tells you exactly why",
      "she gives you fifteen minutes and ends it at fifteen minutes",
      "she says this is not her field and names someone whose field it is",
    ],
    readRef: "/map/credential-decision",
    evidenceLabel: "illustrative",
    trajectory: [
      {
        stage: 0,
        label: "one of the seminar",
        kind: "steady",
        entryConditions: {},
        eventRefs: ["evt-okonkwo-office-hours"],
        exitBehaviors: [],
      },
      {
        stage: 1,
        label: "she has stopped expecting you",
        kind: "neglect-response",
        entryConditions: { minNeglect: 2 },
        eventRefs: ["evt-okonkwo-cools"],
        exitBehaviors: ["the feedback gets shorter"],
      },
      {
        stage: 2,
        label: "you came back with the work done",
        kind: "repair-response",
        entryConditions: { minRepair: 1 },
        eventRefs: ["evt-okonkwo-repair"],
        exitBehaviors: ["she gives you the time again", "she gives you less of it than before"],
      },
      {
        stage: 2,
        label: "she says no to the letter",
        kind: "refuse",
        entryConditions: { minSeason: 4, maxQuality: 1 },
        eventRefs: ["evt-okonkwo-refuses"],
        exitBehaviors: ["an honest no, with the reason attached"],
      },
      {
        stage: 3,
        label: "she spends her advocacy on you",
        kind: "deepen",
        entryConditions: { minQuality: 2, maxNeglect: 1, minSeason: 5 },
        eventRefs: ["evt-okonkwo-advocates"],
        exitBehaviors: ["a door opens that you did not know was a door"],
      },
      {
        stage: 4,
        label: "she leaves the department",
        kind: "leave",
        entryConditions: { minSeason: 12 },
        eventRefs: ["evt-okonkwo-leaves"],
        exitBehaviors: ["she takes a post elsewhere and the connection thins to an email address"],
      },
    ],
  },

  /* ===================================================================== */
  {
    id: "arc-sibling-tasha",
    label: "Tasha, your sister",
    wants: [
      "the load shared without a negotiation every time",
      "to be treated as an adult by the person who knew her at nine",
      "to not be the only one who remembers birthdays",
    ],
    limits: [
      "she will not be the family's default solution twice running",
      "she keeps score, quietly, and eventually says so",
      "she has her own money problems and does not always mention them",
    ],
    refusalBehaviors: [
      "she says it is your turn, and it is",
      "she stops answering about the thing and answers about everything else",
      "she tells you she is out of room this month",
    ],
    readRef: "/topics/relationships",
    evidenceLabel: "illustrative",
    trajectory: [
      {
        stage: 0,
        label: "in and out of contact",
        kind: "steady",
        entryConditions: {},
        eventRefs: ["evt-tasha-call"],
        exitBehaviors: [],
      },
      {
        stage: 1,
        label: "the imbalance shows",
        kind: "neglect-response",
        entryConditions: { minNeglect: 2 },
        eventRefs: ["evt-tasha-imbalance"],
        exitBehaviors: ["she stops asking you for things"],
      },
      {
        stage: 2,
        label: "you took a turn",
        kind: "repair-response",
        entryConditions: { minRepair: 1 },
        eventRefs: ["evt-tasha-repair"],
        exitBehaviors: ["the ledger evens", "she notices and does not say anything yet"],
      },
      {
        stage: 2,
        label: "she is out of room",
        kind: "refuse",
        entryConditions: { minSeason: 3 },
        eventRefs: ["evt-tasha-refuses"],
        exitBehaviors: ["no, and no explanation owed"],
      },
      {
        stage: 3,
        label: "the two of you, as adults",
        kind: "deepen",
        entryConditions: { minQuality: 2, maxNeglect: 1, minSeason: 7 },
        eventRefs: ["evt-tasha-deepen"],
        exitBehaviors: ["the sibling thing turns into a friendship"],
      },
      {
        stage: 4,
        label: "she steps back from the family",
        kind: "leave",
        entryConditions: { minNeglect: 5, maxQuality: -1 },
        eventRefs: ["evt-tasha-steps-back"],
        exitBehaviors: ["polite, distant, and not coming back this decade"],
      },
    ],
  },

  /* ===================================================================== */
  {
    id: "arc-neighbor-lu",
    label: "Lu, two doors down",
    wants: [
      "the street to work the way it used to",
      "someone to notice the small practical things",
      "company that does not require an occasion",
    ],
    limits: [
      "Lu will not be leaned on as a service",
      "Lu's own health means some weeks Lu is not available and will not explain",
      "Lu does not like being thanked in public",
    ],
    refusalBehaviors: [
      "Lu says not this week and leaves it there",
      "Lu declines to be the emergency contact",
      "Lu points out, kindly, that this is not Lu's to solve",
    ],
    readRef: "/topics/relationships",
    evidenceLabel: "illustrative",
    trajectory: [
      {
        stage: 0,
        label: "neighbors",
        kind: "steady",
        entryConditions: {},
        eventRefs: ["evt-lu-doorstep"],
        exitBehaviors: [],
      },
      {
        stage: 1,
        label: "the street gets quieter",
        kind: "neglect-response",
        entryConditions: { minNeglect: 2 },
        eventRefs: ["evt-lu-quiet"],
        exitBehaviors: ["the door stops opening when you pass"],
      },
      {
        stage: 2,
        label: "you did the small practical thing",
        kind: "repair-response",
        entryConditions: { minRepair: 1 },
        eventRefs: ["evt-lu-repair"],
        exitBehaviors: ["it is noticed", "it is noticed and not mentioned"],
      },
      {
        stage: 2,
        label: "Lu declines",
        kind: "refuse",
        entryConditions: { minSeason: 2 },
        eventRefs: ["evt-lu-refuses"],
        exitBehaviors: ["not this week, no reason given"],
      },
      {
        stage: 3,
        label: "the arrangement that works",
        kind: "deepen",
        entryConditions: { minQuality: 2, maxNeglect: 1, minSeason: 4 },
        eventRefs: ["evt-lu-arrangement"],
        exitBehaviors: ["a standing swap that costs neither of you much and helps both"],
      },
      {
        stage: 4,
        label: "Lu moves",
        kind: "leave",
        entryConditions: { minSeason: 14 },
        eventRefs: ["evt-lu-moves"],
        exitBehaviors: ["the apartment goes up for rent and the arrangement ends with it"],
      },
    ],
  },
];

export const COMPANION_BY_ID: Record<string, CompanionArc> = Object.fromEntries(
  COMPANION_ARCS.map((c) => [c.id, c]),
);

/** Every event id any arc can reach — the set the companion event batch must cover. */
export const COMPANION_EVENT_REFS: string[] = [
  ...new Set(COMPANION_ARCS.flatMap((a) => a.trajectory.flatMap((t) => t.eventRefs))),
];
