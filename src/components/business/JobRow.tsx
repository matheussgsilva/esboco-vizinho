"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { ConfirmSubmitButton } from "@/components/ui/ConfirmSubmitButton";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { jobAction, type JobState } from "@/app/(business)/painel/vagas/actions";
import {
  JOB_STATUSES,
  JOB_STATUS_LABELS,
  JOB_TYPES,
  JOB_TYPE_LABELS,
  WORK_MODES,
  WORK_MODE_LABELS,
} from "@/lib/validations/job";

const INITIAL_STATE: JobState = {};

const selectClassName =
  "w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-coral/40";

interface JobRowProps {
  job: {
    id: string;
    title: string;
    description: string;
    type: string;
    workMode: string;
    city: string | null;
    state: string | null;
    salaryMin: number | null;
    salaryMax: number | null;
    showSalary: boolean;
    contactEmail: string | null;
    applicationUrl: string | null;
    status: string;
    closesAt: Date;
    expired: boolean;
  };
}

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function JobRow({ job }: JobRowProps) {
  const [state, formAction, isPending] = useActionState(jobAction, INITIAL_STATE);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-4 rounded-lg border border-border bg-surface p-4">
      <input type="hidden" name="id" value={job.id} />

      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-medium text-ink">{job.title}</h3>
        {job.expired && (
          <span className="rounded-full bg-surface-sand px-2 py-0.5 text-xs font-medium text-ink">
            Prazo vencido — será fechada automaticamente
          </span>
        )}
      </div>

      <FormField label="Título" name="title" defaultValue={job.title} error={errors.title} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-ink">Tipo de contratação</label>
          <select name="type" defaultValue={job.type} className={selectClassName}>
            {JOB_TYPES.map((type) => (
              <option key={type} value={type}>
                {JOB_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-ink">Modalidade</label>
          <select name="workMode" defaultValue={job.workMode} className={selectClassName}>
            {WORK_MODES.map((mode) => (
              <option key={mode} value={mode}>
                {WORK_MODE_LABELS[mode]}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-ink">Status</label>
          <select name="status" defaultValue={job.status} className={selectClassName}>
            {JOB_STATUSES.map((status) => (
              <option key={status} value={status}>
                {JOB_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Cidade" name="city" defaultValue={job.city ?? ""} error={errors.city} />
        <FormField label="Estado" name="state" defaultValue={job.state ?? ""} error={errors.state} />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-ink">Descrição</label>
        <textarea
          name="description"
          rows={4}
          defaultValue={job.description}
          className="w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-coral/40"
        />
        {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Salário mínimo"
          name="salaryMin"
          type="number"
          step="0.01"
          min="0"
          defaultValue={job.salaryMin ?? ""}
          error={errors.salaryMin}
        />
        <FormField
          label="Salário máximo"
          name="salaryMax"
          type="number"
          step="0.01"
          min="0"
          defaultValue={job.salaryMax ?? ""}
          error={errors.salaryMax}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-ink-muted">
        <input type="checkbox" name="showSalary" defaultChecked={job.showSalary} />
        Mostrar salário na vaga pública
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Email de contato"
          name="contactEmail"
          type="email"
          defaultValue={job.contactEmail ?? ""}
          error={errors.contactEmail}
        />
        <FormField
          label="Link de candidatura"
          name="applicationUrl"
          type="url"
          defaultValue={job.applicationUrl ?? ""}
          error={errors.applicationUrl}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-ink">Data de fechamento</label>
        <Input name="closesAt" type="date" defaultValue={toDateInputValue(job.closesAt)} />
        {errors.closesAt && <p className="text-sm text-red-600">{errors.closesAt}</p>}
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="flex gap-2">
        <Button type="submit" name="intent" value="update" disabled={isPending}>
          Salvar
        </Button>
        <ConfirmSubmitButton
          type="submit"
          name="intent"
          value="delete"
          variant="danger"
          disabled={isPending}
          confirmText="Excluir esta vaga permanentemente?"
        >
          Excluir
        </ConfirmSubmitButton>
      </div>
    </form>
  );
}
