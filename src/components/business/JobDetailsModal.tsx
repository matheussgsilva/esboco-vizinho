"use client";

import { useRef } from "react";
import { Modal } from "@/components/ui/Modal";
import { JobStatusPill } from "@/components/business/JobStatusPill";
import { formatSalary } from "@/lib/format";
import { JOB_TYPE_LABELS, WORK_MODE_LABELS } from "@/lib/validations/job";
import type { JobRecord } from "@/components/business/job-types";

const dateFormatter = new Intl.DateTimeFormat("pt-BR");

interface JobDetailsModalProps {
  job: JobRecord;
  onClose: () => void;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-ink-muted">{label}</dt>
      <dd className="mt-0.5 text-sm text-ink">{value}</dd>
    </div>
  );
}

export function JobDetailsModal({ job, onClose }: JobDetailsModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const location = [job.city, job.state].filter(Boolean).join(", ") || "—";
  const salary = job.showSalary ? formatSalary(job) : null;

  return (
    <Modal ref={dialogRef} title={job.title} onClose={onClose}>
      <div className="space-y-4">
        <JobStatusPill status={job.status} expired={job.expired} />

        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DetailRow label="Tipo de contratação" value={JOB_TYPE_LABELS[job.type]} />
          <DetailRow label="Modalidade" value={WORK_MODE_LABELS[job.workMode]} />
          <DetailRow label="Localização" value={location} />
          <DetailRow label="Fecha em" value={dateFormatter.format(job.closesAt)} />
          {salary && <DetailRow label="Salário" value={salary} />}
          {job.contactEmail && <DetailRow label="Email de contato" value={job.contactEmail} />}
          {job.applicationUrl && <DetailRow label="Link de candidatura" value={job.applicationUrl} />}
        </dl>

        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-ink-muted">Descrição</dt>
          <dd className="mt-0.5 whitespace-pre-wrap text-sm text-ink">{job.description}</dd>
        </div>
      </div>
    </Modal>
  );
}
