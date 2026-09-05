"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { ConfirmSubmitButton } from "@/components/ui/ConfirmSubmitButton";
import { FormField } from "@/components/ui/FormField";
import {
  manageSocialLinkAction,
  type SocialLinkState,
} from "@/app/(business)/painel/perfil/actions";

const INITIAL_STATE: SocialLinkState = {};

interface SocialLinksManagerProps {
  links: { id: string; platform: string; url: string }[];
}

export function SocialLinksManager({ links }: SocialLinksManagerProps) {
  const [state, formAction, isPending] = useActionState(manageSocialLinkAction, INITIAL_STATE);
  const errors = state.fieldErrors ?? {};

  return (
    <div className="space-y-4">
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      {links.length > 0 && (
        <ul className="space-y-2">
          {links.map((link) => (
            <li
              key={link.id}
              className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface px-4 py-2.5 text-sm"
            >
              <span className="text-ink">
                <span className="font-medium">{link.platform}</span>{" "}
                <a href={link.url} target="_blank" rel="noreferrer" className="text-ink-muted hover:underline">
                  {link.url}
                </a>
              </span>
              <form action={formAction}>
                <input type="hidden" name="intent" value="delete" />
                <input type="hidden" name="id" value={link.id} />
                <ConfirmSubmitButton
                  type="submit"
                  variant="ghost"
                  disabled={isPending}
                  confirmText="Remover este link?"
                >
                  Remover
                </ConfirmSubmitButton>
              </form>
            </li>
          ))}
        </ul>
      )}

      <form action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <input type="hidden" name="intent" value="add" />
        <div className="flex-1">
          <FormField label="Rede social" name="platform" placeholder="Instagram" error={errors.platform} />
        </div>
        <div className="flex-1">
          <FormField label="URL" name="url" placeholder="https://instagram.com/..." error={errors.url} />
        </div>
        <Button type="submit" variant="secondary" disabled={isPending}>
          Adicionar
        </Button>
      </form>
    </div>
  );
}
