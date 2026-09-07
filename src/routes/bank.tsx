import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDownToLine,
  Building2,
  CheckCircle2,
  FileText,
  Landmark,
  Receipt,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { AgentLauncher, AgentPanel } from "@/components/aithos/AgentPanel";
import { useDemo } from "@/lib/aithos-demo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/bank")({
  head: () => ({
    meta: [
      { title: "SecureBank Demo Environment — AITHOS" },
      {
        name: "description",
        content:
          "A fictional SecureBank dashboard with synthetic data, used to demonstrate the AITHOS privacy-preserving AI browser agent.",
      },
      { property: "og:title", content: "SecureBank Demo Environment — AITHOS" },
      {
        property: "og:description",
        content:
          "Watch AITHOS protect personal details while an AI agent completes a task on a demo banking page.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BankPage,
});

const TRANSACTIONS = [
  { name: "Amazon", note: "Shopping", amount: "− ₹2,499", positive: false },
  { name: "Swiggy", note: "Food & dining", amount: "− ₹845", positive: false },
  { name: "Salary", note: "Credit", amount: "+ ₹85,000", positive: true },
  { name: "Electricity", note: "Utilities", amount: "− ₹2,340", positive: false },
];

const CUSTOMER = [
  { label: "Name", value: "Rahul Sharma", token: "[NAME]" },
  { label: "Email", value: "rahul.sharma@example.com", token: "[EMAIL]" },
  { label: "Phone", value: "+91 98765 43210", token: "[PHONE]" },
  { label: "PAN", value: "ABCDE1234F", token: "[PAN]" },
];

function BankPage() {
  const s = useDemo();
  const protecting = s.scenario !== null && s.scenario !== "leak" && s.stage >= 2;
  const [manualDownload, setManualDownload] = useState(false);
  const downloaded = (s.downloaded && s.scenario === "statement") || manualDownload;
  const [manualView, setManualView] = useState<string | null>(null);
  const done = s.downloaded ? s.scenario : null;
  const opened =
    manualView ?? (done === "transactions" ? "transactions" : done === "history" ? "history" : null);
  const act = (sc: string) => s.clicking && s.scenario === sc;
  const ring = (sc: string) =>
    act(sc) ? "scale-[0.97] shadow-[var(--glow-strong)] ring-4 ring-primary/40" : "";

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-[color-mix(in_oklab,var(--warning)_30%,transparent)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)] px-6 py-2 text-center text-xs text-[var(--color-warning)]">
        Fictional demo environment — SecureBank is not a real bank and all information shown is synthetic.
      </div>

      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/12 text-primary ring-1 ring-primary/25">
              <Landmark className="size-4.5" />
            </span>
            <span className="font-display text-lg font-semibold">SecureBank</span>
          </div>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            {["Home", "Transactions", "Statements", "Profile"].map((l, i) => (
              <span
                key={l}
                className={cn(
                  "cursor-pointer transition-colors hover:text-foreground",
                  i === 0 && "text-foreground",
                )}
              >
                {l}
              </span>
            ))}
          </nav>
          <Link
            to="/console"
            className="rounded-lg border border-primary/30 px-3.5 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
          >
            Privacy Console
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-display text-3xl font-semibold">
          Good morning,{" "}
          <span
            className={cn(
              "inline-block transition-all duration-500",
              protecting && "select-none blur-[5px] text-primary",
            )}
          >
            Rahul
          </span>
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Here's a snapshot of your account activity.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2 space-y-6">
            <div className="relative overflow-hidden rounded-2xl bg-[var(--gradient-surface)] p-7 glow-border">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                  <div className="text-xs tracking-widest text-muted-foreground uppercase">
                    Available Balance
                  </div>
                  <div className="mt-2 font-display text-4xl font-bold">₹1,24,560.00</div>
                  <div className="mt-4 text-xs text-muted-foreground">Account Number</div>
                  <div
                    className={cn(
                      "font-mono text-sm transition-all duration-500",
                      protecting && "w-fit rounded bg-primary/10 px-1.5 py-0.5 text-primary",
                    )}
                  >
                    {protecting ? "[ACCOUNT NUMBER]" : "123456789012"}
                  </div>
                </div>
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/25">
                  <Building2 className="size-5" />
                </span>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  id="download-statement"
                  onClick={() => setManualDownload(true)}
                  className={cn(
                    "relative inline-flex items-center gap-2.5 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all",
                    act("statement") ? ring("statement") : "hover:opacity-90",
                  )}
                >
                  {act("statement") && (
                    <span className="absolute -inset-1.5 animate-pulse rounded-2xl ring-2 ring-primary/60" />
                  )}
                  <ArrowDownToLine className="size-4" />
                  Download Latest Statement
                </button>
                <button
                  id="view-transactions"
                  onClick={() => setManualView("transactions")}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm transition-all hover:bg-surface-2",
                    ring("transactions"),
                  )}
                >
                  <Receipt className="size-4" /> View Transactions
                </button>
                <button
                  id="view-history"
                  onClick={() => setManualView("history")}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm transition-all hover:bg-surface-2",
                    ring("history"),
                  )}
                >
                  <FileText className="size-4" /> View Statement History
                </button>
              </div>

              {downloaded && (
                <div className="animate-rise mt-5 flex items-center gap-2 rounded-xl border border-[color-mix(in_oklab,var(--success)_35%,transparent)] bg-[color-mix(in_oklab,var(--success)_10%,transparent)] px-4 py-3 text-sm text-[var(--color-success)]">
                  <CheckCircle2 className="size-4" /> Statement_September.pdf downloaded
                </div>
              )}

              {opened && (
                <div className="animate-rise mt-5 flex items-center gap-2 rounded-xl border border-[color-mix(in_oklab,var(--success)_35%,transparent)] bg-[color-mix(in_oklab,var(--success)_10%,transparent)] px-4 py-3 text-sm text-[var(--color-success)]">
                  <CheckCircle2 className="size-4" />{" "}
                  {opened === "transactions"
                    ? "Recent transactions opened below"
                    : "Statement history opened — 12 statements available"}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-surface/60 p-6">
              <h2 className="text-base font-semibold">Recent Transactions</h2>
              <ul className="mt-4 divide-y divide-border">
                {TRANSACTIONS.map((t) => (
                  <li key={t.name} className="flex items-center justify-between py-3.5">
                    <div>
                      <div className="text-sm font-medium">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.note}</div>
                    </div>
                    <div
                      className={cn(
                        "font-mono text-sm",
                        t.positive ? "text-[var(--color-success)]" : "text-foreground",
                      )}
                    >
                      {t.amount}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-surface/60 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">Customer Information</h2>
                {s.stage >= 2 && s.scenario !== "leak" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/12 px-2.5 py-1 text-[10px] font-medium text-primary">
                    <ShieldCheck className="size-3" /> Protected
                  </span>
                )}
              </div>
              <dl className="mt-4 space-y-4">
                {CUSTOMER.map((c) => (
                  <div key={c.label}>
                    <dt className="text-xs text-muted-foreground">{c.label}</dt>
                    <dd
                      className={cn(
                        "mt-0.5 w-fit text-sm transition-all duration-500",
                        protecting &&
                          "rounded bg-primary/10 px-1.5 py-0.5 font-mono text-primary",
                      )}
                    >
                      {protecting ? c.token : c.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-2xl border border-border bg-surface/40 p-6 text-sm text-muted-foreground">
              Click the <span className="text-primary">AITHOS Agent</span> button to let the
              privacy-preserving agent complete a task on this page for you.
            </div>
          </aside>
        </div>
      </main>

      <AgentPanel scenarios={["statement", "transactions", "history", "leak"]} />
      <AgentLauncher />
    </div>
  );
}
