import { useState } from "react";
import {
  useWorkflowGuide,
  workflowGuide,
  getCurrentSteps,
  type GuideScenario,
} from "@/lib/workflow-guide";
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  Play,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

export function WorkflowGuideBar() {
  const guide = useWorkflowGuide();
  const [collapsed, setCollapsed] = useState(false);
  const steps = getCurrentSteps(guide.scenario);
  const currentStep = steps[guide.stepIndex];

  if (!guide.active) {
    return (
      <div className="fixed top-3 right-6 z-50">
        <button
          onClick={() => workflowGuide.setActive(true)}
          className="group flex items-center gap-2 rounded-full border border-primary/40 bg-surface/90 px-4 py-2 text-xs font-semibold text-primary shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-primary hover:text-primary-foreground"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          <Sparkles className="size-3.5" />
          <span>Show Workflow Guide</span>
        </button>
      </div>
    );
  }

  return (
    <aside
      aria-label="Interactive Workflow Guide"
      className="fixed top-3 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-auto sm:max-w-2xl max-w-full rounded-2xl border border-primary/35 bg-surface/95 shadow-2xl backdrop-blur-2xl transition-all duration-300 glow-border"
    >
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b border-border/70 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="flex size-6 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Sparkles className="size-3.5 animate-pulse" />
          </span>
          <span className="font-display font-semibold tracking-wide text-foreground">
            Workflow Guide
          </span>
          <span className="hidden sm:inline-flex rounded-full bg-primary/12 px-2 py-0.5 text-[10px] font-medium text-primary">
            Highlighting Active
          </span>
        </div>

        {/* Scenario Switcher */}
        <div className="flex items-center gap-1 rounded-xl bg-background/60 p-0.5 border border-border/80">
          {(
            [
              { id: "banking", label: "Bank Demo", href: "/bank" },
              { id: "flight", label: "Flight Demo", href: "/travel" },
              { id: "leak", label: "Leak Test", href: "/bank" },
            ] as const
          ).map((sc) => (
            <Link
              key={sc.id}
              to={sc.href}
              onClick={() => workflowGuide.setScenario(sc.id)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors",
                guide.scenario === sc.id
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {sc.label}
            </Link>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand guide details" : "Collapse guide details"}
            className="flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-[11px] text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
          >
            {collapsed ? (
              <>
                <span>Expand</span>
                <ChevronDown className="size-3" />
              </>
            ) : (
              <>
                <span>Minimize</span>
                <ChevronUp className="size-3" />
              </>
            )}
          </button>
          <button
            onClick={() => workflowGuide.setActive(false)}
            aria-label="Hide workflow guide"
            className="rounded-lg border border-border px-2 py-1 text-[11px] text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Main Instruction & Explanation Card */}
      {!collapsed && currentStep && (
        <div className="p-4 sm:p-5 space-y-3.5 animate-rise">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] tracking-wider text-primary font-bold uppercase">
                  Step {guide.stepIndex + 1} of {steps.length}
                </span>
                <span className="text-muted-foreground text-xs">•</span>
                <h3 className="font-display font-semibold text-foreground text-sm">
                  {currentStep.title}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {currentStep.subtitle}
              </p>
            </div>

            {/* Step navigation dots */}
            <div className="flex items-center gap-1.5">
              {steps.map((st, i) => (
                <button
                  key={st.id}
                  onClick={() => workflowGuide.goToStep(i)}
                  aria-label={`Go to step ${i + 1}: ${st.title}`}
                  className={cn(
                    "size-2 rounded-full transition-all duration-300",
                    i === guide.stepIndex
                      ? "w-5 bg-primary"
                      : i < guide.stepIndex
                        ? "bg-primary/50"
                        : "bg-surface-2 hover:bg-muted-foreground",
                  )}
                />
              ))}
            </div>
          </div>

          {/* The Two Essential Explanation Boxes */}
          <div className="grid gap-3 sm:grid-cols-2">
            {/* Box 1: What to do */}
            <div className="rounded-xl border border-primary/30 bg-primary/8 p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-primary uppercase">
                <span className="flex size-4.5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-mono">
                  1
                </span>
                What to do
              </div>
              <p className="text-xs font-medium leading-relaxed text-foreground">
                {currentStep.whatToDo}
              </p>
            </div>

            {/* Box 2: What happens after doing that */}
            <div className="rounded-xl border border-[color-mix(in_oklab,var(--success)_35%,transparent)] bg-[color-mix(in_oklab,var(--success)_10%,transparent)] p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-[var(--color-success)] uppercase">
                <span className="flex size-4.5 items-center justify-center rounded-full bg-[var(--color-success)] text-background text-[10px] font-mono">
                  2
                </span>
                What happens after doing that
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {currentStep.whatHappensAfter}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/50 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={workflowGuide.prevStep}
                disabled={guide.stepIndex === 0}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-surface-2 hover:text-foreground disabled:opacity-30 transition-colors"
              >
                <ArrowLeft className="size-3.5" /> Previous
              </button>
              <button
                onClick={workflowGuide.nextStep}
                disabled={guide.stepIndex === steps.length - 1}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-surface-2 hover:text-foreground disabled:opacity-30 transition-colors"
              >
                Next <ArrowRight className="size-3.5" />
              </button>
            </div>

            {currentStep.action && (
              <button
                onClick={currentStep.action}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-1.5 font-semibold text-primary-foreground shadow-[var(--glow-soft)] hover:opacity-90 transition-all hover:scale-[1.02]"
              >
                <Play className="size-3.5 fill-current" />
                <span>{currentStep.actionLabel || "Try This Step"}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
