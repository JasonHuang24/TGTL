/**
 * The eight stage figures (5.0 blueprint §3.6 graphical floor; review F3).
 *
 * AUTHORED IN THIS REPO, BY HAND, IN SVG. The visual doctrine allows authored
 * vector art and forbids photographs and the AI-photograph look, so these are
 * drawn the way a diagram is drawn: one grid, one stroke weight, one ground line,
 * no shading, no faces. A figure with a face invites the reader to decide whether
 * it is them; a figure without one stays what it is, which is a pictogram of a
 * stretch of life rather than a picture of a person in it.
 *
 * Every figure:
 *   - lives on the same 64x64 grid, so the eight read as one set;
 *   - strokes in `currentColor`, so it inherits the bubble's ink and is correct in
 *     both themes without a second palette;
 *   - carries no text, no digit and no claim. The stage bands are navigation
 *     conventions (§3.3) and the art does not get to say more than they do;
 *   - is `aria-hidden`: the bubble's own text is the accessible content, and a
 *     screen reader gets the stage name and its band rather than a description of
 *     a drawing.
 *
 * They are deliberately plain. This is the Phase 1 art checkpoint (§12 decision 11)
 * arriving late, so it is built to be looked at and redirected, not to be final.
 */

const GROUND = <path className="tl-fig-ground" d="M7 57h50" />;

/** One drawing per stage id, keyed by the ids in content/timeline/stages.ts. */
const FIGURES: Record<string, React.ReactNode> = {
  /* Carried entirely: two arms as a cradle, and something small inside them. */
  "stage-birth": (
    <>
      {GROUND}
      <path d="M9 36c4 16 14 22 23 22s19-6 23-22" />
      <circle cx="32" cy="31" r="8" />
      <path d="M20 44c5 5 19 5 24 0" />
    </>
  ),

  /* The rules go in first: a small upright figure, and a ball it is playing with. */
  "stage-early-childhood": (
    <>
      {GROUND}
      <circle cx="24" cy="19" r="7" />
      <path d="M24 26v17" />
      <path d="M14 33h20" />
      <path d="M24 43l-6 14M24 43l6 14" />
      <circle cx="48" cy="48" r="9" />
      <path d="M39 48h18" />
    </>
  ),

  /* Taught, and sorted: a figure carrying a satchel, beside an open book. */
  "stage-tutorial": (
    <>
      {GROUND}
      <circle cx="20" cy="18" r="7" />
      <path d="M20 25v18" />
      <path d="M20 43l-5 14M20 43l5 14" />
      <path d="M20 32h8" />
      <path d="M28 30h6v9h-6z" />
      <path d="M38 30c4-3 8-3 11 0 3-3 7-3 11 0v18c-4-3-8-3-11 0-3-3-7-3-11 0z" />
      <path d="M49 30v18" />
    </>
  ),

  /* The self becomes a project: a figure with headphones, turned slightly away. */
  "stage-adolescence": (
    <>
      {GROUND}
      <circle cx="30" cy="22" r="8" />
      <path d="M20 21a10 10 0 0 1 20 0" />
      <path d="M18 21h4v6h-4zM38 21h4v6h-4z" />
      <path d="M30 30v15" />
      <path d="M19 37h22" />
      <path d="M30 45l-5 12M30 45l5 12" />
      <path d="M45 32h8v14h-8z" />
    </>
  ),

  /* Agency up, resources gated: a doorway, and someone stepping out of it. */
  "stage-launch": (
    <>
      {GROUND}
      <path d="M10 57V15h20v42" />
      <path d="M25 37h2" />
      <circle cx="41" cy="20" r="7" />
      <path d="M41 27v15" />
      <path d="M41 42l-6 15M41 42l8 13" />
      <path d="M47 30h9v11h-9z" />
      <path d="M41 33l6 2" />
    </>
  ),

  /* The base gets set: a roof, and two people under it. */
  "stage-build": (
    <>
      {GROUND}
      <path d="M6 30L26 12l20 18" />
      <path d="M11 30v27M41 30v27" />
      <circle cx="20" cy="38" r="5" />
      <path d="M20 43v9" />
      <circle cx="32" cy="38" r="5" />
      <path d="M32 43v9" />
      <path d="M25 45h2" />
      <circle cx="55" cy="24" r="6" />
      <path d="M55 30v13M55 43l-4 14M55 43l4 14" />
    </>
  ),

  /* Peak load, peak competence: one figure taking the weight of another. */
  "stage-midgame": (
    <>
      {GROUND}
      <circle cx="18" cy="17" r="7" />
      <path d="M18 24v19" />
      <path d="M18 43l-5 14M18 43l5 14" />
      <path d="M24 31l13 4" />
      <circle cx="45" cy="23" r="7" />
      <path d="M45 30c3 7 1 11-3 15" />
      <path d="M42 45l-4 12M42 45l6 12" />
      <path d="M37 35c3 1 5 3 5 6" />
    </>
  ),

  /* The shape becomes visible: someone with a stick, and something they planted. */
  "stage-later": (
    <>
      {GROUND}
      <circle cx="18" cy="20" r="7" />
      <path d="M18 27v17" />
      <path d="M18 44l-5 13M18 44l5 13" />
      <path d="M25 34l4 4" />
      <path d="M29 38v19" />
      <path d="M47 57V33" />
      <path d="M47 41l-8-7M47 38l8-6" />
      <path d="M34 30a13 13 0 0 1 26 0" />
    </>
  ),
};

export function StageFigure({ stageId }: { stageId: string }) {
  const art = FIGURES[stageId];
  if (!art) return null;
  return (
    <svg className="tl-fig" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      {art}
    </svg>
  );
}

export function hasStageFigure(stageId: string): boolean {
  return stageId in FIGURES;
}
