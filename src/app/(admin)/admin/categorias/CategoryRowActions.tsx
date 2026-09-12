"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ConfirmSubmitButton } from "@/components/ui/ConfirmSubmitButton";
import { categoryAction, type CategoryState } from "./actions";

const INITIAL_STATE: CategoryState = {};

interface CategoryRowActionsProps {
  category: { id: string; name: string; businessCount: number };
}

export function CategoryRowActions({ category }: CategoryRowActionsProps) {
  const [renameState, renameAction, isRenaming] = useActionState(categoryAction, INITIAL_STATE);
  const [deleteState, deleteAction, isDeleting] = useActionState(categoryAction, INITIAL_STATE);
  const [name, setName] = useState(category.name);

  const deleteConfirmText =
    category.businessCount > 0
      ? `Esta categoria está em uso por ${category.businessCount} negócio(s). Excluir mesmo assim? Todos perderão essa categoria.`
      : "Excluir esta categoria?";

  return (
    <div className="flex flex-wrap items-start gap-3">
      <form action={renameAction} className="flex items-center gap-2">
        <input type="hidden" name="intent" value="update" />
        <input type="hidden" name="id" value={category.id} />
        <Input
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="h-9 w-40 py-1.5"
        />
        <Button
          type="submit"
          variant="secondary"
          disabled={isRenaming}
          className="px-3 py-1.5 text-xs"
        >
          Salvar
        </Button>
        {renameState.fieldErrors?.name && (
          <p className="text-xs text-red-600">{renameState.fieldErrors.name}</p>
        )}
      </form>

      <form action={deleteAction}>
        <input type="hidden" name="intent" value="delete" />
        <input type="hidden" name="id" value={category.id} />
        <ConfirmSubmitButton
          type="submit"
          variant="danger"
          disabled={isDeleting}
          confirmText={deleteConfirmText}
          className="px-3 py-1.5 text-xs"
        >
          Excluir
        </ConfirmSubmitButton>
        {deleteState.error && <p className="text-xs text-red-600">{deleteState.error}</p>}
      </form>
    </div>
  );
}
