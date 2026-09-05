/**
 * Evidence, status, and provenance types (blueprint §9.4, G-10, G-12).
 *
 * The schema is present from Phase 0; fields are populated as content warrants
 * (the triage requires the infrastructure designed now). No `researched` record
 * ships in v2.0 except hotlines, which carry their own verification fixture.
 */

/** Content status shown to readers as a compact label (§9.4). */
export type ContentStatus = "illustrative" | "editorial" | "researched";

export const STATUS_LABEL: Record<ContentStatus, string> = {
  illustrative: "Illustrative",
  editorial: "Our judgement",
  researched: "Researched",
};

export const STATUS_MEANING: Record<ContentStatus, string> = {
  illustrative:
    "A worked example or demonstration fixture, not a measured finding. Shown to make the shape of a thing visible.",
  editorial:
    "The site's reasoned synthesis of how something works — our judgement, with the reasoning shown, not a citation.",
  researched: "Rests on at least one recorded source.",
};

/** Mentor-note provenance (subset for v2.0, §9.4). */
export type Provenance = "experiential-pattern" | "cultural-wisdom" | "editorial-synthesis";

export const PROVENANCE_LABEL: Record<Provenance, string> = {
  "experiential-pattern": "What experienced people repeatedly report",
  "cultural-wisdom": "Long-standing common counsel",
  "editorial-synthesis": "The site's own synthesis",
};

/**
 * Evidence record for an evidence-bearing page (§9.4). Designed-now fields
 * (openQuestionIds, dataYear/publicationYear, finding/projectInference/
 * recommendation separation) exist even where v2.0 leaves them empty.
 */
export type EvidenceRecord = {
  status: ContentStatus;
  /** Population / place / time, where relevant. */
  scope?: string;
  lastReviewed: string;
  /** What new information would change this claim. */
  whatWouldChange: string;
  /** On model-bearing pages: one honest sentence on the edge of the framing. */
  whereThisFrameFails?: string;
  openQuestionIds?: string[];
  finding?: string;
  projectInference?: string;
  recommendation?: string;
};

/** Field-report shape — designed now, populated later; no submission ships in v2.0. */
export type FieldReport = {
  id: string;
  position: string;
  body: string;
  receivedDate: string;
  status: ContentStatus;
};

/** A single corrections-register entry (§6.9, G-12). Live format from day one. */
export type CorrectionKind =
  | "correction"
  | "retraction"
  | "recommendation-change"
  | "decision"
  | "engine-change"
  /** 5.0 §4.7/§6.3 — a sourced figure changed because its source published a new
   *  release, or because a better source replaced it. Distinct from a correction:
   *  nothing was wrong, the world (or the measurement of it) moved. */
  | "source-change";

export type CorrectionEntry = {
  id: string;
  date: string;
  kind: CorrectionKind;
  summary: string;
  detail: string;
};
