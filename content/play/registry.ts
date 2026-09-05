/**
 * Small display registries for the state vector (blueprint 3.0 §3.6, §11.1):
 * skills as named capabilities, conditions as active modifiers. Effects reference
 * these by id; the panel renders their labels. Kept edition-neutral and plain.
 *
 * NONE of the loss-tier or crisis-tier domains appear here. The depression
 * modifier is NOT a condition in this table — it exists only as a scripted beat
 * with its real-world page (§7.2); it is never a strategic modifier.
 */

export type ConditionRecord = {
  id: string;
  label: string;
  note: string;
  /** Whether this condition steps slack down one band while active (§11.2). */
  highLoad?: boolean;
};

export const CONDITIONS: Record<string, ConditionRecord> = {
  "steady-footing": {
    id: "steady-footing",
    label: "steady footing",
    note: "things are, for now, not on fire",
  },
  "stretched-thin": {
    id: "stretched-thin",
    label: "stretched thin",
    note: "more is being asked than there is of you to give",
    highLoad: true,
  },
  "care-load": {
    id: "care-load",
    label: "carrying care",
    note: "someone else's day runs through yours now",
    highLoad: true,
  },
  "new-parent": {
    id: "new-parent",
    label: "new parent",
    note: "a small person now sets the schedule",
    highLoad: true,
  },
  "run-down": {
    id: "run-down",
    label: "run down",
    note: "the body is sending invoices you have been ignoring",
    highLoad: true,
  },
  "footloose": {
    id: "footloose",
    label: "footloose",
    note: "few obligations, wide options, thin roots",
  },
  "well-tended": {
    id: "well-tended",
    label: "well tended",
    note: "maintenance is getting done; the counterfactual you cannot see is working",
  },
  "in-repair": {
    id: "in-repair",
    label: "in repair",
    note: "rebuilding something that took a hit — slow, real work",
  },
};

export type SkillRecord = { id: string; label: string };

export const SKILLS: Record<string, SkillRecord> = {
  "reads-a-room": { id: "reads-a-room", label: "reads a room" },
  "asks-for-help": { id: "asks-for-help", label: "asks for help" },
  "sticks-with-hard-things": { id: "sticks-with-hard-things", label: "sticks with hard things" },
  "handles-money": { id: "handles-money", label: "handles money" },
  "makes-things": { id: "makes-things", label: "makes things" },
  "tells-the-truth-early": { id: "tells-the-truth-early", label: "tells the truth early" },
  "keeps-a-network": { id: "keeps-a-network", label: "keeps a network warm" },
  "recovers-fast": { id: "recovers-fast", label: "recovers fast" },
  "reads-the-fine-print": { id: "reads-the-fine-print", label: "reads the fine print" },
  "steadies-others": { id: "steadies-others", label: "steadies others" },
};

export function conditionLabel(id: string): string {
  return CONDITIONS[id]?.label ?? id;
}
export function skillLabel(id: string): string {
  return SKILLS[id]?.label ?? id;
}
export function isHighLoadCondition(id: string): boolean {
  return Boolean(CONDITIONS[id]?.highLoad);
}
