"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { registerAction, type RegisterState } from "./actions";

const INITIAL_STATE: RegisterState = {};

export function CadastroForm({
  callbackUrl,
  initialRole = "USER",
  categories,
}: {
  callbackUrl?: string;
  initialRole?: "USER" | "BUSINESS";
  categories: { id: string; name: string }[];
}) {
  const [state, formAction, isPending] = useActionState(registerAction, INITIAL_STATE);
  const [role, setRole] = useState<"USER" | "BUSINESS">(initialRole);
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
        <>
          <FormField
            label="Nome do negócio"
            name="businessName"
            required
            error={errors.businessName}
          />
          <div className="space-y-1.5">
            <span className="text-sm font-medium text-ink">Categorias do negócio</span>
            <div className="grid grid-cols-2 gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-3">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center gap-2 text-sm text-ink">
                  <input
                    type="checkbox"
                    name="categoryIds"
                    value={category.id}
                    className="h-4 w-4 rounded border-border text-brand-coral focus:ring-brand-coral/40"
                  />
                  {category.name}
                </label>
              ))}
            </div>
            {errors.categoryIds && <p className="text-sm text-red-600">{errors.categoryIds}</p>}
          </div>
        </>
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
