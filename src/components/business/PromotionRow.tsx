"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { ConfirmSubmitButton } from "@/components/ui/ConfirmSubmitButton";
import { FormField } from "@/components/ui/FormField";
import { promotionAction, type PromotionState } from "@/app/(business)/painel/promocoes/actions";

const INITIAL_STATE: PromotionState = {};

function toDateInputValue(date: Date | null | undefined) {
  return date ? date.toISOString().slice(0, 10) : "";
}

function promotionStatus(promotion: { isActive: boolean; startsAt: Date | null; endsAt: Date | null }) {
  if (!promotion.isActive) return { label: "Inativa", className: "bg-ink-muted" };
  const now = new Date();
  if (promotion.startsAt && promotion.startsAt > now) {
    return { label: "Agendada", className: "bg-brand-teal" };
  }
  if (promotion.endsAt && promotion.endsAt < now) {
    return { label: "Expirada", className: "bg-ink-muted" };
  }
  return { label: "Ativa", className: "bg-success" };
}

interface PromotionRowProps {
  promotion: {
    id: string;
    title: string;
    discountLabel: string | null;
    description: string | null;
    startsAt: Date | null;
    endsAt: Date | null;
    isActive: boolean;
  };
}

export function PromotionRow({ promotion }: PromotionRowProps) {
  const [state, formAction, isPending] = useActionState(promotionAction, INITIAL_STATE);
  const errors = state.fieldErrors ?? {};
  const status = promotionStatus(promotion);

  return (
    <form action={formAction} className="space-y-3 rounded-lg border border-border bg-surface p-4">
      <input type="hidden" name="id" value={promotion.id} />

      <span
        className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium text-white ${status.className}`}
      >
        {status.label}
      </span>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Título" name="title" defaultValue={promotion.title} error={errors.title} />
        <FormField
          label="Rótulo de desconto"
          name="discountLabel"
          placeholder="Ex: 20% OFF"
          defaultValue={promotion.discountLabel ?? ""}
          error={errors.discountLabel}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-ink">Descrição</label>
        <textarea
          name="description"
          rows={2}
          defaultValue={promotion.description ?? ""}
          className="w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-coral/40"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Início (opcional)"
          name="startsAt"
          type="date"
          defaultValue={toDateInputValue(promotion.startsAt)}
          error={errors.startsAt}
        />
        <FormField
          label="Término (opcional)"
          name="endsAt"
          type="date"
          defaultValue={toDateInputValue(promotion.endsAt)}
          error={errors.endsAt}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-ink-muted">
        <input type="checkbox" name="isActive" defaultChecked={promotion.isActive} />
        Ativa (visível na página pública, dentro da validade)
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
          confirmText="Excluir esta promoção permanentemente?"
        >
          Excluir
        </ConfirmSubmitButton>
      </div>
    </form>
  );
}
