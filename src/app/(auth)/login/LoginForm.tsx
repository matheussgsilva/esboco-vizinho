"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { googleSignInAction, loginAction, type LoginState } from "./actions";

const INITIAL_STATE: LoginState = {};

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [state, formAction, isPending] = useActionState(loginAction, INITIAL_STATE);

  return (
    <div className="space-y-4">
      <form action={formAction} className="space-y-4">
        {callbackUrl && <input type="hidden" name="callbackUrl" value={callbackUrl} />}

        <FormField label="Email" name="email" type="email" required autoComplete="email" />
        <FormField
          label="Senha"
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />

        {state.error && <p className="text-sm text-red-600">{state.error}</p>}

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <div className="flex items-center gap-2 text-xs text-ink-muted">
        <div className="h-px flex-1 bg-border" />
        ou
        <div className="h-px flex-1 bg-border" />
      </div>

      <form action={googleSignInAction}>
        {callbackUrl && <input type="hidden" name="callbackUrl" value={callbackUrl} />}
        <Button type="submit" variant="ghost" className="w-full">
          Entrar com Google
        </Button>
      </form>

      <div className="space-y-1 text-center text-sm text-ink-muted">
        <p>
          <Link href="/recuperar-senha" className="font-medium text-brand-coral hover:text-brand-coral-dark">
            Esqueci minha senha
          </Link>
        </p>
        <p>
          Não tem conta?{" "}
          <Link href="/cadastro" className="font-medium text-brand-coral hover:text-brand-coral-dark">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
