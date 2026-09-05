import Link from "next/link";
import { GAUGE_BAND_ORDER, GAUGE_LABEL } from "@/content/bands";
import {
  ECONOMY_TABLE_ROWS,
  ECONOMY_RULES,
  PIP_TABLE,
  REST_CONVERSION,
  DEBT_THRESHOLDS,
  MAX_DEBT_PIP_DRAG,
} from "@/lib/sim/economy";
import { PILEUP_RULES, MAX_NEGATIVE_ARRIVALS, MAX_CHANCE_ARRIVALS, MAX_COMPANION_ARRIVALS } from "@/lib/sim/season";
import { SATISFACTION_DISCLOSURE } from "@/lib/sim/satisfaction";
import { DOMAIN_SERVES } from "@/content/sim/domains";
import { PRIORITY_KEYS, PRIORITY_LABEL } from "@/content/sim/schema";
import { ATTRIBUTION_LABEL, BUDGET_LABEL, ATTRIBUTION_CATEGORIES, SEASON_COUNT_NOTE, FLEET_POLICY_COUNT_WORD } from "@/content/sim/methodology-copy";
import { CAMPAIGN_LABEL, SEASON_COUNT, ACTIONS, EVENTS, COMPANIONS, PRESETS } from "@/content/sim/registry";
import { LAB_SITUATIONS } from "@/content/sim/lab/situations";

/**
 * THE SANDBOX, DISCLOSED (blueprint 4.0 §6: "`/methodology` publishes the whole
 * machine").
 *
 * Everything the campaign runs on, in readable form, rendered FROM THE SAME
 * FIXTURES the simulator uses — so this page cannot drift from the engine. The
 * blueprint's list, item by item: the budget economy table (§7.5), the season
 * resolution order (§7.6), the pile-up physics (§5.2), the S-10 balance method
 * and its thresholds, the attribution classification rule (§3.10), and the
 * internal satisfaction measure S-10 uses and the game never shows.
 *
 * Numbers are fine HERE. This is the methodology page, not play (§6).
 */
export function SandboxMethodology() {
  return (
    <section className="engine-methodology">
      <h2 id="sandbox">How the sandbox works</h2>
      <p className="status-inline">
        <span className="status-label" data-status="illustrative">
          <span className="status-dot" aria-hidden="true" />
          illustrative
        </span>{" "}
        {CAMPAIGN_LABEL} is a model of a set of tradeoffs, not a prediction and not an average life. Every
        value below is authored rather than measured, and it is all published because a frank, auditable
        model is the whole point. Nothing here is hidden from the person playing.
      </p>
      <p>
        The campaign holds {ACTIONS.length} things you can do, {EVENTS.length} things that can happen to
        you, {COMPANIONS.length} people with their own trajectories, {PRESETS.length} written starting
        positions plus a drawn one, and {LAB_SITUATIONS.length} Decision Lab situations — across{" "}
        {SEASON_COUNT} six-month seasons. {SEASON_COUNT_NOTE}
      </p>

      {/* ---------------------------------------------------------------- */}
      <h3 id="economy">The budget economy: stocks and flow</h3>
      <p>
        The four gauges are <strong>stocks</strong> — what you have. The season budget is a{" "}
        <strong>flow</strong> — what this season lets you spend. Keeping them separate is what makes a
        season a decision rather than a meter: spending pips never moves a gauge, and gauges move only
        through the effects of what actually happened.
      </p>
      <div className="engine-table-wrap">
        <table className="engine-table">
          <caption className="cf-label">Pips granted per season, by the band of the source gauge</caption>
          <thead>
            <tr>
              <th scope="col">currency</th>
              <th scope="col">derives from</th>
              {GAUGE_BAND_ORDER.map((b) => (
                <th scope="col" key={b}>
                  {b}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ECONOMY_TABLE_ROWS.map((row) => (
              <tr key={row.currency}>
                <th scope="row">{BUDGET_LABEL[row.currency]}</th>
                <td>{GAUGE_LABEL[row.source]}</td>
                {row.pipsByBand.map((p) => (
                  <td key={p.band}>{p.pips}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul>
        {ECONOMY_RULES.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
      <p>
        Concretely: rest converts {REST_CONVERSION.pipsPerStep} unspent pips into one band of recovery, to
        a ceiling of {REST_CONVERSION.maxSteps} bands in a season. Maintenance debt costs a pip of time and a pip of
        energy as it passes {DEBT_THRESHOLDS.slice(0, MAX_DEBT_PIP_DRAG).join(" and ")} — and no more than{" "}
        {MAX_DEBT_PIP_DRAG === 2 ? "two" : String(MAX_DEBT_PIP_DRAG)} pips however far past that it goes.
        Passing {DEBT_THRESHOLDS[2]} costs no third pip; it puts the season under high load instead. A typical action costs one to three
        pips of a currency, and a full season commits two to four things.
      </p>

      {/* ---------------------------------------------------------------- */}
      <h3 id="resolution-order">The order things resolve in</h3>
      <p>
        A season always resolves in this order, and the order matters: a consequence you set in motion two
        years ago lands <em>before</em> this season&rsquo;s choices, and an event can therefore remove the
        premise of something you had already committed to.
      </p>
      <pre className="engine-diagram" aria-label="The season resolution order">
{`1  consequences that have come due
2  scheduled events
3  the actions you committed, in the order you committed them
4  events from the people in your life, and from chance
5  season-end bookkeeping
     · standing commitments tick down
     · people you have not been in touch with notice
     · maintenance debt accrues or clears
     · the queue ages`}
      </pre>
      <p>
        <strong>The invalidation rule.</strong> If something resolving earlier removes the premise of an
        action you committed — a layoff arriving before the overtime shift you had signed up for — that
        action does not silently fizzle. It either refunds what you set aside, or converts into the thing
        the event says it becomes, and you are told which, in plain language, in the same season.
      </p>

      {/* ---------------------------------------------------------------- */}
      <h3 id="pileup">How pressure is capped</h3>
      <p>
        A sandbox made of honest individual setbacks can still compose something that reads as despair by
        stacking three of them on a character with nothing spare. The model refuses to do that, and it
        refuses in the open rather than by quietly going easy on you:
      </p>
      <ul>
        {PILEUP_RULES.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
      <p>
        The exact ceilings: at most {MAX_NEGATIVE_ARRIVALS} negative arrivals in a season, at most{" "}
        {MAX_CHANCE_ARRIVALS} chance or systemic events drawn at all, and at most{" "}
        {MAX_COMPANION_ARRIVALS} of the people in your life bringing you something. Deep depletion means
        any gauge at <em>depleted</em>, or two or more at <em>thin</em>.
      </p>
      <p>
        And the floor, which is the other half of the same promise:{" "}
        <strong>
          rest and maintain, wait, and ask for help are free and available in every season of every
          campaign
        </strong>
        , and every season offers at least three affordable things across at least two kinds. That is not
        a design intention — it is an assertion the test suite makes against every season of several
        hundred simulated runs, including runs deliberately started with everything drained.
      </p>

      {/* ---------------------------------------------------------------- */}
      <h3 id="attribution">How &ldquo;why this happened&rdquo; is worked out</h3>
      <p>
        The explain drawer does not narrate a plausible story about an outcome. It reports the factors
        that actually went into the resolution, computed from what the model used. A factor that is not
        listed did not contribute; a factor that contributed cannot go unlisted. The classification is
        fixed:
      </p>
      <div className="engine-table-wrap">
        <table className="engine-table">
          <caption className="cf-label">The attribution rule</caption>
          <thead>
            <tr>
              <th scope="col">what the model read</th>
              <th scope="col">what it renders as</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">the option itself</th>
              <td>{ATTRIBUTION_LABEL.choice}</td>
            </tr>
            <tr>
              <th scope="row">constraint flags that came with the starting position</th>
              <td>{ATTRIBUTION_LABEL.startingConditions}</td>
            </tr>
            <tr>
              <th scope="row">gauges, capabilities, skills, and where a queued consequence came from</th>
              <td>{ATTRIBUTION_LABEL.accumulatedState}</td>
            </tr>
            <tr>
              <th scope="row">flags set by another character&rsquo;s decision</th>
              <td>{ATTRIBUTION_LABEL.otherPeople}</td>
            </tr>
            <tr>
              <th scope="row">flags set by an institutional or systemic event</th>
              <td>{ATTRIBUTION_LABEL.systems}</td>
            </tr>
            <tr>
              <th scope="row">where the marker landed on the range</th>
              <td>{ATTRIBUTION_LABEL.draw}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The same six categories appear on the whole-run look-back at age thirty. There are{" "}
        {ATTRIBUTION_CATEGORIES.length} of them and there is no seventh.
      </p>

      {/* ---------------------------------------------------------------- */}
      <h3 id="balance">How the balance was probed</h3>
      <p>
        Balance is not something you can prove about a sandbox, so the claim here is deliberately weaker
        than &ldquo;balanced&rdquo;: it was <em>probed</em>. {FLEET_POLICY_COUNT_WORD} scripted policies — one greedy for
        each of the ten priorities, plus rest-heavy, rest-and-bank, spend-everything, never-rest and
        wait-only — are
        driven over every starting position, several drawn hands, and several seeds, and then again from a
        deliberately drained state. The definitions are operational so the result is checkable rather than
        felt:
      </p>
      <ul>
        <li>
          <strong>Ending signature</strong> — the end-state gauge bands, the maintenance backlog, the
          skills, the people still in the life, the commitments held for three seasons or more, and the
          doors that opened.
        </li>
        <li>
          <strong>Meaningfully different</strong> — two signatures differing in at least three of those
          components.
        </li>
        <li>
          <strong>Viable</strong> — completed all {SEASON_COUNT} seasons with no gauge pinned at{" "}
          <em>depleted</em> across the final four.
        </li>
      </ul>
      <p>What the suite asserts, and fails on:</p>
      <ul>
        <li>No policy is at least as good as every other policy on all ten priorities.</li>
        <li>Rest-heavy is never strictly dominated — holding the floor is a way of playing.</li>
        <li>At least three meaningfully different viable endings exist for every starting position.</li>
        <li>Every starting position completes the window under every policy.</li>
        <li>
          Every season of every run offers at least three affordable things across at least two kinds,
          drained runs included.
        </li>
      </ul>

      <h3 id="satisfaction">The one internal number, and why you never see it</h3>
      {SATISFACTION_DISCLOSURE.map((line, i) => (
        <p key={i}>{line}</p>
      ))}
      <p>
        If you want to see what the game does show you instead, it is the look-back at thirty: what these
        years cost, what they bought, what is still open, and how it reads against what{" "}
        <em>you</em> said mattered. Read against your own scorecard, and nobody else&rsquo;s.
      </p>

      <h3 id="domains">Which cards count toward which priority</h3>
      <p>
        Both the look-back and the balance probe need an answer to &ldquo;did this season go into that?
        &rdquo; Every card carries domain tags, and this is the whole map from tag to priority. It is a
        design judgement, so it is published rather than buried — a card can serve more than one, and a card
        that serves none of yours is not a wasted season, only a season that went elsewhere.
      </p>
      <ul className="sim-plain-list">
        {PRIORITY_KEYS.map((k) => {
          const tags = Object.entries(DOMAIN_SERVES)
            .filter(([, serves]) => serves.includes(k))
            .map(([tag]) => tag);
          return (
            <li key={k}>
              <strong>{PRIORITY_LABEL[k]}</strong> — {tags.join(", ")}
            </li>
          );
        })}
      </ul>

      <h3 id="sandbox-honesty">What this model does not do</h3>
      <ul>
        <li>It does not predict anything about your life, and it says so wherever branches or futures appear.</li>
        <li>It shows no probability, percentage, or statistic anywhere in play. Only qualitative ranges.</li>
        <li>
          It never scores, grades, ranks, streaks, or characterises the person playing. Runs are never
          combined into a reading about you — the look-back is per-run and about the character.
        </li>
        <li>
          It never tunes itself to how you have been playing. The physics responds to the{" "}
          <em>character&rsquo;s state</em>, by the published rules above, and to nothing else.
        </li>
        <li>
          It offers no way to insert yourself. Starting positions come from the drawn hand or from the
          written, labelled-fictional presets, and there is no third route.
        </li>
        <li>
          The heavy parts of a life that are not decisions are not playable content. They arrive on their
          own quiet channel, they are always skippable, they never appear on any forward-looking screen,
          and they always name the real page for the real thing. See{" "}
          <Link href="/triage">the situation pages</Link>.
        </li>
      </ul>
    </section>
  );
}
