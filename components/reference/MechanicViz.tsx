"use client";

import type { MechanicCard } from "@/content/play/mechanics";

/**
 * The canonical mechanic visualizations (blueprint 3.0 §5). Authored SVG, in-repo,
 * theme-aware via currentColor and CSS variables, and static (no motion required —
 * the reduced-motion equivalent is the same picture). Each carries the same
 * information as the animated in-play version.
 */
export function MechanicViz({ kind }: { kind: MechanicCard["viz"] }) {
  switch (kind) {
    case "strip":
      return <StripViz />;
    case "buffer":
      return <BufferViz />;
    case "curves":
      return <CurvesViz />;
    case "twohands":
      return <TwoHandsViz />;
    case "reroute":
      return <RerouteViz />;
    case "marks":
      return <MarksViz />;
    case "rulers":
      return <RulersViz />;
  }
}

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 320 140" className="mech-viz" role="img" aria-label={label} preserveAspectRatio="xMidYMid meet">
      {children}
    </svg>
  );
}

function StripViz() {
  return (
    <Frame label="A range of outcomes with the draw landing inside it">
      <rect x="16" y="52" width="150" height="26" className="mv-good" />
      <rect x="166" y="52" width="90" height="26" className="mv-mixed" />
      <rect x="256" y="52" width="48" height="26" className="mv-poor" />
      <line x1="210" y1="40" x2="210" y2="90" className="mv-marker" />
      <circle cx="210" cy="40" r="5" className="mv-marker-dot" />
      <text x="16" y="104" className="mv-cap">the move set this range</text>
      <text x="210" y="30" className="mv-cap" textAnchor="middle">the draw</text>
    </Frame>
  );
}

function BufferViz() {
  return (
    <Frame label="The same shock, absorbed by a buffer and cascading without one">
      <text x="16" y="24" className="mv-cap">with slack</text>
      <rect x="16" y="32" width="40" height="20" className="mv-buffer" />
      <rect x="60" y="32" width="120" height="20" className="mv-track" />
      <path d="M120 12 L120 30" className="mv-shock" />
      <polygon points="120,34 116,26 124,26" className="mv-shock-head" />
      <text x="196" y="47" className="mv-cap-sm">held</text>

      <text x="16" y="86" className="mv-cap">without slack</text>
      <rect x="16" y="94" width="164" height="20" className="mv-track" />
      <path d="M40 74 L40 92" className="mv-shock" />
      <polygon points="40,116 34,106 46,106" className="mv-shock-head-fail" />
      <text x="196" y="109" className="mv-cap-sm mv-fail-text">cascades</text>
    </Frame>
  );
}

function CurvesViz() {
  return (
    <Frame label="A small early choice bending a curve up or down across time">
      <line x1="20" y1="120" x2="304" y2="120" className="mv-axis" />
      <path d="M24 96 C 120 92, 200 70, 300 26" className="mv-curve-up" fill="none" />
      <path d="M24 96 C 120 100, 200 112, 300 132" className="mv-curve-down" fill="none" />
      <circle cx="24" cy="96" r="4" className="mv-node" />
      <text x="300" y="20" className="mv-cap-sm" textAnchor="end">tended</text>
      <text x="300" y="130" className="mv-cap-sm mv-fail-text" textAnchor="end">neglected</text>
      <text x="26" y="112" className="mv-cap-sm">one small choice</text>
    </Frame>
  );
}

function TwoHandsViz() {
  return (
    <Frame label="The same option costing differently under two different hands">
      <rect x="20" y="30" width="130" height="80" rx="4" className="mv-card" />
      <rect x="170" y="30" width="130" height="80" rx="4" className="mv-card" />
      <text x="85" y="52" className="mv-cap-sm" textAnchor="middle">same move</text>
      <text x="235" y="52" className="mv-cap-sm" textAnchor="middle">same move</text>
      <rect x="34" y="66" width="102" height="14" className="mv-good" />
      <text x="85" y="98" className="mv-cap-sm" textAnchor="middle">with a floor</text>
      <rect x="184" y="66" width="102" height="14" className="mv-poor" />
      <text x="235" y="98" className="mv-cap-sm mv-fail-text" textAnchor="middle">without one</text>
    </Frame>
  );
}

function RerouteViz() {
  return (
    <Frame label="One route greying out as another draws in">
      <circle cx="30" cy="70" r="5" className="mv-node" />
      <path d="M35 70 C 110 70, 130 40, 290 40" className="mv-route-grey" fill="none" />
      <path d="M35 70 C 110 70, 130 104, 290 104" className="mv-route-new" fill="none" />
      <circle cx="290" cy="40" r="4" className="mv-node-grey" />
      <circle cx="290" cy="104" r="4" className="mv-node" />
      <text x="286" y="30" className="mv-cap-sm mv-grey-text" textAnchor="end">closed</text>
      <text x="286" y="122" className="mv-cap-sm" textAnchor="end">a way back</text>
    </Frame>
  );
}

function MarksViz() {
  return (
    <Frame label="People as marks with load and give flowing between them">
      <circle cx="160" cy="70" r="14" className="mv-you" />
      <text x="160" y="98" className="mv-cap-sm" textAnchor="middle">you</text>
      {[
        [60, 40],
        [260, 40],
        [70, 104],
        [250, 104],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="9" className="mv-node" />
          <line x1={x < 160 ? x + 9 : x - 9} y1={y} x2={x < 160 ? 146 : 174} y2="70" className="mv-flow" />
        </g>
      ))}
    </Frame>
  );
}

function RulersViz() {
  return (
    <Frame label="Two rulers measuring the same figure on different scales">
      <line x1="60" y1="24" x2="60" y2="116" className="mv-axis" />
      <line x1="260" y1="24" x2="260" y2="116" className="mv-axis" />
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={"a" + i} x1="52" y1={28 + i * 22} x2="60" y2={28 + i * 22} className="mv-tick" />
      ))}
      {[0, 1, 2].map((i) => (
        <line key={"b" + i} x1="260" y1={30 + i * 40} x2="268" y2={30 + i * 40} className="mv-tick" />
      ))}
      <circle cx="160" cy="70" r="16" className="mv-you" />
      <text x="60" y="132" className="mv-cap-sm" textAnchor="middle">what was learned</text>
      <text x="260" y="132" className="mv-cap-sm" textAnchor="middle">how it sorts</text>
    </Frame>
  );
}
