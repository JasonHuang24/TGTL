"use client";

/**
 * THE STATE RAIL (N-228, 6.0 §3.9) — what the run is carrying, mid-run.
 *
 * THE DEFECT THIS CLOSES. `SimState` accumulates skills, capabilities, conditions,
 * a maintenance backlog, run flags and the state of the people in the life. The
 * campaign rendered almost none of it while a run was being played: gauges and the
 * queue on the rail, the people on the briefing, and then twenty-four seasons of
 * building things the player could not see until the look-back at thirty. Only the
 * Life Arc's `components/play/StatePanel.tsx` ever showed skills at all.
 *
 * THE RULE THIS OBEYS (C-23). Every field of `SimState` the engine reads has a
 * surface a player can reach mid-run. That is asserted rather than intended: the
 * gate reads the engine's own field accesses out of `lib/sim/season.ts`, matches
 * them against `SimState`, and requires a `data-sim-state-field` for each — so
 * adding a read to the engine forces a surface, and removing a surface names the
 * field it lost. The one declared exemption is the beat channel (§5.1): beats are
 * not state a player inspects, and putting them in the run's chrome is exactly what
 * every other rule about them forbids.
 *
 * WORDS AND BANDS, NO NUMBERS (S-2). Capabilities share the gauges' five-band
 * scale — they are stored on it — so this reuses `GAUGE_BAND_ORDER` rather than
 * inventing a second vocabulary, the way the arc's state panel reuses it for slack.
 * The maintenance backlog reads through the published debt thresholds in
 * `lib/sim/economy.ts`, so the band a player sees and the drag the economy applies
 * are the same fact.
 */

import Link from "next/link";
import { GAUGE_BAND_ORDER, clampGauge } from "@/content/bands";
import { CAPABILITY_KEYS, CAPABILITY_LABEL, CAPABILITY_MEANING, type SimState } from "@/content/sim/schema";
import { DEBT_THRESHOLDS, debtIsHighLoad, debtPenalty } from "@/lib/sim/economy";
import { DOOR_MEANING } from "@/content/sim/campaign/doors";

/** The backlog, as a band in words, derived from the published thresholds. */
export function maintenanceBand(debt: number): { band: string; note: string } {
  if (debt < DEBT_THRESHOLDS[0])
    return { band: "nothing much waiting", note: "The small maintenance of a life is roughly up to date." };
  if (debt < DEBT_THRESHOLDS[1])
    return { band: "a backlog you can feel", note: "Enough deferred that the week has started costing you time it did not used to." };
  if (!debtIsHighLoad(debt))
    return { band: "a backlog that is costing you", note: "The deferred maintenance is taking time and energy from every season now." };
  return {
    band: "a backlog heavy enough to change the week",
    note: "Past this point the season itself is under load — not a penalty, and not a verdict; a bill that has come due.",
  };
}

function plain(s: string): string {
  return s.replace(/[-_]/g, " ");
}

export function StateRail({ run }: { run: SimState }) {
  const debt = maintenanceBand(run.maintenanceDebt);
  const drag = debtPenalty(run.maintenanceDebt);
  const people = Object.values(run.companions);
  // Run flags, read through the door registry so the rail speaks the player's
  // language rather than printing internal ids. A flag the registry skips is not
  // claimed here either — the same rule the look-back's Doors panel follows.
  const flags = run.flags
    .filter((f) => !f.startsWith("start:"))
    .map((f) => DOOR_MEANING[f])
    .flatMap((m) => (m && !("skip" in m) ? [m.label] : []));
  const startFlags = run.flags.filter((f) => f.startsWith("start:")).map((f) => plain(f.replace(/^start:/, "")));

  return (
    <section className="sim-panel sim-state-rail" aria-label="What this run is carrying">
      <h4 className="sim-instrument-title">What this run is carrying</h4>
      <p className="sim-panel-note">
        Everything the model has been keeping about this character, in words. There is no total here and
        nowhere for one to go.
      </p>

      <div className="sim-state-rail-block" data-sim-state-field="skills">
        <p className="sim-panel-label">what you can do now that you could not at eighteen</p>
        {run.skills.length ? (
          <ul className="sim-chip-row">
            {run.skills.map((s) => (
              <li key={s} className="sim-chip" data-kind="skill">
                {plain(s)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="sim-panel-empty">Nothing yet. Skills come from doing a thing more than once.</p>
        )}
      </div>

      <div className="sim-state-rail-block" data-sim-state-field="capabilities">
        <p className="sim-panel-label">what you are like to work with, on the same five-band scale as everything else here</p>
        {/* Deliberately NOT the constraint-profile classes. S-8 requires the
            verbatim worth-guard beside anything that renders the profile, and it
            is right to: the profile is the hand a character was dealt. These are
            capabilities the character BUILT, a different thing with a different
            meaning, and borrowing the profile's markup would have made two
            unrelated instruments answer to one another's rules. */}
        <ul className="sim-state-lines">
          {CAPABILITY_KEYS.map((k) => (
            <li key={k} className="sim-state-line">
              <span className="sim-state-axis">{CAPABILITY_LABEL[k]}</span>
              <span className="sim-state-band">{GAUGE_BAND_ORDER[clampGauge(run.capabilities[k])]}</span>
              <span className="sim-state-note">{CAPABILITY_MEANING[k]}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="sim-state-rail-block" data-sim-state-field="conditions">
        <p className="sim-panel-label">what is true of the week itself</p>
        {run.conditions.length ? (
          <ul className="sim-chip-row">
            {run.conditions.map((c) => (
              <li key={c} className="sim-chip" data-kind="condition">
                {plain(c)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="sim-panel-empty">Nothing is running in the background this season.</p>
        )}
      </div>

      <div className="sim-state-rail-block" data-sim-state-field="maintenanceDebt">
        <p className="sim-panel-label">the maintenance backlog</p>
        <p className="sim-state-band">{debt.band}</p>
        <p className="sim-panel-note">
          {debt.note}
          {drag > 0 ? " It is taking pips off this season's time and energy, and it never takes the last one." : ""}
        </p>
      </div>

      <div className="sim-state-rail-block" data-sim-state-field="flags">
        <p className="sim-panel-label">what the run has picked up</p>
        {flags.length ? (
          <ul className="sim-plain-list">
            {flags.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        ) : (
          <p className="sim-panel-empty">Nothing has attached itself to this run yet.</p>
        )}
        {startFlags.length ? (
          <p className="sim-panel-note">
            And from the start, not chosen: {startFlags.join(", ")}. These came with the hand and are not
            something the character did.
          </p>
        ) : null}
      </div>

      <div className="sim-state-rail-block" data-sim-state-field="companions" data-sim-state-field-also="relationships">
        <p className="sim-panel-label">the people in this, and how it stands with them</p>
        {people.length ? (
          <ul className="sim-people-list">
            {people.map((c) => {
              const mark = run.relationships.find((r) => r.id === c.arcId);
              return (
                <li key={c.arcId} data-exited={c.exited ? "1" : undefined}>
                  <span className="sim-person-name">{mark?.label ?? plain(c.arcId)}</span>
                  <span className="sim-person-state">
                    {c.exited
                      ? "no longer in this"
                      : c.sinceContact >= 3
                        ? "it has been a while"
                        : (mark?.quality ?? 0) >= 2
                          ? "close"
                          : (mark?.quality ?? 0) <= -1
                            ? "strained"
                            : "there"}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="sim-panel-empty">Nobody has come into this run yet.</p>
        )}
      </div>

      {/* The seed is an input to the run rather than something a season changes,
          but it is state the engine reads on every draw, so it is inspectable
          here as well as beside a save. What it means is on the methodology page,
          in one place, rather than restated on every surface that shows it. */}
      <div className="sim-state-rail-block" data-sim-state-field="drawSeed">
        <p className="sim-panel-label">the draw this run is running on</p>
        <p className="sim-state-band">{run.drawSeed}</p>
        <p className="sim-panel-note">
          Every draw in this run is derived from that, so the run replays exactly.{" "}
          <Link href="/methodology#seeded-randomness">What that is for</Link>.
        </p>
      </div>
    </section>
  );
}
