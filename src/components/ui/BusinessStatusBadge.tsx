import type { BusinessStatus } from "../../../generated/enums";

const LABELS: Record<BusinessStatus, string> = {
  PENDING: "Pendente",
  APPROVED: "Aprovada",
  SUSPENDED: "Suspensa",
  REJECTED: "Rejeitada",
};

const CLASSES: Record<BusinessStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-success/10 text-success",
  SUSPENDED: "bg-red-100 text-red-700",
  REJECTED: "bg-red-100 text-red-700",
};

export function BusinessStatusBadge({ status }: { status: BusinessStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${CLASSES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
