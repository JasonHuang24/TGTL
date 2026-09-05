"use client";

import { useEffect, useRef, useState } from "react";
import { useGuide } from "@/lib/guide-context";

/**
 * N-227 — ARM, THEN CONFIRM, for anything that erases.
 *
 * A single press that deletes everything is a mis-tap away from a loss the site
 * cannot undo, and the reader was never told what survives. Arm-then-confirm fixes
 * both in one control: the first press arms and says plainly what is about to go
 * and what is not, the second press inside a short window does it, and letting the
 * window pass disarms it with nothing lost.
 *
 * THE WORDING IS THE POINT. "This cannot be undone by the Guidebook" is the
 * precise, non-overclaiming form: the site cannot bring it back, and the site is
 * not claiming to know what else on the device might have a copy. And where a
 * branch is being deleted, what survives is stated — the run it came from, and any
 * sibling branches, are separate records and are not touched.
 *
 * `window` is deliberately not rendered: a countdown is a digit on a play surface
 * (S-2) and a clock is not what makes the second press deliberate.
 */
const ARM_WINDOW_MS = 6000;

/** The two sentences every armed control ends with. */
export const CANNOT_UNDO_LINE = "This cannot be undone by the Guidebook.";
export const SIBLING_BRANCH_LINE = "The parent or sibling branches remain separate.";

export function ArmedButton({
  label,
  armedLabel = "Press again to erase",
  consequence,
  onConfirm,
  className = "reset-button",
  wrapperClassName = "reset-control",
  noticeClassName = "reset-done",
}: {
  label: string;
  armedLabel?: string;
  /** What is about to go, and what survives. Shown only in the armed state. */
  consequence: string;
  onConfirm: () => void;
  className?: string;
  wrapperClassName?: string;
  noticeClassName?: string;
}) {
  const [armed, setArmed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  return (
    <span className={wrapperClassName}>
      <button
        type="button"
        className={className}
        data-sim-armed={armed ? "1" : "0"}
        aria-describedby={armed ? "armed-consequence" : undefined}
        onClick={() => {
          if (!armed) {
            setArmed(true);
            if (timer.current) clearTimeout(timer.current);
            timer.current = setTimeout(() => setArmed(false), ARM_WINDOW_MS);
            return;
          }
          if (timer.current) clearTimeout(timer.current);
          setArmed(false);
          onConfirm();
        }}
      >
        {armed ? armedLabel : label}
      </button>
      {armed ? (
        <span className={noticeClassName} id="armed-consequence" role="status" data-sim-armed-consequence>
          {consequence} {CANNOT_UNDO_LINE} Or leave it a moment and this goes back to how it was.
        </span>
      ) : null}
    </span>
  );
}

/**
 * "Reset everything this site remembers" (§8). Required on /methodology and
 * /character/logs. Clears all local state (edition, framing, theme, board,
 * logs, guidance, daily plan) and confirms in place. N-227: it arms first.
 */
export function ResetButton({ label = "Reset everything this site remembers" }: { label?: string }) {
  const { reset } = useGuide();
  const [done, setDone] = useState(false);
  return (
    <div className="reset-control">
      <ArmedButton
        label={label}
        consequence="This clears the reading preferences, the board, the logs, the decision guide and the daily plan on this device. Saved runs and branches are separate and are erased from the play screens, not here."
        onConfirm={() => {
          reset();
          setDone(true);
        }}
        wrapperClassName="reset-inline"
      />
      {done && (
        <span className="reset-done" role="status">
          Cleared. Nothing about you is stored on this device now.
        </span>
      )}
    </div>
  );
}
