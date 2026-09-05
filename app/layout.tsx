import type { Metadata } from "next";
import "./globals.css";
import "./sim.css";
import "./sim-instruments.css";
import "./sim-surfaces.css";
import "./timeline.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "The Guidebook to Life",
    template: "%s · The Guidebook to Life",
  },
  description:
    "A guidebook for understanding the life you are living, locating yourself within it, and seeing the strongest available moves for your own goals — in plain language or strategy-guide language, whichever helps.",
  applicationName: "The Guidebook to Life",
  // Publish pass (2026-09-04): this is a labelled preview behind human review
  // gates, so it asks not to be indexed. Remove when the owner closes the gates.
  robots: { index: false, follow: false },
};

/**
 * Runs before first paint to apply the reader's stored edition/theme/framing,
 * avoiding a flash of the default look. Inline only — no external request
 * (§11.1). Wrapped in try/catch so storage being unavailable never breaks the
 * page (G-11).
 */
const NO_FLASH = `(function(){try{var d=document.documentElement,g=function(k){try{return localStorage.getItem(k)}catch(e){return null}};var e=g('tgtl:edition');d.dataset.edition=(e==='game')?'game':'standard';var t=g('tgtl:theme');if(t==='light'||t==='dark')d.dataset.theme=t;d.dataset.reduceFraming=(g('tgtl:reduce-framing')==='1')?'1':'0';}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-edition="standard" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
