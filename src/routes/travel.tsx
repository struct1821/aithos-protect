import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Plane, ShieldCheck, Ticket, Lock, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { AgentLauncher, AgentPanel } from "@/components/aithos/AgentPanel";
import { WorkflowBeacon } from "@/components/aithos/WorkflowBeacon";
import { FLIGHT_FIELDS, useDemo } from "@/lib/aithos-demo";
import { workflowGuide } from "@/lib/workflow-guide";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/travel")({
  head: () => ({
    meta: [
      { title: "SkyWays Booking Demo — AITHOS" },
      {
        name: "description",
        content:
          "A fictional SkyWays flight booking page with synthetic traveller details, used to demonstrate how AITHOS protects personal information while an AI agent books a flight.",
      },
      { property: "og:title", content: "SkyWays Booking Demo — AITHOS" },
      {
        property: "og:description",
        content: "Watch AITHOS redact booking details and still complete the booking safely.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TravelPage,
});

const FLIGHTS = [
  { code: "SW 214", time: "07:40 — 10:05", from: "BOM", to: "DEL", price: "₹5,480", pick: true },
  { code: "SW 388", time: "13:15 — 15:35", from: "BOM", to: "DEL", price: "₹6,120", pick: false },
  { code: "SW 902", time: "19:50 — 22:10", from: "BOM", to: "DEL", price: "₹4,960", pick: false },
];

function TravelPage() {
  const s = useDemo();
  const [manual, setManual] = useState(false);
  const [seatManual, setSeatManual] = useState(false);

  const booked = (s.downloaded && s.scenario === "flight") || manual;
  const seatDone = (s.downloaded && s.scenario === "seats") || seatManual;

  const isRedacting = (s.stage === 1 || s.stage === 2) && s.scenario !== "leak";
  const isProtected = s.stage >= 2 && s.scenario !== "leak";
  const protecting = isProtected || isRedacting;

  // Maintain seamless sync with workflow guide popup whether completed manually or via agent
  const taskDone = Boolean(booked || seatDone);
  useEffect(() => {
    workflowGuide.syncState({
      stage: s.stage,
      scenario: "flight",
      panelOpen: s.panelOpen,
      completed: taskDone,
    });
  }, [s.stage, s.panelOpen, taskDone]);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-[color-mix(in_oklab,var(--warning)_30%,transparent)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)] px-6 py-2 text-center text-xs text-[var(--color-warning)]">
        Fictional demo environment — SkyWays is not a real airline and every detail shown is synthetic.
      </div>

      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/12 text-primary ring-1 ring-primary/25">
              <Plane className="size-4.5" />
            </span>
            <span className="font-display text-lg font-semibold">SkyWays</span>
          </div>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            {["Search", "My Trips", "Check-in", "Profile"].map((l, i) => (
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
            id="nav-privacy-console"
            to="/console"
            className="rounded-lg border border-primary/30 px-3.5 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
          >
            Privacy Console
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-display text-3xl font-semibold">Mumbai → Delhi</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Fri, 18 Sep · 1 traveller · Economy
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-border bg-surface/60 p-6">
              <h2 className="text-base font-semibold">Available flights</h2>
              <ul className="mt-4 space-y-3">
                {FLIGHTS.map((f) => (
                  <li
                    key={f.code}
                    className={cn(
                      "flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4.5 transition-all",
                      f.pick
                        ? "border-primary/40 bg-primary/5 ring-1 ring-primary/30"
                        : "border-border bg-surface/40 hover:bg-surface-2",
                    )}
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-semibold">{f.code}</span>
                        <span className="text-xs text-muted-foreground">SkyWays Express</span>
                      </div>
                      <div className="mt-2 text-sm font-medium">{f.time}</div>
                      <div className="text-xs text-muted-foreground">
                        {f.from} → {f.to} · Non-stop · 2h 25m
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-xl font-bold">{f.price}</div>
                      <span
                        className={cn(
                          "mt-2 inline-block rounded-lg px-3 py-1 text-xs font-semibold",
                          f.pick
                            ? "bg-primary text-primary-foreground"
                            : "border border-border text-muted-foreground",
                        )}
                      >
                        {f.pick ? "Selected" : "Select"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Lively Redaction Passenger & Payment Card */}
            <div
              id="passenger-details-card"
              className={cn(
                "relative overflow-hidden rounded-2xl p-7 transition-all duration-500",
                isRedacting
                  ? "border-primary/80 ring-2 ring-primary/60 shadow-[0_0_35px_rgba(56,189,248,0.35)] bg-surface/90"
                  : isProtected
                    ? "border-[color-mix(in_oklab,var(--success)_40%,transparent)] bg-[var(--gradient-surface)] shadow-lg"
                    : "border-border bg-[var(--gradient-surface)] glow-border",
              )}
            >
              {/* Lively Animated Scanning Laser Line during Redaction */}
              {isRedacting && (
                <div className="pointer-events-none absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-95 blur-[0.5px] animate-scan shadow-[0_0_15px_rgba(56,189,248,0.9)]" />
              )}

              {/* Lively Redaction Activity Banner */}
              {isRedacting ? (
                <div className="mb-5 flex items-center justify-between rounded-xl bg-primary/15 border border-primary/45 px-3.5 py-2 text-xs font-semibold text-primary animate-pulse shadow-[0_0_15px_rgba(56,189,248,0.25)]">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-3.5 animate-spin text-primary" />
                    <span>ON-DEVICE PII REDACTION IN PROGRESS</span>
                  </div>
                  <span className="rounded bg-primary/25 px-1.5 py-0.5 font-mono text-[9px] tracking-wider uppercase">
                    0 bytes to cloud
                  </span>
                </div>
              ) : isProtected ? (
                <div className="mb-5 flex items-center justify-between rounded-xl bg-[color-mix(in_oklab,var(--success)_12%,transparent)] border border-[color-mix(in_oklab,var(--success)_35%,transparent)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-success)] animate-rise">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5" />
                    <span>TRAVELLER CREDENTIALS SANITIZED LOCALLY</span>
                  </div>
                  <span className="rounded bg-[color-mix(in_oklab,var(--success)_20%,transparent)] px-1.5 py-0.5 font-mono text-[9px] tracking-wider uppercase">
                    Safe Context
                  </span>
                </div>
              ) : null}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold">Traveller & payment details</h2>
                  <WorkflowBeacon
                    title="Traveller & Payment Data"
                    whatToDo="Watch passport and saved card data get detected on this page."
                    whatHappensAfter="AITHOS swaps them with [PASSPORT] and [CARD] placeholder tokens before communicating with the model."
                  />
                </div>
                {isProtected && !isRedacting && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/12 px-2.5 py-1 text-[10px] font-medium text-primary">
                    <ShieldCheck className="size-3" /> Protected
                  </span>
                )}
              </div>

              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                {FLIGHT_FIELDS.map((f) => (
                  <div key={f.key}>
                    <dt className="text-xs text-muted-foreground">{f.label}</dt>
                    <dd className="mt-1">
                      {isRedacting ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/20 border border-primary/50 px-2 py-0.5 font-mono text-xs font-semibold text-primary shadow-[0_0_12px_rgba(56,189,248,0.3)] animate-pulse">
                            <Lock className="size-3" />
                            {f.token}
                          </span>
                          <span className="text-xs text-muted-foreground line-through opacity-50">
                            {f.raw}
                          </span>
                        </div>
                      ) : isProtected ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/15 border border-primary/30 px-2 py-0.5 font-mono text-xs font-semibold text-primary">
                            <Lock className="size-3" />
                            {f.token}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            (local only)
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-foreground">{f.raw}</span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <div className="relative inline-flex items-center gap-2">
                  <button
                    id="confirm-booking-btn"
                    onClick={() => setManual(true)}
                    className={cn(
                      "relative inline-flex items-center gap-2.5 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all",
                      s.clicking && s.scenario === "flight"
                        ? "scale-[0.97] shadow-[var(--glow-strong)] ring-4 ring-primary/40"
                        : "hover:opacity-90 active:scale-95",
                    )}
                  >
                    {s.clicking && s.scenario === "flight" && (
                      <span className="absolute -inset-1.5 animate-pulse rounded-2xl ring-2 ring-primary/60" />
                    )}
                    <Ticket className="size-4" />
                    Confirm Booking
                  </button>
                  <WorkflowBeacon
                    title="Confirm Booking Action"
                    whatToDo="Click this directly or ask AITHOS: 'Book my flight to Delhi'."
                    whatHappensAfter="AITHOS securely re-fills the form with real values on-device and clicks confirm without transmitting your credit card or passport to cloud AI."
                  />
                </div>
                <button
                  id="change-seats"
                  onClick={() => setSeatManual(true)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm transition-all hover:bg-surface-2 active:scale-95",
                    s.clicking && s.scenario === "seats" &&
                      "scale-[0.97] shadow-[var(--glow-strong)] ring-4 ring-primary/40",
                  )}
                >
                  Change seats
                </button>
              </div>

              {booked && (
                <div className="animate-rise mt-5 flex items-center justify-between rounded-xl border border-[color-mix(in_oklab,var(--success)_35%,transparent)] bg-[color-mix(in_oklab,var(--success)_10%,transparent)] px-4 py-3 text-sm text-[var(--color-success)]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4" />
                    <span>Booking confirmed — SkyWays SW 214, PNR QJ7T2M</span>
                  </div>
                  <Link
                    to="/console"
                    className="text-xs font-semibold underline underline-offset-4 hover:opacity-80"
                  >
                    Audit Log →
                  </Link>
                </div>
              )}

              {seatDone && (
                <div className="animate-rise mt-5 flex items-center justify-between rounded-xl border border-[color-mix(in_oklab,var(--success)_35%,transparent)] bg-[color-mix(in_oklab,var(--success)_10%,transparent)] px-4 py-3 text-sm text-[var(--color-success)]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4" />
                    <span>Seat updated — 12A, window</span>
                  </div>
                  <Link
                    to="/console"
                    className="text-xs font-semibold underline underline-offset-4 hover:opacity-80"
                  >
                    Audit Log →
                  </Link>
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-surface/60 p-6">
              <h2 className="text-base font-semibold">Fare summary</h2>
              <dl className="mt-4 space-y-3 text-sm">
                {[
                  ["Base fare", "₹4,650"],
                  ["Taxes & fees", "₹830"],
                  ["Total", "₹5,480"],
                ].map(([label, val], idx, arr) => (
                  <div
                    key={label}
                    className={cn(
                      "flex items-center justify-between",
                      idx === arr.length - 1 &&
                        "border-t border-border pt-3 font-semibold text-foreground",
                    )}
                  >
                    <dt className={idx === arr.length - 1 ? "" : "text-muted-foreground"}>
                      {label}
                    </dt>
                    <dd>{val}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-2xl border border-border bg-surface/40 p-6 text-sm text-muted-foreground">
              Click the <span className="text-primary font-semibold">AITHOS Agent</span> button or click{" "}
              <span className="text-foreground font-semibold">Confirm Booking</span> directly to
              observe how passport and credit card data stay protected locally on your device.
            </div>
          </aside>
        </div>
      </main>

      <AgentPanel scenarios={["flight", "seats"]} />
      <AgentLauncher />
    </div>
  );
}
