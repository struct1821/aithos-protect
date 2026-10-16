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
    subtitle: "Or click 'Download Latest Statement' directly",
    whatToDo: "Click the cyan 'AITHOS Agent' button in the bottom right, OR click 'Download Latest Statement' on the page.",
    whatHappensAfter:
      "AITHOS intercepts browser events locally. Sensitive customer identifiers stay strictly protected in your local browser sandbox.",
    actionLabel: "Open Agent Panel",
    action: () => demo.openPanel(),
  },
  {
    id: "choose-prompt",
    targetId: "agent-prompt-suggestions",
    page: "/bank",
    title: "2. Ask the Agent to Act",
    subtitle: "Select a task or enter custom instruction",
    whatToDo: "Click 'Download my latest statement' in the suggestions, or click 'Download Latest Statement' on the page.",
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
    subtitle: "Observe live animated redaction on the page",
    whatToDo: "Notice the customer info card actively highlighting and masking Rahul's name, email, phone, and PAN with safe placeholder tokens.",
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
    title: "7. Safe Execution",
    subtitle: "Click the statement button or let agent click it",
    whatToDo: "Click 'Download Latest Statement' on the page, or let the agent trigger it.",
    whatHappensAfter:
      "The browser safely processes the download. Statement_September.pdf is downloaded locally with 0 data leaks.",
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
    whatToDo: "Task completed! Click 'Privacy Console' in the top header to inspect the complete zero-leak audit trail.",
    whatHappensAfter:
      "The console reveals transparent metrics: 0 raw personal items shared, complete split-compute breakdown, and an immutable log.",
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
    subtitle: "Or click 'Confirm Booking' directly",
    whatToDo: "Click the cyan 'AITHOS Agent' button, OR click 'Confirm Booking' directly on the flight page.",
    whatHappensAfter:
      "The agent activates its travel privacy sandbox. Passport number, DOB, and saved card details on screen remain local only.",
    actionLabel: "Open Agent",
    action: () => demo.openPanel(),
  },
  {
    id: "flight-choose",
    targetId: "agent-prompt-suggestions",
    page: "/travel",
    title: "2. Request Flight Booking",
    subtitle: "Select 'Book my flight to Delhi'",
    whatToDo: "Click 'Book my flight to Delhi' in the suggestions list, or click 'Confirm Booking' on the page.",
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
    title: "4. Confirm Flight Booking",
    subtitle: "Agent or manual checkout",
    whatToDo: "Click 'Confirm Booking' on the page or advance the agent panel.",
    whatHappensAfter:
      "AITHOS re-injects the real details locally at submission time. Your ticket is booked without exposing your details to cloud AI.",
    actionLabel: "Confirm Booking",
    action: () => {
      demo.openPanel();
      demo.next();
    },
  },
  {
    id: "flight-console",
    targetId: "nav-privacy-console",
    page: "/travel",
    title: "5. Inspect Privacy Console",
    subtitle: "Verify zero data was leaked",
    whatToDo: "Booking completed! Click 'Privacy Console' in the top header to view the zero-leak audit log.",
    whatHappensAfter:
      "See cryptographic proof that 0 bytes of sensitive passport or card credentials left your device during the flight booking.",
    actionLabel: "Go to Privacy Console",
    action: () => {
      if (typeof window !== "undefined") {
        window.location.href = "/console";
      }
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
  active: true,
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
  syncState: (params: {
    stage: number;
    scenario: string | null;
    panelOpen: boolean;
    completed?: boolean;
    page?: string;
  }) => {
    if (!state.active) return;

    // 1. If task was completed (either manually on the page or through agent)
    if (params.completed) {
      if (state.scenario === "flight" || params.scenario === "flight") {
        if (state.scenario !== "flight") state.scenario = "flight";
        if (state.stepIndex !== 4) {
          state.stepIndex = 4; // Step 5: Inspect Privacy Console
          state.highlightedTarget = "nav-privacy-console";
          emit();
        }
      } else {
        if (state.scenario !== "banking") state.scenario = "banking";
        if (state.stepIndex !== 7) {
          state.stepIndex = 7; // Step 8: Inspect Privacy Console
          state.highlightedTarget = "nav-privacy-console";
          emit();
        }
      }
      return;
    }

    // 2. If leak test scenario
    if (params.scenario === "leak") {
      if (state.scenario !== "leak") {
        state.scenario = "leak";
      }
      if (state.stepIndex !== 1) {
        state.stepIndex = 1;
        state.highlightedTarget = "agent-panel-content";
        emit();
      }
      return;
    }

    // 3. If panel is closed
    if (!params.panelOpen) {
      // Don't reset if user has completed the task
      const isBankDone = state.scenario === "banking" && state.stepIndex === 7;
      const isFlightDone = state.scenario === "flight" && state.stepIndex === 4;
      if (!isBankDone && !isFlightDone) {
        if (state.stepIndex !== 0) {
          state.stepIndex = 0;
          state.highlightedTarget = "agent-launcher-btn";
          emit();
        }
      }
      return;
    }

    // 4. If panel is open and idle (suggestions ready)
    if (params.stage < 0) {
      if (state.stepIndex !== 1) {
        state.stepIndex = 1;
        state.highlightedTarget = "agent-prompt-suggestions";
        emit();
      }
      return;
    }

    // 5. If panel is open and running flight flow
    if (state.scenario === "flight" || params.scenario === "flight") {
      if (state.scenario !== "flight") {
        state.scenario = "flight";
      }
      let mapped = 2; // stage 0 or 1
      if (params.stage >= 1 && params.stage <= 3) mapped = 2; // Mask Passport & Payment
      else if (params.stage >= 4) mapped = 3; // Confirm Booking
      if (state.stepIndex !== mapped) {
        state.stepIndex = mapped;
        const steps = FLIGHT_STEPS;
        state.highlightedTarget = steps[mapped]?.targetId ?? null;
        emit();
      }
      return;
    }

    // 6. If panel is open and running banking flow
    if (state.scenario === "banking") {
      let mapped = 2; // stage 0 or 1: local-protect
      if (params.stage === 1) mapped = 2; // local-protect (PII redaction)
      else if (params.stage === 2) mapped = 3; // safe-context
      else if (params.stage === 3) mapped = 4; // cloud-reasoning
      else if (params.stage === 4) mapped = 5; // verify-action
      else if (params.stage === 5) mapped = 6; // execute-action
      if (state.stepIndex !== mapped) {
        state.stepIndex = mapped;
        const steps = BANKING_STEPS;
        state.highlightedTarget = steps[mapped]?.targetId ?? null;
        emit();
      }
    }
  },
  syncWithDemoStage: (stage: number, scenario: string | null, panelOpen: boolean) => {
    workflowGuide.syncState({ stage, scenario, panelOpen });
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
