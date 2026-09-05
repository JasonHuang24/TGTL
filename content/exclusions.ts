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

/* =============================================================================
   DOCTRINE — N-268 (6.0 §5.5)
   =============================================================================
   A favourable reading never overrides a safety route. Every instrument that
   orders, ranks or reads — the board, guidance, the tier board, any comparison —
   checks the crisis route before the ordering runs.

   This is a rule about instruments, not a change to the lists below. The lists
   say WHAT may be played; this says what an instrument must do before it says
   anything at all. `content/board.ts` has had the shape since 3.0 (CRISIS_CHIPS
   render first, as plain links, and are never rated or folded into the reading);
   6.0 states it as the site-wide rule the other instruments inherit, and C-8
   asserts the order in source for each of them.

   The failure it prevents is specific: a reader tells an instrument that someone
   is hurting them, and the instrument weighs it. A safety route is not an input.
   ============================================================================= */

/* =============================================================================
   DOCTRINE — N-253 (6.0 §5.4): PRESENTATION WALLS FOR ANY FUTURE GRAPHICAL
   LAYER.
   =============================================================================
   No scene layer exists. These are written before one does, so the first scene
   inherits them rather than arguing with them. The lists below are untouched by
   this text: they govern WHETHER content is playable; this governs how a
   transition out of play, and any depiction at all, is allowed to look.

   - A safety transition replaces the scene with calm, plain help. It never
     animates damage or failure, and it is not a cutscene.
   - Health renders through capacity, symptoms, support, access and
     accommodation — never through grotesque visuals.
   - Discrimination and systemic exclusion are never rendered as character
     debuffs. They are properties of a ruleset, not of a person.
   - Parenthood and childlessness are never scored.
   - Appearance never determines worth.
   - Colour never encodes a verdict (N-233).
   ============================================================================= */

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
