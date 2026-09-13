"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { promotionAction, type PromotionState } from "@/app/(business)/painel/promocoes/actions";

const INITIAL_STATE: PromotionState = {};

export function PromotionForm() {
  const [state, formAction, isPending] = useActionState(promotionAction, INITIAL_STATE);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-4 rounded-lg border border-border bg-surface p-4">
      <input type="hidden" name="intent" value="create" />
      <h2 className="text-sm font-semibold text-ink">Nova promoção</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Título" name="title" required error={errors.title} />
        <FormField
          label="Rótulo de desconto"
          name="discountLabel"
          placeholder="Ex: 20% OFF"
          error={errors.discountLabel}
        />
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Início (opcional)" name="startsAt" type="date" error={errors.startsAt} />
        <FormField label="Término (opcional)" name="endsAt" type="date" error={errors.endsAt} />
      </div>

      <label className="flex items-center gap-2 text-sm text-ink-muted">
        <input type="checkbox" name="isActive" defaultChecked />
        Ativa (visível na página pública, dentro da validade)
      </label>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <Button type="submit" variant="secondary" disabled={isPending}>
        {isPending ? "Adicionando..." : "Adicionar"}
      </Button>
    </form>
  );
}
