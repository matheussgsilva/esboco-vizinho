import type { PlanType } from "../../generated/enums";

interface PlanDefinition {
  type: PlanType;
  name: string;
  /** null para o plano Gratuito, que não passa pelo Stripe Checkout. */
  stripePriceId: string | null;
  features: string[];
}

export const PLANS: Record<Exclude<PlanType, "FREE"> | "FREE", PlanDefinition> = {
  FREE: {
    type: "FREE",
    name: "Gratuito",
    stripePriceId: null,
    features: ["Perfil público básico", "Sem prioridade na busca"],
  },
  BASIC: {
    type: "BASIC",
    name: "Básico",
    stripePriceId: process.env.STRIPE_PRICE_BASIC ?? null,
    features: ["Prioridade na busca", "Perfil público básico"],
  },
  PRO: {
    type: "PRO",
    name: "Pro",
    stripePriceId: process.env.STRIPE_PRICE_PRO ?? null,
    features: ["Prioridade máxima na busca", "Destaque na página inicial"],
  },
};

export function planByPriceId(priceId: string): PlanType | null {
  const entry = Object.values(PLANS).find((p) => p.stripePriceId === priceId);
  return entry?.type ?? null;
}
