import type { BusinessStatus } from "../../generated/enums";
import type { BusinessModerationInput } from "@/lib/validations/admin";

export interface BusinessTransition {
  intent: BusinessModerationInput["intent"];
  label: string;
  variant: "primary" | "secondary" | "danger";
  confirmText: string;
  nextStatus: BusinessStatus;
}

const TRANSITIONS: Record<BusinessStatus, BusinessTransition[]> = {
  PENDING: [
    {
      intent: "approve",
      label: "Aprovar",
      variant: "primary",
      confirmText: "Aprovar esta empresa? O dono receberá um email de confirmação.",
      nextStatus: "APPROVED",
    },
    {
      intent: "reject",
      label: "Rejeitar",
      variant: "danger",
      confirmText: "Rejeitar este cadastro de empresa?",
      nextStatus: "REJECTED",
    },
  ],
  APPROVED: [
    {
      intent: "suspend",
      label: "Suspender",
      variant: "danger",
      confirmText: "Suspender esta empresa? Ela deixará de aparecer na busca pública.",
      nextStatus: "SUSPENDED",
    },
  ],
  SUSPENDED: [
    {
      intent: "reactivate",
      label: "Reativar",
      variant: "primary",
      confirmText: "Reativar esta empresa? Ela volta a aparecer na busca pública.",
      nextStatus: "APPROVED",
    },
  ],
  REJECTED: [
    {
      intent: "reconsider",
      label: "Reconsiderar (aprovar)",
      variant: "primary",
      confirmText: "Aprovar esta empresa apesar da rejeição anterior?",
      nextStatus: "APPROVED",
    },
  ],
};

export function getValidTransitions(status: BusinessStatus): BusinessTransition[] {
  return TRANSITIONS[status];
}

export function resolveTransition(
  status: BusinessStatus,
  intent: BusinessModerationInput["intent"]
): BusinessTransition | null {
  return TRANSITIONS[status].find((t) => t.intent === intent) ?? null;
}
