"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { forgotPasswordAction, type ForgotPasswordState } from "./actions";

const INITIAL_STATE: ForgotPasswordState = {};

export function RecuperarSenhaForm() {
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, INITIAL_STATE);

  if (state.submitted) {
    return (
      <p className="text-sm text-ink-muted">
        Se esse email estiver cadastrado, enviamos um link para redefinir sua senha. Confira sua
        caixa de entrada.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <FormField label="Email" name="email" type="email" required autoComplete="email" />

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Enviando..." : "Enviar link de recuperação"}
      </Button>

      <p className="text-center text-sm text-ink-muted">
        <Link href="/login" className="font-medium text-brand-coral hover:text-brand-coral-dark">
          Voltar para o login
        </Link>
      </p>
    </form>
  );
}
