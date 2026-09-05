/**
 * Effects application and slack derivation (blueprint 3.0 §11.2 — "the physics").
 * Pure functions over the state vector; no RNG, no I/O, no React. The whole run —
 * consequences, compounding curves, the parse — is computed from applying these.
 */

import { GAUGE_KEYS, clampGauge, type GaugeKey } from "@/content/bands";
import { isHighLoadCondition } from "@/content/play/registry";
import type {
  Effects,
  RelationshipMark,
  RunState,
} from "@/content/play/schema";

/** A minimal mutable slice of the state that effects touch. */
export type EffectableState = Pick<
  RunState,
  "gauges" | "skills" | "relationships" | "conditions" | "flags"
>;

const QUALITY_MIN = -2;
const QUALITY_MAX = 3;

/**
 * Apply an effects object, returning a NEW state slice (never mutates input).
 * Gauge deltas are band-steps, clamped to 0..4. Skills and flags are sets.
 * Relationship marks are created on first reference (when a label is given) and
 * their quality clamped to a small band.
 */
export function applyEffects<T extends EffectableState>(state: T, effects?: Effects): T {
  if (!effects) return state;

  const gauges: Record<GaugeKey, number> = { ...state.gauges };
  if (effects.gauge) {
    for (const key of GAUGE_KEYS) {
      const delta = effects.gauge[key];
      if (typeof delta === "number") gauges[key] = clampGauge(gauges[key] + delta);
    }
  }

  let skills = state.skills;
  if (effects.skills && effects.skills.length) {
    const set = new Set(state.skills);
    for (const s of effects.skills) set.add(s);
    skills = [...set];
  }

  let conditions = state.conditions;
  if ((effects.conditionsSet && effects.conditionsSet.length) || (effects.conditionsClear && effects.conditionsClear.length)) {
    const set = new Set(state.conditions);
    for (const c of effects.conditionsSet ?? []) set.add(c);
    for (const c of effects.conditionsClear ?? []) set.delete(c);
    conditions = [...set];
  }

  let flags = state.flags;
  if ((effects.flagsSet && effects.flagsSet.length) || (effects.flagsClear && effects.flagsClear.length)) {
    const set = new Set(state.flags);
    for (const f of effects.flagsSet ?? []) set.add(f);
    for (const f of effects.flagsClear ?? []) set.delete(f);
    flags = [...set];
  }

  let relationships = state.relationships;
  if (effects.relationships && effects.relationships.length) {
    const next: RelationshipMark[] = state.relationships.map((r) => ({ ...r }));
    for (const delta of effects.relationships) {
      const existing = next.find((r) => r.id === delta.id);
      if (existing) {
        existing.quality = clampQuality(existing.quality + delta.quality);
        if (delta.label) existing.label = delta.label;
      } else {
        next.push({
          id: delta.id,
          label: delta.label ?? delta.id,
          quality: clampQuality(delta.quality),
        });
      }
    }
    relationships = next;
  }

  return { ...state, gauges, skills, conditions, flags, relationships };
}

function clampQuality(n: number): number {
  return Math.max(QUALITY_MIN, Math.min(QUALITY_MAX, n));
}

/**
 * Slack derivation (§11.2, one rule, disclosed on /methodology): slack is the
 * minimum of the money and time-structure gauges, stepped down one band while any
 * active condition flags high load. Returns a gauge index 0..4.
 */
export function deriveSlack(gauges: Record<GaugeKey, number>, conditions: string[]): number {
  const base = Math.min(gauges.money, gauges.timeStructure);
  const highLoad = conditions.some(isHighLoadCondition);
  return clampGauge(highLoad ? base - 1 : base);
}
