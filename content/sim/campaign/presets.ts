/**
 * THE FIVE PRESET HANDS — *Launch Window, United States, 2025* (blueprint 4.0
 * §3.3, spec §16.2), plus the Birth-RNG draw that is the other way in.
 *
 * These are the ONLY two ways a hand is ever produced. There is no self-insertion
 * flow, no custom-hand construction, no "describe yourself" step, and none is
 * coming: personal character creation is a deferred owner decision (§12.4) and
 * FORBIDDEN until the owner explicitly revisits it (§11).
 *
 * Every preset ships with a fictional note that renders adjacent to its label on
 * every surface, in fixed presentation order, and none of them is the normal one.
 * Each has strengths, constraints, obligations, relationships, and — as S-10
 * proves rather than promises — several credible routes.
 */

import { makeProfile } from "@/content/sim/profile";
import type { PresetHand } from "@/content/sim/schema";

export const FICTIONAL_NOTE =
  "A fictional starting position, written to make a set of tradeoffs playable. It is not a portrait of anyone, and it is not a claim about how common anything is.";

/**
 * FIXED presentation order (§2.3.1). This array's order IS the order, and it is
 * not sorted by hardness, cost, or anything else — not now and not by a caller.
 */
export const PRESETS: PresetHand[] = [
  {
    id: "preset-supported-explorer",
    label: "Supported Explorer",
    fictionalNote: FICTIONAL_NOTE,
    profile: makeProfile({ money: 1, backing: 0, body: 1, place: 1 }),
    startState: {
      gauges: { money: 3, healthEnergy: 3, connection: 3, timeStructure: 3 },
      capabilities: { vitality: 3, learning: 3, execution: 2, regulation: 2, socialNavigation: 2, adaptability: 2 },
      skills: ["study-habits"],
      flags: ["start:family-backstop", "start:stable-housing"],
      conditions: [],
      relationships: [
        { id: "arc-parent-diane", label: "Diane, your mother", quality: 2 },
        { id: "arc-friend-mo", label: "Mo, from school", quality: 1 },
      ],
      companions: ["arc-parent-diane", "arc-friend-mo"],
      role: "recent school-leaver",
      place: "the suburb you grew up in",
    },
    face: "home",
    presentationOrder: 0,
  },
  {
    id: "preset-working-under-pressure",
    label: "Working Under Pressure",
    fictionalNote: FICTIONAL_NOTE,
    profile: makeProfile({ money: 3, backing: 2, body: 1, place: 1 }),
    startState: {
      gauges: { money: 1, healthEnergy: 2, connection: 2, timeStructure: 1 },
      capabilities: { vitality: 2, learning: 2, execution: 3, regulation: 2, socialNavigation: 2, adaptability: 3 },
      skills: ["shift-work", "budgeting"],
      flags: ["start:no-backstop", "start:income-obligation"],
      conditions: ["second-job"],
      relationships: [
        { id: "arc-coworker-ray", label: "Ray, who trains you in", quality: 1 },
        { id: "arc-sibling-tasha", label: "Tasha, your sister", quality: 2 },
      ],
      companions: ["arc-coworker-ray", "arc-sibling-tasha"],
      role: "shift worker",
      place: "a room in a shared apartment across town from work",
    },
    face: "work",
    presentationOrder: 1,
  },
  {
    id: "preset-credential-route",
    label: "Credential Route",
    fictionalNote: FICTIONAL_NOTE,
    profile: makeProfile({ money: 2, backing: 1, body: 1, place: 0 }),
    startState: {
      gauges: { money: 2, healthEnergy: 3, connection: 2, timeStructure: 2 },
      capabilities: { vitality: 3, learning: 3, execution: 2, regulation: 2, socialNavigation: 2, adaptability: 2 },
      skills: ["study-habits", "academic-writing"],
      flags: ["start:enrolled", "start:carrying-debt"],
      conditions: [],
      relationships: [
        { id: "arc-mentor-okonkwo", label: "Dr Okonkwo, who teaches your seminar", quality: 1 },
        { id: "arc-friend-mo", label: "Mo, from school", quality: 1 },
      ],
      companions: ["arc-mentor-okonkwo", "arc-friend-mo"],
      role: "enrolled student",
      place: "a college town two hours from home",
    },
    face: "school",
    presentationOrder: 2,
  },
  {
    id: "preset-care-constrained-builder",
    label: "Care-Constrained Builder",
    fictionalNote: FICTIONAL_NOTE,
    profile: makeProfile({ money: 2, backing: 1, body: 2, place: 3 }),
    startState: {
      gauges: { money: 2, healthEnergy: 2, connection: 3, timeStructure: 1 },
      capabilities: { vitality: 2, learning: 2, execution: 3, regulation: 3, socialNavigation: 3, adaptability: 2 },
      skills: ["caregiving", "logistics"],
      flags: ["start:caring-duty", "start:place-bound"],
      conditions: ["caring-duty"],
      relationships: [
        { id: "arc-parent-diane", label: "Diane, your mother", quality: 2 },
        { id: "arc-neighbor-lu", label: "Lu, two doors down", quality: 1 },
      ],
      companions: ["arc-parent-diane", "arc-neighbor-lu"],
      role: "carer, and whatever else fits around it",
      place: "the town you cannot easily leave",
    },
    face: "people",
    presentationOrder: 3,
  },
  {
    id: "preset-recovery-and-relaunch",
    label: "Recovery and Relaunch",
    fictionalNote: FICTIONAL_NOTE,
    profile: makeProfile({ money: 2, backing: 2, body: 3, place: 1 }),
    startState: {
      gauges: { money: 2, healthEnergy: 1, connection: 2, timeStructure: 2 },
      capabilities: { vitality: 1, learning: 2, execution: 2, regulation: 3, socialNavigation: 2, adaptability: 3 },
      skills: ["pacing"],
      flags: ["start:interrupted-path", "start:reduced-capacity"],
      conditions: ["reduced-capacity"],
      relationships: [
        { id: "arc-friend-mo", label: "Mo, from school", quality: 2 },
        { id: "arc-coworker-ray", label: "Ray, who trains you in", quality: 0 },
      ],
      companions: ["arc-friend-mo", "arc-coworker-ray"],
      role: "starting again from a standing stop",
      place: "back where you were before it stopped",
    },
    face: "health",
    presentationOrder: 4,
  },
];

export const PRESET_BY_ID: Record<string, PresetHand> = Object.fromEntries(PRESETS.map((p) => [p.id, p]));

/** Presets in their fixed order. Never sort this by anything. */
export function presetsInOrder(): PresetHand[] {
  return [...PRESETS].sort((a, b) => a.presentationOrder - b.presentationOrder);
}
