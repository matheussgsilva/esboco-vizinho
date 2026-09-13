"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { ConfirmSubmitButton } from "@/components/ui/ConfirmSubmitButton";
import {
  upsertOwnerResponseAction,
  deleteOwnerResponseAction,
  type OwnerResponseState,
} from "@/app/(business)/painel/avaliacoes/actions";

const INITIAL_STATE: OwnerResponseState = {};

interface OwnerResponseFormProps {
  reviewId: string;
  slug: string;
  existingResponse?: string | null;
}

export function OwnerResponseForm({ reviewId, slug, existingResponse }: OwnerResponseFormProps) {
  const [state, formAction, isPending] = useActionState(upsertOwnerResponseAction, INITIAL_STATE);
  const [deleteState, deleteFormAction, isDeletePending] = useActionState(
    deleteOwnerResponseAction,
    INITIAL_STATE
  );
  const errors = state.fieldErrors ?? {};

  return (
    <div className="space-y-2 border-t border-border pt-3">
      <form action={formAction} className="space-y-2">
        <input type="hidden" name="reviewId" value={reviewId} />
        <input type="hidden" name="slug" value={slug} />

        <label htmlFor={`response-${reviewId}`} className="text-xs font-medium text-ink-muted">
          {existingResponse ? "Sua resposta" : "Responder a esta avaliação"}
        </label>
        <textarea
          id={`response-${reviewId}`}
          name="response"
          rows={2}
          defaultValue={existingResponse ?? ""}
          placeholder="Agradeça ou esclareça algo sobre esta avaliação..."
          className="w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-coral/40"
        />
        {errors.response && <p className="text-sm text-red-600">{errors.response}</p>}
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}

        <Button type="submit" variant="secondary" disabled={isPending}>
          {isPending ? "Enviando..." : existingResponse ? "Atualizar resposta" : "Responder"}
        </Button>
      </form>

      {existingResponse && (
        <form action={deleteFormAction}>
          <input type="hidden" name="reviewId" value={reviewId} />
          <input type="hidden" name="slug" value={slug} />
          {deleteState.error && <p className="text-sm text-red-600">{deleteState.error}</p>}
          <ConfirmSubmitButton
            type="submit"
            variant="danger"
            disabled={isDeletePending}
            confirmText="Excluir sua resposta?"
          >
            Excluir resposta
          </ConfirmSubmitButton>
        </form>
      )}
    </div>
  );
}
