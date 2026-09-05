import type { Metadata } from "next";
import Link from "next/link";
import { InstrumentPage, PageHeader, Callout, NextSteps, NextStep } from "@/components/primitives";
import { Logs } from "@/components/Logs";
import { ResetButton } from "@/components/ResetButton";

export const metadata: Metadata = {
  title: "Decision record and upkeep list",
  description:
    "Record what you knew before an outcome arrives, and keep sight of the recurring upkeep you're not doing — no counts, no streaks, kept on this device.",
};

/**
 * Decision log + maintenance ledger (§6.6). Donor: Opus 5 dossier tools.
 * Local-only, no counts/streaks/completion. Reset control (§8). Cross-links with
 * the daily plan (integration minimum, §6.5).
 */
export default function LogsPage() {
  return (
    <InstrumentPage>
      <PageHeader
        eyebrow="Records · kept on this device only"
        title="Two records worth keeping"
        intro="Both of these are private to this browser, and neither is a scoreboard. One helps you tell a bad decision from a bad draw, later. The other keeps the quiet upkeep you're not doing from arriving all at once, as a surprise."
      />

      <section className="prose-in-instrument">
        <h2>The decision record</h2>
        <p>
          Write down, before the outcome arrives, what you knew, what you couldn&rsquo;t know, and what
          you expected. This matters because memory reconstructs your reasoning to fit the result: the
          person whose choice worked remembers being confident, and the person whose choice failed
          remembers the doubts they overrode — and both reconstructions feel exactly like recollection.
          A record written in advance is the only instrument that defeats that, and later it answers the
          one question that matters: was this a bad decision, or a bad draw? That difference is the whole
          gap between learning from experience and being trained by luck.
        </p>
      </section>

      <section className="prose-in-instrument">
        <h2>The upkeep list</h2>
        <p>
          This is a list of the recurring upkeep you are currently <em>not</em> doing. It is deliberately
          not a to-do list, and the point is not to clear it; the point is to know what is on it. Deferred
          maintenance is the most common invisible debt, and it does not arrive as a bill — it arrives as
          a cascade, several things failing in the same month, read from the inside as bad luck when it is
          really one structure completing. A named deferral is a debt with a number on it; an unnamed one
          is an ambush.
        </p>
        <Callout tone="quiet">
          <p>
            This tool does not nag, because deferral is usually not a mistake — if there had been the
            capacity, the deferral would not have started. Telling someone with no capacity to do their
            maintenance is describing their life as a failure of foresight when it is arithmetic. So nothing
            here is counted or ranked; the only sorting that matters is which items are cuttable and which
            are quietly accruing.
          </p>
        </Callout>
      </section>

      <Logs />

      <Callout tone="quiet" title="Where this leads">
        <p>
          A plan is where a list gets a day. When an upkeep item is finally going to be done, it becomes a
          line in a <Link href="/guidance/daily-plan">worked daily plan</Link> — the maintenance lane there holds
          exactly the kind of thing this list holds. And an honest note: local-only storage means these
          records frequently will not survive the years over which they would be most useful — a new
          device, a cleared cache. That is the correct trade for privacy, and it does undercut the tool.
        </p>
      </Callout>

      <div className="logs-reset">
        <ResetButton />
      </div>

      <NextSteps>
        <NextStep href="/guidance/daily-plan">A worked daily plan — where the upkeep gets a day.</NextStep>
        <NextStep href="/character/board">The board — lay out the whole situation first.</NextStep>
      </NextSteps>
    </InstrumentPage>
  );
}
