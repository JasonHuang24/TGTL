/**
 * The v2 resolution contract (blueprint 4.0 §3.1, inheriting 3.0 §3.5 LITERAL).
 *
 * Unchanged from 3.0 and not reopened: every option declares 2–3 named bands, at
 * most one marked `failure`; skill and position modify band WIDTHS and never add
 * or remove a band; the draw maps deterministically to exactly one band. That is
 * the visible half of G-09 — the option places the range, the draw lands inside it.
 *
 * Extended for the sandbox: the shift now reads capabilities and the three flag
 * classes (constraint / companion / systemic) as well as gauges and skills, so the
 * §3.10 attribution split has real tagged components to compute from.
 *
 * resolve() is pure. RNG is consumed only in the commit handlers (lib/sim/season).
 */

import { OUTCOME_BAND_RANK, clampGauge, type GaugeKey } from "@/content/bands";
import type { Band, CapabilityKey, SimOption, SimState } from "@/content/sim/schema";

export type StripSegment = {
  name: Band["name"];
  width: number;
  failure: boolean;
  band: Band;
};

export type Resolution = {
  band: Band;
  segments: StripSegment[];
  /** Marker position 0..1 along the strip — the draw. */
  marker: number;
  /** Signed: >0 widened the good bands, <0 widened the poor ones. */
  shift: number;
};

export type ResolveState = Pick<
  SimState,
  "gauges" | "capabilities" | "skills" | "conditions" | "flags"
>;

/** Slack, as in 3.0: the minimum of money and time, stepped down under high load. */
export function deriveSlack(gauges: Record<GaugeKey, number>, highLoad: boolean): number {
  return clampGauge(Math.min(gauges.money, gauges.timeStructure) - (highLoad ? 1 : 0));
}

/**
 * The skill+position shift. Deterministic, no RNG. Positive shifts weight toward
 * the better (lower-rank) bands. Bounded so no single input can dominate.
 */
export function positionShift(
  option: SimOption,
  state: ResolveState,
  ctx: { highLoad?: boolean; companionFlags?: string[]; systemicFlags?: string[] } = {},
): number {
  const s = option.sensitivity;
  const slack = deriveSlack(state.gauges, Boolean(ctx.highLoad));
  // Global footing — the position lesson, felt on every option (§3.10 accumulated).
  let shift = (slack - 2) * 0.25;
  if (s) {
    if (s.gauge) shift += (clampGauge(state.gauges[s.gauge as GaugeKey]) - 2) * 0.4;
    if (s.capability) shift += (clampGauge(state.capabilities[s.capability as CapabilityKey] ?? 2) - 2) * 0.35;
    if (s.skill && state.skills.includes(s.skill)) shift += 0.8;
    if (s.constraintFlags) shift -= s.constraintFlags.filter((f) => state.flags.includes(f)).length * 0.6;
    const comp = new Set([...(ctx.companionFlags ?? []), ...state.flags]);
    if (s.companionFlags) shift -= s.companionFlags.filter((f) => comp.has(f)).length * 0.5;
    const sys = new Set([...(ctx.systemicFlags ?? []), ...state.flags]);
    if (s.systemicFlags) shift -= s.systemicFlags.filter((f) => sys.has(f)).length * 0.7;
  }
  return Math.max(-1.5, Math.min(1.5, shift));
}

/** Reshape the declared band weights by the shift. Never adds or removes a band. */
export function strip(
  option: SimOption,
  state: ResolveState,
  ctx: { highLoad?: boolean; companionFlags?: string[]; systemicFlags?: string[] } = {},
): { segments: StripSegment[]; shift: number } {
  const shift = positionShift(option, state, ctx);
  const strength = option.sensitivity?.strength ?? 0.5;

  const ranked = [...option.bands].sort((a, b) => OUTCOME_BAND_RANK[a.name] - OUTCOME_BAND_RANK[b.name]);
  const totalWeight = ranked.reduce((sum, b) => sum + b.weight, 0);
  const center = ranked.reduce((sum, b) => sum + OUTCOME_BAND_RANK[b.name] * b.weight, 0) / Math.max(1e-9, totalWeight);

  const adjusted = ranked.map((b) => {
    const factor = Math.max(0.05, 1 + shift * (center - OUTCOME_BAND_RANK[b.name]) * strength);
    return { band: b, w: Math.max(0, b.weight) * factor };
  });
  const total = adjusted.reduce((s, x) => s + x.w, 0) || 1;

  return {
    segments: adjusted.map((x) => ({
      name: x.band.name,
      width: x.w / total,
      failure: Boolean(x.band.failure),
      band: x.band,
    })),
    shift,
  };
}

/** Resolve an option against a pure draw in [0,1). Deterministic. */
export function resolve(
  option: SimOption,
  state: ResolveState,
  draw: number,
  ctx: { highLoad?: boolean; companionFlags?: string[]; systemicFlags?: string[] } = {},
): Resolution {
  const { segments, shift } = strip(option, state, ctx);
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

/**
 * Pick the rendered line for a landed band. Repeatable actions declare per-band
 * variant pools (§3.4b); the pool index derives from the same seed coordinates as
 * the draw, so a replay renders identical prose while a repeat reads differently.
 */
export function outcomeLine(
  band: Band,
  variants: string[] | undefined,
  variantDraw: number,
  instanceOrdinal = 0,
): string {
  if (!variants || variants.length === 0) return band.outcome.line;
  const pool = [band.outcome.line, ...variants];
  // ROTATION, not a hash pick. A hashed index over a small pool repeats a line
  // early and at random spacing — the §10 monotony test caught one action taken
  // thirteen times producing the same sentence five times, twice in a row. The
  // occurrence ordinal cycles the pool instead, so a line cannot come back until
  // every other line in its pool has been used. Still a pure function of the
  // ordinal, so replays are identical; the draw only breaks the phase, so two
  // different runs do not start at the same line.
  const phase = Math.floor(variantDraw * pool.length);
  return pool[(instanceOrdinal + phase) % pool.length];
}

export function hasFailureBand(option: SimOption): boolean {
  return option.bands.some((b) => b.failure);
}
