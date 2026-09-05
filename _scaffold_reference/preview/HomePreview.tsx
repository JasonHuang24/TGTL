"use client";

import { useEffect, useState } from "react";

type Edition = "standard" | "game";
type Frame = "full" | "light" | "down";

export function HomePreview() {
  const [edition, setEdition] = useState<Edition>("standard");
  const [frame, setFrame] = useState<Frame>("light");

  useEffect(() => {
    const savedEdition = window.localStorage.getItem("tgtl-edition");
    const savedFrame = window.localStorage.getItem("tgtl-frame");
    if (savedEdition === "standard" || savedEdition === "game") setEdition(savedEdition);
    if (savedFrame === "full" || savedFrame === "light" || savedFrame === "down") setFrame(savedFrame);
  }, []);

  const chooseEdition = (value: Edition) => {
    setEdition(value);
    window.localStorage.setItem("tgtl-edition", value);
  };

  const chooseFrame = (value: Frame) => {
    setFrame(value);
    window.localStorage.setItem("tgtl-frame", value);
  };

  return (
    <div className="site-shell" data-edition={edition} data-frame={frame}>
      <a className="skip-link" href="#main">Skip to the guide</a>
      <header className="site-header">
        <a className="brand" href="/" aria-label="The Guidebook to Life, home">
          <span className="brand-mark" aria-hidden="true">G</span>
          <span><strong>The Guidebook</strong><small>to Life · 2.0</small></span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#roadmap">Roadmap</a><a href="#situations">Situations</a><a href="#guidance">Guidance</a><a href="#topics">Topics</a>
        </nav>
        <a className="help-now" href="/help-now">Help now</a>
      </header>

      <div className="preference-bar" aria-label="Reading preferences">
        <div className="segmented" role="group" aria-label="Edition vocabulary">
          <button aria-pressed={edition === "standard"} onClick={() => chooseEdition("standard")}>Standard</button>
          <button aria-pressed={edition === "game"} onClick={() => chooseEdition("game")}>Game Guide</button>
        </div>
        <div className="segmented" role="group" aria-label="Presentation intensity">
          <button aria-pressed={frame === "full"} onClick={() => chooseFrame("full")}>Full frame</button>
          <button aria-pressed={frame === "light"} onClick={() => chooseFrame("light")}>Light frame</button>
          <button aria-pressed={frame === "down"} onClick={() => chooseFrame("down")}>Set down</button>
        </div>
      </div>

      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">A FIELD GUIDE FOR THE LIFE YOU ARE ACTUALLY LIVING</p>
            <h1 id="hero-title">Find your bearings.<br /><em>Keep your choices.</em></h1>
            <p className="lede">The Guidebook helps you understand what is happening, see the forces shaping it, and find a useful next move—without pretending there is one correct life.</p>
            <div className="hero-actions"><a className="primary-action" href="#doors">Show me where to start</a><a className="quiet-action" href="#roadmap">Explore the life map</a></div>
            <p className="privacy-line"><span aria-hidden="true">◇</span> No account. Private choices stay in this browser. You can clear them at any time.</p>
          </div>
          <div className="book-pair" aria-label="Two editions use the same underlying guide">
            <div className="book standard-book"><span>THE FIELD ATLAS</span><strong>Standard<br />Edition</strong><small>Plain, reflective language</small></div>
            <div className="book game-book"><span>THE STRATEGY COMPANION</span><strong>Game Guide<br />Edition</strong><small>The same facts, translated</small></div>
          </div>
        </section>

        <section className="doors" id="doors" aria-labelledby="doors-title">
          <div className="section-intro"><p className="eyebrow">START WITH WHAT IS TRUE TODAY</p><h2 id="doors-title">What brought you here?</h2><p>No intake ritual. Choose the closest door; you can change course whenever you want.</p></div>
          <div className="door-grid">
            <a className="door door-map" href="#roadmap"><span>01</span><h3>Explore the life map</h3><p>Locate a stage, then follow the domains that matter to you.</p><b>Open the roadmap →</b></a>
            <a className="door" href="/situations"><span>02</span><h3>Something happened</h3><p>Start with the event, not a category or diagnosis.</p><b>Find the nearest situation →</b></a>
            <a className="door" href="/guidance"><span>03</span><h3>Help me choose</h3><p>Compare viable paths, tradeoffs, and recovery routes.</p><b>Lay out the decision →</b></a>
            <a className="door" href="/topics"><span>04</span><h3>Look something up</h3><p>Return directly to work, money, health, relationships, or loss.</p><b>Browse topics →</b></a>
            <a className="door door-help" href="/help-now"><span>05</span><h3>Help now</h3><p>Immediate danger, suicidal crisis, abuse, or urgent support.</p><b>Go straight to help →</b></a>
          </div>
        </section>

        <section className="map-teaser" id="roadmap" aria-labelledby="map-title">
          <div><p className="eyebrow">THE WHOLE-LIFE ROADMAP</p><h2 id="map-title">A life is not a ladder.</h2><p>Health can stall while craft grows. Work can change while care deepens. A route can close, reopen, or become irrelevant. The map keeps those differences visible.</p><a className="text-link" href="/roadmap">Open the complete roadmap →</a></div>
          <div className="route-preview" aria-label="Illustrative route preview">
            {["Early years","Learning","Launch","Building","Midlife","Later life"].map((label, index) => <div key={label} className={index === 2 ? "is-here" : ""}><span>{index + 1}</span><b>{label}</b></div>)}
          </div>
        </section>
      </main>

      <footer><p>The guide is a map, not a verdict.</p><a href="/methodology">How claims and limits are handled</a></footer>
    </div>
  );
}
