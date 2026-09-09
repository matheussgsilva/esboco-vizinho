"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { ConfirmSubmitButton } from "@/components/ui/ConfirmSubmitButton";
import { Modal } from "@/components/ui/Modal";
import { SelectField } from "@/components/ui/SelectField";
import { jobAction, type JobState } from "@/app/(business)/painel/vagas/actions";
import { JobFormFields } from "@/components/business/JobFormFields";
import { JOB_STATUSES, JOB_STATUS_LABELS } from "@/lib/validations/job";
import type { JobRecord } from "@/components/business/job-types";

const INITIAL_STATE: JobState = {};

type JobFormModalProps =
  | { mode: "create"; defaultCity?: string | null; defaultState?: string | null; onClose: () => void }
  | { mode: "edit"; job: JobRecord; onClose: () => void };

export function JobFormModal(props: JobFormModalProps) {
  const [state, formAction, isPending] = useActionState(jobAction, INITIAL_STATE);
  const errors = state.fieldErrors ?? {};
  const dialogRef = useRef<HTMLDialogElement>(null);
  const hasSubmittedRef = useRef(false);

  useEffect(() => {
    if (hasSubmittedRef.current && !isPending && !state.error && !state.fieldErrors) {
      dialogRef.current?.close();
    }
  }, [isPending, state]);

  const isEdit = props.mode === "edit";

  return (
    <Modal ref={dialogRef} title={isEdit ? "Editar vaga" : "Anunciar vaga"} onClose={props.onClose}>
      <form
        action={formAction}
        onSubmit={() => {
          hasSubmittedRef.current = true;
        }}
        className="space-y-4"
      >
        {!isEdit && <input type="hidden" name="intent" value="create" />}
        {isEdit && <input type="hidden" name="id" value={props.job.id} />}

        <JobFormFields
          defaultValues={
            isEdit
              ? { ...props.job }
              : { city: props.defaultCity, state: props.defaultState }
          }
          errors={errors}
        />

        {isEdit && (
          <SelectField label="Status" name="status" defaultValue={props.job.status} error={errors.status}>
            {JOB_STATUSES.map((status) => (
              <option key={status} value={status}>
                {JOB_STATUS_LABELS[status]}
              </option>
            ))}
          </SelectField>
        )}

        {state.error && <p className="text-sm text-red-600">{state.error}</p>}

        <div className="flex gap-2 pt-2">
          <Button
            type="submit"
            {...(isEdit ? { name: "intent", value: "update" } : {})}
            variant={isEdit ? "primary" : "secondary"}
            disabled={isPending}
          >
            {isPending ? (isEdit ? "Salvando..." : "Publicando...") : isEdit ? "Salvar" : "Publicar vaga"}
          </Button>
          {isEdit && (
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
          )}
        </div>
      </form>
    </Modal>
  );
}
