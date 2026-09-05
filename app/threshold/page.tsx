import type { Metadata } from "next";
import Link from "next/link";
import { HOTLINE_GROUPS, HOTLINE_LAST_VERIFIED } from "@/content/hotlines";
import { HotlineList } from "@/components/HotlineList";

export const metadata: Metadata = {
  title: "If you need help now",
  description: "Phone numbers, and nothing else. No framework, no analysis, nothing to read first.",
};

/**
 * The Threshold (blueprint §5.1). Adapted closely from Opus 5's threshold/index.
 * No game vocabulary, no nav noise, minimal chrome; loads fast; works at 320px
 * and with JS disabled (pure static prose + tel: links). Every number renders
 * from the hotline fixture with a lastVerified date; the owner closed the
 * verification gate on 2026-09-04 (§5.1, §15.2), and the date below is read from
 * the fixture so the two can never disagree.
 */
export default function ThresholdPage() {
  return (
    <article className="threshold prose-page is-setdown">
      <h1>If you need help now</h1>
      <p className="threshold-lede">
        This page has phone numbers on it and nothing else. There is no framework here, no analysis,
        and nothing to read first.
      </p>

      {HOTLINE_GROUPS.map((group) => (
        <section key={group.id} className="hotline-group" aria-labelledby={`h-${group.id}`}>
          <h2 id={`h-${group.id}`}>{group.heading}</h2>
          {group.intro && <p className="hotline-intro">{group.intro}</p>}
          <HotlineList hotlines={group.hotlines} />
          {group.closing && <p className="hotline-closing">{group.closing}</p>}
        </section>
      ))}

      <section className="hotline-group" id="privacy" aria-labelledby="h-privacy">
        <h2 id="h-privacy">If someone might see this screen</h2>
        <ul className="privacy-list">
          <li>Use a private or incognito window, or a device that is not yours.</li>
          <li>
            Most domestic-abuse services have a page about covering your tracks online. It is worth
            ten minutes and it is more thorough than anything we would write here.
          </li>
          <li>Phone calls appear on bills. Text and web chat frequently do not.</li>
        </ul>
      </section>

      <p className="threshold-verify">
        These numbers are correct to the best of our knowledge, last checked {HOTLINE_LAST_VERIFIED}, and
        services change. If one does not connect,{" "}
        <a href="https://findahelpline.com/" rel="noopener noreferrer">
          findahelpline.com
        </a>{" "}
        is maintained and verified continuously, which this page is not.
      </p>

      <p className="threshold-footer-links">
        <Link href="/threshold/supporting-someone">If you are trying to help someone else</Link> ·{" "}
        <Link href="/">back to the rest of the site</Link>
      </p>
    </article>
  );
}
