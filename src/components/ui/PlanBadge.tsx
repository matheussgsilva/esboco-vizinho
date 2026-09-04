import type { PlanType } from "../../../generated/enums";

const LABELS: Record<PlanType, string> = {
  FREE: "Gratuito",
  BASIC: "Básico",
  PRO: "Pro",
};

const CLASSES: Record<PlanType, string> = {
  FREE: "bg-border/60 text-ink-muted",
  BASIC: "bg-brand-teal/10 text-brand-teal",
  PRO: "bg-brand-coral/10 text-brand-coral-dark",
};

export function PlanBadge({ plan }: { plan: PlanType }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${CLASSES[plan]}`}
    >
      {LABELS[plan]}
    </span>
  );
}
