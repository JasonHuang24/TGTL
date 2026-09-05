"use client";

/**
 * THE CREATION SCENE (blueprint 4.0 §4.1, §4.3) — "creation is a scene", not a
 * form with a heading. The void, Earth, the two books, and the hand as actual
 * dealt cards.
 *
 * All art is authored SVG, in-repo, drawn from the --sim-* token set so both
 * themes are one drawing. Motion is a slow opacity settle with a reduced-motion
 * equivalent that is the same picture, already settled — never a lesser render.
 *
 * §4.2's SOLID GROUND rule is why every string on this screen sits inside
 * `.sim-scene-plate`, a solid token panel over the art rather than text floating
 * on a gradient. That is also what makes S-9's contrast check decidable here.
 */

import type { ReactNode } from "react";

/* =========================================================================
   The backdrop
   ========================================================================= */

/**
 * The void, with Earth low in the frame and the two books above it. One drawing,
 * three stages of emphasis — `stage` moves the emphasis, never the geometry, so
 * nothing reflows as the scene progresses.
 */
export function SceneBackdrop({ stage }: { stage: "void" | "earth" | "books" | "hand" }) {
  return (
    <div className="sim-scene-backdrop" data-stage={stage} aria-hidden="true">
      <svg viewBox="0 0 1200 640" preserveAspectRatio="xMidYMid slice" className="sim-scene-svg">
        <defs>
          <radialGradient id="simVoidGlow" cx="50%" cy="18%" r="70%">
            <stop offset="0%" className="sim-scene-glow-in" />
            <stop offset="100%" className="sim-scene-glow-out" />
          </radialGradient>
          <radialGradient id="simEarthGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" className="sim-scene-earth-in" />
            <stop offset="70%" className="sim-scene-earth-mid" />
            <stop offset="100%" className="sim-scene-earth-out" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width="1200" height="640" className="sim-scene-void" />
        <rect x="0" y="0" width="1200" height="640" fill="url(#simVoidGlow)" />

        {/* the far field */}
        <g className="sim-scene-stars">
          {STARS.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} className="sim-scene-star" />
          ))}
        </g>

        {/* Earth, low in the frame — small, and clearly a whole world */}
        <g className="sim-scene-earth">
          <circle cx="600" cy="700" r="330" fill="url(#simEarthGlow)" />
          <circle cx="600" cy="700" r="330" className="sim-scene-earth-rim" />
          <path
            d="M410 520 C470 500 520 520 566 506 C610 492 640 508 690 498 C740 488 770 500 800 512"
            className="sim-scene-earth-line"
          />
          <path
            d="M448 566 C500 552 548 566 596 556 C644 546 690 560 748 552"
            className="sim-scene-earth-line"
          />
        </g>

        {/* the two books, held above it */}
        <g className="sim-scene-books">
          <g className="sim-scene-book" transform="translate(470 196)">
            <rect x="0" y="0" width="112" height="150" rx="4" className="sim-scene-book-body" />
            <rect x="0" y="0" width="12" height="150" rx="2" className="sim-scene-book-spine" />
            <line x1="30" y1="34" x2="92" y2="34" className="sim-scene-book-rule" />
            <line x1="30" y1="52" x2="92" y2="52" className="sim-scene-book-rule" />
            <line x1="30" y1="70" x2="74" y2="70" className="sim-scene-book-rule" />
          </g>
          <g className="sim-scene-book" transform="translate(618 196)">
            <rect x="0" y="0" width="112" height="150" rx="4" className="sim-scene-book-body sim-scene-book-alt" />
            <rect x="0" y="0" width="12" height="150" rx="2" className="sim-scene-book-spine sim-scene-book-alt" />
            <path d="M32 46 L56 30 L80 46 L80 100 L56 116 L32 100 Z" className="sim-scene-book-mark" />
          </g>
        </g>
      </svg>
    </div>
  );
}

/** A fixed star field — authored, not random, so the sky is identical every run. */
const STARS: [number, number, number][] = [
  [88, 74, 1.4], [176, 148, 1], [242, 52, 1.6], [318, 206, 1], [402, 96, 1.2],
  [470, 44, 1], [556, 128, 1.5], [636, 62, 1], [712, 152, 1.2], [790, 82, 1.6],
  [868, 178, 1], [944, 58, 1.3], [1024, 138, 1], [1102, 76, 1.5], [1158, 190, 1.1],
  [64, 232, 1.1], [148, 300, 1], [226, 262, 1.3], [1046, 268, 1.2], [1132, 320, 1],
  [356, 330, 0.9], [844, 300, 0.9], [700, 268, 1], [980, 352, 1.1], [120, 396, 1],
];

/* =========================================================================
   The plate — solid ground for text over the art (§4.2 remedy 4)
   ========================================================================= */

export function ScenePlate({
  eyebrow,
  title,
  children,
  wide,
}: {
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="sim-scene-plate" data-wide={wide ? "1" : undefined}>
      {eyebrow ? <p className="sim-scene-eyebrow">{eyebrow}</p> : null}
      {title ? <h1 className="sim-scene-title">{title}</h1> : null}
      {children}
    </div>
  );
}

/* =========================================================================
   The hand, as actual dealt cards
   ========================================================================= */

export type DealtCard = {
  id: string;
  /** The face-up heading — what this card of the hand is about. */
  axis: string;
  /** The value dealt. */
  value: string;
  /** What it means, in plain words. */
  note: string;
};

export function DealtHand({
  cards,
  revealed,
  onTurn,
}: {
  cards: DealtCard[];
  revealed: number;
  onTurn?: () => void;
}) {
  return (
    <div className="sim-dealt">
      <ol className="sim-dealt-row">
        {cards.map((c, i) => {
          const up = i < revealed;
          return (
            <li key={c.id} className="sim-dealt-card" data-up={up ? "1" : "0"}>
              {up ? (
                <div className="sim-dealt-face">
                  <p className="sim-dealt-axis">{c.axis}</p>
                  <p className="sim-dealt-value">{c.value}</p>
                  <p className="sim-dealt-note">{c.note}</p>
                </div>
              ) : (
                <div className="sim-dealt-back" aria-label="A card not yet turned">
                  <svg viewBox="0 0 60 84" className="sim-dealt-back-art" aria-hidden="true">
                    <rect x="4" y="4" width="52" height="76" rx="3" className="sim-dealt-back-frame" />
                    <circle cx="30" cy="42" r="13" className="sim-dealt-back-ring" />
                    <circle cx="30" cy="42" r="3" className="sim-dealt-back-dot" />
                  </svg>
                </div>
              )}
            </li>
          );
        })}
      </ol>
      {onTurn && revealed < cards.length ? (
        <button type="button" className="sim-primary-btn" onClick={onTurn}>
          Turn the next card
        </button>
      ) : null}
    </div>
  );
}
