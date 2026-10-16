import { useEffect, useState } from "react";
import { useWorkflowGuide, getCurrentSteps } from "@/lib/workflow-guide";

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
    <div className="pointer-events-none fixed inset-0 z-30 transition-all duration-300">
      {/* Subtle gentle focus ring on active target */}
      <div
        className="pointer-events-none absolute rounded-xl transition-all duration-500 ring-2 ring-primary/40 shadow-[0_0_15px_rgba(56,189,248,0.2)]"
        style={{
          top: Math.max(0, rect.top - 4),
          left: Math.max(0, rect.left - 4),
          width: rect.width + 8,
          height: rect.height + 8,
        }}
      />
    </div>
  );
}
