"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { ConfirmSubmitButton } from "@/components/ui/ConfirmSubmitButton";
import { FormField } from "@/components/ui/FormField";
import { productAction, type ProductState } from "@/app/(business)/painel/produtos/actions";

const INITIAL_STATE: ProductState = {};

interface ProductRowProps {
  product: {
    id: string;
    name: string;
    description: string | null;
    price: number | null;
    isActive: boolean;
  };
}

export function ProductRow({ product }: ProductRowProps) {
  const [state, formAction, isPending] = useActionState(productAction, INITIAL_STATE);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-3 rounded-lg border border-border bg-surface p-4">
      <input type="hidden" name="id" value={product.id} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Nome" name="name" defaultValue={product.name} error={errors.name} />
        <FormField
          label="Preço"
          name="price"
          type="number"
          step="0.01"
          min="0"
          defaultValue={product.price ?? ""}
          error={errors.price}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-ink">Descrição</label>
        <textarea
          name="description"
          rows={2}
          defaultValue={product.description ?? ""}
          className="w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-coral/40"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-ink-muted">
        <input type="checkbox" name="isActive" defaultChecked={product.isActive} />
        Ativo (visível na página pública)
      </label>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="flex gap-2">
        <Button type="submit" name="intent" value="update" disabled={isPending}>
          Salvar
        </Button>
        <ConfirmSubmitButton
          type="submit"
          name="intent"
          value="delete"
          variant="danger"
          disabled={isPending}
          confirmText="Excluir este produto permanentemente?"
        >
          Excluir
        </ConfirmSubmitButton>
      </div>
    </form>
  );
}
