"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { categoryAction, type CategoryState } from "./actions";

const INITIAL_STATE: CategoryState = {};

export function CategoryCreateForm() {
  const [state, formAction, isPending] = useActionState(categoryAction, INITIAL_STATE);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="intent" value="create" />
      <div className="min-w-50 flex-1">
        <FormField label="Nova categoria" name="name" error={errors.name} />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Criando..." : "Criar categoria"}
      </Button>
      {state.error && <p className="w-full text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
