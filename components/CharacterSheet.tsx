"use client";

import Link from "next/link";
import { useState } from "react";
import { useGuide } from "@/lib/guide-context";
import { Term, TermHeading } from "@/components/Term";
import {
  LIFE_STATS,
  NOT_A_STAT,
  PRESET,
  SHEET_LAYERS,
  NEED_STATE_LINE,
  MORE_IS_NOT_BETTER,
  ATTENTION_NOTE,
  SCORECARD_KINDS,
  SCORECARD_LEAD,
  SCORECARD_CLOSE,
} from "@/content/character";

/**
 * Character sheet — illustrative preset (§6.6). Six life-stats rendered as
 * qualitative bands with a confidence caveat each — no numbers, no bars, no
 * total. The no-score rule is enforced here in the render code, not just in
 * policy: there is nowhere for a score to go.
 */
export function CharacterSheet() {
  const { edition } = useGuide();
  const game = edition === "game";
  /*
   * N-072 (C-36) — the panel explanations are a classifying surface too: they
   * tell the reader what kind of thing each part of their situation is. So the
   * same rejection is offered here. It is deliberately SESSION-ONLY — this sheet
   * is an illustrative preset that describes nobody, and persisting a
   * disagreement with a worked example across visits would be recording a
   * judgement about a reader who was never being described in the first place.
   */
  const [rejected, setRejected] = useState<string[]>([]);
  const toggle = (id: string) =>
    setRejected((r) => (r.includes(id) ? r.filter((x) => x !== id) : [...r, id]));
  const noneFit = rejected.length === SHEET_LAYERS.length;

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
        {/* N-399 — the five layers, as the sheet's structure rather than as six
            prose rows further down. This is what stops privilege, training and
            health being blended into one impression of a person. */}
        <section className="panel sheet-layers" data-sheet-layers>
          <p className="eyebrow">How this sheet is separated — five layers, deliberately not blended</p>
          <p className="stats-intro">
            Almost every failure of a picture like this comes from putting two different kinds of thing in
            the same row. These five are kept apart on purpose, because they have different causes,
            different remedies, and completely different implications about the person they describe.
          </p>
          <div className="sheet-layer-list">
            {SHEET_LAYERS.map((l) => {
              const off = rejected.includes(l.id);
              return (
                <section
                  key={l.id}
                  className={`sheet-layer${off ? " is-rejected" : ""}`}
                  data-sheet-layer={l.id}
                >
                  <h3>{l.label}</h3>
                  <p className="sheet-layer-what">{l.what}</p>
                  <p className="sheet-layer-examples">
                    <span className="sheet-layer-label">For example:</span> {l.examples}
                  </p>
                  <p className="sheet-layer-confused">
                    <span className="sheet-layer-label">Routinely confused with:</span> {l.confusedWith}
                  </p>
                  <button
                    type="button"
                    className="board-reject"
                    data-reject={l.id}
                    aria-pressed={off}
                    onClick={() => toggle(l.id)}
                  >
                    {off ? "Put this back" : "This does not fit"}
                  </button>
                  {off && (
                    <p className="board-reject-note" data-reject-note>
                      Set aside, on your say-so. It stays struck through rather than vanishing, and nothing
                      about you was recorded — this is a worked example, and it was never describing you.
                    </p>
                  )}
                </section>
              );
            })}
          </div>
          {noneFit && (
            <p className="sheet-none-fit" data-reject-none>
              None of these fit — which is a complete answer, and a useful one. The five layers are a
              claim about how a situation divides up, and if the division is wrong for yours, the
              division is the thing that is wrong. There is no next-best version of this to offer you.
            </p>
          )}
          <p className="sheet-need-state" data-need-state>
            {NEED_STATE_LINE}
          </p>
        </section>

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
                {/* N-403 — the band is meaningless without who it is read
                    against, so the population renders on every band. */}
                <p className="stat-population" data-stat-population>
                  <span className="stat-population-label">Compared with:</span> {s.population}
                </p>
                <p className="stat-confidence">{s.confidence}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <p className="eyebrow">What is deliberately not a stat</p>
          <p className="stats-intro">
            Four of these are the composites every character sheet in the world carries, and they are
            listed here with what they actually decompose into — which is more useful than a refusal, and
            considerably harder to argue with.
          </p>
          <dl className="not-a-stat">
            {NOT_A_STAT.map((n) => (
              <div key={n.thing}>
                <dt>{n.thing}</dt>
                <dd>{n.what}</dd>
              </div>
            ))}
          </dl>
          {/* N-405 — the rule the four decompositions share. */}
          <p className="not-a-stat-close" data-more-is-not-better>
            {MORE_IS_NOT_BETTER}
          </p>
        </section>

        {/* N-127 (deferred from batch 4) — attention, and the instrument that
            measures it, named as living somewhere the reader controls. */}
        <section className="panel character-attention" data-attention-note>
          <p className="eyebrow">{ATTENTION_NOTE.title}</p>
          <p>{ATTENTION_NOTE.body}</p>
          <p>{ATTENTION_NOTE.external}</p>
        </section>

        {/* N-408 — the taxonomy, read and never selected. For the reader who is
            succeeding and miserable, which nothing else on this sheet can see. */}
        <section className="panel guidance-scorecard" data-scorecard>
          <p className="eyebrow">Whose scorecard is this?</p>
          <p className="stats-intro">{SCORECARD_LEAD}</p>
          <dl className="scorecard-list">
            {SCORECARD_KINDS.map((k) => (
              <div key={k.name}>
                <dt>{k.name}</dt>
                <dd>{k.what}</dd>
              </div>
            ))}
          </dl>
          <p>{SCORECARD_CLOSE}</p>
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
