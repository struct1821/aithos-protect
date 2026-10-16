import { useState, useEffect } from "react";
import { useDemo } from "@/lib/aithos-demo";
import {
  CheckCircle2,
  ShieldAlert,
  ChevronUp,
  ChevronDown,
  X,
  Cpu,
  ArrowRight,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

export function WorkflowStepsBottomBox() {
  const s = useDemo();
  const [minimized, setMinimized] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Auto-show and expand when an action starts or finishes
  useEffect(() => {
    if (s.stage >= 0 || s.downloaded || s.blocked) {
      setDismissed(false);
      setMinimized(false);
    }
  }, [s.stage, s.downloaded, s.blocked]);

  const active = s.scenario !== null && (s.stage >= 0 || s.downloaded || s.blocked);

  // If no action has started yet or dismissed, don't clutter the page
  if (!active || dismissed) {
    return null;
  }

  const isLeak = s.scenario === "leak";
  const isFlight = s.scenario === "flight";
  const isDone = s.downloaded || (s.stage === 5 && !s.working);

  // Dynamic step list based on scenario
  const steps = isLeak
    ? [
        {
          id: 1,
          name: "Prompt Interception",
          desc: "Detected request asking to share raw bank account number.",
          done: true,
          danger: true,
        },
        {
          id: 2,
          name: "On-Device Policy Evaluation",
          desc: "Identified privacy policy violation: credentials cannot leave the device.",
          done: true,
          danger: true,
        },
        {
          id: 3,
          name: "Transmission Blocked Locally",
          desc: "Request halted on-device. Zero network packets sent to cloud AI.",
          done: true,
          danger: true,
        },
      ]
    : isFlight
      ? [
          {
            id: 1,
            name: "Page & Form Scan",
            desc: "Identified flight booking buttons and traveler input fields.",
            done: s.stage >= 0,
          },
          {
            id: 2,
            name: "On-Device Masking",
            desc: "Passport & Card replaced with [PASSPORT] and [CARD] placeholders.",
            done: s.stage >= 1,
          },
          {
            id: 3,
            name: "Tokenized AI Reasoning",
            desc: "Cloud AI matched request to 'Confirm Booking' button without knowing identity.",
            done: s.stage >= 3,
          },
          {
            id: 4,
            name: "Intent & Safety Validation",
            desc: "On-device checks confirmed target, visibility, and booking authorization.",
            done: s.stage >= 4,
          },
          {
            id: 5,
            name: "Local Browser Execution",
            desc: "Browser safely clicked 'Confirm Booking'. Flight booked with 0 leaks.",
            done: isDone,
          },
        ]
      : [
          {
            id: 1,
            name: "DOM & Control Discovery",
            desc: "Scanned account details card and 'Download Statement' button.",
            done: s.stage >= 0,
          },
          {
            id: 2,
            name: "On-Device PII Redaction",
            desc: "Masked name, email, PAN, and account number with safe placeholder tokens.",
            done: s.stage >= 1,
          },
          {
            id: 3,
            name: "Split-Compute Cloud Reasoning",
            desc: "Cloud AI resolved 'Download Latest Statement' from safe tokens.",
            done: s.stage >= 3,
          },
          {
            id: 4,
            name: "On-Device Guardrail Verification",
            desc: "Verified action target, permissions, and zero credential exfiltration.",
            done: s.stage >= 4,
          },
          {
            id: 5,
            name: "Local Browser Execution",
            desc: "Statement PDF downloaded locally on your machine with 0 PII shared.",
            done: isDone,
          },
        ];

  // Minimized pill
  if (minimized) {
    return (
      <div className="fixed bottom-5 left-5 z-40 animate-rise">
        <button
          onClick={() => setMinimized(false)}
          className={cn(
            "flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold shadow-xl backdrop-blur-xl transition-all hover:scale-105",
            isLeak
              ? "border-destructive/40 bg-surface/95 text-destructive"
              : isDone
                ? "border-[var(--color-success)]/40 bg-surface/95 text-[var(--color-success)]"
                : "border-primary/40 bg-surface/95 text-primary",
          )}
        >
          {isLeak ? (
            <ShieldAlert className="size-3.5 text-destructive" />
          ) : isDone ? (
            <CheckCircle2 className="size-3.5 text-[var(--color-success)]" />
          ) : (
            <Cpu className="size-3.5 text-primary animate-pulse" />
          )}
          <span>
            {isLeak
              ? "Leak Blocked • 3 Steps Logged"
              : isDone
                ? "Action Done • 5 Steps Logged"
                : `Executing Steps (${s.stage + 1}/5)...`}
          </span>
          <ChevronUp className="size-3 opacity-70" />
        </button>
      </div>
    );
  }

  return (
    <aside
      aria-label="Steps Taken Dialog"
      className={cn(
        "fixed bottom-5 left-5 z-40 w-[350px] max-w-[calc(100vw-2.5rem)] rounded-2xl border bg-surface/95 p-4 shadow-2xl backdrop-blur-2xl animate-rise glow-border",
        isLeak
          ? "border-destructive/40 ring-1 ring-destructive/20"
          : isDone
            ? "border-[var(--color-success)]/40 ring-1 ring-[var(--color-success)]/20"
            : "border-primary/35",
      )}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border/70 pb-2.5">
        <div className="flex items-center gap-2">
          {isLeak ? (
            <span className="flex size-5.5 items-center justify-center rounded-lg bg-destructive/15 text-destructive">
              <ShieldAlert className="size-3.5" />
            </span>
          ) : isDone ? (
            <span className="flex size-5.5 items-center justify-center rounded-lg bg-[var(--color-success)]/15 text-[var(--color-success)]">
              <CheckCircle2 className="size-3.5" />
            </span>
          ) : (
            <span className="flex size-5.5 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Cpu className="size-3.5 animate-pulse" />
            </span>
          )}

          <div>
            <div className="text-xs font-bold tracking-wide text-foreground">
              {isLeak
                ? "Privacy Risk Intercepted"
                : isDone
                  ? "Action Completed Successfully"
                  : "Steps Taking Place..."}
            </div>
            <div className="text-[10px] text-muted-foreground">
              {isDone
                ? "5 on-device & split steps executed"
                : isLeak
                  ? "Zero data leaked to cloud"
                  : "Live execution trace"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setMinimized(true)}
            aria-label="Minimize steps dialogue"
            className="rounded p-1 text-[11px] text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
          >
            <ChevronDown className="size-3.5" />
          </button>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Close steps dialogue"
            className="rounded p-1 text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Steps Timeline */}
      <div className="mt-3 space-y-2.5">
        {steps.map((st, index) => {
          const isCurrent = !isDone && !isLeak && st.done && index === s.stage;
          return (
            <div key={st.id} className="flex items-start gap-2.5 text-xs">
              {/* Status bullet */}
              <div className="mt-0.5 shrink-0">
                {st.danger ? (
                  <span className="flex size-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold">
                    ✕
                  </span>
                ) : st.done ? (
                  <span className="flex size-4 items-center justify-center rounded-full bg-[var(--color-success)] text-background text-[9px] font-bold">
                    ✓
                  </span>
                ) : (
                  <span className="flex size-4 items-center justify-center rounded-full border border-muted-foreground/40 bg-surface-2 text-[9px] text-muted-foreground">
                    {st.id}
                  </span>
                )}
              </div>

              {/* Step info */}
              <div className="flex-1 min-w-0">
                <div
                  className={cn(
                    "font-medium leading-tight",
                    st.danger
                      ? "text-destructive font-semibold"
                      : st.done
                        ? "text-foreground"
                        : "text-muted-foreground",
                  )}
                >
                  {st.name}
                  {isCurrent && (
                    <span className="ml-1.5 inline-block text-[10px] text-primary font-normal animate-pulse">
                      (processing)
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-[11px] text-muted-foreground leading-snug">
                  {st.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Audit Summary */}
      <div className="mt-3.5 flex items-center justify-between border-t border-border/60 pt-2.5 text-[11px]">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Lock className="size-3 text-primary" />
          <span>Raw PII shared:</span>
          <span className="font-bold text-foreground">0 bytes</span>
        </div>

        <Link
          to="/console"
          className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
        >
          <span>Audit Log</span>
          <ArrowRight className="size-3" />
        </Link>
      </div>
    </aside>
  );
}
