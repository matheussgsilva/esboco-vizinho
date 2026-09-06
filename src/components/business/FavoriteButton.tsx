"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { toggleFavoriteAction, type FavoriteState } from "@/app/(public)/empresas/[slug]/actions";

const INITIAL_STATE: FavoriteState = {};

interface FavoriteButtonProps {
  businessId: string;
  slug: string;
  initialIsFavorited: boolean;
}

export function FavoriteButton({ businessId, slug, initialIsFavorited }: FavoriteButtonProps) {
  const [state, formAction, isPending] = useActionState(toggleFavoriteAction, INITIAL_STATE);

  return (
    <form action={formAction} className="shrink-0">
      <input type="hidden" name="businessId" value={businessId} />
      <input type="hidden" name="slug" value={slug} />
      <Button type="submit" variant={initialIsFavorited ? "secondary" : "ghost"} disabled={isPending}>
        {initialIsFavorited ? "★ Favoritado" : "☆ Favoritar"}
      </Button>
      {state.error && <p className="mt-1 text-xs text-red-600">{state.error}</p>}
    </form>
  );
}
