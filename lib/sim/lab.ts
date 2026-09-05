/**
 * THE DECISION LAB (blueprint 4.0 §3.8) — fork-and-compare as a standalone door.
 *
 * Three named axes, each labelled in the UI and reflected honestly in attribution:
 *
 *   choice-vary   same seeds, same hand — only the decision differs.  THE AGENCY LESSON
 *   draw-vary     same choices, a fresh draw-seed.                    G-09
 *   position-vary the same situation from a second constraint profile. G-08
 *
 * Unlimited rewind here (a Lab branch is a hypothesis, not a life), and the
 * no-prediction line renders on every comparison. Attribution is computed by the
 * same `classify` the campaign uses, so the Lab is not a special case that could
 * quietly drift from the engine it is teaching.
 *
 * THE CURATION RULES (§3.8, LITERAL, lint-enforced in S-1):
 *   1. No Lab situation's decision window may contain or schedule any loss-tier
 *      beat on any branch. The Lab does not read the beat channel at all — there
 *      is no code path here that could.
 *   2. Every situation's window must remain VALID on all branches under all its
 *      declared axes. A draw-vary or position-vary branch may never render a
 *      committed choice unavailable mid-window. That is why Lab actions carry no
 *      prerequisites and no flag gates: the window is curated, never fizzled.
 */

import { hashToUnit } from "@/lib/sim/rng";
import { applyEffects } from "@/lib/sim/effects";
import { resolve, outcomeLine } from "@/lib/sim/resolve";
import { classify, renderable } from "@/lib/sim/attribution";
import { newCampaign } from "@/lib/sim/campaign";
import { LAB_ACTIONS, LAB_ACTION_BY_ID, LAB_SITUATIONS, LAB_SITUATION_BY_ID } from "@/content/sim/lab/situations";
import { PRESET_BY_ID } from "@/content/sim/registry";
import type {
  AttributionComponent,
  LabAxis,
  LabSituation,
  ResolvedItem,
  SimAction,
  SimState,
} from "@/content/sim/schema";

/** The line that renders on EVERY comparison, in both editions (§5.5). */
export const NO_PREDICTION_LINE =
  "These are two runs of a model, not two versions of your future. The model is a teaching object: it shows how a decision, a draw, and a starting position interact. It does not know anything about you, and it is not predicting anything.";

export const AXIS_FRAME: Record<LabAxis, string> = {
  "choice-vary":
    "Both branches start from the same position and get the same luck. The only difference is the decision. Whatever separates them at the end is what the decision was worth — here, once, under these conditions.",
  "draw-vary":
    "Both branches make the same decisions. The only difference is the draw. If they end apart, that gap is not skill and not judgement; it is the range the move always had.",
  "position-vary":
    "Both branches make the same decisions and get the same luck. The only difference is where they started. What separates them is what the position cost — which is not something either character did.",
};

export type LabStep = ResolvedItem & {
  stepIndex: number;
  actionLabel: string;
  scene?: string;
  /**
   * The chosen option's own cost, spread and reversibility chips, plus any
   * position notes that are live for THIS branch's starting position.
   *
   * The Lab rendered none of this. That mattered most on position-vary, whose
   * whole lesson is "the same move costs different amounts from where you are" —
   * the screen said so and then showed two columns with no costs in them at all,
   * so the reader had to take the claim on faith. The campaign has rendered these
   * chips since 3.0; the Lab simply dropped them.
   */
  chips: { costs: string[]; variance: string; reversibility: string; positionNotes: string[]; recovery: boolean };
};

export type LabBranch = {
  id: string;
  label: string;
  axis: LabAxis;
  /** actionId → optionId, the branch's committed choices through the window. */
  choices: { actionId: string; optionId: string }[];
  seeds: { handSeed: string; drawSeed: string };
  presetId: string;
  steps: LabStep[];
  endState: SimState;
  /** Where the branch ended up, in the same qualitative vocabulary as play. */
  ending: { gauges: SimState["gauges"]; skills: string[]; flags: string[] };
};

/* =========================================================================
   Running a branch
   ========================================================================= */

function labState(presetId: string, handSeed: string, drawSeed: string): SimState {
  const preset = PRESET_BY_ID[presetId];
  return newCampaign({
    origin: preset ? { kind: "preset", presetId } : { kind: "birth-rng" },
    handSeed,
    drawSeed,
  });
}

/**
 * Run one branch of a situation. Pure in (situation, choices, seeds, preset), so a
 * branch replays byte-identically and two branches differing in exactly one input
 * differ in exactly what that input controls — which is the whole lesson.
 */
export function runBranch(
  situation: LabSituation,
  opts: { id: string; label: string; axis: LabAxis; choices: { actionId: string; optionId: string }[]; drawSeed?: string; presetId?: string },
): LabBranch {
  const presetId = opts.presetId ?? situation.startPresetId;
  const drawSeed = opts.drawSeed ?? situation.seeds.drawSeed;
  let s = labState(presetId, situation.seeds.handSeed, drawSeed);
  const handFlags = s.flags.filter((f) => f.startsWith("start:"));
  const steps: LabStep[] = [];

  situation.window.forEach((actionId, stepIndex) => {
    const action: SimAction | undefined = LAB_ACTION_BY_ID[actionId];
    if (!action) return;
    const choice = opts.choices.find((c) => c.actionId === actionId);
    const option = action.options.find((o) => o.id === choice?.optionId) ?? action.options[0];
    // Each window step is its own "season" coordinate, so the draws are
    // independent of one another and of any campaign run using the same seed.
    const coords = { seasonIndex: stepIndex, instanceOrdinal: 0, id: action.id };
    const draw = hashToUnit(drawSeed, `lab:${situation.id}:${coords.seasonIndex}:${coords.id}`);
    const res = resolve(option, s, draw);
    const line = outcomeLine(res.band, action.outcomeVariants?.[res.band.name], hashToUnit(drawSeed, `labv:${action.id}`), stepIndex);
    const attribution: AttributionComponent[] = renderable(
      classify(option, s, { marker: res.marker, handFlags }),
    );
    s = applyEffects(s, res.band.outcome.effects, { kind: "action", id: action.id, seasonIndex: stepIndex });
    steps.push({
      stepIndex,
      kind: "action",
      id: action.id,
      actionLabel: action.label,
      scene: action.scene,
      chips: {
        costs: option.chips.costs,
        variance: option.chips.variance,
        reversibility: option.chips.reversibility,
        // Position notes are filtered against THIS branch's own flags, so the
        // position-vary columns show the notes that are true where each one
        // starts — which is the axis's lesson, rendered rather than asserted.
        positionNotes: (option.chips.positionNotes ?? []).filter((p) => s.flags.includes(p.when)).map((p) => p.text),
        recovery: (option.flags ?? []).includes("recovery"),
      },
      label: action.label,
      family: action.family,
      optionId: option.id,
      optionLabel: option.label,
      band: res.band.name,
      failure: Boolean(res.band.failure),
      line,
      attribution,
      marker: res.marker,
      shift: res.shift,
      readRef: action.readRef,
      evidenceLabel: action.contract.evidenceLabel,
    });
  });

  return {
    id: opts.id,
    label: opts.label,
    axis: opts.axis,
    choices: opts.choices,
    seeds: { handSeed: situation.seeds.handSeed, drawSeed },
    presetId,
    steps,
    endState: s,
    ending: { gauges: s.gauges, skills: s.skills, flags: s.flags.filter((f) => !f.startsWith("start:")) },
  };
}

/* =========================================================================
   The three axes, each producing its pair
   ========================================================================= */

/** The default (first-option) choice set for a situation's window. */
export function defaultChoices(situation: LabSituation): { actionId: string; optionId: string }[] {
  return situation.window.map((actionId) => {
    const action = LAB_ACTION_BY_ID[actionId];
    return { actionId, optionId: action?.options[0]?.id ?? "" };
  });
}

/**
 * ONE decision changed, and only one.
 *
 * choice-vary used to run option-index 0 against option-index 1 across EVERY step
 * of the window — the whole run swapped — while the screen said "The only
 * difference is the decision" and "Whatever separates them at the end is what the
 * decision was worth". With three steps differing, whatever separated them was
 * three decisions, and the axis could not teach what it claimed to.
 *
 * `decisionStep` is the step the situation is actually about. Every other step is
 * held identical, so the difference at the end is attributable to one choice.
 */
export function choicesVaryingOneStep(
  situation: LabSituation,
  which: 0 | 1,
): { actionId: string; optionId: string }[] {
  const step = situation.decisionStep ?? 0;
  return situation.window.map((actionId, i) => {
    const action = LAB_ACTION_BY_ID[actionId];
    const idx = i === step ? Math.min((action?.options.length ?? 1) - 1, which) : 0;
    return { actionId, optionId: action?.options[idx]?.id ?? "" };
  });
}

export type Comparison = {
  situation: LabSituation;
  axis: LabAxis;
  frame: string;
  noPrediction: string;
  left: LabBranch;
  right: LabBranch;
  /** What actually differs — computed, not narrated. */
  differences: { field: string; left: string; right: string }[];
  /** The honest reading of WHY they differ, from the axis and the attribution. */
  reading: string;
};

export function compare(situationId: string, axis: LabAxis): Comparison | null {
  const situation = LAB_SITUATION_BY_ID[situationId];
  if (!situation || !situation.axes.includes(axis)) return null;

  let left: LabBranch;
  let right: LabBranch;

  if (axis === "choice-vary") {
    left = runBranch(situation, { id: "a", label: "the first way", axis, choices: choicesVaryingOneStep(situation, 0) });
    right = runBranch(situation, { id: "b", label: "the other way", axis, choices: choicesVaryingOneStep(situation, 1) });
  } else if (axis === "draw-vary") {
    const choices = defaultChoices(situation);
    left = runBranch(situation, { id: "a", label: "one run of it", axis, choices });
    right = runBranch(situation, {
      id: "b",
      label: "the same run, different luck",
      axis,
      choices,
      drawSeed: situation.seeds.altDrawSeed,
    });
  } else {
    const choices = defaultChoices(situation);
    left = runBranch(situation, {
      id: "a",
      label: PRESET_BY_ID[situation.positions[0]]?.label ?? situation.positions[0],
      axis,
      choices,
      presetId: situation.positions[0],
    });
    right = runBranch(situation, {
      id: "b",
      label: PRESET_BY_ID[situation.positions[1]]?.label ?? situation.positions[1],
      axis,
      choices,
      presetId: situation.positions[1],
    });
  }

  return {
    situation,
    axis,
    frame: AXIS_FRAME[axis],
    noPrediction: NO_PREDICTION_LINE,
    left,
    right,
    differences: diff(left, right),
    reading: reading(axis, left, right),
  };
}

function diff(a: LabBranch, b: LabBranch): { field: string; left: string; right: string }[] {
  const out: { field: string; left: string; right: string }[] = [];
  // Step-by-step first: two branches can end in the same place having got there
  // through visibly different seasons, and that difference is the lesson.
  const BAND_WORD: Record<string, string> = {
    strong: "it went well",
    solid: "it held",
    mixed: "mixed",
    poor: "it went poorly",
    failure: "it fell through",
  };
  a.steps.forEach((step, i) => {
    const other = b.steps[i];
    if (!other || step.band === other.band) return;
    out.push({
      field: step.actionLabel,
      left: BAND_WORD[step.band ?? ""] ?? String(step.band),
      right: BAND_WORD[other.band ?? ""] ?? String(other.band),
    });
  });
  const GAUGE_WORDS: Record<string, string> = {
    money: "money",
    healthEnergy: "energy",
    connection: "connection",
    timeStructure: "time",
  };
  const BANDS = ["depleted", "thin", "steady", "comfortable", "abundant"];
  for (const k of Object.keys(a.ending.gauges)) {
    const l = a.ending.gauges[k as keyof typeof a.ending.gauges];
    const r = b.ending.gauges[k as keyof typeof b.ending.gauges];
    if (l !== r) out.push({ field: GAUGE_WORDS[k] ?? k, left: BANDS[l], right: BANDS[r] });
  }
  const skillsL = a.ending.skills.filter((s) => !b.ending.skills.includes(s));
  const skillsR = b.ending.skills.filter((s) => !a.ending.skills.includes(s));
  if (skillsL.length || skillsR.length)
    out.push({
      field: "what you came away knowing",
      left: skillsL.length ? skillsL.map(plain).join(", ") : "nothing the other did not",
      right: skillsR.length ? skillsR.map(plain).join(", ") : "nothing the other did not",
    });
  const flagsL = a.ending.flags.filter((f) => !b.ending.flags.includes(f));
  const flagsR = b.ending.flags.filter((f) => !a.ending.flags.includes(f));
  if (flagsL.length || flagsR.length)
    out.push({
      field: "doors",
      left: flagsL.length ? flagsL.map(plain).join(", ") : "none the other did not have",
      right: flagsR.length ? flagsR.map(plain).join(", ") : "none the other did not have",
    });
  return out;
}

function reading(axis: LabAxis, a: LabBranch, b: LabBranch): string {
  // "Same" must mean the same on EVERYTHING the comparison renders — the bands
  // AND the endings. Deciding it on bands alone let a pair whose end states are
  // identical in every tracked field render "different endings", which is a
  // fabricated claim, and §6 forbids the display asserting what the model did
  // not produce.
  const sameBands = a.steps.every((s, i) => s.band === b.steps[i]?.band);
  const sameEnding = JSON.stringify(a.ending) === JSON.stringify(b.ending);
  const same = sameBands && sameEnding;
  if (axis === "choice-vary")
    return same
      ? "The two decisions landed in the same bands this time. That is a real result: some decisions matter less than they feel like they should, and finding that out is worth the branch."
      : "The branches separated, and since the position and the draw were identical, the decision is the only thing that could have separated them.";
  if (axis === "draw-vary") {
    if (same)
      return "Identical choices, different luck, and the same result anyway. That happens when the move's range is narrow — which is a property of the move, not of the person making it.";
    if (sameEnding)
      return "Identical choices, different luck. The seasons went differently and the two branches still arrive in the same place — which is its own lesson about how much of a difference a difference makes.";
    return "Identical choices, different luck, different endings. Nothing about the play was better in one branch. The move set the range; the draw landed inside it.";
  }
  return same
    ? "The same play from two different positions landed the same way here. Position does not decide everything — but note what each branch spent to get there, which is not the same number."
    : "The same play, the same luck, two different starting positions, two different endings. That difference is not something either character did.";
}

function plain(s: string): string {
  return s.replace(/[-_]/g, " ");
}

export { LAB_SITUATIONS, LAB_ACTIONS, LAB_SITUATION_BY_ID, LAB_ACTION_BY_ID };
