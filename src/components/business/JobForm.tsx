"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { jobAction, type JobState } from "@/app/(business)/painel/vagas/actions";
import { JOB_TYPES, JOB_TYPE_LABELS, WORK_MODES, WORK_MODE_LABELS } from "@/lib/validations/job";

const INITIAL_STATE: JobState = {};

const selectClassName =
  "w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-coral/40";

interface JobFormProps {
  defaultCity?: string | null;
  defaultState?: string | null;
}

export function JobForm({ defaultCity, defaultState }: JobFormProps) {
  const [state, formAction, isPending] = useActionState(jobAction, INITIAL_STATE);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-4 rounded-lg border border-border bg-surface p-4">
      <input type="hidden" name="intent" value="create" />
      <h2 className="text-sm font-semibold text-ink">Anunciar vaga</h2>

      <FormField label="Título" name="title" required error={errors.title} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="type" className="text-sm font-medium text-ink">
            Tipo de contratação
          </label>
          <select id="type" name="type" defaultValue={JOB_TYPES[0]} className={selectClassName}>
            {JOB_TYPES.map((type) => (
              <option key={type} value={type}>
                {JOB_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
          {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="workMode" className="text-sm font-medium text-ink">
            Modalidade
          </label>
          <select id="workMode" name="workMode" defaultValue={WORK_MODES[0]} className={selectClassName}>
            {WORK_MODES.map((mode) => (
              <option key={mode} value={mode}>
                {WORK_MODE_LABELS[mode]}
              </option>
            ))}
          </select>
          {errors.workMode && <p className="text-sm text-red-600">{errors.workMode}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Cidade" name="city" defaultValue={defaultCity ?? ""} error={errors.city} />
        <FormField label="Estado" name="state" defaultValue={defaultState ?? ""} error={errors.state} />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="description" className="text-sm font-medium text-ink">
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
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
          error={errors.salaryMin}
        />
        <FormField
          label="Salário máximo"
          name="salaryMax"
          type="number"
          step="0.01"
          min="0"
          error={errors.salaryMax}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-ink-muted">
        <input type="checkbox" name="showSalary" defaultChecked />
        Mostrar salário na vaga pública
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Email de contato"
          name="contactEmail"
          type="email"
          error={errors.contactEmail}
        />
        <FormField
          label="Link de candidatura"
          name="applicationUrl"
          type="url"
          placeholder="https://..."
          error={errors.applicationUrl}
        />
      </div>
      <p className="text-xs text-ink-muted">Informe pelo menos um dos dois campos acima.</p>

      <div className="space-y-1.5">
        <label htmlFor="closesAt" className="text-sm font-medium text-ink">
          Data de fechamento
        </label>
        <Input id="closesAt" name="closesAt" type="date" />
        <p className="text-xs text-ink-muted">
          Padrão: fecha automaticamente 90 dias após a publicação se deixar em branco.
        </p>
        {errors.closesAt && <p className="text-sm text-red-600">{errors.closesAt}</p>}
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <Button type="submit" variant="secondary" disabled={isPending}>
        {isPending ? "Publicando..." : "Publicar vaga"}
      </Button>
    </form>
  );
}
