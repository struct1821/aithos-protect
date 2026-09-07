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

/** Conversational lines the agent "says" at each stage. */
type Voice = {
  ack: string[];
  protect: string[];
  context: string[];
  reason: string[];
  verify: string[];
  execute: string[];
  done: string[];
};

const BASE_VOICE: Pick<Voice, "protect" | "context" | "reason" | "verify"> = {
  protect: [
    "Before I touch anything, let me scan this page for personal details — I don't want any of it leaving your device.",
    "One second — I'm checking what's on screen that shouldn't be shared.",
    "Quick privacy sweep first. Anything identifying gets masked locally.",
  ],
  context: [
    "Okay, everything sensitive is swapped for placeholders. The AI reasoning happens on this masked version, so your real details never travel.",
    "Done — your details are replaced with tokens. What I reason over is meaningless to anyone else.",
    "Masked and ready. I kept the structure so I can still act correctly, minus the real values.",
  ],
  reason: [
    "Now I'm working out which control on this page actually does what you asked.",
    "Let me look at what's clickable here and match it to your request.",
    "Figuring out the right control to use — I only want to touch the one that matters.",
  ],
  verify: [
    "Before I click, I'm double-checking this is safe and really is what you meant.",
    "Running my safety checks — right target, visible, permitted, matches your intent.",
    "Just validating the action so I don't do anything you didn't ask for.",
  ],
};

const VOICES: Record<Exclude<Scenario, "leak">, Voice> = {
  statement: {
    ack: [
      "Sure — you want your most recent statement. Let me handle that for you.",
      "Got it, I'll pull up your latest statement.",
    ],
    reason: BASE_VOICE.reason,
    protect: BASE_VOICE.protect,
    context: BASE_VOICE.context,
    verify: BASE_VOICE.verify,
    execute: [
      "All clear — downloading your statement now.",
      "Checks passed. Grabbing the statement for you.",
    ],
    done: [
      "Your statement is downloaded. Nothing personal was sent anywhere — zero raw details shared.",
      "Done! Statement saved, and your account details never left this device.",
    ],
  },
  transactions: {
    ack: [
      "Happy to — let me open your recent transactions.",
      "Sure thing, I'll bring up your recent activity.",
    ],
    reason: BASE_VOICE.reason,
    protect: BASE_VOICE.protect,
    context: BASE_VOICE.context,
    verify: BASE_VOICE.verify,
    execute: ["Opening your transactions now.", "Safe to proceed — pulling up your activity."],
    done: [
      "There you go — your recent transactions are open, with none of your personal details exposed.",
      "Transactions are up. Everything identifying stayed masked the whole time.",
    ],
  },
  history: {
    ack: [
      "Of course — let me find your older statements.",
      "Sure, I'll open your statement history.",
    ],
    reason: BASE_VOICE.reason,
    protect: BASE_VOICE.protect,
    context: BASE_VOICE.context,
    verify: BASE_VOICE.verify,
    execute: ["Opening your statement history.", "All good — loading your past statements."],
    done: [
      "Your statement history is open. No personal data was shared to get there.",
      "Done — past statements are showing, privacy intact.",
    ],
  },
  flight: {
    ack: [
      "Sure — a flight to Delhi. I'll fill in the booking for you.",
      "Got it, let me book that Delhi flight.",
    ],
    reason: BASE_VOICE.reason,
    protect: [
      "This form has your passport, birth date and card on it — let me lock those down before I do anything.",
      "Booking pages are sensitive. Scanning for passport, card and personal details first.",
    ],
    context: BASE_VOICE.context,
    verify: [
      "A booking spends money, so I'm being extra careful before confirming.",
      "Double-checking everything before I confirm — this one's irreversible.",
    ],
    execute: [
      "Everything checks out — filling the form and confirming the booking.",
      "Approved. Completing your booking now.",
    ],
    done: [
      "Your flight is booked. Your passport and card details were never exposed — only masked placeholders were used for reasoning.",
      "Booked! And none of your travel documents or payment details were shared.",
    ],
  },
  seats: {
    ack: ["Sure — let me change your seat.", "Got it, I'll sort your seat out."],
    reason: BASE_VOICE.reason,
    protect: BASE_VOICE.protect,
    context: BASE_VOICE.context,
    verify: BASE_VOICE.verify,
    execute: ["Opening seat selection and picking a window seat.", "Safe to go — updating your seat."],
    done: [
      "Seat updated. Your booking details stayed private the whole way through.",
      "Done — new seat is set, and nothing personal was shared.",
    ],
  },
};

const LEAK_VOICE = {
  ack: [
    "Hold on — I need to look at what you're asking me to share.",
    "Let me check that request before I do anything.",
  ],
  block: [
    "I can't do that one. Your account number is exactly the kind of thing I'm built to keep off the wire — I'll happily use it locally to complete a task, but I won't hand it to a model.",
    "That's a no from me. Sending your account number to an AI would defeat the point — I can act on your account without ever revealing it.",
  ],
};

const NO_MATCH = [
  "I'm not seeing anything on this page that does that. Try one of the suggestions above and I'll take it from there.",
  "Hmm — I couldn't find a control here that matches that. Want to try one of the requests above?",
];

function pick(list: string[], seed: number): string {
  return list[seed % list.length] ?? list[0]!;
}

/** The line the agent "says" for a given stage of the current run. */
export function agentLine(
  scenario: Scenario,
  stage: number,
  seed: number,
  finished = false,
): string | null {
  if (scenario === "leak") {
    if (stage === 0) return pick(LEAK_VOICE.ack, seed);
    if (stage === 1) return finished ? pick(LEAK_VOICE.block, seed) : null;
    return null;
  }
  const v = VOICES[scenario];
  if (!v) return null;
  switch (stage) {
    case 0:
      return pick(v.ack, seed);
    case 1:
      return pick(v.protect, seed);
    case 2:
      return pick(v.context, seed);
    case 3:
      return pick(v.reason, seed);
    case 4:
      return pick(v.verify, seed);
    case 5:
      return finished ? pick(v.done, seed) : pick(v.execute, seed);
    default:
      return null;
  }
}

export function noMatchLine(seed: number) {
  return pick(NO_MATCH, seed);
}

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
  /** varies the agent's wording between runs */
  seed: number;
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
  seed: 0,
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
  submit(text: string, allowed: Scenario[]) {
    const prompt = text.trim();
    if (!prompt) return;
    const match = matchIntent(prompt, allowed);
    if (!match) {
      clearTimers();
      set({ ...initial, panelOpen: true, prompt, unmatched: prompt, seed: Math.floor(Math.random() * 1000) });
      return;
    }
    demo.start(match, true, prompt);
  },
  start(scenario: Scenario, autoplay = true, prompt?: string) {
    clearTimers();
    set({
      ...initial,
      panelOpen: true,
      scenario,
      autoplay,
      seed: Math.floor(Math.random() * 1000),
      prompt: prompt ?? COMMANDS[scenario],
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
    demo.start(state.scenario, state.autoplay, state.prompt);
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
