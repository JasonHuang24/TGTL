"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useGuide } from "@/lib/guide-context";
import { DOORS } from "@/content/routes";
import { STORAGE_KEYS, readString, writeString } from "@/lib/storage";
import { loadRun } from "@/lib/engine/persist";
import { PROLOGUE_LINES } from "@/content/play/framing";

/**
 * The ethereal entrance (blueprint 3.0 §3.1, §6.1). The entrance and the prologue
 * merge: a quiet pre-life space — void, starlight, Earth below, no specific
 * religion's imagery — where the two books stand as manuals for the same package.
 * Held as a thought experiment, never asserted cosmology.
 *
 * The doors and Help-now are the load-bearing anchors: this component is
 * server-rendered into the exported HTML, so every door except the client-only
 * "Continue" is a plain link present and clickable from first paint. The prologue
 * art plays *around* them, never before them. Reduced-motion honoured; the opening
 * is CSS-only and skipped on return.
 */
export function EntranceHome() {
  const { edition, setEdition } = useGuide();
  const [seen, setSeen] = useState(true);
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    const already = readString(STORAGE_KEYS.entranceSeen) === "1";
    setSeen(already);
    if (!already) writeString(STORAGE_KEYS.entranceSeen, "1");
    const run = loadRun();
    setCanContinue(Boolean(run) && run?.phase !== "parse");
  }, []);

  const game = edition === "game";
  const staticDoors = DOORS.filter((d) => !("clientOnly" in d && d.clientOnly));

  return (
    <div className="entrance" data-fresh={seen ? undefined : "1"}>
      <div className="ethereal" aria-hidden="true">
        <div className="ethereal-stars" />
        <svg className="ethereal-earth" viewBox="0 0 200 120" preserveAspectRatio="xMidYMax slice">
          <defs>
            <radialGradient id="earthGlow" cx="50%" cy="120%" r="80%">
              <stop offset="0%" stopColor="var(--atlas-accent)" stopOpacity="0.5" />
              <stop offset="60%" stopColor="var(--atlas-accent)" stopOpacity="0.08" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <ellipse cx="100" cy="150" rx="120" ry="70" fill="url(#earthGlow)" />
          <path d="M-10 120 Q100 78 210 120 Z" fill="var(--atlas-raised)" />
        </svg>
      </div>

      <section className="entrance-hero" aria-labelledby="entrance-title">
        <p className="entrance-kicker">{game ? "A loading screen before the world loads" : "Before the run"}</p>
        <h1 id="entrance-title" className="visually-hidden-h1">
          The Guidebook to Life
        </h1>
        <p className="prologue-line">{game ? PROLOGUE_LINES[0].game : PROLOGUE_LINES[0].standard}</p>
        <p className="prologue-line prologue-line-2">
          {game ? PROLOGUE_LINES[1].game : PROLOGUE_LINES[1].standard}
        </p>

        <div className="book-pair" role="group" aria-label="Choose an edition — two manuals for the same package">
          <button
            type="button"
            className="book book-standard"
            aria-pressed={edition === "standard"}
            onClick={() => setEdition("standard")}
          >
            <span className="book-eyebrow">The Guidebook to Life</span>
            <strong className="book-title">
              Standard
              <br />
              Edition
            </strong>
            <span className="book-note">Plain language. Same facts.</span>
            <span className="book-choose">{edition === "standard" ? "Selected" : "Read this one"}</span>
          </button>

          <button
            type="button"
            className="book book-game"
            aria-pressed={edition === "game"}
            onClick={() => setEdition("game")}
          >
            <span className="book-eyebrow">The Guidebook to Life</span>
            <strong className="book-title">
              Game Guide
              <br />
              Edition
            </strong>
            <span className="book-note">Strategy-guide language. Same facts.</span>
            <span className="book-choose">{edition === "game" ? "Selected" : "Read this one"}</span>
          </button>
        </div>
        <p className="entrance-subtitle">You can switch any time — you&rsquo;ll keep your place.</p>
      </section>

      <section className="doors-section" aria-labelledby="doors-title">
        <h2 id="doors-title" className="doors-title">
          Where would you like to start?
        </h2>
        <ul className="door-grid">
          {canContinue && (
            <li>
              <Link className="door door-continue" href="/play">
                <span className="door-label">Continue</span>
                <span className="door-blurb">Pick your run back up exactly where you left it.</span>
                <span className="door-go" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          )}
          {staticDoors.map((door) => (
            <li key={door.id}>
              <Link
                className={`door${door.id === "help" ? " door-help" : ""}${door.id === "begin" ? " door-primary" : ""}`}
                href={door.href}
              >
                <span className="door-label">{door.label}</span>
                <span className="door-blurb">{door.blurb}</span>
                <span className="door-go" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="doors-privacy">
          No account, no analytics, no score. Anything you choose to write stays in this browser.
        </p>
      </section>
    </div>
  );
}
