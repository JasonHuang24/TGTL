import type { Metadata } from "next";
import Link from "next/link";
import { CampaignApp } from "@/components/sim/CampaignApp";

import { CAMPAIGN_CONTENT_NOTE } from "@/content/sim/methodology-copy";
export const metadata: Metadata = {
  title: "Launch Window — United States · 2025",
  description:
    "Twelve years of a life in twenty-four six-month seasons: a real season budget, an open action menu, other people with their own decisions, and consequences that arrive seasons after you set them going. A model, not a prediction.",
};

/**
 * *Launch Window — United States · 2025* (blueprint 4.0 §3.3). The campaign needs
 * JavaScript by nature, so the exported HTML carries a static floor explaining what
 * it is and linking to the reading layer, hidden by CSS once the client hydrates.
 */
export default function CampaignPage() {
  return (
    <div className="sim-play-page">
      <noscript>
        <style>{`:root .sim-campaign{display:none!important}`}</style>
      </noscript>

      <div className="sim-play-nojs-floor">
        <div className="prose-page">
          <p className="eyebrow">The Playthrough · the long one</p>
          <h1>Launch Window — United States, 2025</h1>
          <p className="lede">
            Ages eighteen to thirty, in twenty-four six-month seasons. You direct a life under a real budget while
            life also happens to you.
          </p>
          <p>
            Each season you read where things stand, decide what you are aiming at, spend a limited budget of
            time, energy and money across an open menu of things you could do, and then watch your choices resolve
            alongside whatever arrived on its own. Some consequences land years later, and you can see them coming.
          </p>
          <p>
            It is fictional and replayable — a model of a set of tradeoffs, not a census-average life and not a
            forecast of yours. It needs JavaScript to play. Without it, the reading layer is fully open:{" "}
            <Link href="/walkthrough">learn the game</Link>, <Link href="/map/launch">the launch years</Link>,{" "}
            <Link href="/methodology">how the engine works</Link>, or <Link href="/triage">something happened</Link>.
          </p>
          <p className="nojs-content-note">Everything stays on this device. {CAMPAIGN_CONTENT_NOTE}</p>
        </div>
      </div>

      <CampaignApp />
    </div>
  );
}
