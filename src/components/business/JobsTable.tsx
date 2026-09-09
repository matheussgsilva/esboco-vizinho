"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { JobFormModal } from "@/components/business/JobFormModal";
import { JobDetailsModal } from "@/components/business/JobDetailsModal";
import { JobStatusPill } from "@/components/business/JobStatusPill";
import { JOB_TYPE_LABELS, WORK_MODE_LABELS } from "@/lib/validations/job";
import type { JobRecord } from "@/components/business/job-types";

const dateFormatter = new Intl.DateTimeFormat("pt-BR");

type ActiveModal = { mode: "create" } | { mode: "edit"; job: JobRecord } | { mode: "details"; job: JobRecord } | null;

interface JobsTableProps {
  jobs: JobRecord[];
  defaultCity?: string | null;
  defaultState?: string | null;
}

export function JobsTable({ jobs, defaultCity, defaultState }: JobsTableProps) {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setActiveModal({ mode: "create" })}>Nova vaga</Button>
      </div>

      {jobs.length === 0 ? (
        <p className="rounded-lg border border-border bg-surface px-4 py-8 text-center text-sm text-ink-muted">
          Nenhuma vaga cadastrada ainda.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-lilac/40 text-ink-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Título</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Modalidade</th>
                <th className="px-4 py-3 font-medium">Cidade/UF</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Fecha em</th>
                <th className="px-4 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-ink">{job.title}</td>
                  <td className="px-4 py-3 text-ink-muted">{JOB_TYPE_LABELS[job.type]}</td>
                  <td className="px-4 py-3 text-ink-muted">{WORK_MODE_LABELS[job.workMode]}</td>
                  <td className="px-4 py-3 text-ink-muted">
                    {[job.city, job.state].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <JobStatusPill status={job.status} expired={job.expired} />
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{dateFormatter.format(job.closesAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveModal({ mode: "details", job })}
                        className="font-medium text-ink hover:text-brand-coral"
                      >
                        Detalhes
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveModal({ mode: "edit", job })}
                        className="font-medium text-brand-coral hover:text-brand-coral-dark"
                      >
                        Editar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeModal?.mode === "create" && (
        <JobFormModal
          mode="create"
          defaultCity={defaultCity}
          defaultState={defaultState}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal?.mode === "edit" && (
        <JobFormModal key={activeModal.job.id} mode="edit" job={activeModal.job} onClose={() => setActiveModal(null)} />
      )}
      {activeModal?.mode === "details" && (
        <JobDetailsModal key={activeModal.job.id} job={activeModal.job} onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}
