"use client";

import Link from "next/link";
import { useGuide } from "@/lib/guide-context";
import { Term, TermHeading } from "@/components/Term";
import { LIFE_STATS, NOT_A_STAT, PRESET } from "@/content/character";

/**
 * Character sheet — illustrative preset (§6.6). Six life-stats rendered as
 * qualitative bands with a confidence caveat each — no numbers, no bars, no
 * total. The no-score rule is enforced here in the render code, not just in
 * policy: there is nowhere for a score to go.
 */
export function CharacterSheet() {
  const { edition } = useGuide();
  const game = edition === "game";

  return (
    <div className="character-sheet">
      <div className="character-side">
        <section className="panel">
          <p className="eyebrow">
            {PRESET.label} · illustrative, not an assessment
          </p>
          <TermHeading k="goal" />
          <p>{PRESET.mainQuest}</p>
          <TermHeading k="sideGoal" />
          <ul className="chip-list">
            {PRESET.sideQuests.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <p className="eyebrow">
            <Term k="resource" caps />s
          </p>
          <ul className="chip-list">
            {PRESET.resources.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <div className="support-pressure">
            <div>
              <TermHeading k="support" />
              <ul className="chip-list">
                {PRESET.buffs.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
            <div>
              <TermHeading k="pressure" />
              <ul className="chip-list">
                {PRESET.debuffs.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="panel">
          <p className="eyebrow">Skills and the people around you</p>
          <ul className="chip-list">
            {PRESET.skills.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <TermHeading k="party" />
          <ul className="chip-list">
            {PRESET.support.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
      </div>

      <div className="character-main">
        <section className="panel">
          <p className="eyebrow">
            <Term k="lifeStat" caps />s · functioning, not worth
          </p>
          <p className="stats-intro">
            Six broad areas of functioning. Each is a dashboard of several things, shown as a plain band
            with an honest caveat — never a number, because a number here would imply a score, and there is
            no score. This sheet does not lead with strength or looks; those matter greatly for some lives
            and surface only when they actually bear on the build.
          </p>
          <ul className="stat-grid">
            {LIFE_STATS.map((s) => (
              <li key={s.id} className="stat-row">
                <div className="stat-head">
                  <h3>{game ? s.game : s.standard}</h3>
                  <span className="stat-band">{s.band}</span>
                </div>
                <p className="stat-covers">{s.covers}</p>
                <p className="stat-confidence">{s.confidence}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <p className="eyebrow">What is deliberately not a stat</p>
          <dl className="not-a-stat">
            {NOT_A_STAT.map((n) => (
              <div key={n.thing}>
                <dt>{n.thing}</dt>
                <dd>{n.what}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="panel character-next">
          <p>
            Use this as a set of questions rather than a verdict: which <Term k="pressure" /> is binding
            today, which <Term k="support" /> is real, and what is unknown but cheap to learn. To lay out
            your own situation instead of reading a preset, the board is the place for that.
          </p>
          <Link className="stage-deep-link" href="/character/board">
            Lay out your own situation on the board →
          </Link>
        </section>
      </div>
    </div>
  );
}
