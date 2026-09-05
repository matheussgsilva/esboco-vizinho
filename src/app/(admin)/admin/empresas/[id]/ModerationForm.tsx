"use client";

import { useActionState } from "react";
import { ConfirmSubmitButton } from "@/components/ui/ConfirmSubmitButton";
import type { BusinessTransition } from "@/lib/business-status";
import { moderateBusinessAction, type BusinessModerationState } from "../actions";

const INITIAL_STATE: BusinessModerationState = {};

export function ModerationForm({
  businessId,
  transitions,
}: {
  businessId: string;
  transitions: BusinessTransition[];
}) {
  const [state, formAction, isPending] = useActionState(moderateBusinessAction, INITIAL_STATE);

  if (transitions.length === 0) {
    return <p className="text-sm text-ink-muted">Nenhuma ação disponível para o status atual.</p>;
  }

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="id" value={businessId} />

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="flex flex-wrap gap-2">
        {transitions.map((transition) => (
          <ConfirmSubmitButton
            key={transition.intent}
            type="submit"
            name="intent"
            value={transition.intent}
            variant={transition.variant}
            disabled={isPending}
            confirmText={transition.confirmText}
          >
            {transition.label}
          </ConfirmSubmitButton>
        ))}
      </div>
    </form>
  );
}
