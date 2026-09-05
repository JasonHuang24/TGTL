import type { Metadata } from "next";
import { RedirectStub } from "@/components/RedirectStub";

export const metadata: Metadata = {
  title: "Moved to the world map",
  description: "The roadmap is now the world map.",
};

/** Sanctioned redirect stub (§6.1): /roadmap → /map. */
export default function RoadmapStub() {
  return <RedirectStub to="/map" toLabel="the world map" />;
}
