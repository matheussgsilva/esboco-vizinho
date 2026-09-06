"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { ConfirmSubmitButton } from "@/components/ui/ConfirmSubmitButton";
import { StarRatingInput } from "@/components/ui/StarRatingInput";
import {
  upsertReviewAction,
  deleteReviewAction,
  type ReviewState,
} from "@/app/(public)/empresas/[slug]/actions";

const INITIAL_STATE: ReviewState = {};

interface ReviewFormProps {
  businessId: string;
  slug: string;
  existingReview?: { rating: number; comment: string | null } | null;
}

export function ReviewForm({ businessId, slug, existingReview }: ReviewFormProps) {
  const [state, formAction, isPending] = useActionState(upsertReviewAction, INITIAL_STATE);
  const [deleteState, deleteFormAction, isDeletePending] = useActionState(
    deleteReviewAction,
    INITIAL_STATE
  );
  const errors = state.fieldErrors ?? {};

  return (
    <div className="space-y-3 rounded-lg border border-border bg-surface p-4">
      <form action={formAction} className="space-y-3">
        <input type="hidden" name="businessId" value={businessId} />
        <input type="hidden" name="slug" value={slug} />

        <h3 className="text-sm font-semibold text-ink">
          {existingReview ? "Sua avaliação" : "Deixe sua avaliação"}
        </h3>

        <StarRatingInput defaultValue={existingReview?.rating ?? 0} />
        {errors.rating && <p className="text-sm text-red-600">{errors.rating}</p>}

        <textarea
          name="comment"
          rows={3}
          defaultValue={existingReview?.comment ?? ""}
          placeholder="Conte como foi sua experiência (opcional)"
          className="w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-coral/40"
        />
        {errors.comment && <p className="text-sm text-red-600">{errors.comment}</p>}

        {state.error && <p className="text-sm text-red-600">{state.error}</p>}

        <Button type="submit" disabled={isPending}>
          {isPending ? "Enviando..." : existingReview ? "Atualizar avaliação" : "Publicar avaliação"}
        </Button>
      </form>

      {existingReview && (
        <form action={deleteFormAction}>
          <input type="hidden" name="businessId" value={businessId} />
          <input type="hidden" name="slug" value={slug} />
          {deleteState.error && <p className="text-sm text-red-600">{deleteState.error}</p>}
          <ConfirmSubmitButton
            type="submit"
            variant="danger"
            disabled={isDeletePending}
            confirmText="Excluir sua avaliação?"
          >
            Excluir avaliação
          </ConfirmSubmitButton>
        </form>
      )}
    </div>
  );
}
