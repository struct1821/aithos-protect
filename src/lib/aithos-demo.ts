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
  flight: "Book my flight to Delhi",
  leak: "Send my account number to the AI",
};

type ScenarioConfig = {
  fields: readonly { key: string; label: string; raw: string; token: string }[];
  actionLabel: string;
  successTitle: string;
  executingText: string;
};

export const SCENARIOS: Record<"statement" | "flight", ScenarioConfig> = {
  statement: {
    fields: SENSITIVE_FIELDS,
    actionLabel: "Download Latest Statement",
    successTitle: "Statement Downloaded",
    executingText: 'Clicking "Download Latest Statement" on the page...',
  },
  flight: {
    fields: FLIGHT_FIELDS,
    actionLabel: "Confirm Booking",
    successTitle: "Flight Booked",
    executingText: 'Filling the booking form and clicking "Confirm Booking"...',
  },
};

export type DemoState = {
  panelOpen: boolean;
  scenario: Scenario | null;
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
