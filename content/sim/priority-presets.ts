/**
 * PRIORITY PRESETS (blueprint 4.0 §3.6) — the staged half of the onboarding.
 *
 * The ten-way instrument is the real thing, and it is one tap behind. What
 * creation defaults to is this: a handful of named, honest starting scorecards,
 * so a new player reaches their first real allocation inside three minutes
 * without having to rank ten abstractions cold (§10's three-minute item).
 *
 * These are HONEST, not flattering. Each names what it is buying and what it is
 * spending to buy it, because a scorecard that only lists upsides teaches the
 * wrong thing about priorities — which is that they cost each other.
 *
 * None of them is recommended, none is first-because-best, and the order is fixed.
 */

import { PRIORITY_KEYS, type PrioritySet } from "@/content/sim/schema";

function set(partial: Partial<PrioritySet>): PrioritySet {
  const out = {} as PrioritySet;
  for (const k of PRIORITY_KEYS) out[k] = partial[k] ?? 0;
  return out;
}

export type PriorityPreset = { id: string; label: string; note: string; weights: PrioritySet };

export const PRIORITY_PRESETS: PriorityPreset[] = [
  {
    id: "pri-floor-first",
    label: "Floor first",
    note: "Get something under you that holds, then think about the rest. Buys resilience; spends the years you could have been taking swings in.",
    weights: set({ safety: 3, health: 2, wealth: 1, closeness: 1 }),
  },
  {
    id: "pri-get-good",
    label: "Get good at something",
    note: "Point most of the decade at one difficult thing. Buys a skill that compounds; spends breadth, and some of the people who wanted more of you.",
    weights: set({ mastery: 3, autonomy: 2, creativity: 1, recognition: 1 }),
  },
  {
    id: "pri-people-first",
    label: "People first",
    note: "Build the bench and keep it. Buys a life with others in it; spends the mobility that comes from being able to leave.",
    weights: set({ closeness: 3, service: 2, safety: 1, meaning: 1 }),
  },
  {
    id: "pri-own-hours",
    label: "Own your hours",
    note: "Optionality over income, every time. Buys the freedom to change your mind; spends the security that comes from committing to something.",
    weights: set({ autonomy: 3, creativity: 2, meaning: 1, health: 1 }),
  },
  {
    id: "pri-make-it-count",
    label: "Make it count",
    note: "Do work that is worth doing and be seen doing it. Buys a life you can defend; spends comfort, and often sleep.",
    weights: set({ service: 3, meaning: 2, recognition: 2, mastery: 1 }),
  },
  {
    id: "pri-comfort",
    label: "Room to breathe",
    note: "Money and comfort, honestly wanted. Buys a life with slack in it; spends some of the risk that a bigger swing would need.",
    weights: set({ wealth: 3, safety: 2, health: 2, closeness: 1 }),
  },
];
