"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  updateBusinessHoursAction,
  type BusinessHoursState,
} from "@/app/(business)/painel/horarios/actions";
import { DAYS, DAY_LABELS } from "@/lib/validations/business";

const INITIAL_STATE: BusinessHoursState = {};

interface BusinessHoursFormProps {
  hours: { dayOfWeek: string; openTime: string | null; closeTime: string | null; isClosed: boolean }[];
}

export function BusinessHoursForm({ hours }: BusinessHoursFormProps) {
  const [state, formAction, isPending] = useActionState(updateBusinessHoursAction, INITIAL_STATE);
  const errors = state.fieldErrors ?? {};
  const byDay = new Map(hours.map((h) => [h.dayOfWeek, h]));

  return (
    <form action={formAction} className="space-y-4">
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="space-y-3">
        {DAYS.map((day) => {
          const row = byDay.get(day);
          const error = errors[`${day}_openTime`];
          return (
            <div
              key={day}
              className="flex flex-col gap-3 rounded-md border border-border bg-surface p-3 sm:flex-row sm:items-center"
            >
              <span className="w-24 shrink-0 text-sm font-medium text-ink">{DAY_LABELS[day]}</span>

              <label className="flex items-center gap-2 text-sm text-ink-muted">
                <input
                  type="checkbox"
                  name={`${day}_isClosed`}
                  defaultChecked={row?.isClosed ?? false}
                />
                Fechado
              </label>

              <Input
                type="time"
                name={`${day}_openTime`}
                defaultValue={row?.openTime ?? ""}
                className="sm:w-32"
              />
              <span className="text-sm text-ink-muted">até</span>
              <Input
                type="time"
                name={`${day}_closeTime`}
                defaultValue={row?.closeTime ?? ""}
                className="sm:w-32"
              />

              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          );
        })}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Salvando..." : "Salvar horários"}
      </Button>
    </form>
  );
}
