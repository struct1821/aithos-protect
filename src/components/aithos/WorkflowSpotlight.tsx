import { useEffect, useState } from "react";
import { useWorkflowGuide, getCurrentSteps } from "@/lib/workflow-guide";
import { Sparkles, ArrowRight, ArrowLeft, Play, X, ShieldAlert, ShieldCheck } from "lucide-react";

export function WorkflowSpotlight() {
  const guide = useWorkflowGuide();
  const [rect, setRect] = useState<DOMRect | null>(null);
  const steps = getCurrentSteps(guide.scenario);
  const currentStep = steps[guide.stepIndex];

  useEffect(() => {
    if (!guide.active || !guide.highlightedTarget) {
      setRect(null);
      return;
    }

    const updatePosition = () => {
      const el = document.getElementById(guide.highlightedTarget!);
      if (el) {
        const r = el.getBoundingClientRect();
        setRect(r);
        // Gently ensure element is visible without jarring scroll
        if (r.top < 60 || r.bottom > window.innerHeight - 60) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      } else {
        setRect(null);
      }
    };

    updatePosition();
    const interval = setInterval(updatePosition, 300);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [guide.active, guide.highlightedTarget, guide.stepIndex, guide.scenario]);

  if (!guide.active || !currentStep || !rect) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40 transition-all duration-300">
      {/* Glowing animated spotlight frame on target element */}
      <div
        className="pointer-events-none absolute rounded-2xl transition-all duration-500 ring-4 ring-primary/70 shadow-[0_0_35px_rgba(56,189,248,0.45)]"
        style={{
          top: Math.max(0, rect.top - 6),
          left: Math.max(0, rect.left - 6),
          width: rect.width + 12,
          height: rect.height + 12,
        }}
      >
        {/* Radar wave ping */}
        <span className="absolute -inset-2 animate-ping rounded-2xl border-2 border-primary/50 opacity-40 duration-1000" />
        
        {/* Floating beacon chip attached to the spotlight */}
        <div className="pointer-events-auto absolute -top-8.5 left-0 z-50 flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[11px] font-bold tracking-wide text-primary-foreground shadow-lg animate-rise">
          <Sparkles className="size-3 animate-spin" />
          <span>CURRENT FOCUS</span>
        </div>
      </div>
    </div>
  );
}
