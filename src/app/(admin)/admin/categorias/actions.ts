"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { generateUniqueCategorySlug } from "@/lib/slug";
import {
  categoryCreateSchema,
  categoryUpdateSchema,
  categoryDeleteSchema,
} from "@/lib/validations/category";

export interface CategoryState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

function fieldErrorsFromZod(issues: { path: PropertyKey[]; message: string }[]) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}

function revalidateCategoryPaths() {
  revalidatePath("/admin/categorias");
  revalidatePath("/");
}

export async function categoryAction(
  _prevState: CategoryState,
  formData: FormData
): Promise<CategoryState> {
  const session = await requireRole(["ADMIN"]);
  const intent = formData.get("intent");

  if (intent === "create") {
    const parsed = categoryCreateSchema.safeParse({ name: formData.get("name") });
    if (!parsed.success) {
      return { fieldErrors: fieldErrorsFromZod(parsed.error.issues) };
    }

    const slug = await generateUniqueCategorySlug(parsed.data.name);
    const category = await prisma.category.create({
      data: { name: parsed.data.name, slug },
    });

    await logAudit({
      actorId: session.user.id,
      action: "category.create",
      targetType: "Category",
      targetId: category.id,
      metadata: { name: category.name, slug: category.slug },
    });

    revalidateCategoryPaths();
    return {};
  }

  if (intent === "update") {
    const parsed = categoryUpdateSchema.safeParse({
      id: formData.get("id"),
      name: formData.get("name"),
    });
    if (!parsed.success) {
      return { fieldErrors: fieldErrorsFromZod(parsed.error.issues) };
    }

    const existing = await prisma.category.findUnique({ where: { id: parsed.data.id } });
    if (!existing) {
      return { error: "Categoria não encontrada." };
    }

    await prisma.category.update({
      where: { id: parsed.data.id },
      data: { name: parsed.data.name },
    });

    await logAudit({
      actorId: session.user.id,
      action: "category.update",
      targetType: "Category",
      targetId: parsed.data.id,
      metadata: { from: existing.name, to: parsed.data.name },
    });

    revalidateCategoryPaths();
    revalidatePath(`/categorias/${existing.slug}`);
    return {};
  }

  if (intent === "delete") {
    const parsed = categoryDeleteSchema.safeParse({ id: formData.get("id") });
    if (!parsed.success) {
      return { error: "Ação inválida." };
    }

    const existing = await prisma.category.findUnique({
      where: { id: parsed.data.id },
      include: { _count: { select: { businesses: true } } },
    });
    if (!existing) {
      return { error: "Categoria não encontrada." };
    }

    await prisma.category.delete({ where: { id: parsed.data.id } });

    await logAudit({
      actorId: session.user.id,
      action: "category.delete",
      targetType: "Category",
      targetId: parsed.data.id,
      metadata: {
        name: existing.name,
        slug: existing.slug,
        affectedBusinesses: existing._count.businesses,
      },
    });

    revalidateCategoryPaths();
    return {};
  }

  return { error: "Ação inválida." };
}
