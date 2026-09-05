import type { Metadata } from "next";
import { RedirectStub } from "@/components/RedirectStub";

export const metadata: Metadata = {
  title: "Moved to the walkthrough",
  description: "Orientation now lives in the walkthrough and the in-run briefing.",
};

/** Sanctioned redirect stub (§6.1): /orientation → /walkthrough. */
export default function OrientationStub() {
  return <RedirectStub to="/walkthrough" toLabel="the walkthrough" />;
}
