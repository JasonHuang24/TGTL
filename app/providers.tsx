"use client";

import { GuideProvider } from "@/lib/guide-context";
import { SiteChrome } from "@/components/SiteChrome";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GuideProvider>
      <SiteChrome>{children}</SiteChrome>
    </GuideProvider>
  );
}
