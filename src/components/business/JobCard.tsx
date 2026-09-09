import Link from "next/link";
import { JOB_TYPE_LABELS, WORK_MODE_LABELS, type JobTypeCode, type WorkModeCode } from "@/lib/validations/job";

const currencyFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export interface JobCardData {
  id: string;
  title: string;
  businessName: string;
  city: string | null;
  state: string | null;
  type: JobTypeCode;
  workMode: WorkModeCode;
  salaryMin: number | null;
  salaryMax: number | null;
  showSalary: boolean;
}

function formatSalary(job: Pick<JobCardData, "salaryMin" | "salaryMax">) {
  if (job.salaryMin != null && job.salaryMax != null) {
    return `${currencyFormatter.format(job.salaryMin)} - ${currencyFormatter.format(job.salaryMax)}`;
  }
  if (job.salaryMin != null) return `A partir de ${currencyFormatter.format(job.salaryMin)}`;
  if (job.salaryMax != null) return `Até ${currencyFormatter.format(job.salaryMax)}`;
  return null;
}

export function JobCard({ job }: { job: JobCardData }) {
  const location = [job.city, job.state].filter(Boolean).join(", ");
  const salary = job.showSalary ? formatSalary(job) : null;

  return (
    <Link
      href={`/vagas/${job.id}`}
      className="block space-y-2 rounded-lg border border-border bg-surface p-4 transition-shadow hover:shadow-md"
    >
      <h3 className="text-base font-semibold text-ink">{job.title}</h3>
      <p className="text-sm text-ink-muted">
        {job.businessName}
        {location && ` · ${location}`}
      </p>
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-ink-muted">
          {JOB_TYPE_LABELS[job.type]}
        </span>
        <span className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-ink-muted">
          {WORK_MODE_LABELS[job.workMode]}
        </span>
      </div>
      {salary && <p className="text-sm font-medium text-ink">{salary}</p>}
    </Link>
  );
}
