import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Plane, ShieldCheck, Ticket } from "lucide-react";
import { useState } from "react";
import { AgentLauncher, AgentPanel } from "@/components/aithos/AgentPanel";
import { FLIGHT_FIELDS, useDemo } from "@/lib/aithos-demo";
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
  const booked = (s.downloaded && s.scenario === "flight") || manual;
  const protecting = s.scenario === "flight" && s.stage >= 2;

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
          <section className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-border bg-surface/60 p-6">
              <h2 className="text-base font-semibold">Available flights</h2>
              <ul className="mt-4 space-y-3">
                {FLIGHTS.map((f) => (
                  <li
                    key={f.code}
                    className={cn(
                      "flex flex-wrap items-center justify-between gap-4 rounded-xl border px-4 py-3.5 transition-colors",
                      f.pick
                        ? "border-primary/40 bg-primary/8"
                        : "border-border hover:bg-surface-2",
                    )}
                  >
                    <div>
                      <div className="text-sm font-medium">
                        {f.time}{" "}
                        <span className="text-muted-foreground">
                          · {f.from} → {f.to}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">SkyWays {f.code} · Non-stop</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-sm">{f.price}</span>
                      <span
                        className={cn(
                          "rounded-lg px-3 py-1.5 text-xs",
                          f.pick
                            ? "bg-primary/15 font-medium text-primary"
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

            <div className="relative overflow-hidden rounded-2xl bg-[var(--gradient-surface)] p-7 glow-border">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">Traveller & payment details</h2>
                {protecting && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/12 px-2.5 py-1 text-[10px] font-medium text-primary">
                    <ShieldCheck className="size-3" /> Protected
                  </span>
                )}
              </div>
              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                {FLIGHT_FIELDS.map((f) => (
                  <div key={f.key}>
                    <dt className="text-xs text-muted-foreground">{f.label}</dt>
                    <dd
                      className={cn(
                        "mt-0.5 text-sm transition-all duration-500",
                        protecting && "rounded bg-primary/10 px-1.5 py-0.5 text-primary blur-[0.2px]",
                      )}
                    >
                      {protecting ? f.token : f.raw}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  id="confirm-booking"
                  onClick={() => setManual(true)}
                  className={cn(
                    "relative inline-flex items-center gap-2.5 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all",
                    s.clicking && s.scenario === "flight"
                      ? "scale-[0.97] shadow-[var(--glow-strong)] ring-4 ring-primary/40"
                      : "hover:opacity-90",
                  )}
                >
                  {s.clicking && s.scenario === "flight" && (
                    <span className="absolute -inset-1.5 animate-pulse rounded-2xl ring-2 ring-primary/60" />
                  )}
                  <Ticket className="size-4" />
                  Confirm Booking
                </button>
                <button className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm transition-colors hover:bg-surface-2">
                  Change seats
                </button>
              </div>

              {booked && (
                <div className="animate-rise mt-5 flex items-center gap-2 rounded-xl border border-[color-mix(in_oklab,var(--success)_35%,transparent)] bg-[color-mix(in_oklab,var(--success)_10%,transparent)] px-4 py-3 text-sm text-[var(--color-success)]">
                  <CheckCircle2 className="size-4" /> Booking confirmed — SkyWays SW 214, PNR
                  QJ7T2M
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
                ].map(([k, v], i) => (
                  <div key={k} className="flex items-center justify-between">
                    <dt className={i === 2 ? "font-medium" : "text-muted-foreground"}>{k}</dt>
                    <dd className={cn("font-mono", i === 2 && "font-semibold text-primary")}>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-2xl border border-border bg-surface/40 p-6 text-sm text-muted-foreground">
              Click the <span className="text-primary">AITHOS Agent</span> button and ask it to book
              the flight — your details stay protected.
            </div>
          </aside>
        </div>
      </main>

      <AgentPanel scenarios={["flight", "leak"]} />
      <AgentLauncher />
    </div>
  );
}
