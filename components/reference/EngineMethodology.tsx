import { HAND_AXES, ERA, TILT_STRENGTH } from "@/content/play/hand-axes";
import {
  GAUGE_BAND_ORDER,
  GAUGE_KEYS,
  GAUGE_LABEL,
  OUTCOME_BAND_ORDER,
  OUTCOME_BAND_LABEL,
} from "@/content/bands";
import { PROFILE_COST_BANDS } from "@/content/sim/schema";
import { AXIS_BAND_NOTE, PROFILE_INTRO, WORTH_GUARD, bandForHardness } from "@/content/sim/profile";
import { PROFILE_AXES, PROFILE_AXIS_LABEL, PROFILE_AXIS_MEANING } from "@/content/sim/schema";

/**
 * The engine, disclosed (blueprint 3.0 §8): the full weight and outcome tables in
 * readable form, labeled illustrative. An engine needs internal weights; the
 * owner's auditable-process standard means nothing is hidden and nothing is
 * claimed as researched. Numbers are fine HERE — this is the methodology page, not
 * play. Rendered from the same fixtures the simulator runs on, so it cannot drift.
 */
export function EngineMethodology() {
  return (
    <section className="engine-methodology">
      <h2 id="engine">How the engine works</h2>
      <p className="status-inline">
        <span className="status-label" data-status="illustrative">
          <span className="status-dot" aria-hidden="true" />
          illustrative
        </span>{" "}
        This is a model, not a prediction — a way to feel how the mechanics move. Every weight below is
        authored, not measured. It is published in full because a frank, auditable model is the whole
        point; nothing here is hidden, and nothing is claimed as researched.
      </p>

      <h3>The Birth RNG is conditional, not independent dice</h3>
      <p>
        The starting hand is drawn in a hierarchy: the era is fixed, the household &amp; class is drawn
        first, and its hardness then <em>tilts</em> the family, body, and environment draws toward its
        own level — a hard household bends the later draws toward hard values, a resourced one toward
        easy ones. That is what &ldquo;randomized does not mean independent&rdquo; means in practice.
      </p>
      <pre className="engine-diagram" aria-label="The Birth RNG hierarchy">
{`era (fixed: ${ERA.label})
   │
   ▼
household & class  ──tilts──►  family stability
                   ──tilts──►  body & health
                   ──tilts──►  local environment`}
      </pre>
      <p className="engine-note">
        The tilt multiplies each later value&rsquo;s base weight by{" "}
        <code>1 + householdHardness × lean × {TILT_STRENGTH}</code>, where <code>lean</code> runs from
        −1 (easiest value) to +1 (hardest).
      </p>

      <h3>The hand axes and their weights</h3>
      {HAND_AXES.map((axis) => (
        <div key={axis.id} className="engine-table-wrap">
          <table className="engine-table">
            <caption>{axis.title}</caption>
            <thead>
              <tr>
                <th>value</th>
                <th>base weight</th>
                <th>hardness (0–3)</th>
                <th>starting effect</th>
              </tr>
            </thead>
            <tbody>
              {axis.values.map((v) => (
                <tr key={v.id}>
                  <td>{v.label}</td>
                  <td>{v.weight}</td>
                  <td>{v.hardness}</td>
                  <td>
                    {v.gauge
                      ? Object.entries(v.gauge)
                          .map(([g, d]) => `${GAUGE_LABEL[g as keyof typeof GAUGE_LABEL]} ${d > 0 ? "+" : ""}${d}`)
                          .join(", ")
                      : "—"}
                    {v.flags?.length ? ` · flags: ${v.flags.join(", ")}` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <h3 id="constraint-profile">The constraint profile</h3>
      <p>
        Version 3.0 of this simulator ended character creation on a single word — Easy, Medium, Hard,
        Extreme — computed by summing the hardness of the four drawn axes. That is gone. Collapsing
        money, support, body and place into one grade of a life was the wrong instrument, and it read as
        a ranking of the person holding the hand even though it was never meant to.
      </p>
      <p>
        What replaced it says the same information without the collapse: <strong>per axis</strong>, what
        this start makes expensive. Each drawn axis maps to one cost axis, one for one, and{" "}
        <em>nothing sums them</em>. There is no composite, no total, no summary line, and no ordering —
        not because they are hidden, but because they do not exist.
      </p>
      <p>{PROFILE_INTRO}</p>
      <div className="engine-table-wrap">
        <table className="engine-table">
          <caption className="cf-label">The four axes and their cost bands</caption>
          <thead>
            <tr>
              <th scope="col">axis</th>
              <th scope="col">what it measures</th>
              {PROFILE_COST_BANDS.map((b) => (
                <th scope="col" key={b}>
                  {b}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PROFILE_AXES.map((axis) => (
              <tr key={axis}>
                <th scope="row">{PROFILE_AXIS_LABEL[axis]}</th>
                <td>{PROFILE_AXIS_MEANING[axis]}</td>
                {PROFILE_COST_BANDS.map((b) => (
                  <td key={b}>{AXIS_BAND_NOTE[axis][b]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Internally each axis still carries a hardness of nought to three, because the content pools need
        something to condition on. It maps to a band by the table above ({" "}
        {[0, 1, 2, 3].map((h) => `${h} → ${bandForHardness(h)}`).join("; ")} ) and it is rendered
        nowhere. The test suite greps the whole render layer to prove that.
      </p>
      <p className="worth-guard">{WORTH_GUARD}</p>

      <h3>Gauges and slack</h3>
      <p>
        Every resource gauge holds one of five bands: {GAUGE_BAND_ORDER.join(" · ")}. The four gauges are{" "}
        {GAUGE_KEYS.map((k) => GAUGE_LABEL[k]).join(", ")}. <strong>Slack</strong> — the buffer — is
        derived by one disclosed rule: it is the lower of the money and time-&amp;-structure gauges,
        stepped down one band while any active condition flags high load. Nothing else feeds it.
      </p>

      <h3>How an outcome resolves</h3>
      <p>
        Each option declares two or three outcome bands from a fixed vocabulary, at most one marked a
        failure. Skill and position reshape the <em>widths</em> of those bands — never adding or removing
        one — and then a single draw, a pure function of the run&rsquo;s draw-seed and the card&rsquo;s
        id, lands the marker in exactly one band. That is the whole of it: the option sets the range, the
        draw lands inside it.
      </p>
      <div className="engine-table-wrap">
        <table className="engine-table">
          <thead>
            <tr>
              <th>band</th>
              <th>reads as</th>
            </tr>
          </thead>
          <tbody>
            {OUTCOME_BAND_ORDER.map((b) => (
              <tr key={b}>
                <td>{b}</td>
                <td>{OUTCOME_BAND_LABEL[b]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
