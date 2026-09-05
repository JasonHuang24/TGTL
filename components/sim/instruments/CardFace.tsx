"use client";

/**
 * CANONICAL INSTRUMENT 1 of 6 — THE CARD FACE (blueprint 4.0 §4.1, §4.3).
 *
 * Nine family frames and nine illustration motifs, drawn once here and reused
 * everywhere a decision, action, or event appears. This is the piece that makes
 * the graphical floor real: "every action/event card renders its family frame +
 * illustration motif" is an assertion about this component, and S-9 walks the
 * screens that use it.
 *
 * All art is authored SVG, in-repo. No external assets, no photographs, no
 * AI-photo look. Every stroke and fill comes from the --sim-* token set, so both
 * themes are one drawing rather than two. The motifs are static — the reduced-
 * motion equivalent is the same picture — and every card carries a text
 * equivalent (the family word plus the motif's own description), which is the
 * §4.1 accessibility rule applied to the instrument.
 */

import type { CardFamily } from "@/content/sim/schema";

export const FAMILY_WORD: Record<CardFamily, string> = {
  home: "home",
  school: "learning",
  threshold: "the threshold",
  work: "work",
  money: "money",
  people: "people",
  health: "body and capacity",
  civic: "institutions",
  inner: "inner life",
};

/** What each motif depicts, in words — the instrument's text equivalent (§4.1). */
export const FAMILY_MOTIF_ALT: Record<CardFamily, string> = {
  home: "a doorway with a light on behind it",
  school: "an open book with a rising line above it",
  threshold: "a hand reaching across a gap toward another hand",
  work: "a set of stacked shifts, one lit",
  money: "a stack of coins beside a level line",
  people: "three linked marks, one at a distance",
  health: "a slow wave over a steady baseline",
  civic: "a stamped form with a queue behind it",
  inner: "a small lamp inside a wide dark field",
};

/* =========================================================================
   The nine motifs
   ========================================================================= */

/**
 * The motif on its own, exported for N-204: the season chrome carries the
 * origin's `face` on every turn, and it must be the SAME drawing the selection
 * card uses, not a second one that could drift from it. `CardFace` below renders
 * this; nothing else draws a family.
 */
export function FamilyMotif({ family }: { family: CardFamily }) {
  return <Motif family={family} />;
}

function Motif({ family }: { family: CardFamily }) {
  const common = {
    viewBox: "0 0 120 72",
    className: "sim-motif",
    role: "img" as const,
    "aria-label": FAMILY_MOTIF_ALT[family],
    preserveAspectRatio: "xMidYMid meet",
  };
  switch (family) {
    case "home":
      return (
        <svg {...common}>
          <path d="M20 46 L48 22 L76 46" className="sim-motif-line" />
          <rect x="30" y="46" width="36" height="20" className="sim-motif-fill" />
          <rect x="42" y="52" width="12" height="14" className="sim-motif-accent" />
          <circle cx="94" cy="34" r="9" className="sim-motif-glow" />
          <line x1="88" y1="66" x2="112" y2="66" className="sim-motif-line" />
        </svg>
      );
    case "school":
      return (
        <svg {...common}>
          <path d="M18 54 L58 46 L58 66 L18 62 Z" className="sim-motif-fill" />
          <path d="M98 54 L58 46 L58 66 L98 62 Z" className="sim-motif-fill" />
          <line x1="58" y1="46" x2="58" y2="66" className="sim-motif-line" />
          <path d="M24 34 L46 26 L68 30 L94 14" className="sim-motif-accent-line" />
          <circle cx="94" cy="14" r="3.5" className="sim-motif-accent" />
        </svg>
      );
    case "threshold":
      return (
        <svg {...common}>
          <path d="M10 44 L34 44 L42 36" className="sim-motif-line" />
          <path d="M110 44 L86 44 L78 36" className="sim-motif-line" />
          <circle cx="46" cy="33" r="4" className="sim-motif-fill" />
          <circle cx="74" cy="33" r="4" className="sim-motif-accent" />
          <path d="M50 33 L70 33" className="sim-motif-dash" />
          <line x1="14" y1="60" x2="106" y2="60" className="sim-motif-line" />
        </svg>
      );
    case "work":
      return (
        <svg {...common}>
          <rect x="16" y="50" width="88" height="8" className="sim-motif-fill" />
          <rect x="16" y="38" width="88" height="8" className="sim-motif-fill" />
          <rect x="16" y="26" width="88" height="8" className="sim-motif-accent" />
          <rect x="16" y="14" width="88" height="8" className="sim-motif-fill" />
          <line x1="16" y1="66" x2="104" y2="66" className="sim-motif-line" />
        </svg>
      );
    case "money":
      return (
        <svg {...common}>
          <ellipse cx="40" cy="24" rx="18" ry="6" className="sim-motif-accent" />
          <ellipse cx="40" cy="36" rx="18" ry="6" className="sim-motif-fill" />
          <ellipse cx="40" cy="48" rx="18" ry="6" className="sim-motif-fill" />
          <line x1="66" y1="48" x2="106" y2="48" className="sim-motif-line" />
          <line x1="72" y1="40" x2="72" y2="56" className="sim-motif-dash" />
          <line x1="100" y1="40" x2="100" y2="56" className="sim-motif-dash" />
        </svg>
      );
    case "people":
      return (
        <svg {...common}>
          <circle cx="34" cy="30" r="7" className="sim-motif-fill" />
          <circle cx="60" cy="44" r="7" className="sim-motif-accent" />
          <circle cx="96" cy="24" r="6" className="sim-motif-hollow" />
          <line x1="40" y1="34" x2="54" y2="41" className="sim-motif-line" />
          <line x1="66" y1="41" x2="90" y2="28" className="sim-motif-dash" />
          <line x1="16" y1="64" x2="104" y2="64" className="sim-motif-line" />
        </svg>
      );
    case "health":
      return (
        <svg {...common}>
          <line x1="12" y1="44" x2="108" y2="44" className="sim-motif-line" />
          <path d="M12 44 C28 44 30 22 46 22 C62 22 62 58 78 58 C94 58 96 44 108 44" className="sim-motif-accent-line" />
          <circle cx="46" cy="22" r="3.5" className="sim-motif-accent" />
        </svg>
      );
    case "civic":
      return (
        <svg {...common}>
          <rect x="22" y="14" width="48" height="44" className="sim-motif-hollow" />
          <line x1="30" y1="26" x2="62" y2="26" className="sim-motif-line" />
          <line x1="30" y1="34" x2="62" y2="34" className="sim-motif-line" />
          <line x1="30" y1="42" x2="50" y2="42" className="sim-motif-line" />
          <circle cx="60" cy="48" r="7" className="sim-motif-accent" />
          <circle cx="84" cy="36" r="4" className="sim-motif-fill" />
          <circle cx="96" cy="36" r="4" className="sim-motif-fill" />
          <circle cx="108" cy="36" r="4" className="sim-motif-fill" />
        </svg>
      );
    case "inner":
      return (
        <svg {...common}>
          <rect x="8" y="8" width="104" height="56" className="sim-motif-void" />
          <circle cx="60" cy="36" r="10" className="sim-motif-glow" />
          <circle cx="60" cy="36" r="3.5" className="sim-motif-accent" />
          <line x1="60" y1="52" x2="60" y2="60" className="sim-motif-dash" />
        </svg>
      );
  }
}

/* =========================================================================
   The face
   ========================================================================= */

export function CardFace({
  family,
  eyebrow,
  title,
  children,
  band,
  selected,
  as = "article",
}: {
  family: CardFamily;
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
  /** Tints the frame when a card is showing a landed outcome. */
  band?: "strong" | "solid" | "mixed" | "poor" | "failure";
  selected?: boolean;
  as?: "article" | "div" | "li";
}) {
  const Tag = as;
  return (
    <Tag
      className="sim-card"
      data-family={family}
      data-band={band}
      data-selected={selected ? "1" : undefined}
    >
      <div className="sim-card-frame" aria-hidden="true">
        <Motif family={family} />
      </div>
      <div className="sim-card-body">
        <p className="sim-card-family">
          {/* The text equivalent of the frame + motif (§4.1 accessibility rule). */}
          <span className="sim-card-family-word">{FAMILY_WORD[family]}</span>
          {eyebrow ? <span className="sim-card-eyebrow"> · {eyebrow}</span> : null}
        </p>
        <h3 className="sim-card-title">{title}</h3>
        {children}
      </div>
    </Tag>
  );
}

/** The nine faces, drawn together — used on /methodology and the walkthrough. */
export function FamilyPlate() {
  const families: CardFamily[] = ["home", "school", "threshold", "work", "money", "people", "health", "civic", "inner"];
  return (
    <ul className="sim-family-plate">
      {families.map((f) => (
        <li key={f} className="sim-family-plate-item" data-family={f}>
          <div className="sim-card-frame">
            <Motif family={f} />
          </div>
          <span className="sim-family-plate-word">{FAMILY_WORD[f]}</span>
        </li>
      ))}
    </ul>
  );
}
