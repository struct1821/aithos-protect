import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Eye, Gauge, MousePointerClick, Plane, ShieldCheck, Sparkles } from "lucide-react";
import { PrivacyFlow } from "@/components/aithos/PrivacyFlow";
import { demo } from "@/lib/aithos-demo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AITHOS — Intelligence. Private. Powerful." },
      {
        name: "description",
        content:
          "AITHOS is a privacy-preserving AI browser agent. It lets AI complete tasks on webpages while your personal information stays protected on your device.",
      },
      { property: "og:title", content: "AITHOS — Intelligence. Private. Powerful." },
      {
        property: "og:description",
        content: "AI should know what it needs — not everything about you.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const PRINCIPLES = [
  { icon: Eye, title: "See locally", body: "AITHOS reads the page on your device — nothing leaves first." },
  { icon: ShieldCheck, title: "Protect locally", body: "Personal details are found and hidden before anything is sent." },
  { icon: Sparkles, title: "Reason with safe context", body: "The AI still understands the page, without knowing who you are." },
  { icon: MousePointerClick, title: "Act safely", body: "Every action is checked against your request before it runs." },
];

function Landing() {
  const navigate = useNavigate();

  const startDemo = () => {
    demo.start("statement");
    navigate({ to: "/bank" });
  };

  const startFlightDemo = () => {
    demo.start("flight");
    navigate({ to: "/travel" });
  };

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 grid-bg opacity-60" />
        <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <span className="font-display text-lg font-semibold tracking-[0.2em]">AITHOS</span>
          <nav className="flex items-center gap-2 text-sm">
            <Link
              to="/bank"
              className="rounded-lg px-3.5 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              Banking Demo
            </Link>
            <Link
              to="/travel"
              className="rounded-lg px-3.5 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              Flight Demo
            </Link>
            <Link
              to="/console"
              className="rounded-lg border border-border px-3.5 py-1.5 text-xs transition-colors hover:bg-surface-2"
            >
              Privacy Console
            </Link>
          </nav>
        </header>

        <section className="relative mx-auto max-w-4xl px-6 pt-20 pb-24 text-center">
          <span className="animate-rise inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 text-[11px] tracking-[0.22em] text-primary uppercase">
            Intelligence. Private. Powerful.
          </span>
          <h1 className="animate-rise mt-8 font-display text-6xl leading-[1.05] font-bold md:text-7xl">
            AITHOS
          </h1>
          <p className="animate-rise mx-auto mt-6 max-w-2xl text-2xl leading-snug text-muted-foreground md:text-3xl">
            “AI should know what it needs —{" "}
            <span className="text-foreground">not everything about you.</span>”
          </p>
          <div className="animate-rise mt-10 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={startDemo}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground shadow-[var(--glow-strong)] transition-transform hover:scale-[1.02]"
            >
              Start Live Demo <ArrowRight className="size-4" />
            </button>
            <button
              onClick={startFlightDemo}
              className="inline-flex items-center gap-2 rounded-xl border border-primary/30 px-6 py-4 text-sm text-primary transition-colors hover:bg-primary/10"
            >
              <Plane className="size-4" /> Book a Flight Demo
            </button>
            <Link
              to="/console"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-4 text-sm transition-colors hover:bg-surface-2"
            >
              <Gauge className="size-4" /> Explore Privacy Console
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Demonstration only. Every name, number and account shown is synthetic.
          </p>
        </section>
      </div>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-4 md:grid-cols-4">
          {PRINCIPLES.map((p, i) => (
            <div
              key={p.title}
              className="animate-rise rounded-2xl border border-border bg-surface/60 p-6 transition-colors hover:border-primary/30"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <p.icon className="size-5 text-primary" />
              <h3 className="mt-4 text-base font-semibold">{p.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="text-center font-display text-3xl font-semibold">How it works</h2>
        <p className="mt-2 mb-10 text-center text-muted-foreground">
          Private information is protected before the AI ever sees the page.
        </p>
        <PrivacyFlow />
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-8 text-xs text-muted-foreground">
          <span>AITHOS — privacy-preserving AI browser agent (prototype)</span>
          <span>All data shown is synthetic and for demonstration only.</span>
        </div>
      </footer>
    </div>
  );
}
