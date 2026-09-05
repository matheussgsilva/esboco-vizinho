"use server";

import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { requireSession, requireBusinessOwner } from "@/lib/auth-utils";
import { getOwnedBusiness } from "@/lib/business";
import { prisma } from "@/lib/prisma";
import {
  productCreateSchema,
  productUpdateSchema,
  productDeleteSchema,
} from "@/lib/validations/business";

export interface ProductState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

function fieldErrorsFromZod(error: z.ZodError) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}

export async function productAction(
  _prevState: ProductState,
  formData: FormData
): Promise<ProductState> {
  const session = await requireSession();
  const intent = formData.get("intent");

  if (intent === "create") {
    const business = await getOwnedBusiness(session.user.id);
    if (!business) {
      return { error: "Empresa não encontrada." };
    }
    await requireBusinessOwner(business.ownerId);

    const parsed = productCreateSchema.safeParse({
      name: formData.get("name"),
      description: formData.get("description"),
      price: formData.get("price"),
      isActive: formData.get("isActive"),
    });

    if (!parsed.success) {
      return { fieldErrors: fieldErrorsFromZod(parsed.error) };
    }

    await prisma.product.create({ data: { businessId: business.id, ...parsed.data } });

    revalidatePath("/painel/produtos");
    revalidatePath("/painel");
    return {};
  }

  if (intent === "update") {
    const parsed = productUpdateSchema.safeParse({
      id: formData.get("id"),
      name: formData.get("name"),
      description: formData.get("description"),
      price: formData.get("price"),
      isActive: formData.get("isActive"),
    });

    if (!parsed.success) {
      return { fieldErrors: fieldErrorsFromZod(parsed.error) };
    }

    const { id, ...data } = parsed.data;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { business: { select: { ownerId: true } } },
    });

    if (!product) {
      return { error: "Produto não encontrado." };
    }

    await requireBusinessOwner(product.business.ownerId);

    await prisma.product.update({ where: { id }, data });

    revalidatePath("/painel/produtos");
    return {};
  }

  if (intent === "delete") {
    const parsed = productDeleteSchema.safeParse({ id: formData.get("id") });
    if (!parsed.success) {
      return { error: "Ação inválida." };
    }

    const product = await prisma.product.findUnique({
      where: { id: parsed.data.id },
      include: { business: { select: { ownerId: true } } },
    });

    if (!product) {
      return { error: "Produto não encontrado." };
    }

    await requireBusinessOwner(product.business.ownerId);

    await prisma.product.delete({ where: { id: product.id } });

    revalidatePath("/painel/produtos");
    revalidatePath("/painel");
    return {};
  }

  return { error: "Ação inválida." };
}
