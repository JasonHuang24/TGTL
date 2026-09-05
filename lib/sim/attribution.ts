/**
 * THE ATTRIBUTION SPLIT (blueprint 4.0 §3.10, LITERAL — and computable).
 *
 * "Attribution is computed, never narrated" (§6). The rendered factors on any
 * resolution are exactly the set of nonzero tagged components that went into it —
 * gate S-12 asserts set equality, so a factor cannot be described in prose without
 * a real modifier behind it, and a real modifier cannot go unmentioned.
 *
 * The classification rule is FIXED (§3.10) and lives here, in one function:
 *
 *   hand-derived flags / preset constraints ....... your starting conditions
 *   gauges, skills, capabilities, queue provenance  your accumulated state
 *   companion triggers ........................... other people's decisions
 *   systemic triggers ............................ systems and institutions
 *   the option itself ............................ your choice
 *   the marker ................................... the draw
 */

import { clampGauge, type GaugeKey } from "@/content/bands";
import {
  type AttributionComponent,
  type CapabilityKey,
  type SimOption,
  type SimState,
  type Sensitivity,
} from "@/content/sim/schema";

/** The state attribution reads. A partial so fixtures can pass a slice. */
export type AttributableState = Pick<
  SimState,
  "gauges" | "capabilities" | "skills" | "flags" | "profile" | "companions"
>;

/**
 * The single classification pass. Returns every component with its category and
 * signed weight; the caller filters to nonzero and renders exactly those.
 *
 * `marker` is the draw position 0..1; `neutral` is where the draw would have to
 * land for luck to have contributed nothing. The draw's contribution is signed by
 * which side of neutral it fell, and its magnitude is how far — so "the draw" only
 * appears when the draw actually did something.
 */
export function classify(
  option: SimOption,
  state: AttributableState,
  opts: {
    marker: number;
    /** Constraint flags that came from the hand or preset (starting conditions). */
    handFlags: string[];
    /** Flags set by a companion's behaviour this season. */
    companionFlags?: string[];
    /** Flags set by a systemic event this season. */
    systemicFlags?: string[];
    /** A queue entry's provenance, when this resolution came off the queue. */
    queueSource?: { label: string; seasonIndex: number };
  },
): AttributionComponent[] {
  const out: AttributionComponent[] = [];
  const s: Sensitivity | undefined = option.sensitivity;

  /* ---- your choice: the option itself, always a contributor ---- */
  out.push({ category: "choice", weight: 1, note: `you chose to ${lower(option.label)}` });

  /* ---- your accumulated state ---- */
  if (s?.gauge) {
    const band = clampGauge(state.gauges[s.gauge as GaugeKey]);
    const w = (band - 2) * 0.4;
    if (w !== 0)
      out.push({
        category: "accumulatedState",
        weight: w,
        note: w > 0 ? `the ${gaugeWord(s.gauge)} you had built up` : `how thin your ${gaugeWord(s.gauge)} was`,
      });
  }
  if (s?.capability) {
    const band = clampGauge(state.capabilities[s.capability as CapabilityKey] ?? 2);
    const w = (band - 2) * 0.35;
    if (w !== 0)
      out.push({
        category: "accumulatedState",
        weight: w,
        note: w > 0 ? `the ${capabilityWord(s.capability)} you had built` : `how little ${capabilityWord(s.capability)} you had to spend`,
      });
  }
  if (s?.skill && state.skills.includes(s.skill))
    out.push({ category: "accumulatedState", weight: 0.8, note: `the ${skillWord(s.skill)} you already had` });
  if (opts.queueSource)
    out.push({
      category: "accumulatedState",
      weight: 0.5,
      note: `what ${opts.queueSource.label} had already set in motion`,
    });

  /* ---- your starting conditions ---- */
  if (s?.constraintFlags) {
    const hit = s.constraintFlags.filter((f) => state.flags.includes(f) && opts.handFlags.includes(f));
    for (const f of hit)
      out.push({ category: "startingConditions", weight: -0.6, note: `what you started with: ${flagWord(f)}` });
  }
  // A constraint flag the run acquired later is accumulated state, not a start.
  if (s?.constraintFlags) {
    const later = s.constraintFlags.filter((f) => state.flags.includes(f) && !opts.handFlags.includes(f));
    for (const f of later)
      out.push({ category: "accumulatedState", weight: -0.6, note: `where the run had got to: ${flagWord(f)}` });
  }

  /* ---- other people's decisions ---- */
  const compFlags = opts.companionFlags ?? [];
  if (s?.companionFlags)
    for (const f of s.companionFlags.filter((f) => compFlags.includes(f) || state.flags.includes(f)))
      out.push({ category: "otherPeople", weight: -0.5, note: `what someone else decided: ${flagWord(f)}` });

  /* ---- systems and institutions ---- */
  const sysFlags = opts.systemicFlags ?? [];
  if (s?.systemicFlags)
    for (const f of s.systemicFlags.filter((f) => sysFlags.includes(f) || state.flags.includes(f)))
      out.push({ category: "systems", weight: -0.7, note: `the rules you were working inside: ${flagWord(f)}` });

  /* ---- the draw ---- */
  const luck = opts.marker - 0.5;
  if (Math.abs(luck) > 0.08)
    out.push({
      category: "draw",
      weight: luck * 2,
      note: luck > 0 ? "where the draw landed — the wrong side of the range" : "where the draw landed — the good side of the range",
    });

  return out;
}

/** Only nonzero components render (§3.10). This is the set S-12 compares. */
export function renderable(components: AttributionComponent[]): AttributionComponent[] {
  return components.filter((c) => Math.abs(c.weight) > 1e-9);
}

/* ---- plain words, so the split reads as English and never as a formula ---- */

const GAUGE_WORD: Record<string, string> = {
  money: "money",
  healthEnergy: "energy",
  connection: "connection",
  timeStructure: "time",
};
const CAPABILITY_WORD: Record<string, string> = {
  vitality: "vitality",
  learning: "learning",
  execution: "follow-through",
  regulation: "steadiness",
  socialNavigation: "read of people",
  adaptability: "adaptability",
};

function gaugeWord(k: string): string {
  return GAUGE_WORD[k] ?? k;
}
function capabilityWord(k: string): string {
  return CAPABILITY_WORD[k] ?? k;
}
function skillWord(k: string): string {
  return k.replace(/[-_]/g, " ");
}
function flagWord(k: string): string {
  return k.replace(/[-_]/g, " ");
}
function lower(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}
