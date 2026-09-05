/**
 * Parse copy (blueprint 3.0 §3.7) — the narrative achievement lines for the life
 * review. Kept in content (not the engine) so gates S-1/S-2 lint them like every
 * other sim-rendered string.
 *
 * These are NARRATIVE and belong to the character's life: no counts toward
 * anything, no rarity tiers, no reader-facing meta-progression. Deliberately
 * include ordinary, relational, domestic, and invisible contributions — not only
 * wealth/prestige/credentials (brief §6B).
 */

import type { RunState } from "@/content/play/schema";

export type AchievementRule = {
  id: string;
  line: string;
  when: (s: RunState) => boolean;
};

export const ACHIEVEMENT_RULES: AchievementRule[] = [
  {
    id: "kept-people-close",
    line: "Kept people genuinely close — bonds that would have shown up for you.",
    when: (s) => s.relationships.filter((r) => r.quality >= 2).length > 0,
  },
  {
    id: "tended-connection",
    line: "Left the people around you better tended than you found them.",
    when: (s) => s.gauges.connection >= 3,
  },
  {
    id: "made-things",
    line: "Made real things with your hands that outlast the making.",
    when: (s) => s.skills.includes("makes-things"),
  },
  {
    id: "steadied-others",
    line: "Were, for someone, the steady one in a hard stretch.",
    when: (s) => s.skills.includes("steadies-others"),
  },
  {
    id: "learned-to-ask",
    line: "Learned the unglamorous skill of asking — and let yourself be held.",
    when: (s) => s.skills.includes("asks-for-help"),
  },
  {
    id: "carried-the-body",
    line: "Carried the body carefully enough that it kept carrying you.",
    when: (s) => s.gauges.healthEnergy >= 3,
  },
  {
    id: "built-a-floor",
    line: "Built a floor solid enough that a shock did not become a fall.",
    when: (s) => s.gauges.money >= 3,
  },
  {
    id: "stayed-with-hard-things",
    line: "Stayed with hard things long past the point most people leave.",
    when: (s) => s.skills.includes("sticks-with-hard-things"),
  },
];

/** Always named, whatever the gauges say — the invisible, domestic, ordinary work. */
export const INVISIBLE_WORK_ACHIEVEMENT =
  "Did the quiet, repeating, unwitnessed work that a life is mostly made of.";

/** All achievement lines, for the content-boundary and no-numbers lints. */
export const ALL_ACHIEVEMENT_LINES: string[] = [
  ...ACHIEVEMENT_RULES.map((r) => r.line),
  INVISIBLE_WORK_ACHIEVEMENT,
];

/* ---- The win-condition read (§3.7): the run against the player's OWN weights ---- */

import type { GaugeKey } from "@/content/bands";
import type { ObjectiveKey } from "@/content/play/schema";

export type AimInput = {
  gauges: Record<GaugeKey, number>;
  skills: string[];
  relationships: { quality: number }[];
};

type AimLevel = "served" | "partial" | "thin";

export const AIM_READS: Record<ObjectiveKey, Record<AimLevel, string>> = {
  safety: {
    served: "You asked for safety and stability, and the run built a floor — money and health steady enough that a shock had somewhere soft to land.",
    partial: "You asked for safety and stability, and the run got partway there — a floor in places, thin in others.",
    thin: "You asked for safety and stability, and the run didn't much deliver it — the floor stayed low. Often that's the hand more than the play.",
  },
  health: {
    served: "You asked for health and energy, and the run left you with capacity to spend rather than a debt to pay.",
    partial: "You asked for health and energy, and held some of it — enough weeks, not all of them.",
    thin: "You asked for health and energy, and the run spent it faster than it came back.",
  },
  closeness: {
    served: "You asked for close relationships, and the run built them — people who knew you and stayed.",
    partial: "You asked for close relationships, and some of them held, between everything else.",
    thin: "You asked for close relationships, and the run kept putting them last; the people thinned out.",
  },
  autonomy: {
    served: "You asked for autonomy, and much of your time stayed yours to direct.",
    partial: "You asked for autonomy, and held some of it — though plenty of your time got spoken for.",
    thin: "You asked for autonomy, and the run gave little of it; the days mostly belonged to other demands.",
  },
  mastery: {
    served: "You asked for mastery, and the run built it — real skill, grown for its own sake.",
    partial: "You asked for mastery, and started down it; there's a capability here, unfinished.",
    thin: "You asked for mastery, and the run didn't make room for it — the deep skill never quite got its hours.",
  },
  wealth: {
    served: "You asked for wealth and comfort, and the run got there — room at the end of the month, and then some.",
    partial: "You asked for wealth and comfort, and the run got partway — enough, not spare.",
    thin: "You asked for wealth and comfort, and the money stayed tight the whole way through.",
  },
  service: {
    served: "You asked for service, and the run bent toward others — people tended, someone steadied, bonds that held.",
    partial: "You asked for service, and gave some of it, between everything else.",
    thin: "You asked for service, and the run turned mostly inward; the giving stayed on the to-do list.",
  },
  creativity: {
    served: "You asked for creativity, and the run made room to make things — and things got made.",
    partial: "You asked for creativity, and it happened in the gaps, which is where most of it happens.",
    thin: "You asked for creativity, and the run never quite cleared the space for it.",
  },
  recognition: {
    served: "You asked to be seen for what you do, and by the end the room knew your name for the right reason.",
    partial: "You asked to be seen for what you do, and some of it landed with the people who were looking.",
    thin: "You asked to be seen for what you do, and the run kept you doing rather than being seen.",
  },
  meaning: {
    served: "You asked for meaning and peace, and the run found a shape that made sense from the inside.",
    partial: "You asked for meaning and peace, and got some of both, unevenly.",
    thin: "You asked for meaning and peace, and the run stayed too loud and too busy to hear either.",
  },
};

/** A tension line when a highly-weighted aim came out thin — honesty where aims conflicted. */
export const AIM_TENSION =
  "You weighted more than one thing heavily, and the run couldn't fully serve them all at once — which is not a failure of play so much as the shape of a finite life. What you spent on one, you spent from another.";

export function readAim(k: ObjectiveKey, input: AimInput): AimLevel {
  const g = input.gauges;
  const deepBonds = input.relationships.filter((r) => r.quality >= 2).length;
  const craftSkills = input.skills.filter((s) => s === "makes-things" || s === "sticks-with-hard-things").length;
  const band = (served: boolean, partial: boolean): AimLevel => (served ? "served" : partial ? "partial" : "thin");
  switch (k) {
    case "safety":
      return band(g.money >= 3 && g.healthEnergy >= 2, g.money >= 2 || g.healthEnergy >= 2);
    case "health":
      return band(g.healthEnergy >= 3, g.healthEnergy >= 2);
    case "closeness":
      return band(deepBonds >= 1 && g.connection >= 3, g.connection >= 2 || deepBonds >= 1);
    case "autonomy":
      return band(g.timeStructure >= 3, g.timeStructure >= 2);
    case "mastery":
      return band(craftSkills >= 2, craftSkills >= 1);
    case "wealth":
      return band(g.money >= 4, g.money >= 3);
    case "service":
      return band(g.connection >= 3 || input.skills.includes("steadies-others") || deepBonds >= 1, g.connection >= 2);
    case "creativity":
      return band(input.skills.includes("makes-things"), craftSkills >= 1);
    case "recognition":
      return band(craftSkills >= 1 && g.connection >= 3, g.connection >= 2 || craftSkills >= 1);
    case "meaning":
      return band(g.healthEnergy >= 3 && g.timeStructure >= 3, g.healthEnergy >= 2 && g.timeStructure >= 2);
  }
}

/** Every aim-read line + the tension line, for the content lints. */
export const ALL_AIM_LINES: string[] = [
  ...Object.values(AIM_READS).flatMap((m) => Object.values(m)),
  AIM_TENSION,
];
