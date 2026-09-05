"use client";

import { useState } from "react";
import { useGuide } from "@/lib/guide-context";

/**
 * "Reset everything this site remembers" (§8). Required on /methodology and
 * /character/logs. Clears all local state (edition, framing, theme, board,
 * logs, guidance, daily plan) and confirms in place.
 */
export function ResetButton({ label = "Reset everything this site remembers" }: { label?: string }) {
  const { reset } = useGuide();
  const [done, setDone] = useState(false);
  return (
    <div className="reset-control">
      <button
        type="button"
        className="reset-button"
        onClick={() => {
          reset();
          setDone(true);
        }}
      >
        {label}
      </button>
      {done && (
        <span className="reset-done" role="status">
          Cleared. Nothing about you is stored on this device now.
        </span>
      )}
    </div>
  );
}
