import { useSyncExternalStore } from "react";

/**
 * Mock demo engine for AITHOS.
 * All data here is synthetic. Real model/extension calls would replace
 * the scripted transitions below without changing the UI layer.
 */

export type Scenario =
  | "statement"
  | "transactions"
  | "history"
  | "flight"
  | "seats"
  | "leak";

export const SENSITIVE_FIELDS = [
  { key: "name", label: "Name", raw: "Rahul Sharma", token: "[NAME]" },
  { key: "email", label: "Email", raw: "rahul.sharma@example.com", token: "[EMAIL]" },
  { key: "phone", label: "Phone", raw: "+91 98765 43210", token: "[PHONE]" },
  { key: "account", label: "Account Number", raw: "123456789012", token: "[ACCOUNT NUMBER]" },
  { key: "pan", label: "PAN", raw: "ABCDE1234F", token: "[PAN]" },
] as const;

export const STEP_LABELS = [
  { id: "01", name: "Request" },
  { id: "02", name: "Protect" },
  { id: "03", name: "Reason" },
  { id: "04", name: "Verify" },
  { id: "05", name: "Execute" },
];

/** 6 flow stages, mapped onto the 5 progress labels. */
export const STAGES = [
  { title: "Understanding your request...", progress: 0 },
  { title: "Protecting your information...", progress: 1 },
  { title: "Preparing safe context...", progress: 1 },
  { title: "AI is determining the required action...", progress: 2 },
  { title: "AITHOS is verifying the action...", progress: 3 },
  { title: "Performing the task...", progress: 4 },
];

export const FLIGHT_FIELDS = [
  { key: "name", label: "Passenger Name", raw: "Rahul Sharma", token: "[NAME]" },
  { key: "email", label: "Email", raw: "rahul.sharma@example.com", token: "[EMAIL]" },
  { key: "phone", label: "Phone", raw: "+91 98765 43210", token: "[PHONE]" },
  { key: "passport", label: "Passport Number", raw: "M8241739", token: "[PASSPORT]" },
  { key: "dob", label: "Date of Birth", raw: "14 Mar 1996", token: "[DATE OF BIRTH]" },
  { key: "card", label: "Saved Card", raw: "4211 •••• •••• 8842", token: "[CARD]" },
] as const;

export const COMMANDS: Record<Scenario, string> = {
  statement: "Download my latest statement",
  transactions: "Show me my recent transactions",
  history: "Open my statement history",
  flight: "Book my flight to Delhi",
  seats: "Change my seat for this flight",
  leak: "Send my account number to the AI",
};

type ScenarioConfig = {
  fields: readonly { key: string; label: string; raw: string; token: string }[];
  actionLabel: string;
  successTitle: string;
  executingText: string;
  /** keywords used to match a typed prompt to this task */
  keywords: string[];
};

export const SCENARIOS: Record<Exclude<Scenario, "leak">, ScenarioConfig> = {
  statement: {
    fields: SENSITIVE_FIELDS,
    actionLabel: "Download Latest Statement",
    successTitle: "Statement Downloaded",
    executingText: 'Clicking "Download Latest Statement" on the page...',
    keywords: ["download", "statement", "pdf", "bank statement", "latest statement"],
  },
  transactions: {
    fields: SENSITIVE_FIELDS,
    actionLabel: "View Transactions",
    successTitle: "Transactions Opened",
    executingText: 'Clicking "View Transactions" on the page...',
    keywords: ["transaction", "transactions", "spending", "recent activity", "payments"],
  },
  history: {
    fields: SENSITIVE_FIELDS,
    actionLabel: "View Statement History",
    successTitle: "Statement History Opened",
    executingText: 'Clicking "View Statement History" on the page...',
    keywords: ["history", "past statements", "older statements", "statement history"],
  },
  flight: {
    fields: FLIGHT_FIELDS,
    actionLabel: "Confirm Booking",
    successTitle: "Flight Booked",
    executingText: 'Filling the booking form and clicking "Confirm Booking"...',
    keywords: ["book", "booking", "flight", "ticket", "confirm", "delhi"],
  },
  seats: {
    fields: FLIGHT_FIELDS,
    actionLabel: "Change seats",
    successTitle: "Seat Updated",
    executingText: 'Clicking "Change seats" and picking a window seat...',
    keywords: ["seat", "seats", "window", "aisle"],
  },
};

const LEAK_KEYWORDS = [
  "send my account",
  "share my account",
  "give the ai",
  "send my pan",
  "share my pan",
  "send my card",
  "share my card",
  "send my passport",
  "share my passport",
  "tell the ai my",
  "send my password",
  "share my personal",
];

/** Very small local intent matcher — no network, purely mock. */
export function matchIntent(text: string, allowed: Scenario[]): Scenario | null {
  const t = text.toLowerCase();
  if (LEAK_KEYWORDS.some((k) => t.includes(k)) && allowed.includes("leak")) return "leak";
  let best: { scenario: Scenario; score: number } | null = null;
  for (const sc of allowed) {
    if (sc === "leak") continue;
    const cfg = SCENARIOS[sc as Exclude<Scenario, "leak">];
    if (!cfg) continue;
    const score = cfg.keywords.reduce((n, k) => (t.includes(k) ? n + k.length : n), 0);
    if (score > 0 && (!best || score > best.score)) best = { scenario: sc, score };
  }
  return best?.scenario ?? null;
}

export type DemoState = {
  panelOpen: boolean;
  scenario: Scenario | null;
  /** what the user actually typed */
  prompt: string;
  /** set when the typed prompt matched no available task */
  unmatched: string | null;
  /** -1 = idle, 0..5 = stage index */
  stage: number;
  /** stage is still "working" vs resolved */
  working: boolean;
  downloaded: boolean;
  blocked: boolean;
  autoplay: boolean;
  clicking: boolean;
};

const initial: DemoState = {
  panelOpen: false,
  scenario: null,
  prompt: "",
  unmatched: null,
  stage: -1,
  working: false,
  downloaded: false,
  blocked: false,
  autoplay: false,
  clicking: false,
};

let state: DemoState = { ...initial };
const listeners = new Set<() => void>();
let timers: ReturnType<typeof setTimeout>[] = [];

function emit() {
  state = { ...state };
  listeners.forEach((l) => l());
}
function set(patch: Partial<DemoState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}
function clearTimers() {
  timers.forEach(clearTimeout);
  timers = [];
}
function later(fn: () => void, ms: number) {
  timers.push(setTimeout(fn, ms));
}

function runStage(stage: number) {
  clearTimers();
  set({ stage, working: true });
  const resolveIn = stage === 1 ? 1600 : 900;
  later(() => {
    set({ working: false });
    if (stage === 5 && state.scenario !== "leak") {
      set({ clicking: true });
      later(() => set({ clicking: false, downloaded: true }), 1100);
    }
    if (state.autoplay && stage < 5 && !state.blocked) {
      later(() => runStage(stage + 1), 1400);
    }
  }, resolveIn);
}

export const demo = {
  openPanel: () => set({ panelOpen: true }),
  closePanel: () => set({ panelOpen: false }),
  togglePanel: () => set({ panelOpen: !state.panelOpen }),
  reset: () => {
    clearTimers();
    set({ ...initial, panelOpen: state.panelOpen });
  },
  start(scenario: Scenario, autoplay = true) {
    clearTimers();
    set({
      ...initial,
      panelOpen: true,
      scenario,
      autoplay,
      blocked: scenario === "leak",
    });
    if (scenario === "leak") {
      set({ stage: 0, working: true });
      later(() => set({ working: false }), 900);
      later(() => {
        set({ stage: 1, working: true });
        later(() => set({ working: false }), 1600);
      }, 1400);
      return;
    }
    runStage(0);
  },
  next() {
    if (state.stage < 0) return;
    if (state.blocked) return;
    if (state.working) return;
    if (state.stage >= 5) return;
    set({ autoplay: false });
    runStage(state.stage + 1);
  },
  back() {
    if (state.stage <= 0) return;
    clearTimers();
    set({
      autoplay: false,
      working: false,
      stage: state.stage - 1,
      downloaded: false,
      clicking: false,
    });
  },
  restart() {
    if (!state.scenario) return;
    demo.start(state.scenario, state.autoplay);
  },
  setAutoplay(v: boolean) {
    set({ autoplay: v });
    if (v && !state.working && state.stage >= 0 && state.stage < 5 && !state.blocked) {
      later(() => runStage(state.stage + 1), 400);
    }
  },
};

export function useDemo(): DemoState {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => initial,
  );
}

export { emit };
