"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import {
  updateBusinessCategoriesAction,
  type BusinessCategoriesState,
} from "@/app/(business)/painel/perfil/actions";

const INITIAL_STATE: BusinessCategoriesState = {};

interface BusinessCategoriesFormProps {
  categories: { id: string; name: string }[];
  selectedIds: string[];
}

export function BusinessCategoriesForm({ categories, selectedIds }: BusinessCategoriesFormProps) {
  const [state, formAction, isPending] = useActionState(updateBusinessCategoriesAction, INITIAL_STATE);

  return (
    <form action={formAction} className="space-y-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {categories.map((category) => (
          <label key={category.id} className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              name="categoryIds"
              value={category.id}
              defaultChecked={selectedIds.includes(category.id)}
              className="h-4 w-4 rounded border-border text-brand-coral focus:ring-brand-coral/40"
            />
            {category.name}
          </label>
        ))}
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" variant="secondary" disabled={isPending}>
        {isPending ? "Salvando..." : "Salvar categorias"}
      </Button>
    </form>
  );
}
