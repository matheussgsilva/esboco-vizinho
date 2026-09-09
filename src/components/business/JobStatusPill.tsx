import type { JobStatusCode } from "@/lib/validations/job";

interface JobStatusPillProps {
  status: JobStatusCode;
  expired: boolean;
}

export function JobStatusPill({ status, expired }: JobStatusPillProps) {
  if (status === "OPEN" && expired) {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
        Prazo vencido
      </span>
    );
  }

  if (status === "OPEN") {
    return (
      <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
        Aberta
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-surface-sand px-2.5 py-1 text-xs font-medium text-ink-muted">
      Fechada
    </span>
  );
}
