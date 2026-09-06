"use client";

import { useActionState } from "react";
import { ConfirmSubmitButton } from "@/components/ui/ConfirmSubmitButton";
import { toggleFavoriteAction, type FavoriteState } from "@/app/(public)/empresas/[slug]/actions";

const INITIAL_STATE: FavoriteState = {};

interface RemoveFavoriteButtonProps {
  businessId: string;
  slug: string;
}

export function RemoveFavoriteButton({ businessId, slug }: RemoveFavoriteButtonProps) {
  const [state, formAction, isPending] = useActionState(toggleFavoriteAction, INITIAL_STATE);

  return (
    <form action={formAction}>
      <input type="hidden" name="businessId" value={businessId} />
      <input type="hidden" name="slug" value={slug} />
      {state.error && <p className="mb-1 text-xs text-red-600">{state.error}</p>}
      <ConfirmSubmitButton
        type="submit"
        variant="ghost"
        disabled={isPending}
        confirmText="Remover esta empresa dos favoritos?"
        className="w-full"
      >
        Remover dos favoritos
      </ConfirmSubmitButton>
    </form>
  );
}
