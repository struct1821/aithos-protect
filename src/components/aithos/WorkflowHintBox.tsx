import { useState } from "react";
import {
  useWorkflowGuide,
  workflowGuide,
  getCurrentSteps,
} from "@/lib/workflow-guide";
import {
  Lightbulb,
  X,
  ChevronRight,
  ChevronLeft,
  Play,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

export function WorkflowHintBox() {
  const guide = useWorkflowGuide();
  const [minimized, setMinimized] = useState(false);
  const [showNextInsight, setShowNextInsight] = useState(true);
  const steps = getCurrentSteps(guide.scenario);
  const currentStep = steps[guide.stepIndex];

  if (!guide.active) {
    return (
      <div className="fixed top-20 right-6 z-40">
        <button
          onClick={() => workflowGuide.setActive(true)}
          className="group flex items-center gap-2 rounded-full border border-primary/30 bg-surface/90 px-3.5 py-1.5 text-xs font-medium text-primary shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-primary hover:text-primary-foreground"
        >
          <Lightbulb className="size-3.5" />
          <span>Show Hints</span>
        </button>
      </div>
    );
  }

  if (minimized) {
    return (
      <div className="fixed top-20 right-6 z-40 animate-rise">
        <button
          onClick={() => setMinimized(false)}
          className="flex items-center gap-2 rounded-full border border-primary/40 bg-surface/95 px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-xl backdrop-blur-xl transition-all hover:border-primary hover:scale-105"
        >
          <span className="flex size-2 rounded-full bg-primary animate-ping" />
          <Lightbulb className="size-3.5 text-primary" />
          <span>Hint: {currentStep?.title || "Next Step"}</span>
        </button>
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-label="Workflow Hint"
      className="fixed top-20 right-6 z-40 w-[340px] max-w-[calc(100vw-2rem)] rounded-2xl border border-primary/30 bg-surface/95 p-4 shadow-2xl backdrop-blur-xl animate-rise"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border/70 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="flex size-5 items-center justify-center rounded-md bg-primary/15 text-primary">
            <Lightbulb className="size-3.5" />
          </span>
          <span className="text-xs font-bold tracking-wide text-foreground uppercase">
            Hint • Step {guide.stepIndex + 1}/{steps.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setMinimized(true)}
            aria-label="Minimize hint"
            className="rounded p-1 text-[11px] text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
          >
            Minimize
          </button>
          <button
            onClick={() => workflowGuide.setActive(false)}
            aria-label="Close hints"
            className="rounded p-1 text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Scenario Switcher */}
      <div className="mt-2.5 flex items-center justify-between gap-1 text-[11px]">
        {(
          [
            { id: "banking", label: "Bank", href: "/bank" },
            { id: "flight", label: "Flight", href: "/travel" },
            { id: "leak", label: "Leak Test", href: "/bank" },
          ] as const
        ).map((sc) => (
          <Link
            key={sc.id}
            to={sc.href}
            onClick={() => workflowGuide.setScenario(sc.id)}
            className={cn(
              "flex-1 text-center rounded-md py-1 transition-colors",
              guide.scenario === sc.id
                ? "bg-primary/20 text-primary font-semibold border border-primary/30"
                : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
            )}
          >
            {sc.label}
          </Link>
        ))}
      </div>

      {/* Step details */}
      <div className="mt-3 space-y-2">
        <div className="text-xs font-semibold text-foreground">
          {currentStep?.title}
        </div>

        {/* What to do block */}
        <div className="rounded-xl bg-surface-2/70 p-2.5 border border-border/70">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-wider">
            <span className="flex size-3.5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[8px] font-mono">
              1
            </span>
            <span>What to do</span>
          </div>
          <p className="mt-1 text-xs text-foreground font-medium leading-relaxed">
            {currentStep?.whatToDo}
          </p>
        </div>

        {/* What happens next */}
        {currentStep?.whatHappensAfter && (
          <div className="rounded-xl bg-[color-mix(in_oklab,var(--success)_8%,transparent)] p-2.5 border border-[color-mix(in_oklab,var(--success)_25%,transparent)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--color-success)] uppercase tracking-wider">
                <span className="flex size-3.5 items-center justify-center rounded-full bg-[var(--color-success)] text-background text-[8px] font-mono">
                  2
                </span>
                <span>Privacy & System Result</span>
              </div>
              <button
                type="button"
                onClick={() => setShowNextInsight(!showNextInsight)}
                className="text-[10px] text-muted-foreground hover:text-foreground"
              >
                {showNextInsight ? "Hide" : "Show"}
              </button>
            </div>
            {showNextInsight && (
              <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed animate-rise">
                {currentStep.whatHappensAfter}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-3.5 flex items-center justify-between border-t border-border/60 pt-2.5 text-xs">
        <div className="flex items-center gap-1">
          <button
            onClick={workflowGuide.prevStep}
            disabled={guide.stepIndex === 0}
            className="rounded-lg p-1 text-muted-foreground hover:bg-surface-2 hover:text-foreground disabled:opacity-20 transition-colors"
            title="Previous hint"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="text-[11px] text-muted-foreground font-medium">
            {guide.stepIndex + 1} / {steps.length}
          </span>
          <button
            onClick={workflowGuide.nextStep}
            disabled={guide.stepIndex === steps.length - 1}
            className="rounded-lg p-1 text-muted-foreground hover:bg-surface-2 hover:text-foreground disabled:opacity-20 transition-colors"
            title="Next hint"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        {currentStep?.action && (
          <button
            onClick={currentStep.action}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90 active:scale-95 transition-all"
          >
            <Play className="size-3 fill-current" />
            <span>{currentStep.actionLabel || "Try It"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
