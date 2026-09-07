import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, CheckCircle2, MousePointerClick, ShieldCheck, ShieldAlert } from "lucide-react";
import { AgentLauncher, AgentPanel } from "@/components/aithos/AgentPanel";
import { PrivacyFlow } from "@/components/aithos/PrivacyFlow";
import { COMMANDS, SCENARIOS, SENSITIVE_FIELDS, demo, useDemo } from "@/lib/aithos-demo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/console")({
  head: () => ({
    meta: [
      { title: "AITHOS Privacy Console — Your AI activity, your control" },
      {
        name: "description",
        content:
          "Live view of what AITHOS protected, what the AI actually saw, and which action was approved and executed.",
      },
      { property: "og:title", content: "AITHOS Privacy Console" },
      {
        property: "og:description",
        content: "Your AI activity. Your data. Your control.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConsolePage,
});

function Panel({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-border bg-surface/60 p-6", className)}>
      <h2 className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ConsolePage() {
  const s = useDemo();
  const active = s.scenario !== null;
  const blocked = s.scenario === "leak";
  const command = s.prompt || (s.scenario ? COMMANDS[s.scenario] : "No active request");
  const cfg = s.scenario && s.scenario !== "leak" ? SCENARIOS[s.scenario] : null;
  const fields = cfg?.fields ?? SENSITIVE_FIELDS;
  const count = !active ? 0 : blocked ? 1 : s.stage >= 1 ? fields.length : 0;
  const protectedCount = count;
  const detectedCount = count;

  return (
    <div className="min-h-screen grid-bg">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-display text-lg font-semibold tracking-[0.18em]">
            AITHOS
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link
              to="/bank"
              className="rounded-lg border border-border px-3.5 py-1.5 text-xs transition-colors hover:bg-surface-2"
            >
              Demo Website
            </Link>
            <button
              onClick={() => demo.start("statement")}
              className="rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Start Live Demo
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="font-display text-4xl font-semibold">AITHOS Privacy Console</h1>
        <p className="mt-2 text-muted-foreground">Your AI activity. Your data. Your control.</p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Sensitive Data Detected", value: String(detectedCount) },
            { label: "Sensitive Data Protected", value: String(protectedCount) },
            {
              label: "Action Validation",
              value: blocked ? "Blocked" : s.stage >= 4 ? "Passed" : "Pending",
            },
            {
              label: "Task Result",
              value: blocked ? "Not shared" : s.downloaded ? "Completed" : "Waiting",
            },
          ].map((m) => (
            <div key={m.label} className="rounded-2xl border border-border bg-surface/60 p-5">
              <div className="text-xs text-muted-foreground">{m.label}</div>
              <div className="mt-2 font-display text-2xl font-semibold">{m.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Panel title="Current Request">
              <p className="text-xl font-medium">{command}</p>
            </Panel>

            <Panel title="Local Protection">
              <div className="flex flex-wrap gap-8">
                <div>
                  <div className="text-xs text-muted-foreground">Sensitive items detected</div>
                  <div className="font-display text-2xl font-semibold">{detectedCount}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Sensitive items protected</div>
                  <div className="font-display text-2xl font-semibold text-primary">
                    {protectedCount}
                  </div>
                </div>
              </div>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {fields.map((f) => {
                  const on = blocked ? f.key === "account" : s.stage >= 1;
                  return (
                    <li
                      key={f.key}
                      className={cn(
                        "flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm transition-colors",
                        on ? "bg-primary/8 text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {f.label}
                      <Check
                        className={cn(
                          "size-4",
                          on ? "text-[var(--color-success)]" : "opacity-25",
                        )}
                      />
                    </li>
                  );
                })}
              </ul>
            </Panel>

            <Panel title="AI Context">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="size-4 text-[var(--color-success)]" /> Useful context preserved
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Raw PII shared</div>
                  <div className="font-display text-7xl leading-none font-bold text-gradient-cyan">
                    0
                  </div>
                </div>
              </div>
            </Panel>

            <Panel title="The AITHOS Story">
              <PrivacyFlow />
            </Panel>
          </div>

          <div className="space-y-6">
            <Panel title="AI Action">
              {blocked ? (
                <div className="flex items-center gap-2 text-sm text-[var(--color-destructive)]">
                  <ShieldAlert className="size-4" /> No action taken
                </div>
              ) : (
                <>
                  <div className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 font-mono text-xs text-primary">
                    <MousePointerClick className="size-3.5" /> CLICK
                  </div>
                  <p className="mt-3 text-sm font-medium">
                    {cfg?.actionLabel ?? "Download Latest Statement"}
                  </p>
                  <div className="mt-5">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Confidence</span>
                      <span className="text-foreground">98%</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
                      <div
                        className="h-full rounded-full bg-[var(--gradient-cyan)] transition-[width] duration-1000"
                        style={{ width: s.stage >= 3 ? "98%" : "0%" }}
                      />
                    </div>
                  </div>
                </>
              )}
            </Panel>

            <Panel title="Safety">
              <div className="text-xs text-muted-foreground">Action validation</div>
              {blocked ? (
                <div className="mt-1.5 flex items-center gap-2 font-display text-lg font-semibold text-[var(--color-destructive)]">
                  <ShieldAlert className="size-5" /> BLOCKED
                </div>
              ) : (
                <div
                  className={cn(
                    "mt-1.5 flex items-center gap-2 font-display text-lg font-semibold",
                    s.stage >= 4 ? "text-[var(--color-success)]" : "text-muted-foreground",
                  )}
                >
                  <ShieldCheck className="size-5" /> {s.stage >= 4 ? "APPROVED ✓" : "PENDING"}
                </div>
              )}
            </Panel>

            <Panel title="Result">
              {blocked ? (
                <p className="text-sm text-muted-foreground">
                  Your sensitive information was not shared.
                </p>
              ) : s.downloaded ? (
                <div className="flex items-center gap-2 text-sm text-[var(--color-success)]">
                  <CheckCircle2 className="size-4" />{" "}
                  {s.scenario === "flight" ? "Flight booked ✓" : "Statement downloaded ✓"}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Waiting for the agent to finish.</p>
              )}
            </Panel>

            <button
              onClick={() => demo.start("leak")}
              className="w-full rounded-2xl border border-[color-mix(in_oklab,var(--destructive)_35%,transparent)] px-4 py-3 text-sm transition-colors hover:bg-[color-mix(in_oklab,var(--destructive)_10%,transparent)]"
            >
              Run the blocked-request demo
            </button>
          </div>
        </div>
      </main>

      <AgentPanel />
      <AgentLauncher />
    </div>
  );
}
