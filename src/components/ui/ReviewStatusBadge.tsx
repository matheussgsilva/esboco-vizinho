import type { ReviewStatus } from "../../../generated/enums";

const LABELS: Record<ReviewStatus, string> = {
  PUBLISHED: "Publicada",
  FLAGGED: "Denunciada",
  REMOVED: "Removida",
};

const CLASSES: Record<ReviewStatus, string> = {
  PUBLISHED: "bg-success/10 text-success",
  FLAGGED: "bg-amber-100 text-amber-800",
  REMOVED: "bg-red-100 text-red-700",
};

export function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${CLASSES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
