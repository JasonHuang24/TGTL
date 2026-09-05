/**
 * Deterministic derived-seed RNG (blueprint 3.0 §3.8, gate S-7).
 *
 * The discipline, LITERAL: every draw is a PURE function of (seed, id) — there is
 * no sequential RNG stream, no counter, no mutable generator. `hashToUnit` given
 * the same arguments always returns the same value, so React re-renders, resume
 * rehydration, StrictMode double-invocation, and "why this happened" detours can
 * never perturb a draw. A sequential-stream engine would fail S-7 by construction;
 * this one passes it by construction.
 *
 * The ONE place non-determinism is allowed is `freshSeed()`, called only at an
 * explicit user action (new run, redraw, new hand). Its output is then frozen into
 * the run and every subsequent draw is pure. `freshSeed` is never called during
 * render, effects, or replay.
 */

/** cyrb53 — a well-distributed 53-bit string hash (public-domain, non-cryptographic). */
export function cyrb53(str: string, seed = 0): number {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

const TWO_POW_53 = 9007199254740992;

/**
 * A pure draw in [0, 1) from a seed, an id, and an optional salt (for the rare
 * case a single id needs more than one independent value).
 */
export function hashToUnit(seed: string, id: string, salt = 0): number {
  return cyrb53(`${seed}|${id}|${salt}`) / TWO_POW_53;
}

/**
 * Pick an index from a weight array using a unit value. Deterministic given the
 * same (unit, weights). Empty or zero-sum weights fall back to index 0.
 */
export function weightedIndex(unit: number, weights: number[]): number {
  const total = weights.reduce((a, b) => a + (b > 0 ? b : 0), 0);
  if (total <= 0) return 0;
  let target = unit * total;
  for (let i = 0; i < weights.length; i++) {
    const w = weights[i] > 0 ? weights[i] : 0;
    if (target < w) return i;
    target -= w;
  }
  return weights.length - 1;
}

/** Pick an element from an array using a unit value (uniform). */
export function pick<T>(unit: number, arr: readonly T[]): T {
  if (arr.length === 0) throw new Error("pick from empty array");
  const i = Math.min(arr.length - 1, Math.floor(unit * arr.length));
  return arr[i];
}

/**
 * A fresh, opaque seed string. The ONLY non-deterministic function here; called
 * exclusively at an explicit user action (new run / redraw / new hand), never in
 * render, effects, or replay. Uses crypto when available, Math.random otherwise —
 * both fine because the result is frozen into the run immediately after.
 */
export function freshSeed(): string {
  try {
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      const a = new Uint32Array(2);
      crypto.getRandomValues(a);
      return a[0].toString(36) + a[1].toString(36);
    }
  } catch {
    /* fall through */
  }
  // Deterministic-tooling environments (and tests) may pass an explicit seed
  // instead of calling this; the Math.random branch is only ever a runtime path.
  return Math.floor(Math.random() * 0xffffffff).toString(36) + "x";
}
