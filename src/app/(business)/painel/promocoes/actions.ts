"use server";

import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { requireSession, requireBusinessOwner } from "@/lib/auth-utils";
import { getOwnedBusiness } from "@/lib/business";
import { prisma } from "@/lib/prisma";
import {
  promotionCreateSchema,
  promotionUpdateSchema,
  promotionDeleteSchema,
} from "@/lib/validations/business";

export interface PromotionState {
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

export async function promotionAction(
  _prevState: PromotionState,
  formData: FormData
): Promise<PromotionState> {
  const session = await requireSession();
  const intent = formData.get("intent");

  if (intent === "create") {
    const business = await getOwnedBusiness(session.user.id);
    if (!business) {
      return { error: "Empresa não encontrada." };
    }
    await requireBusinessOwner(business.ownerId);

    const parsed = promotionCreateSchema.safeParse({
      title: formData.get("title"),
      discountLabel: formData.get("discountLabel"),
      description: formData.get("description"),
      startsAt: formData.get("startsAt"),
      endsAt: formData.get("endsAt"),
      isActive: formData.get("isActive"),
    });

    if (!parsed.success) {
      return { fieldErrors: fieldErrorsFromZod(parsed.error) };
    }

    await prisma.promotion.create({ data: { businessId: business.id, ...parsed.data } });

    revalidatePath("/painel/promocoes");
    revalidatePath("/painel");
    revalidatePath(`/empresas/${business.slug}`);
    return {};
  }

  if (intent === "update") {
    const parsed = promotionUpdateSchema.safeParse({
      id: formData.get("id"),
      title: formData.get("title"),
      discountLabel: formData.get("discountLabel"),
      description: formData.get("description"),
      startsAt: formData.get("startsAt"),
      endsAt: formData.get("endsAt"),
      isActive: formData.get("isActive"),
    });

    if (!parsed.success) {
      return { fieldErrors: fieldErrorsFromZod(parsed.error) };
    }

    const { id, ...data } = parsed.data;
    const promotion = await prisma.promotion.findUnique({
      where: { id },
      include: { business: { select: { ownerId: true, slug: true } } },
    });

    if (!promotion) {
      return { error: "Promoção não encontrada." };
    }

    await requireBusinessOwner(promotion.business.ownerId);

    await prisma.promotion.update({ where: { id }, data });

    revalidatePath("/painel/promocoes");
    revalidatePath(`/empresas/${promotion.business.slug}`);
    return {};
  }

  if (intent === "delete") {
    const parsed = promotionDeleteSchema.safeParse({ id: formData.get("id") });
    if (!parsed.success) {
      return { error: "Ação inválida." };
    }

    const promotion = await prisma.promotion.findUnique({
      where: { id: parsed.data.id },
      include: { business: { select: { ownerId: true, slug: true } } },
    });

    if (!promotion) {
      return { error: "Promoção não encontrada." };
    }

    await requireBusinessOwner(promotion.business.ownerId);

    await prisma.promotion.delete({ where: { id: promotion.id } });

    revalidatePath("/painel/promocoes");
    revalidatePath("/painel");
    revalidatePath(`/empresas/${promotion.business.slug}`);
    return {};
  }

  return { error: "Ação inválida." };
}
