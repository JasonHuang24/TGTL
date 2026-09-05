/**
 * THE POST-RUN PARSE, campaign edition (blueprint 4.0 §3.9, spec §13).
 *
 * A life review, never a report card. No totals, no comparisons, no verdicts, no
 * score — and no characterisation of the person who played it. Everything here is
 * about the CHARACTER's twelve years.
 *
 * THE REAL-LIFE BRIDGE, and why its selector looks the way it does (§3.9, LITERAL):
 * the one real-world next step must be GENERIC and keyed AT MOST to the campaign's
 * domain themes — never to this run's failures, neglects, priorities, or outcomes.
 * Rather than promise that in a comment, `selectBridge` takes a campaign id and
 * nothing else, so there is no input from which anything about a particular run
 * could be recovered. The signature is the enforcement, and S-5 asserts the
 * signature, every call site, and every template's wording.
 */

import { GAUGE_KEYS, type GaugeKey, type OutcomeBandName } from "@/content/bands";
import { hashToUnit } from "@/lib/sim/rng";
import { replay } from "@/lib/sim/forks";
import { runSeason } from "@/lib/sim/season";
import { commitSeason } from "@/lib/sim/campaign";
import { ACTION_BY_ID, CAMPAIGN_ID, EVENT_BY_ID, seasonLabel } from "@/content/sim/registry";
import { DOOR_MEANING, DOOR_NOTE } from "@/content/sim/campaign/doors";
import { servesPriority } from "@/content/sim/domains";
import { COMPANION_ARCS } from "@/content/sim/campaign/companions";
import { CAMPAIGN_BEATS } from "@/content/sim/campaign/beats";
import {
  ATTRIBUTION_CATEGORIES,
  CAPABILITY_KEYS,
  PRIORITY_KEYS,
  PRIORITY_LABEL,
  type AttributionCategory,
  type CapabilityKey,
  type CardFamily,
  type PriorityKey,
  type SimState,
} from "@/content/sim/schema";

/* =========================================================================
   The parse
   ========================================================================= */

export type SeasonNote = {
  seasonIndex: number;
  age: number;
  half: string;
  headline: string;
  family: CardFamily;
  band?: OutcomeBandName;
  failure?: boolean;
};

export type PriorityRead = {
  key: PriorityKey;
  label: string;
  weight: number;
  /** What the run actually did about it, in plain words. Never a score. */
  reading: string;
};

export type DoorState = {
  label: string;
  /** N-214: four states. "narrowing" is a door getting harder, not a closed one. */
  state: "opened" | "closed" | "still recoverable" | "narrowing";
  note: string;
};

export type CampaignParse = {
  origin: SimState["origin"];
  profile: SimState["profile"];
  seasons: SeasonNote[];
  /** Commitments held across seasons — the maintained, unglamorous half. */
  maintained: string[];
  achievements: string[];
  /** Costs paid and needs neglected. Named, never scolded (§5.3). */
  costs: string[];
  /** Whole-run attribution, computed from the tagged components (§3.10). */
  attribution: { category: AttributionCategory; share: "most of it" | "a large part" | "some of it" | "a little of it" }[];
  priorities: PriorityRead[];
  /** Priority revisions, rendered as ADAPTATION — which is what they are. */
  revisions: { seasonIndex: number; note: string }[];
  doors: DoorState[];
  counterfactuals: string[];
  companions: { label: string; note: string }[];
  /** Beats, reduced-frame. A skipped beat is ONE neutral line (§5.1). */
  beatNotes: string[];
  bridge: Bridge;
  /**
   * Set when the ledger could not be replayed to the end (a recorded season
   * needed a response the ledger does not carry). Never silent: the parse says
   * so, in plain language, rather than presenting a short life as a whole one.
   */
  truncatedAtSeason: number | null;
  gaugesFinal: Record<GaugeKey, number>;
  capabilitiesFinal: Record<CapabilityKey, number>;
};

/**
 * The invisible-work line, carried forward from 3.0's parse. It is always last and
 * it is always present, because the work that does not show is still the work.
 */
export const INVISIBLE_WORK_LINE =
  "And the part that leaves no record: the weeks you kept the ordinary machinery of a life running, which is most of what a life is made of and almost none of what gets counted.";

export function computeParse(state: SimState): CampaignParse {
  // Replay from the ledger so every rendered fact is derived, never remembered.
  let s = replay(state.origin, { handSeed: state.handSeed, drawSeed: state.drawSeed }, []);
  s = { ...s, priorities: state.priorities };

  const seasons: SeasonNote[] = [];
  let truncatedAt: number | null = null;
  const attributionTotals = new Map<AttributionCategory, number>();
  const revisions: { seasonIndex: number; note: string }[] = [];
  const familiesTouched = new Set<CardFamily>();
  let failures = 0;
  let recoveries = 0;

  for (const season of state.committed) {
    if (season.priorityRevision) {
      s = { ...s, priorities: season.priorityRevision };
      const label = seasonLabel(season.seasonIndex);
      revisions.push({
        seasonIndex: season.seasonIndex,
        note: `At ${label.age} you changed what you were aiming at. That is adaptation — new information arriving and the plan moving to meet it — and it is recorded here as such.`,
      });
    }
    // commitSeason, not runSeason: the season pointer has to advance, or every
    // replayed season re-runs season one and the parse sees a single season.
    const run = commitSeason(s, season.allocations, season.eventResponses, season.beatResponse);
    if (!run.done) {
      // The ledger and the content have gone out of step — a recorded season
      // needs a response the ledger does not carry. Swallowing this silently
      // truncated the parse and reported the short version as the whole life.
      truncatedAt = season.seasonIndex;
      break;
    }
    for (const item of run.result.items) {
      for (const c of item.attribution)
        attributionTotals.set(c.category, (attributionTotals.get(c.category) ?? 0) + Math.abs(c.weight));
      familiesTouched.add(item.family);
      if (item.failure) failures++;
      if (item.kind === "action") {
        const act = ACTION_BY_ID[item.id];
        if (act?.options.find((o) => o.id === item.optionId)?.flags?.some((f) => f === "recovery" || f === "endurance"))
          recoveries++;
      }
    }
    const lead = run.result.items.find((i) => i.kind === "action") ?? run.result.items[0];
    if (lead) {
      const label = seasonLabel(season.seasonIndex);
      seasons.push({
        seasonIndex: season.seasonIndex,
        age: label.age,
        half: label.half,
        headline: lead.line,
        family: lead.family,
        band: lead.band,
        failure: lead.failure,
      });
    }
    s = run.state;
  }

  /* ---- maintained commitments and achievements ---- */
  const counts = new Map<string, number>();
  for (const season of state.committed)
    for (const a of season.allocations) counts.set(a.actionId, (counts.get(a.actionId) ?? 0) + 1);
  const maintained = [...counts.entries()]
    .filter(([, n]) => n >= 3)
    .map(([id, n]) => {
      const label = ACTION_BY_ID[id]?.label ?? id;
      return `${label} — held across ${numberWord(n)} season${n === 1 ? "" : "s"}.`;
    });

  const achievements: string[] = [];
  if (s.skills.length)
    achievements.push(`You came out of it knowing how to do things you could not do at eighteen: ${s.skills.map(plain).join(", ")}.`);
  if (familiesTouched.size >= 5)
    achievements.push("You did not spend twelve years in one corner of a life. The record runs across most of it.");
  if (recoveries > 0)
    achievements.push(`${capitalise(numberWord(recoveries))} times, something went wrong and you went and did something about it rather than waiting for it to pass.`);
  const kept = Object.values(s.companions).filter((c) => !c.exited).length;
  if (kept > 0)
    achievements.push(`${capitalise(numberWord(kept))} of the people who were in your life at eighteen were still in it at thirty. That does not happen on its own.`);
  achievements.push(INVISIBLE_WORK_LINE);

  /* ---- costs and neglected needs, named without shame ---- */
  const costs: string[] = [];
  if (s.maintenanceDebt >= 3)
    costs.push("There is a backlog of small maintenance in this life. It is not a moral failure; it is a bill, and it was still costing you time at thirty.");
  // One template per gauge meant a bad run printed the same sentence four times in
  // a row ("Money finished thin. Whatever else... / Energy finished thin. Whatever
  // else..."). §5.2 caps what a SEASON delivers; nothing capped or varied the
  // closing screen, and the voice lint only ever read season items.
  const THIN: Record<GaugeKey, string> = {
    money: "Money finished thin. Whatever else these years bought, they did not buy room.",
    healthEnergy: "You arrive at thirty tired. Some of that is the decade and some of it is the way you spent it.",
    connection: "There are fewer people close in than there were at eighteen. That is a real cost and it is not a verdict.",
    timeStructure: "Your week is still full of other people's shapes. The hours never quite came back.",
  };
  const thin = GAUGE_KEYS.filter((k) => s.gauges[k] <= 1);
  if (thin.length >= 3)
    costs.push(
      `Most of what a life runs on finished thin — ${thin.map((k) => gaugeWord(k)).join(", ")}. Naming all of it in one line rather than four is not softening it; it is the same fact, said once.`,
    );
  else for (const k of thin) costs.push(THIN[k]);
  const gone = Object.values(s.companions).filter((c) => c.exited);
  for (const c of gone) {
    const arc = COMPANION_ARCS.find((a) => a.id === c.arcId);
    costs.push(`${arc?.label ?? c.arcId} is not in this life any more. People can leave, and this one did.`);
  }
  if (failures > 0)
    costs.push(
      `${capitalise(numberWord(failures))} thing${failures === 1 ? "" : "s"} did not work. That is what a decade with real attempts in it looks like from the inside.`,
    );

  /* ---- the whole-run attribution split ---- */
  const total = [...attributionTotals.values()].reduce((a, b) => a + b, 0) || 1;
  const attribution = ATTRIBUTION_CATEGORIES.map((category) => ({
    category,
    weight: attributionTotals.get(category) ?? 0,
  }))
    .filter((c) => c.weight > 0)
    .sort((a, b) => b.weight - a.weight)
    .map((c) => ({ category: c.category, share: shareWord(c.weight / total) }));

  /* ---- the scorecard, read against the player's OWN priorities ---- */
  const priorities: PriorityRead[] = PRIORITY_KEYS.filter((k) => state.priorities[k] > 0).map((key) => ({
    key,
    label: PRIORITY_LABEL[key],
    weight: state.priorities[key],
    reading: priorityReading(key, s, counts),
  }));

  /* ---- doors ---- */
  // Every non-`start:` flag used to be pushed here as state "opened", with the
  // note "This is available to you now", and the stylesheet paints "opened" in
  // the good-outcome color — so a character who lost a job, was denied benefits
  // or burned a reference read those as green doors that opened, on the last
  // screen of a twelve-year run. §3.9 asks for three states; one was shipped.
  // A flag now renders only if DOOR_MEANING says what it is and which way it
  // went. Anything unlisted or skipped is not claimed at all.
  const doors: DoorState[] = [];
  for (const flag of s.flags) {
    if (flag.startsWith("start:")) continue;
    const meaning = DOOR_MEANING[flag];
    if (!meaning || "skip" in meaning) continue;
    doors.push({ label: meaning.label, state: meaning.state, note: DOOR_NOTE[meaning.state] });
  }
  const unusedFamilies = (["work", "school", "people", "health", "money", "home", "civic", "inner", "threshold"] as CardFamily[]).filter(
    (f) => !familiesTouched.has(f),
  );
  for (const f of unusedFamilies)
    doors.push({
      label: familyWord(f),
      state: "still recoverable",
      note: "You did not go here. It is still there; thirty is not a closing time.",
    });

  /* ---- counterfactuals ---- */
  const counterfactuals: string[] = [
    "The fork you did not take is still playable. That is what the branch list is for — not to find the right one, because there is no right one, but to see what the other one actually cost.",
  ];
  if (state.fork)
    // "Both are still there" was only true once forking began saving the parent
    // first; it names that save now rather than asserting one exists.
    counterfactuals.push(
      `This run is itself a branch — ${state.fork.label} — taken from a run that was saved at the point you branched. That saved run is still on this device, and so is this one.`,
    );

  /* ---- companions ---- */
  const companions = Object.values(s.companions).map((c) => {
    const arc = COMPANION_ARCS.find((a) => a.id === c.arcId);
    return {
      label: arc?.label ?? c.arcId,
      note: c.exited
        ? "Left, at their own decision."
        : c.neglect >= 3
          ? "Still here, and it has been a while since you were."
          : c.repair > 0
            ? "There was a repair in this, and it was made."
            : "Still here.",
    };
  });

  /* ---- beats, reduced-frame ---- */
  const beatNotes = state.beatsPlayed.map((b) =>
    b.skipped ? CAMPAIGN_BEATS[b.beatId]?.skippedLine ?? "" : CAMPAIGN_BEATS[b.beatId]?.skippedLine ?? "",
  ).filter(Boolean);

  return {
    origin: state.origin,
    profile: state.profile,
    seasons,
    maintained,
    achievements,
    costs,
    attribution,
    priorities,
    revisions,
    doors,
    counterfactuals,
    companions,
    beatNotes,
    bridge: selectBridge(CAMPAIGN_ID),
    truncatedAtSeason: truncatedAt,
    gaugesFinal: s.gauges,
    capabilitiesFinal: s.capabilities,
  };
}

/* =========================================================================
   THE REAL-LIFE BRIDGE (§3.9, LITERAL selection semantics)
   ========================================================================= */

export type Bridge = { theme: string; line: string; linkLabel: string; href: string };

/**
 * The campaign's domain themes (spec §16.1). The bridge templates are keyed to
 * THESE and to nothing else — they are the campaign's subject matter, not this
 * run's story.
 */
const BRIDGE_TEMPLATES: Bridge[] = [
  {
    theme: "education and skill",
    line: "This campaign is about the years when what you can do is still being decided. If that question is live in your own life, the guidance flow is the tool for it — it asks about your situation and shows the routes, without telling you which one you are.",
    linkLabel: "Open the guidance flow",
    href: "/guidance",
  },
  {
    theme: "work and income",
    line: "This campaign is about work that has to pay for a life while also becoming something. If that is live for you right now, the guidance flow will walk it with you — your answers, your constraints, no verdict at the end.",
    linkLabel: "Open the guidance flow",
    href: "/guidance",
  },
  {
    theme: "housing and material stability",
    line: "This campaign is about where you live and what it costs you to be there. If that is a live question in your own life, the guidance flow is where to take it.",
    linkLabel: "Open the guidance flow",
    href: "/guidance",
  },
  {
    theme: "health and functional capacity",
    line: "This campaign is about the capacity a life is spent from. If yours is a live question at the moment, the guidance flow will take it seriously without pretending to diagnose anything.",
    linkLabel: "Open the guidance flow",
    href: "/guidance",
  },
  {
    theme: "relationships and support",
    line: "This campaign is about the people a life is made with and what keeping them costs. If any of that is live for you, the guidance flow is the tool, and it will not tell you what your relationships are.",
    linkLabel: "Open the guidance flow",
    href: "/guidance",
  },
  {
    theme: "meaning, identity, and future optionality",
    line: "This campaign is about what a life is for and what stays possible. If that is a live question, the guidance flow is where the guidebook does that work with you rather than at you.",
    linkLabel: "Open the guidance flow",
    href: "/guidance",
  },
];

/**
 * LITERAL: this function takes a campaign id and NOTHING ELSE.
 *
 * An earlier version also took the run's hand seed, on the reasoning that a seed
 * is not an outcome. That reasoning was wrong, and the adversarial review of the
 * mechanic said so plainly: the hand seed fully determines the starting hand, so
 * the run's entire constraint profile was recoverable inside this function with
 * the signature unchanged. "The signature is the enforcement" was a claim the
 * signature did not support. It supports it now: from a campaign id, nothing
 * about a particular run is recoverable, because a campaign id is the same for
 * every run of that campaign.
 *
 * The cost is that the closing line is the same for everyone. That is the right
 * cost to pay: §3.9 says the bridge is keyed AT MOST to the campaign's domain
 * themes, and one campaign has one set of themes.
 */
export function selectBridge(campaignId: string): Bridge {
  const u = hashToUnit("bridge-template", campaignId);
  return BRIDGE_TEMPLATES[Math.min(BRIDGE_TEMPLATES.length - 1, Math.floor(u * BRIDGE_TEMPLATES.length))];
}

/** Exported so S-5 can lint EVERY template rather than the ones a seed happens to reach. */
export { BRIDGE_TEMPLATES };

/** The invitational frame the bridge always renders inside. Never an assertion. */
export const BRIDGE_FRAME =
  "One last thing, and it is not about the character. If any of what this campaign is made of is live in your own life right now, there is a tool on this site for that. If it is not, this is just a game about a decade, and you can close it.";

/* =========================================================================
   helpers
   ========================================================================= */

function priorityReading(key: PriorityKey, s: SimState, counts: Map<string, number>): string {
  const spentOn = [...counts.entries()]
    .filter(([id]) => actionServes(id, key))
    .reduce((a, [, n]) => a + n, 0);
  if (spentOn === 0)
    return `You said this mattered, and the record does not show many seasons going into it. That is not a failure — twelve years is not long enough for ten priorities — but it is worth seeing.`;
  if (spentOn >= 6) return `A great deal of this run went here. Whatever else it cost, this got the seasons.`;
  // "one seasons of it" when the count was one.
  return `Some of the run went here — ${numberWord(spentOn)} season${spentOn === 1 ? "" : "s"} of it, alongside everything else that was being carried.`;
}

/** Which priorities an action's domains speak to. Authoring data, not a score. */
const PRIORITY_DOMAINS: Record<PriorityKey, string[]> = {
  safety: ["housing", "money", "stability"],
  health: ["health", "capacity", "recovery"],
  closeness: ["relationships", "family", "care", "support"],
  autonomy: ["autonomy", "optionality", "independence"],
  mastery: ["skill", "craft", "learning", "practice"],
  wealth: ["money", "income", "work"],
  service: ["service", "community", "care"],
  creativity: ["creative", "making", "art"],
  recognition: ["status", "recognition", "profile"],
  meaning: ["meaning", "identity", "inner"],
};

function actionServes(actionId: string, key: PriorityKey): boolean {
  const act = ACTION_BY_ID[actionId];
  if (!act) return false;
  // Was a SUBSTRING match against a short word list, which silently answered
  // "no" for 36 of the pool's 77 domain tags — `institutions`, `education`,
  // `people`, and (by accident of spelling) `mastery` and `creativity`
  // themselves. The closing screen then told a player who had spent a decade on
  // a craft that the record did not show many seasons going into mastery.
  return servesPriority(act.domains, key);
}

function shareWord(fraction: number): "most of it" | "a large part" | "some of it" | "a little of it" {
  if (fraction >= 0.4) return "most of it";
  if (fraction >= 0.25) return "a large part";
  if (fraction >= 0.12) return "some of it";
  return "a little of it";
}

const WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen",
  "nineteen", "twenty",
];
function numberWord(n: number): string {
  return WORDS[n] ?? "many";
}
function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function plain(s: string): string {
  return s.replace(/[-_]/g, " ");
}
const GAUGE_WORD: Record<GaugeKey, string> = {
  money: "money",
  healthEnergy: "energy",
  connection: "connection",
  timeStructure: "time",
};
function gaugeWord(k: GaugeKey): string {
  return GAUGE_WORD[k];
}
const FAMILY_WORD: Record<CardFamily, string> = {
  home: "home and where you live",
  school: "learning and skill",
  threshold: "asking for help",
  work: "work",
  money: "money",
  people: "the people around you",
  health: "your own capacity",
  civic: "institutions and paperwork",
  inner: "the inside of your own life",
};
function familyWord(f: CardFamily): string {
  return FAMILY_WORD[f];
}

export { CAPABILITY_KEYS, EVENT_BY_ID };
