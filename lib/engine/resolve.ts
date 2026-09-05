/**
 * The resolution contract (blueprint 3.0 §3.5, LITERAL) — the engine's semantics.
 *
 *   - Every option declares 2–3 named bands, at most one marked `failure`.
 *   - Skill and position modify band WIDTHS on the strip; they never add or remove
 *     a band. This is the visible half of G-09: the option (skill) places the
 *     marker's range; the draw (luck) lands the marker inside it.
 *   - The draw maps DETERMINISTICALLY to exactly one band. The draw is the only
 *     RNG, consumed once at commit (lib/engine/run.ts) — resolve() itself is pure.
 */

import { OUTCOME_BAND_RANK, clampGauge, type GaugeKey } from "@/content/bands";
import { deriveSlack } from "@/lib/engine/effects";
import type { Band, Option, RunState } from "@/content/play/schema";

export type StripSegment = {
  name: Band["name"];
  /** Normalized width 0..1 (segments sum to 1). */
  width: number;
  failure: boolean;
  band: Band;
};

export type Resolution = {
  /** The band the draw landed in. */
  band: Band;
  /** The strip, left→right by severity rank (best first). */
  segments: StripSegment[];
  /** Marker position 0..1 along the strip (the luck draw). */
  marker: number;
  /**
   * How far skill+position shifted the range, signed: >0 widened the good bands,
   * <0 widened the poor ones, ~0 left the base distribution. For honest display.
   */
  shift: number;
};

/** The state fields resolution reads (so callers can pass a partial in tests). */
export type ResolveState = Pick<RunState, "gauges" | "skills" | "conditions" | "flags">;

/**
 * Compute the skill+position shift for an option against the character's state.
 * Deterministic; no RNG. Positive shifts weight toward better (lower-rank) bands.
 */
export function positionShift(option: Option, state: ResolveState): number {
  const s = option.sensitivity;
  const slack = deriveSlack(state.gauges, state.conditions);
  // Global footing: slack relative to "steady" (index 2) — the position lesson,
  // felt on every option even without per-option sensitivity.
  let shift = (slack - 2) * 0.25;
  if (s) {
    if (s.skill && state.skills.includes(s.skill)) shift += 0.8;
    if (s.gauge) shift += (clampGauge(state.gauges[s.gauge as GaugeKey]) - 2) * 0.4;
    if (s.penaltyFlags) {
      const hit = s.penaltyFlags.filter((f) => state.flags.includes(f)).length;
      shift -= hit * 0.6;
    }
  }
  return Math.max(-1.5, Math.min(1.5, shift));
}

/**
 * Reshape an option's declared band weights by the shift, producing the strip
 * segments (never adding or removing bands). Ordered best→worst by severity rank.
 */
export function strip(option: Option, state: ResolveState): { segments: StripSegment[]; shift: number } {
  const shift = positionShift(option, state);
  const strength = option.sensitivity?.strength ?? 0.5;

  const ranked = [...option.bands].sort(
    (a, b) => OUTCOME_BAND_RANK[a.name] - OUTCOME_BAND_RANK[b.name],
  );
  const center =
    ranked.reduce((sum, b) => sum + OUTCOME_BAND_RANK[b.name] * b.weight, 0) /
    Math.max(1e-9, ranked.reduce((sum, b) => sum + b.weight, 0));

  const adjusted = ranked.map((b) => {
    const factor = Math.max(0.05, 1 + shift * (center - OUTCOME_BAND_RANK[b.name]) * strength);
    return { band: b, w: Math.max(0, b.weight) * factor };
  });
  const total = adjusted.reduce((s, x) => s + x.w, 0) || 1;

  const segments: StripSegment[] = adjusted.map((x) => ({
    name: x.band.name,
    width: x.w / total,
    failure: Boolean(x.band.failure),
    band: x.band,
  }));
  return { segments, shift };
}

/**
 * Resolve an option against a pure draw value in [0,1). The draw lands the marker
 * on the strip; the segment it falls in is the landed band. Deterministic.
 */
export function resolve(option: Option, state: ResolveState, draw: number): Resolution {
  const { segments, shift } = strip(option, state);
  const marker = Math.max(0, Math.min(0.999999, draw));
  let acc = 0;
  let landed = segments[segments.length - 1];
  for (const seg of segments) {
    acc += seg.width;
    if (marker < acc) {
      landed = seg;
      break;
    }
  }
  return { band: landed.band, segments, marker, shift };
}

/** Whether an option can land in a failure band at all (for successor-pool steering). */
export function hasFailureBand(option: Option): boolean {
  return option.bands.some((b) => b.failure);
}
