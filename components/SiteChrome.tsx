"use client";

import Link from "next/link";
import { useCallback, useEffect } from "react";
import { useGuide } from "@/lib/guide-context";
import { useRoute } from "./Term";
import { PRIMARY_NAV, SETDOWN_NAV, isSetDownRoute } from "@/content/routes";

/** Routes that carry a quick-exit control (§5.3, plus the reachable supporter page). */
const QUICK_EXIT_ROUTES = new Set([
  "/threshold",
  "/threshold/supporting-someone",
  "/situations/being-hurt",
]);

const THRESHOLD_ROUTES = new Set(["/threshold", "/threshold/supporting-someone"]);

/** N-263: how long a second Escape still counts as part of the same gesture. */
const DOUBLE_ESCAPE_MS = 900;

/**
 * The one navigation both exits go through — the visible control and the
 * keyboard gesture — so the two can never be fixed apart (C-6).
 */
function leaveThisPage() {
  try {
    window.location.replace("https://weather.com/");
  } catch {
    window.location.href = "https://weather.com/";
  }
}

function quickExit(e: React.MouseEvent<HTMLAnchorElement>) {
  // F2 (3.0): the control is a real <a href="https://weather.com/"> so it works
  // with JavaScript disabled. When JS is present, enhance the click to
  // location.replace() so the page does not sit in the back history as the top
  // entry (§5.3, the sole sanctioned page-initiated external navigation).
  e.preventDefault();
  leaveThisPage();
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const route = useRoute();
  const { edition, reduceFraming, theme, setEdition, setReduceFraming, setTheme, reset } =
    useGuide();

  const setDown = isSetDownRoute(route);
  const isThreshold = THRESHOLD_ROUTES.has(route);
  const showQuickExit = QUICK_EXIT_ROUTES.has(route);
  const showHelpNow = !isThreshold; // Threshold IS help-now; every other route links to it.
  const showPreferences = !setDown; // Set-down pages stay calm: no edition/theme chrome.
  // On set-down routes the header shows a quiet subset with no Play entry (§6.1);
  // a grief page does not invite anyone to play.
  const navItems = setDown ? SETDOWN_NAV : PRIMARY_NAV;

  // N-263 (§3.10, §5.3) — DOUBLE-ESCAPE AS A KEYBOARD QUICK EXIT.
  //
  // The reader who most needs the quick exit is often the one who cannot reach or
  // aim at a button, and whose screen is being read over their shoulder now. Two
  // Escape presses inside the window run the same navigation the visible control
  // runs. The route set is DERIVED from content/routes.ts (`setDown` above), never
  // hand-listed, so a route added to the set-down inventory gets the gesture with
  // it; the listener is attached only while the route is set-down and removed when
  // the route changes. With JavaScript off there is no key handler at all — the
  // visible anchor is the exit there, and the note below claims nothing more.
  useEffect(() => {
    if (!setDown) return;
    let lastEscape = 0;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const at = Date.now();
      if (lastEscape && at - lastEscape <= DOUBLE_ESCAPE_MS) {
        lastEscape = 0;
        leaveThisPage();
        return;
      }
      lastEscape = at;
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setDown, route]);

  const cycleTheme = useCallback(() => {
    const next = theme === "system" ? "light" : theme === "light" ? "dark" : "system";
    setTheme(next);
  }, [theme, setTheme]);

  const themeLabel = theme === "system" ? "Match system" : theme === "light" ? "Light" : "Dark";

  return (
    <div className="site-shell" data-setdown={setDown ? "1" : undefined}>
      <a className="skip-link" href="#main">
        Skip to the page
      </a>

      <header className="site-header" data-minimal={isThreshold ? "1" : undefined}>
        <Link className="brand" href="/" aria-label="The Guidebook to Life — home">
          <span className="brand-mark" aria-hidden="true">
            ✦
          </span>
          <span className="brand-text">
            <strong>The Guidebook</strong>
            <small>to Life</small>
          </span>
        </Link>

        {!isThreshold && (
          <nav className="primary-nav" aria-label="Primary">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={route === item.href ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="header-actions">
          {!isThreshold && (
            <details className="menu">
              <summary aria-label="Open the menu">Menu</summary>
              <nav className="menu-panel" aria-label="Sections">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </details>
          )}
          {showQuickExit && (
            <a
              className="quick-exit"
              href="https://weather.com/"
              rel="noopener noreferrer"
              onClick={quickExit}
            >
              Leave this page
            </a>
          )}
          {showHelpNow && (
            <Link className="help-now" href="/threshold">
              Help now
            </Link>
          )}
        </div>
      </header>

      {showPreferences && (
        <div className="preference-bar" aria-label="Reading preferences">
          <div className="segmented" role="group" aria-label="Edition">
            <span className="segmented-label">Edition</span>
            <button
              type="button"
              aria-pressed={edition === "standard"}
              onClick={() => setEdition("standard")}
            >
              Standard
            </button>
            <button
              type="button"
              aria-pressed={edition === "game"}
              onClick={() => setEdition("game")}
            >
              Game Guide
            </button>
          </div>
          <button
            type="button"
            className="toggle"
            aria-pressed={reduceFraming}
            onClick={() => setReduceFraming(!reduceFraming)}
          >
            {reduceFraming ? "Game framing is reduced" : "Reduce game framing"}
          </button>
          <button type="button" className="toggle theme-toggle" onClick={cycleTheme}>
            Theme: {themeLabel}
          </button>
        </div>
      )}

      {showQuickExit && (
        <p className="quick-exit-note" role="note">
          <strong>&ldquo;Leave this page&rdquo;</strong> jumps to a weather site immediately. It does
          not erase your browser history. Pressing Escape twice also leaves this page.{" "}
          <Link href="/threshold#privacy">If someone might see this screen.</Link>
        </p>
      )}

      <main id="main">{children}</main>

      <footer className="site-footer" data-minimal={isThreshold ? "1" : undefined}>
        {!isThreshold && (
          <>
            <div className="footer-primary">
              <p className="footer-line">The guide is a map, not a verdict.</p>
              {/* N-266 (§3.10): name what is stored AND what this site cannot see. The
                  second sentence is the honest half most privacy notes omit, and it is
                  what makes the first one believable. No count of keys, no figure. */}
              <p className="footer-note">
                No account, no analytics, no score. Anything you write stays in this browser, under
                keys the reset control clears. Visits to the help-now and safety pages are not
                recorded by this site. Your browser, device, network, or employer may still keep
                their own records.
              </p>
            </div>
            <div className="footer-links">
              <Link href="/methodology">How this works</Link>
              <Link href="/methodology#corrections">Corrections</Link>
              <Link href="/threshold">Help now</Link>
              <button type="button" className="link-button" onClick={reset}>
                Reset everything this site remembers
              </button>
            </div>
          </>
        )}
        {/* Publish pass (2026-09-04): the stamp names the version and says this is a
            preview behind human review gates; the gates are listed on /methodology. */}
        <p className="footer-version">
          TGTL 5.0 preview — The Timeline ·{" "}
          <Link href="/methodology#preview-status">what is still unreviewed</Link>
        </p>
      </footer>
    </div>
  );
}
