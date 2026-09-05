/**
 * THE CONSEQUENCE QUEUE (blueprint 4.0 §3.5, gate S-11).
 *
 * Typed delayed effects with explicit in-world timing. Three invariants, all
 * asserted by S-11 over full campaign fleets:
 *
 *   1. Every entry RESOLVES, RE-QUEUES WITH A CAUSE, or EXPIRES VISIBLY. Nothing
 *      is ever silently dropped; every transition is written into the entry's own
 *      history, so a landed consequence is traceable back to the season that
 *      caused it (the §10 queue test).
 *   2. The queue's universe is ORDINARY CONSEQUENCES ONLY. Loss-tier beats are
 *      never queue entries (§5.1) — the QueueEntry type has no beat arm, and the
 *      only insert path is `insert`, which takes a QueueInsertion.
 *   3. The queue never reveals genuinely uncertain events. It holds what has
 *      already been set in motion, not what might happen.
 */

import type { Effects, QueueEntry, QueueInsertion, SimState } from "@/content/sim/schema";

/** How long a condition-gated entry waits before it expires, if not authored. */
export const DEFAULT_CONDITION_WINDOW = 6;

/**
 * Place an insertion on the queue. The id is namespaced by source and season so
 * the same delayed effect fired twice produces two distinct, traceable entries.
 */
export function insert(
  queue: QueueEntry[],
  insertion: QueueInsertion,
  source: QueueEntry["sourceRef"],
): QueueEntry[] {
  const entry: QueueEntry = {
    id: `${source.kind}:${source.id}:s${source.seasonIndex}:${insertion.refId}`,
    sourceRef: source,
    label: insertion.label,
    effects: insertion.effects,
    due: insertion.due,
    placedSeason: source.seasonIndex,
    revealed: true,
    history: [{ seasonIndex: source.seasonIndex, what: "placed" }],
  };
  // Re-firing the identical delayed effect in the same season is idempotent.
  if (queue.some((q) => q.id === entry.id)) return queue;
  return [...queue, entry];
}

/** The absolute season an entry comes due, for rendering and for `due` checks. */
export function dueSeason(entry: QueueEntry): number {
  return "seasons" in entry.due ? entry.placedSeason + entry.due.seasons : entry.placedSeason + entry.due.withinSeasons;
}

/** Is this entry due to resolve at the start of `seasonIndex`? */
export function isDue(entry: QueueEntry, seasonIndex: number, state: Pick<SimState, "flags" | "conditions">): boolean {
  if ("seasons" in entry.due) return seasonIndex >= entry.placedSeason + entry.due.seasons;
  const met = state.flags.includes(entry.due.condition) || state.conditions.includes(entry.due.condition);
  return met && seasonIndex > entry.placedSeason;
}

/** Has a condition-gated entry run out of window? Timed entries never expire. */
export function isExpired(entry: QueueEntry, seasonIndex: number): boolean {
  if ("seasons" in entry.due) return false;
  return seasonIndex >= entry.placedSeason + entry.due.withinSeasons;
}

export type QueueStep = {
  /** Entries resolving this season, in placement order (oldest cause first). */
  resolving: QueueEntry[];
  /** Entries whose window ran out — they expire VISIBLY, with a line. */
  expiring: QueueEntry[];
  /** Everything still pending, with its history extended. */
  remaining: QueueEntry[];
};

/**
 * Advance the queue one season. Called first in the §7.6 resolution order, so a
 * consequence that comes due is felt before this season's own choices land.
 */
export function step(
  queue: QueueEntry[],
  seasonIndex: number,
  state: Pick<SimState, "flags" | "conditions">,
): QueueStep {
  const resolving: QueueEntry[] = [];
  const expiring: QueueEntry[] = [];
  const remaining: QueueEntry[] = [];
  for (const entry of [...queue].sort((a, b) => a.placedSeason - b.placedSeason)) {
    if (isDue(entry, seasonIndex, state)) {
      resolving.push({ ...entry, history: [...entry.history, { seasonIndex, what: "resolved" }] });
    } else if (isExpired(entry, seasonIndex)) {
      expiring.push({
        ...entry,
        history: [...entry.history, { seasonIndex, what: "expired", cause: "its window closed without the condition" }],
      });
    } else {
      remaining.push({
        ...entry,
        history: [...entry.history, { seasonIndex, what: "requeued", cause: causeOf(entry) }],
      });
    }
  }
  return { resolving, expiring, remaining };
}

function causeOf(entry: QueueEntry): string {
  return "seasons" in entry.due
    ? `not yet due — lands in season ${dueSeason(entry) + 1}`
    : `waiting on: ${entry.due.condition.replace(/[-_]/g, " ")}`;
}

/**
 * What the briefing renders for a pending entry: the label, and honest timing.
 * Never a probability; never a preview of anything uncertain (§3.5, §6).
 */
export function pendingLine(entry: QueueEntry, seasonIndex: number): string {
  if ("seasons" in entry.due) {
    const left = dueSeason(entry) - seasonIndex;
    if (left <= 0) return `${entry.label} — lands this season`;
    if (left === 1) return `${entry.label} — lands next season`;
    return `${entry.label} — lands in ${numberWord(left)} seasons`;
  }
  return `${entry.label} — waiting on ${entry.due.condition.replace(/[-_]/g, " ")}`;
}

/** No bare numbers in play (S-2): timing is spelled out. */
const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
export function numberWord(n: number): string {
  return WORDS[n] ?? "several";
}

/** All effects a set of entries applies, in order. */
export function effectsOf(entries: QueueEntry[]): Effects[] {
  return entries.map((e) => e.effects);
}
