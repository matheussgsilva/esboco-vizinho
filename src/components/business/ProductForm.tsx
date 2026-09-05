"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { productAction, type ProductState } from "@/app/(business)/painel/produtos/actions";

const INITIAL_STATE: ProductState = {};

export function ProductForm() {
  const [state, formAction, isPending] = useActionState(productAction, INITIAL_STATE);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-4 rounded-lg border border-border bg-surface p-4">
      <input type="hidden" name="intent" value="create" />
      <h2 className="text-sm font-semibold text-ink">Adicionar produto ou serviço</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Nome" name="name" required error={errors.name} />
        <FormField label="Preço" name="price" type="number" step="0.01" min="0" error={errors.price} />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="description" className="text-sm font-medium text-ink">
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          rows={2}
          className="w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-coral/40"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-ink-muted">
        <input type="checkbox" name="isActive" defaultChecked />
        Ativo (visível na página pública)
      </label>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <Button type="submit" variant="secondary" disabled={isPending}>
        {isPending ? "Adicionando..." : "Adicionar"}
      </Button>
    </form>
  );
}
