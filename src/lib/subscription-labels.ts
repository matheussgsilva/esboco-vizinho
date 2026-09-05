import type { SubscriptionStatus } from "../../generated/enums";

export const SUBSCRIPTION_STATUS_LABELS: Record<SubscriptionStatus, string> = {
  TRIALING: "Em teste",
  ACTIVE: "Ativa",
  PAST_DUE: "Pagamento atrasado",
  CANCELED: "Cancelada",
  UNPAID: "Não paga",
  INCOMPLETE: "Incompleta",
  INCOMPLETE_EXPIRED: "Expirada",
  PAUSED: "Pausada",
};
