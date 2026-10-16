import { useState } from "react";
import { Info, Sparkles, ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkflowBeaconProps {
  id?: string;
  title: string;
  whatToDo: string;
  whatHappensAfter: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  align?: "left" | "right" | "top" | "bottom";
}

export function WorkflowBeacon({
  title,
  whatToDo,
  whatHappensAfter,
  actionLabel,
  onAction,
  className,
}: WorkflowBeaconProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("relative inline-flex items-center", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="group relative flex size-6.5 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary/60"
        title="Workflow Guide: What to do & what happens"
        aria-label="Workflow Guide"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/30 opacity-60" />
        <Sparkles className="size-3.5 transition-transform group-hover:rotate-12" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="false"
          className="animate-rise fixed sm:absolute z-50 sm:top-8 sm:left-0 top-20 left-4 right-4 sm:right-auto sm:w-84 rounded-2xl border border-primary/40 bg-surface/95 p-4.5 shadow-2xl backdrop-blur-2xl ring-1 ring-border text-left"
        >
          <div className="flex items-center justify-between border-b border-border/80 pb-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-primary uppercase">
              <Sparkles className="size-3.5" />
              <span>Workflow Insight</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 text-muted-foreground hover:bg-surface-2 hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          </div>

          <div className="mt-2 font-display text-sm font-semibold text-foreground">
            {title}
          </div>

          <div className="mt-3 space-y-3">
            {/* What to do */}
            <div className="rounded-xl border border-primary/25 bg-primary/8 p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-primary uppercase">
                <span className="flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px]">
                  1
                </span>
                What to do
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-foreground/90 font-medium">
                {whatToDo}
              </p>
            </div>

            {/* What happens after */}
            <div className="rounded-xl border border-[color-mix(in_oklab,var(--success)_30%,transparent)] bg-[color-mix(in_oklab,var(--success)_8%,transparent)] p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[var(--color-success)] uppercase">
                <span className="flex size-4 items-center justify-center rounded-full bg-[var(--color-success)] text-background text-[10px]">
                  2
                </span>
                What happens after doing that
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {whatHappensAfter}
              </p>
            </div>
          </div>

          {actionLabel && onAction && (
            <div className="mt-3 pt-2 border-t border-border/60">
              <button
                type="button"
                onClick={() => {
                  onAction();
                  setOpen(false);
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                {actionLabel} <ArrowRight className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
