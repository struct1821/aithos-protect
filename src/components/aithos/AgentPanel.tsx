import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Gauge,
  MousePointerClick,
  RotateCcw,
  ScanLine,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useRef } from "react";
import {
  COMMANDS,
  SENSITIVE_FIELDS,
  STAGES,
  STEP_LABELS,
  demo,
  useDemo,
} from "@/lib/aithos-demo";
import { cn } from "@/lib/utils";

function StageHeader({ title, done }: { title: string; done: boolean }) {
  return (
    <div className="flex items-center gap-2.5 text-sm">
      <span
        className={cn(
          "size-2 rounded-full",
          done ? "bg-[var(--color-success)]" : "animate-pulse bg-primary",
        )}
      />
      <span className={done ? "text-muted-foreground" : "text-foreground"}>{title}</span>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("animate-rise rounded-xl border border-border bg-surface/70 p-4", className)}>
      {children}
    </div>
  );
}

export function AgentPanel() {
  const s = useDemo();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [s.stage, s.working, s.downloaded]);

  if (!s.panelOpen) return null;
  const progressIdx = s.stage >= 0 ? STAGES[s.stage]!.progress : -1;

  return (
    <div className="fixed right-6 bottom-24 z-50 flex max-h-[78vh] w-[min(28rem,calc(100vw-3rem))] flex-col overflow-hidden rounded-2xl glass shadow-2xl glow-border animate-rise">
      {/* header */}
      <div className="flex items-center justify-between border-b border-border bg-background/60 px-5 py-4">
        <div>
          <div className="font-display text-lg font-semibold tracking-[0.16em]">AITHOS</div>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-primary">
            <span className="size-1.5 animate-pulse rounded-full bg-primary" />
            Privacy Protection Active
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Link
            to="/console"
            className="rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            Console
          </Link>
          <button
            onClick={demo.closePanel}
            aria-label="Close AITHOS panel"
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* progress rail */}
      {s.stage >= 0 && (
        <div className="flex gap-1.5 border-b border-border px-5 py-3">
          {STEP_LABELS.map((st, i) => (
            <div key={st.id} className="flex-1">
              <div
                className={cn(
                  "h-1 rounded-full transition-colors duration-500",
                  i < progressIdx
                    ? "bg-primary/60"
                    : i === progressIdx
                      ? "bg-primary"
                      : "bg-surface-2",
                )}
              />
              <div
                className={cn(
                  "mt-1.5 font-mono text-[10px] tracking-wide transition-colors",
                  i <= progressIdx ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {st.id} {st.name}
              </div>
            </div>
          ))}
        </div>
      )}

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {s.stage < 0 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              What would you like me to do?
            </p>
            <div className="space-y-2">
              <button
                onClick={() => demo.start("statement")}
                className="group flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-surface/70 px-4 py-3 text-left text-sm transition-all hover:border-primary/40 hover:bg-surface-2"
              >
                <span>{COMMANDS.statement}</span>
                <Send className="size-4 text-primary opacity-60 transition-opacity group-hover:opacity-100" />
              </button>
              <button
                onClick={() => demo.start("leak")}
                className="group flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-surface/70 px-4 py-3 text-left text-sm transition-all hover:border-[color-mix(in_oklab,var(--destructive)_50%,transparent)] hover:bg-surface-2"
              >
                <span>{COMMANDS.leak}</span>
                <ShieldAlert className="size-4 text-[var(--color-destructive)] opacity-70 transition-opacity group-hover:opacity-100" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Pick a suggested command to run the demonstration.
            </p>
          </div>
        )}

        {/* BLOCKED SCENARIO */}
        {s.scenario === "leak" && s.stage >= 0 && (
          <>
            <Card>
              <StageHeader title="Understanding your request..." done={s.stage > 0 || !s.working} />
              {(s.stage > 0 || !s.working) && (
                <div className="mt-3 space-y-1">
                  <Row label="User intent" value={COMMANDS.leak} />
                  <div className="flex items-center gap-2 pt-1 text-sm text-[var(--color-success)]">
                    <Check className="size-4" /> Request understood
                  </div>
                </div>
              )}
            </Card>
            {s.stage >= 1 && (
              <Card className="border-[color-mix(in_oklab,var(--destructive)_35%,transparent)]">
                <StageHeader title="Checking privacy policy..." done={!s.working} />
                {!s.working && (
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center gap-2 text-base font-semibold text-[var(--color-destructive)]">
                      <ShieldAlert className="size-5" /> Privacy Risk Detected
                    </div>
                    <div className="rounded-lg border border-[color-mix(in_oklab,var(--destructive)_35%,transparent)] bg-[color-mix(in_oklab,var(--destructive)_10%,transparent)] p-3">
                      <div className="text-xs text-muted-foreground">Account Number</div>
                      <div className="mt-1 font-mono text-lg line-through decoration-[var(--color-destructive)] decoration-2">
                        123456789012
                      </div>
                    </div>
                    <div className="rounded-lg bg-surface-2 p-3 text-sm">
                      <div className="font-semibold text-[var(--color-destructive)]">
                        Blocked by AITHOS Privacy Policy
                      </div>
                      <div className="mt-1 text-muted-foreground">
                        Your sensitive information was not shared.
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            )}
          </>
        )}

        {/* MAIN SCENARIO */}
        {s.scenario === "statement" && s.stage >= 0 && (
          <>
            <Card>
              <StageHeader title={STAGES[0]!.title} done={s.stage > 0 || !s.working} />
              {(s.stage > 0 || !s.working) && (
                <div className="mt-3 space-y-1">
                  <Row label="User intent" value={COMMANDS.statement} />
                  <div className="flex items-center gap-2 pt-1 text-sm text-[var(--color-success)]">
                    <Check className="size-4" /> Request understood
                  </div>
                </div>
              )}
            </Card>

            {s.stage >= 1 && (
              <Card>
                <StageHeader title={STAGES[1]!.title} done={s.stage > 1 || !s.working} />
                <div className="relative mt-3 overflow-hidden rounded-lg bg-background/60 p-3">
                  {s.stage === 1 && s.working && (
                    <span className="pointer-events-none absolute inset-x-0 top-0 h-8 animate-scan bg-gradient-to-b from-transparent via-primary/25 to-transparent" />
                  )}
                  <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <ScanLine className="size-3.5 text-primary" /> Sensitive information detected
                  </div>
                  <ul className="space-y-1.5">
                    {SENSITIVE_FIELDS.map((f, i) => (
                      <li
                        key={f.key}
                        className="animate-rise flex items-center gap-2 text-sm"
                        style={{ animationDelay: `${i * 140}ms` }}
                      >
                        <Check className="size-4 text-[var(--color-success)]" />
                        {f.label}
                      </li>
                    ))}
                  </ul>
                </div>
                {(s.stage > 1 || !s.working) && (
                  <div className="mt-3 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
                    5 sensitive items protected
                  </div>
                )}
              </Card>
            )}

            {s.stage >= 2 && (
              <Card>
                <StageHeader title={STAGES[2]!.title} done={s.stage > 2 || !s.working} />
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border bg-background/50 p-3">
                    <div className="mb-2 font-mono text-[10px] tracking-widest text-muted-foreground">
                      BEFORE
                    </div>
                    <div className="space-y-1 font-mono text-[11px] text-muted-foreground">
                      {SENSITIVE_FIELDS.map((f) => (
                        <div key={f.key} className="truncate">
                          {f.raw}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-primary/30 bg-primary/8 p-3">
                    <div className="mb-2 font-mono text-[10px] tracking-widest text-primary">
                      AFTER
                    </div>
                    <div className="space-y-1 font-mono text-[11px] text-primary">
                      {SENSITIVE_FIELDS.map((f, i) => (
                        <div
                          key={f.key}
                          className="animate-rise truncate"
                          style={{ animationDelay: `${i * 120}ms` }}
                        >
                          {f.token}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-foreground">Sensitive information stays protected.</p>
                {(s.stage > 2 || !s.working) && (
                  <div className="mt-3 flex items-center justify-between rounded-lg bg-surface-2 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">Raw personal information shared</span>
                    <span className="font-display text-3xl font-bold text-primary">0</span>
                  </div>
                )}
              </Card>
            )}

            {s.stage >= 3 && (
              <Card>
                <StageHeader title={STAGES[3]!.title} done={s.stage > 3 || !s.working} />
                {(s.stage > 3 || !s.working) && (
                  <div className="mt-3 space-y-1">
                    <Row label="User request" value={COMMANDS.statement} />
                    <Row label="Available page action" value="Download Latest Statement" />
                    <div className="mt-2 flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 font-mono text-xs text-primary">
                      <MousePointerClick className="size-4" />
                      → CLICK "Download Latest Statement"
                    </div>
                    <div className="flex items-center gap-2 pt-1 text-sm text-[var(--color-success)]">
                      <Check className="size-4" /> Action understood
                    </div>
                  </div>
                )}
              </Card>
            )}

            {s.stage >= 4 && (
              <Card>
                <StageHeader title={STAGES[4]!.title} done={s.stage > 4 || !s.working} />
                <ul className="mt-3 space-y-1.5">
                  {[
                    "Action matches user intent",
                    "Target exists on webpage",
                    "Target is visible",
                    "Action is permitted",
                  ].map((c, i) => (
                    <li
                      key={c}
                      className="animate-rise flex items-center gap-2 text-sm"
                      style={{ animationDelay: `${i * 140}ms` }}
                    >
                      <Check className="size-4 text-[var(--color-success)]" /> {c}
                    </li>
                  ))}
                </ul>
                {(s.stage > 4 || !s.working) && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-[color-mix(in_oklab,var(--success)_14%,transparent)] px-3 py-2 text-sm font-semibold text-[var(--color-success)]">
                    <ShieldCheck className="size-4" /> Action Approved
                  </div>
                )}
              </Card>
            )}

            {s.stage >= 5 && (
              <Card>
                <StageHeader title={STAGES[5]!.title} done={s.downloaded} />
                {s.downloaded ? (
                  <div className="mt-4 flex flex-col items-center gap-2 py-4">
                    <span className="relative flex size-14 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--success)_16%,transparent)]">
                      <span className="absolute inset-0 animate-pulse-ring rounded-full bg-[color-mix(in_oklab,var(--success)_25%,transparent)]" />
                      <CheckCircle2 className="size-8 text-[var(--color-success)]" />
                    </span>
                    <div className="font-display text-lg font-semibold">Statement Downloaded</div>
                    <Link
                      to="/console"
                      className="mt-1 inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                    >
                      <Gauge className="size-3.5" /> View Privacy Console
                    </Link>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Clicking "Download Latest Statement" on the page...
                  </p>
                )}
              </Card>
            )}
          </>
        )}
      </div>

      {/* controls */}
      {s.stage >= 0 && (
        <div className="flex items-center justify-between gap-2 border-t border-border bg-background/60 px-5 py-3">
          <button
            onClick={demo.back}
            disabled={s.stage <= 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs transition-colors hover:bg-surface-2 disabled:opacity-35"
          >
            <ArrowLeft className="size-3.5" /> Back
          </button>
          <button
            onClick={demo.restart}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="size-3.5" /> Restart Demo
          </button>
          <button
            onClick={demo.next}
            disabled={s.blocked || s.stage >= 5 || s.working}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-35"
          >
            Next <ArrowRight className="size-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

export function AgentLauncher() {
  const s = useDemo();
  return (
    <button
      onClick={demo.togglePanel}
      className="group fixed right-6 bottom-6 z-50 inline-flex items-center gap-2.5 rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--glow-strong)] transition-transform hover:scale-[1.03]"
    >
      <span className="relative flex size-2.5">
        <span className="absolute inline-flex size-full animate-pulse-ring rounded-full bg-primary-foreground/60" />
        <span className="relative inline-flex size-2.5 rounded-full bg-primary-foreground" />
      </span>
      <Sparkles className="size-4" />
      AITHOS Agent
      {s.panelOpen && <X className="size-4 opacity-70" />}
    </button>
  );
}
