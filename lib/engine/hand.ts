/**
 * Birth RNG — drawing the hand (blueprint 3.0 §3.3). Pure: the whole hand derives
 * from the hand-seed via hashToUnit, so the accepted hand replays identically
 * ("same hand, again") and a redraw is just a fresh hand-seed.
 *
 * Hierarchical and conditional: household is drawn first; its hardness tilts the
 * weights of family, health, and environment (the "randomized does not mean
 * independent" lesson). The difficulty tier is computed from the summed hardness.
 */

import { GAUGE_KEYS, clampGauge, type GaugeKey } from "@/content/bands";
import { hashToUnit, weightedIndex } from "@/lib/engine/rng";
import {
  BASELINE_GAUGE,
  ERA,
  HAND_AXES,
  TILT_STRENGTH,
  type HandAxis,
  type HandValue,
} from "@/content/play/hand-axes";
import { makeProfile } from "@/content/sim/profile";
import type { Hand } from "@/content/play/schema";

/** Tilt an axis's base weights by the household hardness (§ hand-axes TILT rule). */
function tiltedWeights(axis: HandAxis, householdHardness: number): number[] {
  return axis.values.map((v) => {
    const lean = (v.hardness - 1.5) / 1.5; // -1..1
    const factor = Math.max(0.05, 1 + householdHardness * lean * TILT_STRENGTH);
    return Math.max(0, v.weight) * factor;
  });
}

function drawAxis(axis: HandAxis, seed: string, householdHardness: number): HandValue {
  const weights =
    axis.id === "household"
      ? axis.values.map((v) => Math.max(0, v.weight))
      : tiltedWeights(axis, householdHardness);
  const unit = hashToUnit(seed, `hand:${axis.id}`);
  return axis.values[weightedIndex(unit, weights)];
}

export type DrawnHand = {
  hand: Hand;
  /** The per-axis picked values, in reveal order, for the creation beat. */
  reveal: { axisId: string; title: string; value: HandValue }[];
  /** Starting gauges the hand sets (the run initializes from these). */
  startGauges: Record<GaugeKey, number>;
  startConditions: string[];
};

export function drawHand(handSeed: string): DrawnHand {
  const household = drawAxis(HAND_AXES[0], handSeed, 0);
  const family = drawAxis(HAND_AXES[1], handSeed, household.hardness);
  const health = drawAxis(HAND_AXES[2], handSeed, household.hardness);
  const environment = drawAxis(HAND_AXES[3], handSeed, household.hardness);

  const picked = [household, family, health, environment];
  // THE CONSTRAINT PROFILE (§2.3.1). The four drawn axes map onto the four cost
  // axes one-for-one, and nothing sums them: the summed hardness that used to
  // produce a tier is not computed here any more, because there is no tier.
  const profile = makeProfile({
    money: household.hardness,
    backing: family.hardness,
    body: health.hardness,
    place: environment.hardness,
  });

  const startGauges = {} as Record<GaugeKey, number>;
  for (const key of GAUGE_KEYS) startGauges[key] = BASELINE_GAUGE;
  for (const v of picked) {
    if (v.gauge) {
      for (const key of GAUGE_KEYS) {
        const d = v.gauge[key];
        if (typeof d === "number") startGauges[key] = clampGauge(startGauges[key] + d);
      }
    }
  }

  const flags = [...new Set(picked.flatMap((v) => v.flags ?? []))];
  const startConditions = [...new Set(picked.flatMap((v) => v.conditions ?? []))];

  const hand: Hand = {
    era: ERA.label,
    household: household.label,
    family: family.label,
    health: health.label,
    environment: environment.label,
    flags,
    profile,
  };

  return {
    hand,
    reveal: [
      { axisId: "era", title: "The board", value: eraAsValue() },
      { axisId: "household", title: HAND_AXES[0].title, value: household },
      { axisId: "family", title: HAND_AXES[1].title, value: family },
      { axisId: "health", title: HAND_AXES[2].title, value: health },
      { axisId: "environment", title: HAND_AXES[3].title, value: environment },
    ],
    startGauges,
    startConditions,
  };
}

/** Present the fixed era as a reveal card in the same shape as a drawn value. */
function eraAsValue(): HandValue {
  return { id: ERA.id, label: ERA.label, reveal: ERA.reveal, hardness: 0, weight: 1 };
}
