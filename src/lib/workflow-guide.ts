import { useSyncExternalStore } from "react";
import { demo } from "./aithos-demo";

export type GuideScenario = "banking" | "flight" | "leak";

export type GuideStep = {
  id: string;
  targetId: string;
  page?: "/bank" | "/travel" | "/console" | "/";
  title: string;
  subtitle: string;
  whatToDo: string;
  whatHappensAfter: string;
  actionLabel?: string;
  action?: () => void;
  panelStageTrigger?: number;
};

export const BANKING_STEPS: GuideStep[] = [
  {
    id: "open-agent",
    targetId: "agent-launcher-btn",
    page: "/bank",
    title: "1. Open AITHOS Agent",
    subtitle: "Initialize local on-device privacy engine",
    whatToDo: "Click the cyan 'AITHOS Agent' button in the bottom right corner.",
    whatHappensAfter:
      "The AITHOS agent panel slides up. It initializes its on-device sandbox directly in your browser. No data leaves your machine.",
    actionLabel: "Open Agent Panel",
    action: () => demo.openPanel(),
  },
  {
    id: "choose-prompt",
    targetId: "agent-prompt-suggestions",
    page: "/bank",
    title: "2. Ask the Agent to Act",
    subtitle: "Select a task or enter custom instruction",
    whatToDo: "Click 'Download my latest statement' or type a command in the input box.",
    whatHappensAfter:
      "AITHOS intercepts the request locally. It scans the current webpage DOM to identify both interactive buttons and personal data fields before touching the network.",
    actionLabel: "Select 'Download statement'",
    action: () => {
      demo.openPanel();
      demo.start("statement", false);
    },
  },
  {
    id: "local-protect",
    targetId: "customer-info-card",
    page: "/bank",
    title: "3. On-Device PII Redaction",
    subtitle: "Detect and mask personal identifiers",
    whatToDo: "Observe the customer info on the page and in the panel turning into protected tokens. Click 'Next' in the panel.",
    whatHappensAfter:
      "All sensitive items (Rahul Sharma, 123456789012, PAN, email) are replaced with synthetic placeholders like [ACCOUNT NUMBER]. Zero identity details leave your computer.",
    actionLabel: "Advance to Safe Context",
    action: () => {
      demo.openPanel();
      demo.next();
    },
  },
  {
    id: "safe-context",
    targetId: "agent-safe-context-card",
    page: "/bank",
    title: "4. Build Safe Context",
    subtitle: "Zero-leak payload verification",
    whatToDo: "Review the BEFORE vs AFTER tokenized comparison card. Click 'Next'.",
    whatHappensAfter:
      "AITHOS confirms that exactly 0 raw personal items will be sent. The outgoing context contains only non-sensitive DOM structure and tokens.",
    actionLabel: "Send Safe Context",
    action: () => {
      demo.openPanel();
      demo.next();
    },
  },
  {
    id: "cloud-reasoning",
    targetId: "agent-split-compute-card",
    page: "/bank",
    title: "5. Split-Compute AI Reasoning",
    subtitle: "Cloud AI reasons without knowing identity",
    whatToDo: "Notice the Cloud Request payload has only tokens. Click 'Next' to evaluate the AI's suggested action.",
    whatHappensAfter:
      "The cloud model matches your intent to the webpage control: 'Download Latest Statement'. It sends back only the action name—not your personal data.",
    actionLabel: "Evaluate Action",
    action: () => {
      demo.openPanel();
      demo.next();
    },
  },
  {
    id: "verify-action",
    targetId: "agent-verification-card",
    page: "/bank",
    title: "6. Intent & Safety Verification",
    subtitle: "On-device guardrails validate safety",
    whatToDo: "Review the 4 safety checks in the panel. Click 'Next' to authorize browser execution.",
    whatHappensAfter:
      "The on-device engine verifies the proposed click matches what you requested, the button is visible and permitted, and no risky operations will occur.",
    actionLabel: "Authorize Execution",
    action: () => {
      demo.openPanel();
      demo.next();
    },
  },
  {
    id: "execute-action",
    targetId: "download-statement",
    page: "/bank",
    title: "7. Safe Local Execution",
    subtitle: "The agent clicks the button locally",
    whatToDo: "Watch the 'Download Latest Statement' button get triggered on the banking page.",
    whatHappensAfter:
      "AITHOS executes the click directly in your browser. Statement_September.pdf is downloaded, and an audit trail is recorded locally with 0 data leaks.",
    actionLabel: "Trigger Execution",
    action: () => {
      demo.openPanel();
      demo.next();
    },
  },
  {
    id: "inspect-console",
    targetId: "nav-privacy-console",
    page: "/bank",
    title: "8. Inspect Privacy Console",
    subtitle: "Verify cryptographic zero-leak audit",
    whatToDo: "Click 'Privacy Console' in the top header or panel to view the complete audit log.",
    whatHappensAfter:
      "The console reveals transparent metrics: 0 raw personal items shared, complete split-compute breakdown, and an immutable log of everything that happened.",
    actionLabel: "Go to Privacy Console",
    action: () => {
      if (typeof window !== "undefined") {
        window.location.href = "/console";
      }
    },
  },
];

export const FLIGHT_STEPS: GuideStep[] = [
  {
    id: "flight-start",
    targetId: "agent-launcher-btn",
    page: "/travel",
    title: "1. Open Flight Booking Agent",
    subtitle: "Book travel with synthetic traveller data",
    whatToDo: "Click the 'AITHOS Agent' button on the SkyWays travel page.",
    whatHappensAfter:
      "The agent activates its travel privacy sandbox. Passport number, DOB, and saved card details on screen will remain local only.",
    actionLabel: "Open Agent",
    action: () => demo.openPanel(),
  },
  {
    id: "flight-choose",
    targetId: "agent-prompt-suggestions",
    page: "/travel",
    title: "2. Request Flight Booking",
    subtitle: "Select 'Book my flight to Delhi'",
    whatToDo: "Click 'Book my flight to Delhi' in the suggestions list.",
    whatHappensAfter:
      "AITHOS scans the flight list and passenger form. It identifies sensitive fields (Passport, Card, DOB) and prepares local tokens.",
    actionLabel: "Start Booking Flow",
    action: () => {
      demo.openPanel();
      demo.start("flight", false);
    },
  },
  {
    id: "flight-protect",
    targetId: "passenger-details-card",
    page: "/travel",
    title: "3. Mask Passport & Payment Data",
    subtitle: "Tokens replace sensitive travel credentials",
    whatToDo: "Watch Passport M8241739 and Card 4211... get tokenized into [PASSPORT] and [CARD]. Click 'Next'.",
    whatHappensAfter:
      "The cloud model never sees your real passport or credit card. Only synthetic placeholders leave your device.",
    actionLabel: "Next Step",
    action: () => {
      demo.openPanel();
      demo.next();
    },
  },
  {
    id: "flight-execute",
    targetId: "confirm-booking-btn",
    page: "/travel",
    title: "4. Autonomous Booking Execution",
    subtitle: "Agent completes checkout locally",
    whatToDo: "Click 'Next' until the booking is confirmed on the airline page.",
    whatHappensAfter:
      "AITHOS re-injects the real details locally at submission time and clicks 'Confirm Booking'. Your ticket is booked without exposing your details to cloud AI.",
    actionLabel: "Confirm Booking",
    action: () => {
      demo.openPanel();
      demo.next();
    },
  },
];

export const LEAK_STEPS: GuideStep[] = [
  {
    id: "leak-start",
    targetId: "agent-launcher-btn",
    page: "/bank",
    title: "1. Test Privacy Guardrails",
    subtitle: "Attempting to leak sensitive data",
    whatToDo: "Open the agent panel and select the red action: 'Send my account number to the AI'.",
    whatHappensAfter:
      "AITHOS intercepts the prompt before sending it. Its on-device policy engine detects that this violates privacy policies.",
    actionLabel: "Trigger Policy Violation Test",
    action: () => {
      demo.openPanel();
      demo.start("leak", true);
    },
  },
  {
    id: "leak-blocked",
    targetId: "agent-panel-content",
    page: "/bank",
    title: "2. Immediate Risk Interception",
    subtitle: "Blocked by AITHOS Privacy Policy",
    whatToDo: "Observe the red 'Privacy Risk Detected' alert and strikethrough of the account number.",
    whatHappensAfter:
      "The request is permanently halted locally. The account number was NEVER sent across the internet, protecting you even if someone malicious tries to extract your data.",
  },
];

type WorkflowState = {
  active: boolean;
  scenario: GuideScenario;
  stepIndex: number;
  highlightedTarget: string | null;
  expandedExplanation: boolean;
};

const initialState: WorkflowState = {
  active: true, // Enabled by default so the user immediately gets guided
  scenario: "banking",
  stepIndex: 0,
  highlightedTarget: "agent-launcher-btn",
  expandedExplanation: true,
};

let state: WorkflowState = { ...initialState };
const listeners = new Set<() => void>();

function emit() {
  state = { ...state };
  listeners.forEach((l) => l());
}

export const workflowGuide = {
  toggle: () => {
    state.active = !state.active;
    emit();
  },
  setActive: (active: boolean) => {
    state.active = active;
    emit();
  },
  setScenario: (scenario: GuideScenario) => {
    state.scenario = scenario;
    state.stepIndex = 0;
    const steps =
      scenario === "banking"
        ? BANKING_STEPS
        : scenario === "flight"
          ? FLIGHT_STEPS
          : LEAK_STEPS;
    state.highlightedTarget = steps[0]?.targetId ?? null;
    emit();
  },
  nextStep: () => {
    const steps =
      state.scenario === "banking"
        ? BANKING_STEPS
        : state.scenario === "flight"
          ? FLIGHT_STEPS
          : LEAK_STEPS;
    if (state.stepIndex < steps.length - 1) {
      state.stepIndex += 1;
      state.highlightedTarget = steps[state.stepIndex]!.targetId;
      emit();
    }
  },
  prevStep: () => {
    const steps =
      state.scenario === "banking"
        ? BANKING_STEPS
        : state.scenario === "flight"
          ? FLIGHT_STEPS
          : LEAK_STEPS;
    if (state.stepIndex > 0) {
      state.stepIndex -= 1;
      state.highlightedTarget = steps[state.stepIndex]!.targetId;
      emit();
    }
  },
  goToStep: (index: number) => {
    const steps =
      state.scenario === "banking"
        ? BANKING_STEPS
        : state.scenario === "flight"
          ? FLIGHT_STEPS
          : LEAK_STEPS;
    if (index >= 0 && index < steps.length) {
      state.stepIndex = index;
      state.highlightedTarget = steps[index]!.targetId;
      emit();
    }
  },
  setHighlightedTarget: (target: string | null) => {
    state.highlightedTarget = target;
    emit();
  },
  toggleExplanation: () => {
    state.expandedExplanation = !state.expandedExplanation;
    emit();
  },
  syncWithDemoStage: (stage: number, scenario: string | null, panelOpen: boolean) => {
    if (!state.active) return;
    if (!panelOpen) {
      if (state.stepIndex !== 0) {
        state.stepIndex = 0;
        state.highlightedTarget = "agent-launcher-btn";
        emit();
      }
      return;
    }
    if (scenario === "leak") {
      if (state.scenario !== "leak") {
        state.scenario = "leak";
        state.stepIndex = 1;
        state.highlightedTarget = "agent-panel-content";
        emit();
      }
      return;
    }
    if (stage < 0) {
      state.stepIndex = 1;
      state.highlightedTarget = "agent-prompt-suggestions";
      emit();
      return;
    }
    // Mapping demo stage (0..5) to guide step in flight flow
    if (state.scenario === "flight" || scenario === "flight") {
      if (state.scenario !== "flight") {
        state.scenario = "flight";
      }
      let mapped = 2;
      if (stage >= 1 && stage <= 3) mapped = 2;
      else if (stage >= 4) mapped = 3;
      if (state.stepIndex !== mapped) {
        state.stepIndex = mapped;
        const steps = FLIGHT_STEPS;
        state.highlightedTarget = steps[mapped]?.targetId ?? null;
        emit();
      }
      return;
    }

    // Mapping demo stage (0..5) to guide step in banking flow
    if (state.scenario === "banking") {
      let mapped = 2; // stage 0 or 1
      if (stage === 1) mapped = 2;
      else if (stage === 2) mapped = 3;
      else if (stage === 3) mapped = 4;
      else if (stage === 4) mapped = 5;
      else if (stage === 5) mapped = 6;
      if (state.stepIndex !== mapped) {
        state.stepIndex = mapped;
        const steps = BANKING_STEPS;
        state.highlightedTarget = steps[mapped]?.targetId ?? null;
        emit();
      }
    }
  },
};

export function useWorkflowGuide(): WorkflowState {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => initialState,
  );
}

export function getCurrentSteps(scenario: GuideScenario): GuideStep[] {
  switch (scenario) {
    case "flight":
      return FLIGHT_STEPS;
    case "leak":
      return LEAK_STEPS;
    case "banking":
    default:
      return BANKING_STEPS;
  }
}
