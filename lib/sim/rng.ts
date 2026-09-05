/**
 * Occurrence-discriminated derived draws (blueprint 4.0 §2.1 — the ONE sanctioned
 * extension to 3.0's determinism discipline, stated there because the 3.0 formula
 * breaks on repetition).
 *
 * 3.0 derived every draw from `hash(drawSeed, cardId)`. That is replay-stable, but
 * a sandbox lets you take the same action in season 3 and again in season 11 — and
 * under the 3.0 formula both occurrences would land on the same draw forever.
 *
 * v2 derives from `hash(drawSeed, seasonIndex, actionInstanceOrdinal, actionId)`.
 * The instance ordinal is COMPUTED from the committed ledger, never stored, so it
 * is a pure function of the replay. Two consequences, both gate-asserted (S-7):
 *
 *   - a repeated action draws freshly each occurrence;
 *   - a full replay of the same ledger is byte-identical.
 *
 * As in 3.0, there is no sequential stream and no mutable generator: every draw is
 * a pure function of its coordinates, so re-renders, resume rehydration, StrictMode
 * double-invocation and explain-drawer detours can never perturb one. `freshSeed`
 * remains the only non-deterministic call, made only at an explicit user action.
 */

import { cyrb53, hashToUnit, weightedIndex, pick, freshSeed } from "@/lib/engine/rng";

export { cyrb53, hashToUnit, weightedIndex, pick, freshSeed };

/** The coordinates that discriminate one draw from every other (§2.1). */
export type DrawCoords = {
  seasonIndex: number;
  /** How many times this id had already been committed before this occurrence. */
  instanceOrdinal: number;
  id: string;
};

/** The canonical key. One place, so the formula cannot drift between callers. */
export function drawKey(c: DrawCoords): string {
  return `s${c.seasonIndex}:o${c.instanceOrdinal}:${c.id}`;
}

/**
 * A pure draw in [0,1) for one occurrence of one record. `salt` is for the rare
 * case where a single occurrence needs two independent values (e.g. an outcome
 * band and then a variant line from that band's pool).
 */
export function drawFor(drawSeed: string, c: DrawCoords, salt = 0): number {
  return hashToUnit(drawSeed, drawKey(c), salt);
}

/**
 * Event and companion SELECTION draws. Selection is a pure function of (seeds,
 * committed prefix, state) per §7.6 — this is its randomness source, keyed by
 * season and slot so two selections in one season never collide.
 */
export function selectionDraw(drawSeed: string, seasonIndex: number, slot: string, salt = 0): number {
  return hashToUnit(drawSeed, `select:s${seasonIndex}:${slot}`, salt);
}
