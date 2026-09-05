/**
 * THE BUDGET ECONOMY (blueprint 4.0 §7.5) — the sandbox physics.
 *
 * Stocks vs. flow, the distinction that makes a season a real decision rather
 * than a menu:
 *
 *   - GAUGES are STOCKS. They are what you have. They move only through effects.
 *   - The BUDGET is a FLOW. It is what this season lets you spend. It re-derives
 *     fresh from the current gauge bands every season and does not carry over.
 *
 * Spending pips never directly steps a gauge — that would collapse flow back into
 * stock and make the whole thing one meter again. The one bridge between them is
 * rest: rest converts spare capacity into gauge recovery, which is what rest IS.
 *
 * Every table here is published verbatim on /methodology (§6). Nothing about the
 * economy is hidden, and nothing about it adapts to the reader (§11 FORBIDDEN:
 * no reader-performance-responsive tuning — the physics reads STATE, never the
 * person playing).
 */

import { GAUGE_BAND_ORDER, clampGauge, type GaugeKey } from "@/content/bands";
import {
  BUDGET_CURRENCIES,
  type ActionCost,
  type Budget,
  type BudgetCurrency,
  type SimState,
} from "@/content/sim/schema";

/* =========================================================================
   The published per-band pip table (§7.5)
   ========================================================================= */

/**
 * Pips granted by the band of the currency's source gauge. Index is the gauge
 * band index 0..4 (depleted → abundant). Published on /methodology.
 */
export const PIP_TABLE: Record<BudgetCurrency, number[]> = {
  //           depleted  thin  steady  comfortable  abundant
  timeStructure: [1, 2, 3, 4, 5],
  energy: [1, 2, 3, 4, 5],
  money: [1, 2, 3, 4, 5],
};

/** Which gauge each budget currency derives from (§7.5). */
export const CURRENCY_SOURCE: Record<BudgetCurrency, GaugeKey> = {
  timeStructure: "timeStructure",
  energy: "healthEnergy",
  money: "money",
};

/**
 * Connection is deliberately NOT spendable: relationships are built by actions,
 * not paid for in a currency (§7.5). Named here so the omission is a decision on
 * the record rather than an oversight.
 */
export const NON_SPENDABLE_GAUGES: GaugeKey[] = ["connection"];

/**
 * Maintenance debt raises the cost of running a season (§5.3). Ordinary physics:
 * it removes pips, and it never produces a catastrophe.
 */
export const DEBT_THRESHOLDS = [3, 6, 9];

/**
 * The pip drag is capped at TWO, and the third threshold costs something else.
 *
 * Why: the pip table runs one to five, so a three-pip drag flattened four of the
 * five bands into a single value — a player at the bottom had to climb four
 * band-steps to gain one pip, which told them, at exactly the wrong moment, that
 * nothing they did changed what they could do. Capping the drag keeps the
 * economy responsive; the third threshold instead puts the season under LOAD,
 * which steps slack down and does not need pips to exist in order to cost
 * something. Both halves are published.
 */
export const MAX_DEBT_PIP_DRAG = 2;

export function debtPenalty(maintenanceDebt: number): number {
  let n = 0;
  for (const t of DEBT_THRESHOLDS) if (maintenanceDebt >= t) n++;
  return Math.min(MAX_DEBT_PIP_DRAG, n);
}

/** True once the backlog passes its third threshold: the week itself is heavier. */
export function debtIsHighLoad(maintenanceDebt: number): boolean {
  return maintenanceDebt >= DEBT_THRESHOLDS[2];
}

/* =========================================================================
   Derivation
   ========================================================================= */

/** Derive this season's budget from the current stocks. Pure. */
/**
 * THE RESERVED PIP — narrowed, after the adversarial review of its first version
 * came back FAIL.
 *
 * WHAT IT IS NOW: the maintenance-debt drag can never take the last pip of time
 * or the last pip of energy. That is all it does.
 *
 * WHAT IT DID BEFORE, and why that was wrong. The first version applied the
 * reserve at the very end of the derivation, after standing-commitment upkeep as
 * well. The reviewer measured the consequence: across the fleet the reserve
 * cancelled 2,059 pips of published penalty in 1,307 currency-seasons, and over
 * a large reachable region — every debt from nought to nine crossed with every
 * commitment count from nought to five, at the depleted band — the budget was
 * flatly insensitive to both. Two published economy rules were, in effect, false
 * exactly where they were supposed to bite hardest. Publishing a rule does not
 * make it physics if the rule stops applying and the publication does not say so.
 *
 * The justification shipped with it was also false, and is withdrawn: it claimed
 * a player could be trapped unable to afford the action that would end a standing
 * commitment. There is no such action in this engine. What there is instead — see
 * `canAffordStanding` below — is a rule that stops the trap being built.
 *
 * Money is still not reserved. Money genuinely runs out, and the model would be
 * lying if it said otherwise.
 */
export const DEBT_DRAG_FLOOR = 1;

export function deriveBudget(state: Pick<SimState, "gauges" | "maintenanceDebt" | "standing">): Budget {
  const penalty = debtPenalty(state.maintenanceDebt);
  const out = {} as Budget;
  for (const c of BUDGET_CURRENCIES) {
    const band = clampGauge(state.gauges[CURRENCY_SOURCE[c]]);
    const base = PIP_TABLE[c][band];
    // Debt costs one pip of time and one of energy at each threshold; it never
    // touches money directly (debt is a load on the week, not a fine), and it
    // never takes the last pip of either.
    // Debt costs a pip of time and a pip of energy per threshold, capped, and it
    // never takes the LAST pip of either. It never touches money: debt is a load
    // on the week, not a fine.
    const drag = c === "money" ? 0 : penalty;
    out[c] = c === "money" ? base : Math.max(Math.min(base, DEBT_DRAG_FLOOR), base - drag);
  }
  // Standing commitments are already-spent flow: their upkeep comes off the top,
  // visibly, before the player allocates anything new — and it is NOT reserved
  // against. A commitment prices itself.
  //
  // What happens when a season can no longer pay one is NOT that the model quietly
  // refunds it. It is that the commitment LAPSES. You promised something in a
  // season that could afford it, your position fell, and now it cannot — which is
  // one of the more ordinary ways a plan ends, and the model should say so rather
  // than either pretending you can still pay or closing the season around you.
  // `lapsingStanding` names which ones, and the season surfaces each one plainly.
  for (const s of payableStanding(state, out)) {
    for (const c of BUDGET_CURRENCIES) out[c] = Math.max(0, out[c] - (s.upkeep[c] ?? 0));
  }
  return out;
}

/** Which standing commitments this season can still pay for, oldest first. */
function payableStanding(
  state: Pick<SimState, "standing">,
  budget: Budget,
): Pick<SimState, "standing">["standing"] {
  const remaining = { ...budget };
  const kept: Pick<SimState, "standing">["standing"] = [];
  for (const s of [...state.standing].sort((a, b) => a.startedSeason - b.startedSeason)) {
    const afterT = remaining.timeStructure - (s.upkeep.timeStructure ?? 0);
    const afterE = remaining.energy - (s.upkeep.energy ?? 0);
    const afterM = remaining.money - (s.upkeep.money ?? 0);
    // A commitment is payable only if paying it leaves the season a pip of time
    // and a pip of energy — the same reserve the debt drag respects. Otherwise it
    // is not affordable, and pretending otherwise is how a season closes.
    if (afterT >= DEBT_DRAG_FLOOR && afterE >= DEBT_DRAG_FLOOR && afterM >= 0) {
      remaining.timeStructure = afterT;
      remaining.energy = afterE;
      remaining.money = afterM;
      kept.push(s);
    }
  }
  return kept;
}

/** The commitments this season cannot pay for. They lapse, visibly. */
export function lapsingStanding(
  state: Pick<SimState, "gauges" | "maintenanceDebt" | "standing">,
): Pick<SimState, "standing">["standing"] {
  const base = {} as Budget;
  const penalty = debtPenalty(state.maintenanceDebt);
  for (const c of BUDGET_CURRENCIES) {
    const b = PIP_TABLE[c][clampGauge(state.gauges[CURRENCY_SOURCE[c]])];
    base[c] = c === "money" ? b : Math.max(Math.min(b, DEBT_DRAG_FLOOR), b - penalty);
  }
  const payable = new Set(payableStanding(state, base).map((s) => s.actionId + ":" + s.instanceOrdinal));
  return state.standing.filter((s) => !payable.has(s.actionId + ":" + s.instanceOrdinal));
}

/**
 * Whether a new standing commitment can be taken on. It can, if the season would
 * still hold a pip of time and a pip of energy after it and everything already
 * running. This is the honest form of the promise the reserve used to make by
 * refunding upkeep: rather than quietly giving the pips back afterwards, the
 * model declines to let you promise away the whole season in the first place —
 * visibly, before you commit, which is when it is useful to know.
 */
export function canAffordStanding(
  state: Pick<SimState, "gauges" | "maintenanceDebt" | "standing">,
  upkeep: ActionCost,
): boolean {
  const after = deriveBudget(state);
  return (
    after.timeStructure - (upkeep.timeStructure ?? 0) >= DEBT_DRAG_FLOOR &&
    after.energy - (upkeep.energy ?? 0) >= DEBT_DRAG_FLOOR &&
    after.money - (upkeep.money ?? 0) >= 0
  );
}

export function emptyBudget(): Budget {
  return { timeStructure: 0, energy: 0, money: 0 };
}

export function costOf(cost: ActionCost): Budget {
  return {
    timeStructure: cost.timeStructure ?? 0,
    energy: cost.energy ?? 0,
    money: cost.money ?? 0,
  };
}

export function addBudget(a: Budget, b: Budget): Budget {
  return {
    timeStructure: a.timeStructure + b.timeStructure,
    energy: a.energy + b.energy,
    money: a.money + b.money,
  };
}

export function subtractBudget(a: Budget, b: Budget): Budget {
  return {
    timeStructure: a.timeStructure - b.timeStructure,
    energy: a.energy - b.energy,
    money: a.money - b.money,
  };
}

export function isAffordable(remaining: Budget, cost: ActionCost): boolean {
  const c = costOf(cost);
  return (
    remaining.timeStructure >= c.timeStructure &&
    remaining.energy >= c.energy &&
    remaining.money >= c.money
  );
}

export function budgetTotal(b: Budget): number {
  return b.timeStructure + b.energy + b.money;
}

/**
 * Rest's conversion (§7.5): leftover pips become gauge recovery. The rate is a
 * published constant, and it is capped so rest can never be an exploit — spare
 * capacity is a real but bounded resource.
 */
export const REST_CONVERSION = {
  /** Pips of leftover flow that buy one band-step of recovery. */
  pipsPerStep: 3,
  /** Never more than this many band-steps from one season of rest. */
  maxSteps: 2,
};

/**
 * Recovery bought by rest. Reads the ENERGY you did not spend, and nothing else:
 * capacity is what rest restores, and money left in the account does not restore
 * it. (Summing all three currencies also made deliberate under-allocation the
 * highest-return, lowest-variance use of a pip in the campaign, which is the
 * opposite of what rest is supposed to teach.)
 */
export function restRecoverySteps(unspent: Budget): number {
  return Math.min(REST_CONVERSION.maxSteps, Math.floor(unspent.energy / REST_CONVERSION.pipsPerStep));
}

/* =========================================================================
   The published table, as data — /methodology renders exactly this.
   ========================================================================= */

export const ECONOMY_TABLE_ROWS = BUDGET_CURRENCIES.map((c) => ({
  currency: c,
  source: CURRENCY_SOURCE[c],
  pipsByBand: GAUGE_BAND_ORDER.map((band, i) => ({ band, pips: PIP_TABLE[c][i] })),
}));

export const ECONOMY_RULES: string[] = [
  "The budget is re-derived from your gauge bands at the start of every season. Unspent pips do not carry over.",
  "Spending pips never moves a gauge. Gauges move only through the effects of what actually happened.",
  "Costs are small whole numbers, one to three pips of a currency.",
  "Connection is not spendable. Relationships are built by doing things with people, not paid for.",
  "Standing commitments take their upkeep off the top of the season, before you allocate anything new.",
  "Maintenance debt costs you a pip of time and a pip of energy at each of the first two thresholds — three and six — and never more than two pips, because the pip scale only runs to five and a bigger drag would flatten four of its five bands into one number. It never costs money directly, and it never takes the last pip of time or energy, so it can slow a season down and cannot close one.",
  "The third threshold, at nine, does something different: the week itself goes under load, which steps your slack down a band. That is a real cost that does not need spare pips to exist in order to be felt — which is the point, because at that stage there are none.",
  "A season in which you do nothing for your own upkeep adds a step of debt; a season in which you take any health-family action, or rest, or wait, or ask for help, clears one. Some cards add or clear debt on their own outcomes as well, so a bad season can move it by more than one.",
  "Rest and maintenance costs nothing and is always available. What it does is convert the ENERGY you did not spend into recovery — three unspent energy pips buy one band of health and energy back, to a ceiling of two bands in a season. Unspent time and unspent money buy nothing; capacity is what rest restores.",
  "That recovery lands in addition to whatever the rest card's own outcome did. It is the only place in the model where unspent flow becomes stock, and it is capped precisely so that deliberately under-allocating cannot become the best move in the game.",
  "The floor set — rest and maintain, wait, and ask for help — is free in every state of every campaign. There is no state of this game in which you cannot afford to stop, wait, or ask.",
  "Standing commitments are different: their upkeep is not reserved against, because a commitment should price itself. You cannot take one on that the season could not pay for — that is checked before you commit, which is when knowing is useful.",
  "And if your position falls far enough that a season can no longer pay for a commitment you already made, the commitment LAPSES, and you are told. Not refunded, not quietly still running: ended, because you promised it from a position you no longer have. Lapsing costs you the ground it was holding, which is a real cost and a survivable one.",
];
