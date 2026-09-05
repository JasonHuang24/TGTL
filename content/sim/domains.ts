/**
 * THE DOMAIN VOCABULARY — what each authored `domains` tag actually serves.
 *
 * `domains` is the tag every action and event carries to say what kind of thing
 * it is. Two places read it: `actionServes` in the parse (the closing "a great
 * deal of this run went here" reading, per priority) and `SATISFACTION_SOURCES`
 * in the internal balance measure that S-10 probes with.
 *
 * Both used to match by SUBSTRING against a short hardcoded word list, and
 * nothing constrained what an author could write. The result, measured across
 * the shipped pool: 77 distinct domain strings, of which 36 matched no priority
 * at all — including `institutions` (26 records), `education` (18) and `people`
 * (17). Worse, the two most obvious tags were orphans by accident of spelling:
 * `"creativity".includes("creative")` is false, and `"mastery"` contains none of
 * skill/craft/learning/practice. So a card tagged `mastery` served neither
 * mastery nor creativity, and `act-body-creative-practice` — "Commit to a year of
 * practice" — served neither.
 *
 * This replaces the substring guess with an authored map, one entry per tag, and
 * S-3 fails the build on a tag with no entry or an entry no record uses. The
 * mapping is a design judgement and is published on /methodology with everything
 * else, because it shapes both what the closing screen says a run went into and
 * what the balance fleet concludes about which ways of playing work.
 */

import type { PriorityKey } from "@/content/sim/schema";

export const DOMAIN_SERVES: Record<string, PriorityKey[]> = {
  /* --- work and money --- */
  work: ["wealth"],
  income: ["wealth"],
  money: ["safety", "wealth"],
  tax: ["safety", "wealth"],
  paperwork: ["safety"],
  markets: ["wealth"],
  market: ["wealth"],
  search: ["wealth"],
  negotiation: ["wealth", "recognition"],
  leverage: ["wealth", "recognition"],
  advancement: ["wealth", "recognition"],
  material: ["wealth"],
  liability: ["safety"],
  opportunity: ["wealth", "autonomy"],

  /* --- the roof, the paperwork, the floor under things --- */
  housing: ["safety"],
  home: ["safety"],
  place: ["safety", "autonomy"],
  distance: ["autonomy"],
  stability: ["safety"],
  safety: ["safety"],
  access: ["safety"],
  logistics: ["safety"],
  planning: ["safety"],
  maintenance: ["safety", "health"],
  "long-horizon": ["safety", "meaning"],
  // Dealing with an institution is rarely anybody's goal; what it buys is the
  // thing you were entitled to and could not reach, which is a floor question.
  institutions: ["safety"],

  /* --- body and capacity --- */
  health: ["health"],
  capacity: ["health"],
  sleep: ["health"],
  habits: ["health"],

  /* --- people --- */
  relationships: ["closeness"],
  people: ["closeness"],
  family: ["closeness"],
  friendship: ["closeness"],
  neighbors: ["closeness"],
  support: ["closeness"],
  care: ["closeness", "service"],
  caregiving: ["closeness", "service"],
  repair: ["closeness"],
  conflict: ["closeness"],
  boundaries: ["closeness", "autonomy"],
  commitment: ["closeness"],
  obligation: ["closeness"],
  responsibility: ["closeness", "service"],
  mentorship: ["service", "mastery"],

  /* --- learning and craft --- */
  learning: ["mastery"],
  education: ["mastery"],
  school: ["mastery"],
  skill: ["mastery"],
  skills: ["mastery"],
  craft: ["mastery", "creativity"],
  trades: ["mastery"],
  mastery: ["mastery"],
  credential: ["mastery", "wealth"],
  credentials: ["mastery", "wealth"],
  portfolio: ["mastery", "creativity"],

  /* --- making --- */
  creative: ["creativity"],
  creativity: ["creativity"],
  making: ["creativity"],

  /* --- being seen --- */
  recognition: ["recognition"],
  reputation: ["recognition"],
  presentation: ["recognition"],
  authority: ["recognition"],
  management: ["recognition"],
  reliability: ["recognition"],

  /* --- hours that are yours --- */
  autonomy: ["autonomy"],
  optionality: ["autonomy"],
  adaptability: ["autonomy"],
  scheduling: ["autonomy"],
  time: ["autonomy"],
  exit: ["autonomy"],

  /* --- what it was for --- */
  meaning: ["meaning"],
  identity: ["meaning"],
  inner: ["meaning"],
  endings: ["meaning"],
  thresholds: ["meaning"],
  fit: ["meaning", "autonomy"],
};

/*
 * The map holds exactly the tags the pool uses — no aspirational vocabulary.
 * `recovery`, `service`, `community`, `practice`, `art`, `status`, `profile` and
 * `independence` were carried over from the old hardcoded word list and are gone:
 * a tag nobody writes cannot be checked against anything, and keeping it would
 * let a typo'd entry sit here looking like coverage. Adding a new tag means
 * adding its entry in the same change, which is what S-3 enforces in both
 * directions. Every one of the ten priorities still has content serving it —
 * `service` through `care`, `caregiving`, `responsibility` and `mentorship` —
 * and S-3 asserts that too.
 */

/** Which priorities a record's domain tags serve, deduplicated. */
export function domainsServe(domains: readonly string[]): PriorityKey[] {
  const out = new Set<PriorityKey>();
  for (const d of domains) for (const k of DOMAIN_SERVES[d] ?? []) out.add(k);
  return [...out];
}

/** Does this record serve that priority at all? */
export function servesPriority(domains: readonly string[], key: PriorityKey): boolean {
  return domains.some((d) => (DOMAIN_SERVES[d] ?? []).includes(key));
}
