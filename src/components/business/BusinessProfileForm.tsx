"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import {
  updateBusinessProfileAction,
  type BusinessProfileState,
} from "@/app/(business)/painel/perfil/actions";

const INITIAL_STATE: BusinessProfileState = {};

interface BusinessProfileFormProps {
  business: {
    name: string;
    description: string | null;
    phone: string | null;
    whatsapp: string | null;
    website: string | null;
    email: string | null;
    addressLine: string | null;
    city: string | null;
    state: string | null;
    zipCode: string | null;
  };
}

export function BusinessProfileForm({ business }: BusinessProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateBusinessProfileAction,
    INITIAL_STATE
  );
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-4">
      <FormField
        label="Nome do negócio"
        name="name"
        required
        defaultValue={business.name}
        error={errors.name}
      />
      <div className="space-y-1.5">
        <label htmlFor="description" className="text-sm font-medium text-ink">
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={business.description ?? ""}
          className="w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-coral/40"
        />
        {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Telefone"
          name="phone"
          defaultValue={business.phone ?? ""}
          error={errors.phone}
        />
        <FormField
          label="WhatsApp"
          name="whatsapp"
          defaultValue={business.whatsapp ?? ""}
          error={errors.whatsapp}
        />
        <FormField
          label="Site"
          name="website"
          defaultValue={business.website ?? ""}
          error={errors.website}
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          defaultValue={business.email ?? ""}
          error={errors.email}
        />
      </div>

      <FormField
        label="Endereço"
        name="addressLine"
        defaultValue={business.addressLine ?? ""}
        error={errors.addressLine}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormField label="Cidade" name="city" defaultValue={business.city ?? ""} error={errors.city} />
        <FormField label="Estado" name="state" defaultValue={business.state ?? ""} error={errors.state} />
        <FormField
          label="CEP"
          name="zipCode"
          defaultValue={business.zipCode ?? ""}
          error={errors.zipCode}
        />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Salvando..." : "Salvar alterações"}
      </Button>
    </form>
  );
}
