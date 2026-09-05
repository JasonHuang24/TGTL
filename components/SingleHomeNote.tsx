import Link from "next/link";

/**
 * N-321 (6.0 §3.12, C-33) — THE SINGLE-HOME RULE, SAID TO THE READER.
 *
 * The site already runs on the rule: four guides own the core mechanisms and
 * everything else links to them rather than re-explaining. Until now that was
 * stated once, on the topics index, as a description of how the site was built.
 * Said on every topic route, as an invariant a reader can report a breach of, it
 * becomes the only kind of maintenance that scales — and a quiet promise that
 * nothing here is padding.
 *
 * It is a server component with a plain link in it, so it is present with
 * JavaScript off. C-33 asserts it renders on every `/topics/*` route and is
 * proven red by removing it from one.
 */
export function SingleHomeNote() {
  return (
    <p className="single-home-note" data-single-home>
      <strong>One home per idea.</strong> Every mechanism on this site is explained in exactly one
      place, and everything else links to it. If you find an explanation here that exists nowhere else
      on the site, that is a bug —{" "}
      <Link href="/methodology#corrections">tell us on the corrections page</Link>.
    </p>
  );
}
