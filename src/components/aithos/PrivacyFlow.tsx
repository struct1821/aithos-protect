import { User, ShieldCheck, Sparkles, ListChecks, MousePointerClick } from "lucide-react";

const NODES = [
  { icon: User, title: "You ask", body: "You tell AITHOS what you want done." },
  { icon: ShieldCheck, title: "AITHOS protects", body: "Your private details are hidden on your device." },
  { icon: Sparkles, title: "AI understands", body: "The AI sees only what it needs to help." },
  { icon: ListChecks, title: "AITHOS checks", body: "Every action is verified before it happens." },
  { icon: MousePointerClick, title: "Task done", body: "The page does exactly what you asked." },
];

export function PrivacyFlow() {
  return (
    <div className="relative">
      <div className="grid gap-4 md:grid-cols-5">
        {NODES.map((n, i) => (
          <div
            key={n.title}
            className="group relative rounded-2xl bg-surface/60 p-5 glow-border animate-rise"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/25">
                <n.icon className="size-5" />
              </span>
              <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
            </div>
            <h4 className="text-base font-semibold">{n.title}</h4>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{n.body}</p>
            {i < NODES.length - 1 && (
              <span className="absolute top-1/2 -right-[18px] hidden h-px w-6 bg-gradient-to-r from-primary/70 to-transparent md:block" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
