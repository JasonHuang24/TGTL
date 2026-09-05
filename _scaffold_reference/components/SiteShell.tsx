"use client";

import { useEffect, useRef, useState } from "react";
import { isSensitiveRoute, useGuide } from "../GuideContext";

const nav = [
  ["/roadmap", "Roadmap"],
  ["/situations", "Situations"],
  ["/guidance", "Guidance"],
  ["/character", "Character"],
  ["/topics", "Topics"],
  ["/history", "History"],
  ["/methodology", "Methodology"],
];

function quickExit() {
  window.location.replace("https://www.google.com/search?q=weather");
}

export function SiteShell({ route, children }: { route: string; children: React.ReactNode }) {
  const { edition, frame, effectiveFrame, setEdition, setFrame, reset } = useGuide();
  const sensitive = isSensitiveRoute(route);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const escapeCount = useRef(0);
  const escapeTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!sensitive) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      escapeCount.current += 1;
      if (escapeTimer.current) window.clearTimeout(escapeTimer.current);
      escapeTimer.current = window.setTimeout(() => { escapeCount.current = 0; }, 900);
      if (escapeCount.current >= 2) quickExit();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [sensitive]);

  return (
    <div className="site-shell" data-edition={edition} data-frame={effectiveFrame} data-sensitive={sensitive || undefined}>
      <a className="skip-link" href="#main-content">Skip to the guide</a>
      <header className="site-header">
        <a className="brand" href="/" aria-label="The Guidebook to Life, home">
          <span className="brand-mark" aria-hidden="true">G</span>
          <span><strong>The Guidebook</strong><small>to Life · 2.0</small></span>
        </a>
        <nav aria-label="Primary navigation">
          {nav.map(([href, label]) => <a href={href} key={href} aria-current={route === href ? "page" : undefined}>{label}</a>)}
        </nav>
        <div className="header-actions">
          {sensitive && <button type="button" className="exit-button" onClick={quickExit}>Exit this page</button>}
          <a className="help-now" href="/help-now" aria-current={route === "/help-now" ? "page" : undefined}>Help now</a>
        </div>
      </header>

      <div className="preference-bar" aria-label="Reading preferences">
        {sensitive && <p className="safety-override"><span aria-hidden="true">○</span> This page uses calm, plain language. Your reading preference has not been changed.</p>}
        <div className="preference-controls">
          <div className="segmented" role="group" aria-label="Edition vocabulary">
            <button aria-pressed={edition === "standard"} onClick={() => setEdition("standard")}>Standard</button>
            <button aria-pressed={edition === "game"} onClick={() => setEdition("game")}>Game Guide</button>
          </div>
          <div className="segmented" role="group" aria-label="Presentation intensity">
            <button aria-pressed={frame === "full"} onClick={() => setFrame("full")} disabled={sensitive}>Full frame</button>
            <button aria-pressed={frame === "light"} onClick={() => setFrame("light")} disabled={sensitive}>Light frame</button>
            <button aria-pressed={frame === "down" || sensitive} onClick={() => setFrame("down")}>Set down</button>
          </div>
        </div>
      </div>

      <main id="main-content">{children}</main>

      <footer className="site-footer">
        <div><strong>The guide is a map, not a verdict.</strong><p>No account. No analytics. Personal planning stays on this device.</p></div>
        <div className="footer-links"><a href="/methodology">Evidence & limits</a><button type="button" onClick={() => setPrivacyOpen((value) => !value)}>Privacy</button><button type="button" onClick={reset}>Reset local data</button></div>
        {privacyOpen && <div className="footer-note" role="status">This site stores reading preferences and optional plan data in this browser only. Reset removes both. Safety-page visits are not recorded by the application. Browser, device, network, or employer records may still exist.</div>}
      </footer>
    </div>
  );
}

export function PageHeader({ eyebrow, title, intro, status }: { eyebrow: string; title: string; intro: string; status?: string }) {
  return <header className="page-header"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-intro">{intro}</p>{status && <span className="status-badge">{status}</span>}</header>;
}

export function EvidenceDetails({ children, title = "Evidence and limits" }: { children: React.ReactNode; title?: string }) {
  return <details className="evidence-details"><summary>{title}</summary><div>{children}</div></details>;
}

export function NextMove({ children, title = "A useful next move" }: { children: React.ReactNode; title?: string }) {
  return <aside className="next-move"><span aria-hidden="true">→</span><div><h2>{title}</h2>{children}</div></aside>;
}

export function Status({ children, kind = "illustrative" }: { children: React.ReactNode; kind?: "verified" | "illustrative" | "required" | "contested" }) {
  return <span className="status-badge" data-kind={kind}>{children}</span>;
}
