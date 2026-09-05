"use client";

import { useEffect, useMemo, useState } from "react";
import roadmap from "../../content/roadmap.json";
import { useGuide } from "../GuideContext";
import { EvidenceDetails, NextMove, PageHeader, Status } from "./SiteShell";

export function HumanPackagePage() {
  return <article className="reading-page">
    <PageHeader eyebrow="ORIENTATION · FIVE MINUTES" title="The Human Package" intro="The parts of being human that every route begins inside—and the reasons no life can be read as effort alone." />
    <section className="prose-lead"><p>Human beings arrive unfinished. We need care before we can choose, language before we can explain ourselves, and other people before independence means anything. That is not a defect in the design. It is the design.</p></section>
    <div className="package-list">
      <section><span>01</span><div><h2>Dependence comes first</h2><p>No one begins self-made. Caregivers, households, institutions, and communities carry the early years. Later independence rests on that support, whether it was abundant, strained, interrupted, or unsafe.</p></div></section>
      <section><span>02</span><div><h2>Starting conditions are unequal</h2><p>Health, family resources, safety, legal status, geography, appearance, social treatment, and chance shape the available moves. They explain context; they do not determine human worth.</p></div></section>
      <section><span>03</span><div><h2>Adaptability is real—and not unlimited</h2><p>People learn, recover, compensate, and revise. Some losses remain. Some constraints can be changed only collectively. A good map shows both agency and the edge of agency.</p></div></section>
      <section><span>04</span><div><h2>Every other person is a full person</h2><p>Relationships can provide love, repair, care, information, access, burden, conflict, and danger. No one is scenery in someone else’s story.</p></div></section>
      <section><span>05</span><div><h2>Place and time change the rules</h2><p>A reasonable move in one household, country, economy, body, or era can be unavailable in another. The first deep roadmap uses a United States 2025 baseline because production needs a starting point—not because it is universal.</p></div></section>
      <section><span>06</span><div><h2>There is no mandatory win condition</h2><p>Stability, love, health, craft, freedom, service, pleasure, faith, curiosity, and legacy can matter in different combinations. Common is not automatically good. Uncommon is not automatically failure.</p></div></section>
    </div>
    <NextMove><p>Open the roadmap and choose the stage that best matches your current question—not necessarily your age.</p><a className="text-link" href="/roadmap">Locate yourself on the roadmap →</a></NextMove>
    <EvidenceDetails><p>This synopsis is editorial synthesis: a framing of the project’s scope, not a measured universal profile. Specific developmental, demographic, or outcome claims require claim-level evidence before publication.</p><Status kind="required">Research required for factual expansion</Status></EvidenceDetails>
  </article>;
}

export function RoadmapPage() {
  const { edition, age, setAge, sexLens, setSexLens, term } = useGuide();
  const [stageId, setStageId] = useState("stage-launch");
  const [branchId, setBranchId] = useState("branch-training");
  const stage = roadmap.stages.find((item) => item.id === stageId) ?? roadmap.stages[3];
  const branch = roadmap.branches.find((item) => item.id === branchId) ?? roadmap.branches[0];

  useEffect(() => {
    const starts = [0, 6, 12, 18, 25, 40, 60, 75];
    const index = starts.reduce((last, start, i) => age >= start ? i : last, 0);
    setStageId(roadmap.stages[index].id);
  }, [age]);

  return <div className="wide-page">
    <PageHeader eyebrow="UNITED STATES BASELINE · REFERENCE 2025" title={term("roadmap")} intro="Eight overlapping chapters across parallel domains. The ranges orient; they do not tell anyone when a life should happen." status="Illustrative fixture" />
    <section className="roadmap-controls" aria-label="Roadmap controls">
      <div className="age-control"><label htmlFor="age"><span>Selected age</span><strong>{age}</strong></label><input id="age" type="range" min="0" max="90" value={age} onChange={(event) => setAge(Number(event.target.value))} /><div><span>Birth</span><span>45</span><span>90</span></div></div>
      <div><p className="control-label">Sex-aware lens</p><div className="segmented" role="group" aria-label="Sex-aware roadmap lens"><button aria-pressed={sexLens === "shared"} onClick={() => setSexLens("shared")}>Shared first</button><button aria-pressed={sexLens === "female"} onClick={() => setSexLens("female")}>Female</button><button aria-pressed={sexLens === "male"} onClick={() => setSexLens("male")}>Male</button></div><small>This fixture changes no claims: research is required before sex-linked differences are published.</small></div>
    </section>

    <section className="roadmap-board" aria-label="Life roadmap">
      <div className="stage-spine">
        {roadmap.stages.map((item, index) => <button key={item.id} className={item.id === stageId ? "is-selected" : ""} aria-current={item.id === stageId ? "step" : undefined} onClick={() => { setStageId(item.id); setAge([0,6,12,18,25,40,60,75][index]); }}><span>{index + 1}</span><b>{edition === "game" ? item.gameLabel : item.label}</b><small>{item.short}</small></button>)}
      </div>
      <div className="domain-tracks">
        {roadmap.domains.map((domain, index) => <div key={domain.id}><div><b>{domain.label}</b><small>{domain.note}</small></div><span className={"track track-" + ((index % 3) + 1)} aria-hidden="true"><i style={{ width: (28 + index * 8) + "%" }} /><em>{index % 2 === 0 ? "◇" : "↩"}</em></span></div>)}
        <div className="map-key"><span><i className="key-line solid" /> selected or observed</span><span><i className="key-line dotted" /> uncertain</span><span>◇ gate</span><span>↩ reopened route</span></div>
      </div>
      <aside className="stage-panel">
        <p className="eyebrow">SELECTED {term("stage").toUpperCase()} · {stage.short}</p>
        <h2>{edition === "game" ? stage.gameLabel : stage.label}</h2>
        <p className="stage-summary">{stage.summary}</p>
        <dl><div><dt>What often matters</dt><dd>{stage.needs}</dd></div><div><dt>Agency</dt><dd>{stage.agency}</dd></div><div><dt>Variation</dt><dd>{stage.variation}</dd></div></dl>
        <NextMove title="Try this next"><p>{stage.nextMove}</p></NextMove>
      </aside>
    </section>

    <section className="branch-section">
      <div className="section-intro"><p className="eyebrow">BRANCHING WITHOUT DESTINY</p><h2>A route can split, pause, reconnect, or change its objective.</h2><p>The map distinguishes what was chosen from what was assigned, gated, or reopened.</p></div>
      <div className="branch-picker" role="tablist" aria-label="Choose a branch">
        {roadmap.branches.map((item) => <button role="tab" aria-selected={branchId === item.id} key={item.id} onClick={() => setBranchId(item.id)}><span>{item.type}</span><b>{item.label}</b></button>)}
      </div>
      <article className="branch-detail" role="tabpanel">
        <div className="branch-head"><div><p className="eyebrow">{branch.type}</p><h2>{branch.label}</h2></div><Status kind="illustrative">Illustrative branch</Status></div>
        <p className="branch-summary">{branch.summary}</p>
        <dl className="consequence-grid"><div><dt>Potential value</dt><dd>{branch.reward}</dd></div><div><dt>Tradeoff</dt><dd>{branch.tradeoff}</dd></div><div><dt>Gate or condition</dt><dd>{branch.gate}</dd></div><div><dt>Alternative</dt><dd>{branch.alternative}</dd></div><div className="recovery-field"><dt>{term("recovery")}</dt><dd>{branch.recovery}</dd></div><div><dt>Evidence status</dt><dd>{branch.evidence}</dd></div></dl>
      </article>
    </section>
  </div>;
}

const attributes = [
  ["Vitality", "Variable", "Energy, pain, mobility, sleep, and recovery—not moral effort."],
  ["Learning", "Strong with structure", "Acquiring, connecting, and updating knowledge."],
  ["Execution", "Context-sensitive", "Starting, sequencing, finishing, and adapting action."],
  ["Regulation", "Unknown", "Managing attention, emotion, impulse, and recovery under load."],
  ["Social navigation", "Developing", "Reading context, communicating, repairing, and asking."],
  ["Adaptability", "Demonstrated", "Changing strategy without pretending change has no cost."]
];

export function CharacterPage() {
  const { term } = useGuide();
  return <div className="wide-page">
    <PageHeader eyebrow="ILLUSTRATIVE PRESET · NOT AN ASSESSMENT" title={term("character")} intro="A functional picture of capacity, resources, conditions, supports, and commitments. There is no total score because human worth is not a stat." status="Illustrative fixture" />
    <section className="character-layout">
      <div className="attribute-panel">
        <div className="panel-heading"><p className="eyebrow">FUNCTIONING-ORIENTED VIEW</p><h2>{term("attribute")}s</h2></div>
        {attributes.map(([name, band, description]) => <article key={name}><div><h3>{name}</h3><span>{band}</span></div><p>{description}</p></article>)}
      </div>
      <div className="character-side">
        <section><p className="eyebrow">STARTING CONDITIONS</p><h2>Context before judgment</h2><ul><li>United States 2025 baseline</li><li>Family resources: not entered</li><li>Health and access: not entered</li><li>Safety and legal position: not entered</li></ul><p className="quiet-note">Unknown is a valid value. This release does not ask for sensitive profile data.</p></section>
        <section><p className="eyebrow">CURRENT RESOURCES</p><div className="resource-chips"><span>Time · constrained</span><span>Money · unknown</span><span>Support · some</span><span>Optionality · mixed</span></div></section>
        <section><p className="eyebrow">{term("supports").toUpperCase()} / {term("pressures").toUpperCase()}</p><div className="support-pressure"><div><b>Supports</b><p>A trusted peer, transferable writing skill, one stable routine.</p></div><div><b>Pressures</b><p>Variable energy, caregiving load, financial uncertainty.</p></div></div></section>
        <section><p className="eyebrow">GOALS AND PROJECTS</p><h3>{term("goal")}</h3><p>Build a stable, sustainable work transition.</p><h3>{term("project")}</h3><p>Run one low-cost role experiment without taking on debt.</p></section>
      </div>
    </section>
    <NextMove><p>Use this sheet as a set of questions, not a diagnosis: Which pressure is binding today? Which support is real? What is unknown but cheap to learn?</p><a href="/guidance" className="text-link">Take the picture to the decision guide →</a></NextMove>
  </div>;
}
