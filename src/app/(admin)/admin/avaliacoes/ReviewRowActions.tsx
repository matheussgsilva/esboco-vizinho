"use client";

import { useActionState } from "react";
import { ConfirmSubmitButton } from "@/components/ui/ConfirmSubmitButton";
import { moderateReviewAction, type ReviewModerationState } from "./actions";

const INITIAL_STATE: ReviewModerationState = {};

export function ReviewRowActions({ reviewId }: { reviewId: string }) {
  const [state, formAction, isPending] = useActionState(moderateReviewAction, INITIAL_STATE);

  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <input type="hidden" name="id" value={reviewId} />
      <div className="flex gap-2">
        <ConfirmSubmitButton
          type="submit"
          name="intent"
          value="restore"
          variant="secondary"
          disabled={isPending}
          confirmText="Restaurar esta avaliação como publicada?"
        >
          Restaurar
        </ConfirmSubmitButton>
        <ConfirmSubmitButton
          type="submit"
          name="intent"
          value="remove"
          variant="danger"
          disabled={isPending}
          confirmText="Remover esta avaliação permanentemente da exibição pública?"
        >
          Remover
        </ConfirmSubmitButton>
      </div>
      {state.error && <p className="text-xs text-red-600">{state.error}</p>}
    </form>
  );
}
