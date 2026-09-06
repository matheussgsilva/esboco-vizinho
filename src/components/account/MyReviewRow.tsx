"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ConfirmSubmitButton } from "@/components/ui/ConfirmSubmitButton";
import { StarRating } from "@/components/ui/StarRating";
import { deleteReviewAction, type ReviewState } from "@/app/(public)/empresas/[slug]/actions";

const INITIAL_STATE: ReviewState = {};

const dateFormatter = new Intl.DateTimeFormat("pt-BR");

interface MyReviewRowProps {
  review: {
    businessId: string;
    businessName: string;
    businessSlug: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
  };
}

export function MyReviewRow({ review }: MyReviewRowProps) {
  const [state, formAction, isPending] = useActionState(deleteReviewAction, INITIAL_STATE);

  return (
    <div className="space-y-1.5 rounded-lg border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/empresas/${review.businessSlug}`}
          className="font-medium text-ink hover:text-brand-coral hover:underline"
        >
          {review.businessName}
        </Link>
        <span className="shrink-0 text-xs text-ink-muted">{dateFormatter.format(review.createdAt)}</span>
      </div>
      <StarRating rating={review.rating} />
      <p className="text-sm text-ink">{review.comment ?? "(sem comentário)"}</p>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <form action={formAction}>
        <input type="hidden" name="businessId" value={review.businessId} />
        <input type="hidden" name="slug" value={review.businessSlug} />
        <ConfirmSubmitButton
          type="submit"
          variant="danger"
          disabled={isPending}
          confirmText="Excluir esta avaliação?"
        >
          Excluir
        </ConfirmSubmitButton>
      </form>
    </div>
  );
}
