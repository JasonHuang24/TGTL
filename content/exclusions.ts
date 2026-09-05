/**
 * The two-tier content-boundary exclusion lists (blueprint 3.0 §7.1, gate S-1).
 * Kept beside the terminology map so the lint and the content cannot drift.
 *
 * A lexical lint cannot catch a paraphrase, so it is the *regression backstop*,
 * not the guarantee — the full event pool gets a human review pass against these
 * domains before release (recorded in DECISIONS.md and the report). But the list
 * is deliberately broad on the unambiguous phrasings so an accidental regression
 * is caught.
 *
 *   CRISIS TIER — never anywhere in sim content (cards, options, outcomes, beats,
 *   parse, summaries). Abuse & coercive control, self-harm & suicide, sexual
 *   violence, acute psychiatric crisis. These are routed to the real safety pages,
 *   never played.
 *
 *   LOSS TIER — permitted ONLY inside records typed as scripted beats (deaths of
 *   others, serious illness, the character's own end, the depression modifier).
 *   Never in decision-card outcome pools, never an RNG surprise. Each such beat
 *   carries skippable/reducedFrame/realPageLink and renders quiet (§7.2).
 */

/** Domains within the crisis tier — for lint reporting. */
export const CRISIS_TIER: Record<string, string[]> = {
  "self-harm-suicide": [
    "suicide",
    "suicidal",
    "kill yourself",
    "kill myself",
    "kill herself",
    "kill himself",
    "end your life",
    "end my life",
    "end her life",
    "end his life",
    "take your own life",
    "took her own life",
    "took his own life",
    "self-harm",
    "self harm",
    "selfharm",
    "hurt yourself",
    "cut yourself",
    "cutting yourself",
    "hang yourself",
    "overdose",
  ],
  "abuse-coercive-control": [
    "abuse",
    "abusive",
    "abuser",
    "coercive control",
    "coercion",
    "beaten",
    "beats her",
    "beats him",
    "beat her",
    "beat him",
    "hits her",
    "hits him",
    "hitting her",
    "hitting him",
    "strangled",
    "restraining order",
    "coerced",
    "controlling partner",
  ],
  "sexual-violence": [
    "rape",
    "raped",
    "rapist",
    "sexual assault",
    "sexually assaulted",
    "sexual violence",
    "molested",
    "molestation",
  ],
  "acute-psychiatric-crisis": [
    "psychosis",
    "psychotic",
    "manic episode",
    "in crisis",
    "hospitalized for",
    "hospitalised for",
  ],
};

/** Domains within the loss tier — allowed only inside scripted-beat records. */
export const LOSS_TIER: Record<string, string[]> = {
  "death-of-others": [
    "death",
    "deaths",
    "died",
    "dies",
    "dying",
    "dead",
    "funeral",
    "burial",
    "buried",
    "grave",
    "bereaved",
    "bereavement",
    "widow",
    "widowed",
    "mourning",
    "passed away",
  ],
  "serious-illness": [
    "terminal",
    "cancer",
    "tumor",
    "tumour",
    "chemotherapy",
    "hospice",
    "seriously ill",
    "terminal illness",
    "diagnosis",
  ],
  "own-end": ["your own death", "your death", "the end of your life", "your final"],
  "depression-modifier": [
    "depression",
    "depressed",
    "clinically depressed",
  ],
};

/** Flat lists for the lint. */
export const CRISIS_TIER_TERMS: string[] = Object.values(CRISIS_TIER).flat();
export const LOSS_TIER_TERMS: string[] = Object.values(LOSS_TIER).flat();

/** Which crisis domain a phrase belongs to (for lint messages). */
export function crisisDomainOf(phrase: string): string | undefined {
  for (const [domain, terms] of Object.entries(CRISIS_TIER)) {
    if (terms.includes(phrase)) return domain;
  }
  return undefined;
}
export function lossDomainOf(phrase: string): string | undefined {
  for (const [domain, terms] of Object.entries(LOSS_TIER)) {
    if (terms.includes(phrase)) return domain;
  }
  return undefined;
}
