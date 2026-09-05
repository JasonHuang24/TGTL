"use client";

import { OUTCOME_BAND_LABEL } from "@/content/bands";
import { resolve, type StripSegment, type ResolveState } from "@/lib/engine/resolve";
import type { Option } from "@/content/play/schema";

/**
 * The distribution strip (blueprint 3.0 §3.5, §5) — the canonical variance
 * visualization and the visible half of G-09. The option (skill + position) set
 * the marker's RANGE — the widths of the bands; the draw (luck) lands the marker
 * inside it. The split is always shown. No numeric probability ever appears —
 * qualitative widths and words only.
 *
 * Reduced motion: the marker has a static, no-animation position (the reveal is a
 * class toggle, and the animation is gated in CSS by prefers-reduced-motion).
 */
export function DistributionStrip({
  segments,
  marker,
  revealed,
  shift,
  landedName,
  showLegend = true,
}: {
  segments: StripSegment[];
  marker: number;
  revealed: boolean;
  shift: number;
  landedName?: string;
  showLegend?: boolean;
}) {
  const shiftWord =
    shift > 0.25 ? "widened the better outcomes" : shift < -0.25 ? "widened the harder outcomes" : "left the base spread";

  return (
    <div className="sim-dist-strip" data-revealed={revealed ? "1" : "0"}>
      <div className="sim-dist-bar" role="img" aria-label="The range of outcomes this move could draw from">
        {segments.map((seg, i) => (
          <div
            key={seg.name + i}
            className="sim-dist-seg"
            data-band={seg.name}
            data-landed={revealed && landedName === seg.name ? "1" : "0"}
            style={{ flexGrow: Math.max(0.03, seg.width) }}
          >
            <span className="sim-dist-seg-label">{OUTCOME_BAND_LABEL[seg.name]}</span>
          </div>
        ))}
        <span
          className="sim-dist-marker"
          data-shown={revealed ? "1" : "0"}
          style={{ left: `${Math.round(marker * 1000) / 10}%` }}
          aria-hidden={!revealed}
        >
          <span className="sim-dist-marker-dot" />
          <span className="sim-dist-marker-label">the draw</span>
        </span>
      </div>
      {showLegend && (
        <p className="sim-dist-legend">
          <span className="sim-dist-legend-skill">The band widths are where your move set the range.</span>{" "}
          <span className="sim-dist-legend-luck">The marker is the draw.</span>{" "}
          <span className="sim-dist-legend-shift">Your footing {shiftWord}.</span>
        </p>
      )}
    </div>
  );
}

/**
 * The counterfactual strip (blueprint 3.0 §3.5, the slack lesson): the SAME draw
 * resolved at two buffer levels, side by side — absorbed with a margin, cascading
 * without one. Deterministic regardless of the player's actual buffer.
 */
export function CounterfactualStrip({ option, marker }: { option: Option; marker: number }) {
  const high: ResolveState = {
    gauges: { money: 4, healthEnergy: 2, connection: 2, timeStructure: 4 },
    skills: [],
    conditions: [],
    flags: [],
  };
  const low: ResolveState = {
    gauges: { money: 0, healthEnergy: 2, connection: 2, timeStructure: 0 },
    skills: [],
    conditions: [],
    flags: [],
  };
  const hi = resolve(option, high, marker);
  const lo = resolve(option, low, marker);
  return (
    <div className="sim-counterfactual">
      <p className="sim-counterfactual-lead">The same draw, at two different buffers — this is what slack does:</p>
      <div className="sim-counterfactual-pair">
        <div className="sim-cf-col">
          <p className="sim-cf-label">With a buffer</p>
          <DistributionStrip segments={hi.segments} marker={marker} revealed shift={hi.shift} landedName={hi.band.name} showLegend={false} />
          <p className="sim-cf-outcome" data-band={hi.band.name}>{OUTCOME_BAND_LABEL[hi.band.name]}</p>
        </div>
        <div className="sim-cf-col">
          <p className="sim-cf-label">Without one</p>
          <DistributionStrip segments={lo.segments} marker={marker} revealed shift={lo.shift} landedName={lo.band.name} showLegend={false} />
          <p className="sim-cf-outcome" data-band={lo.band.name}>{OUTCOME_BAND_LABEL[lo.band.name]}</p>
        </div>
      </div>
      <p className="sim-counterfactual-note">
        Same decision, same luck. The only difference is the margin underneath — and that is the whole of
        what a buffer buys you.
      </p>
    </div>
  );
}
