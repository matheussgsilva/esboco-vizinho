import { FormField } from "@/components/ui/FormField";
import { SelectField } from "@/components/ui/SelectField";
import { Input } from "@/components/ui/Input";
import { BRAZILIAN_STATES } from "@/lib/brazilian-states";
import {
  JOB_TYPES,
  JOB_TYPE_LABELS,
  WORK_MODES,
  WORK_MODE_LABELS,
  type JobTypeCode,
  type WorkModeCode,
} from "@/lib/validations/job";

export interface JobFormFieldsValues {
  title?: string;
  type?: JobTypeCode;
  workMode?: WorkModeCode;
  city?: string | null;
  state?: string | null;
  description?: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  showSalary?: boolean;
  contactEmail?: string | null;
  applicationUrl?: string | null;
  closesAt?: Date | null;
}

interface JobFormFieldsProps {
  defaultValues: JobFormFieldsValues;
  errors: Record<string, string>;
}

function toDateInputValue(date: Date | null | undefined) {
  return date ? date.toISOString().slice(0, 10) : "";
}

export function JobFormFields({ defaultValues, errors }: JobFormFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField label="Título" name="title" defaultValue={defaultValues.title ?? ""} required error={errors.title} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectField label="Tipo de contratação" name="type" defaultValue={defaultValues.type ?? JOB_TYPES[0]} error={errors.type}>
          {JOB_TYPES.map((type) => (
            <option key={type} value={type}>
              {JOB_TYPE_LABELS[type]}
            </option>
          ))}
        </SelectField>

        <SelectField label="Modalidade" name="workMode" defaultValue={defaultValues.workMode ?? WORK_MODES[0]} error={errors.workMode}>
          {WORK_MODES.map((mode) => (
            <option key={mode} value={mode}>
              {WORK_MODE_LABELS[mode]}
            </option>
          ))}
        </SelectField>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Cidade" name="city" defaultValue={defaultValues.city ?? ""} error={errors.city} />
        <SelectField label="Estado" name="state" defaultValue={defaultValues.state ?? ""} error={errors.state}>
          <option value="">Selecione</option>
          {BRAZILIAN_STATES.map((state) => (
            <option key={state.code} value={state.code}>
              {state.code} — {state.name}
            </option>
          ))}
        </SelectField>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="description" className="text-sm font-medium text-ink">
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={defaultValues.description ?? ""}
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
          defaultValue={defaultValues.salaryMin ?? ""}
          error={errors.salaryMin}
        />
        <FormField
          label="Salário máximo"
          name="salaryMax"
          type="number"
          step="0.01"
          min="0"
          defaultValue={defaultValues.salaryMax ?? ""}
          error={errors.salaryMax}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-ink-muted">
        <input type="checkbox" name="showSalary" defaultChecked={defaultValues.showSalary ?? true} />
        Mostrar salário na vaga pública
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Email de contato"
          name="contactEmail"
          type="email"
          defaultValue={defaultValues.contactEmail ?? ""}
          error={errors.contactEmail}
        />
        <FormField
          label="Link de candidatura"
          name="applicationUrl"
          type="url"
          placeholder="https://..."
          defaultValue={defaultValues.applicationUrl ?? ""}
          error={errors.applicationUrl}
        />
      </div>
      <p className="text-xs text-ink-muted">Informe pelo menos um dos dois campos acima.</p>

      <div className="space-y-1.5">
        <label htmlFor="closesAt" className="text-sm font-medium text-ink">
          Data de fechamento
        </label>
        <Input id="closesAt" name="closesAt" type="date" defaultValue={toDateInputValue(defaultValues.closesAt)} />
        <p className="text-xs text-ink-muted">
          Padrão: fecha automaticamente 90 dias após a publicação se deixar em branco.
        </p>
        {errors.closesAt && <p className="text-sm text-red-600">{errors.closesAt}</p>}
      </div>
    </div>
  );
}
