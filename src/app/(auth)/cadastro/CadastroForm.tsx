"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { registerAction, type RegisterState } from "./actions";

const INITIAL_STATE: RegisterState = {};

export function CadastroForm({ callbackUrl }: { callbackUrl?: string }) {
  const [state, formAction, isPending] = useActionState(registerAction, INITIAL_STATE);
  const [role, setRole] = useState<"USER" | "BUSINESS">("USER");
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-4">
      {callbackUrl && <input type="hidden" name="callbackUrl" value={callbackUrl} />}

      <div className="flex gap-2 rounded-lg border border-border bg-surface p-1 text-sm">
        <button
          type="button"
          onClick={() => setRole("USER")}
          className={`flex-1 rounded-md px-3 py-2 font-medium transition-colors ${
            role === "USER" ? "bg-brand-coral text-white" : "text-ink-muted"
          }`}
        >
          Sou consumidor
        </button>
        <button
          type="button"
          onClick={() => setRole("BUSINESS")}
          className={`flex-1 rounded-md px-3 py-2 font-medium transition-colors ${
            role === "BUSINESS" ? "bg-brand-coral text-white" : "text-ink-muted"
          }`}
        >
          Sou dono de negócio
        </button>
      </div>
      <input type="hidden" name="role" value={role} />

      <FormField label="Nome" name="name" required autoComplete="name" error={errors.name} />
      <FormField
        label="Email"
        name="email"
        type="email"
        required
        autoComplete="email"
        error={errors.email}
      />

      {role === "BUSINESS" && (
        <FormField
          label="Nome do negócio"
          name="businessName"
          required
          error={errors.businessName}
        />
      )}

      <FormField
        label="Senha"
        name="password"
        type="password"
        required
        autoComplete="new-password"
        error={errors.password}
      />
      <FormField
        label="Confirmar senha"
        name="confirmPassword"
        type="password"
        required
        autoComplete="new-password"
        error={errors.confirmPassword}
      />

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Criando conta..." : "Criar conta"}
      </Button>

      <p className="text-center text-sm text-ink-muted">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-brand-coral hover:text-brand-coral-dark">
          Entrar
        </Link>
      </p>
    </form>
  );
}
