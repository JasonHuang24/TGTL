"use client";

import { useState } from "react";
import { useGuide } from "../GuideContext";

const doors = [
  { id: "map", number: "01", href: "/roadmap", title: "Explore the life map", body: "Locate a stage, then follow the domains that matter to you.", action: "Open the roadmap" },
  { id: "happened", number: "02", href: "/situations", title: "Something happened", body: "Start with the event, not a category or diagnosis.", action: "Find the nearest situation" },
  { id: "choose", number: "03", href: "/guidance", title: "Help me choose", body: "Compare viable paths, tradeoffs, and recovery routes.", action: "Lay out the decision" },
  { id: "lookup", number: "04", href: "/topics", title: "Look something up", body: "Return directly to work, money, health, relationships, or loss.", action: "Browse topics" },
  { id: "help", number: "05", href: "/help-now", title: "Help now", body: "Immediate danger, suicidal crisis, abuse, or urgent support.", action: "Go straight to help" },
];

export function HomePage() {
  const { edition, effectiveFrame, setFrame } = useGuide();
  const [triage, setTriage] = useState<string | null>(null);
  const chosen = doors.find((door) => door.id === triage);

  return <>
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">A FIELD GUIDE FOR THE LIFE YOU ARE ACTUALLY LIVING</p>
        <h1 id="hero-title">Find your bearings.<br /><em>Keep your choices.</em></h1>
        <p className="lede">The Guidebook helps you understand what is happening, see the forces shaping it, and find a useful next move—without pretending there is one correct life.</p>
        <div className="hero-actions"><a className="primary-action" href="#doors">Show me where to start</a><a className="quiet-action" href="/roadmap">Explore the life map</a></div>
        <p className="privacy-line"><span aria-hidden="true">◇</span> No account. Private choices stay in this browser. You can clear them at any time.</p>
      </div>
      {effectiveFrame !== "down" && <div className="book-pair" aria-label="Two editions use the same underlying guide">
        <div className="book standard-book" data-active={edition === "standard" || undefined}><span>THE FIELD ATLAS</span><strong>Standard<br />Edition</strong><small>Plain, reflective language</small></div>
        <div className="book game-book" data-active={edition === "game" || undefined}><span>THE STRATEGY COMPANION</span><strong>Game Guide<br />Edition</strong><small>The same facts, translated</small></div>
      </div>}
    </section>

    <section className="doors" id="doors" aria-labelledby="doors-title">
      <div className="section-intro"><p className="eyebrow">TWO QUESTIONS, THEN A USEFUL PAGE</p><h2 id="doors-title">What brought you here?</h2><p>Choose the closest answer. You can also use any door directly; this is orientation, not intake.</p></div>
      <div className="door-grid">
        {doors.map((door) => <button type="button" className={"door " + (door.id === "help" ? "door-help" : "")} key={door.id} onClick={() => setTriage(door.id)} aria-pressed={triage === door.id}>
          <span>{door.number}</span><h3>{door.title}</h3><p>{door.body}</p><b>{door.action} →</b>
        </button>)}
      </div>
      {chosen && <div className="triage-second" role="region" aria-live="polite" aria-labelledby="frame-question">
        <div><p className="eyebrow">ONE MORE CHOICE</p><h3 id="frame-question">How much of the game frame would help right now?</h3><p>This choice changes language and visual treatment, never the underlying guidance.</p></div>
        <div className="frame-choices">
          <button onClick={() => setFrame("full")}><strong>Full frame</strong><span>Use the strategy-guide vocabulary when it clarifies structure.</span></button>
          <button onClick={() => setFrame("light")}><strong>Light frame</strong><span>Mostly plain language, with translated terms when useful.</span></button>
          <button onClick={() => setFrame("down")}><strong>Set down</strong><span>Calm plain language, without game labels or ornament.</span></button>
        </div>
        <a className="primary-action" href={chosen.href}>Continue to {chosen.title.toLowerCase()} →</a>
      </div>}
    </section>

    <section className="human-preview">
      <div><p className="eyebrow">THE HUMAN PACKAGE</p><h2>Highly adaptable. Deeply dependent. Unequally equipped.</h2></div>
      <div><p>People arrive needing other people. Starting conditions differ. Place and era change the rules. Chance remains active. No single win condition fits every life.</p><a className="text-link" href="/human-package">Read the five-minute orientation →</a></div>
    </section>

    <section className="map-teaser" aria-labelledby="map-title">
      <div><p className="eyebrow">THE WHOLE-LIFE ROADMAP</p><h2 id="map-title">A life is not a ladder.</h2><p>Health can stall while craft grows. Work can change while care deepens. A route can close, reopen, or become irrelevant. The map keeps those differences visible.</p><a className="text-link" href="/roadmap">Open the complete roadmap →</a></div>
      <div className="route-preview" aria-label="Illustrative route preview">
        {["Early years","Learning","Launch","Building","Midlife","Later life"].map((label, index) => <div key={label} className={index === 2 ? "is-here" : ""}><span>{index + 1}</span><b>{label}</b></div>)}
      </div>
    </section>

    <section className="returner-strip"><div><p className="eyebrow">COMING BACK?</p><h2>Skip the welcome. Go where you left off.</h2></div><div><a href="/topics">Browse topics</a><a href="/daily-plan">Open the private daily plan</a><a href="/history">See history</a></div></section>
  </>;
}
