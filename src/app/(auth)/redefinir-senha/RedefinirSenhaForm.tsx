"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { resetPasswordAction, type ResetPasswordState } from "./actions";

const INITIAL_STATE: ResetPasswordState = {};

export function RedefinirSenhaForm({ token, email }: { token: string; email: string }) {
  const [state, formAction, isPending] = useActionState(resetPasswordAction, INITIAL_STATE);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="email" value={email} />

      <FormField
        label="Nova senha"
        name="password"
        type="password"
        required
        autoComplete="new-password"
      />
      <FormField
        label="Confirmar nova senha"
        name="confirmPassword"
        type="password"
        required
        autoComplete="new-password"
      />

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Salvando..." : "Redefinir senha"}
      </Button>
    </form>
  );
}
