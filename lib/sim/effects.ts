/**
 * Effects application, v2 (blueprint 4.0 §7.2, extending 3.0 §11.2's physics).
 *
 * Pure functions over the state vector — no RNG, no I/O, no React. The whole run
 * is computed by applying these: consequences, compounding, the parse. Nothing
 * narrative-only ever pretends to be mechanical.
 *
 * New in v2: capability deltas, companion-arc state changes, queue insertions,
 * and maintenance debt. Capabilities are SLOW — a delta of 1 here is a fractional
 * step, so a capability band moves over seasons rather than in one action.
 */

import { GAUGE_KEYS, clampGauge, type GaugeKey } from "@/content/bands";
import { insert } from "@/lib/sim/queue";
import {
  CAPABILITY_KEYS,
  type CapabilityKey,
  type CompanionState,
  type Effects,
  type QueueEntry,
  type RelationshipMark,
  type SimState,
} from "@/content/sim/schema";

const QUALITY_MIN = -2;
const QUALITY_MAX = 3;

/**
 * Capabilities move on a finer internal scale than the five bands they display
 * in, so a season of practice is visible progress without a band flipping every
 * time. `CAPABILITY_GRAIN` steps make one band.
 */
export const CAPABILITY_GRAIN = 4;

export type EffectableState = Pick<
  SimState,
  | "gauges"
  | "capabilities"
  | "skills"
  | "relationships"
  | "companions"
  | "conditions"
  | "flags"
  | "queue"
  | "maintenanceDebt"
>;

/** Fine-grained capability accumulators, kept alongside the displayed bands. */
export type CapabilityProgress = Partial<Record<CapabilityKey, number>>;

export function applyEffects<T extends EffectableState>(
  state: T,
  effects: Effects | undefined,
  source?: QueueEntry["sourceRef"],
): T {
  if (!effects) return state;

  /* ---- gauges (band steps, clamped) ---- */
  const gauges: Record<GaugeKey, number> = { ...state.gauges };
  if (effects.gauge)
    for (const key of GAUGE_KEYS) {
      const d = effects.gauge[key];
      if (typeof d === "number") gauges[key] = clampGauge(gauges[key] + d);
    }

  /* ---- capabilities (slow: fractional steps toward a band) ---- */
  const capabilities: Record<CapabilityKey, number> = { ...state.capabilities };
  if (effects.capability)
    for (const key of CAPABILITY_KEYS) {
      const d = effects.capability[key];
      if (typeof d === "number") capabilities[key] = clampGauge(capabilities[key] + d / CAPABILITY_GRAIN);
    }

  /* ---- skills ---- */
  let skills = state.skills;
  if (effects.skills?.length) skills = [...new Set([...state.skills, ...effects.skills])];

  /* ---- conditions and flags ---- */
  let conditions = state.conditions;
  if (effects.conditionsSet?.length || effects.conditionsClear?.length) {
    const set = new Set(state.conditions);
    for (const c of effects.conditionsSet ?? []) set.add(c);
    for (const c of effects.conditionsClear ?? []) set.delete(c);
    conditions = [...set];
  }
  let flags = state.flags;
  if (effects.flagsSet?.length || effects.flagsClear?.length) {
    const set = new Set(state.flags);
    for (const f of effects.flagsSet ?? []) set.add(f);
    for (const f of effects.flagsClear ?? []) set.delete(f);
    flags = [...set];
  }

  /* ---- relationship marks ---- */
  let relationships = state.relationships;
  if (effects.relationships?.length) {
    const next: RelationshipMark[] = state.relationships.map((r) => ({ ...r }));
    for (const delta of effects.relationships) {
      const existing = next.find((r) => r.id === delta.id);
      if (existing) {
        existing.quality = clampQuality(existing.quality + delta.quality);
        if (delta.label) existing.label = delta.label;
      } else {
        next.push({ id: delta.id, label: delta.label ?? delta.id, quality: clampQuality(delta.quality) });
      }
    }
    relationships = next;
  }

  /* ---- companion arc state (§3.7) ---- */
  let companions = state.companions;
  if (effects.companions?.length) {
    const next: Record<string, CompanionState> = { ...state.companions };
    for (const d of effects.companions) {
      // A run is dealt its people. An effect naming an arc that is not in this
      // run does nothing: materialising a stranger mid-campaign — and then
      // handing them the season's single companion slot — is not a life, it is
      // a content-authoring accident given agency.
      const cur = next[d.arcId];
      if (!cur) continue;
      next[d.arcId] = {
        ...cur,
        stage: Math.max(0, cur.stage + (d.stageDelta ?? 0)),
        neglect: Math.max(0, cur.neglect + (d.neglect ?? 0)),
        repair: Math.max(0, cur.repair + (d.repair ?? 0)),
        // Once someone has left, they have left. Nothing in the effects system
        // can un-leave them: that would be commanding loyalty (§3.7 LITERAL).
        exited: cur.exited || Boolean(d.exit),
        sinceContact: 0,
      };
    }
    companions = next;
  }

  /* ---- the queue ---- */
  let queue = state.queue;
  if (effects.queue?.length && source) for (const ins of effects.queue) queue = insert(queue, ins, source);

  /* ---- maintenance debt (§5.3) ---- */
  const maintenanceDebt = Math.max(0, state.maintenanceDebt + (effects.maintenanceDebt ?? 0));

  return {
    ...state,
    gauges,
    capabilities,
    skills,
    conditions,
    flags,
    relationships,
    companions,
    queue,
    maintenanceDebt,
  };
}

export function applyAll<T extends EffectableState>(
  state: T,
  list: (Effects | undefined)[],
  source?: QueueEntry["sourceRef"],
): T {
  let s = state;
  for (const e of list) s = applyEffects(s, e, source);
  return s;
}

function clampQuality(n: number): number {
  return Math.max(QUALITY_MIN, Math.min(QUALITY_MAX, n));
}

/**
 * High load: the condition set that steps slack down a band. Kept here rather
 * than in content so the physics is one rule, published on /methodology.
 */
export const HIGH_LOAD_CONDITIONS = ["caring-duty", "second-job", "commute-heavy", "unstable-housing", "reduced-capacity"];

export function isHighLoad(conditions: string[], maintenanceDebt = 0): boolean {
  // The third maintenance-debt threshold puts the week under load. It is the
  // cost that replaces a third pip of drag, because at that point there are no
  // spare pips left to take and a cost that cannot be paid is not a cost.
  if (maintenanceDebt >= 9) return true;
  return conditions.some((c) => HIGH_LOAD_CONDITIONS.includes(c));
}

/**
 * DEPLETION (§5.2, mechanism 2): the state-derived, deterministic, published
 * threshold below which the season's event mix stops adding negative chance
 * arrivals. Honest physics, not hidden mercy — it is disclosed on /methodology
 * and it reads STATE, never the person playing.
 */
export function isDeeplyDepleted(gauges: Record<GaugeKey, number>): boolean {
  const values = GAUGE_KEYS.map((k) => gauges[k]);
  const anyDepleted = values.some((v) => v <= 0);
  const twoThin = values.filter((v) => v <= 1).length >= 2;
  return anyDepleted || twoThin;
}
