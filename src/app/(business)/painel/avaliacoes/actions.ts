"use server";

import { revalidatePath } from "next/cache";
import { requireBusinessOwner, requireSession } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import {
  ownerResponseUpsertSchema,
  ownerResponseDeleteSchema,
} from "@/lib/validations/reviews";

export interface OwnerResponseState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function upsertOwnerResponseAction(
  _prevState: OwnerResponseState,
  formData: FormData
): Promise<OwnerResponseState> {
  await requireSession();

  const parsed = ownerResponseUpsertSchema.safeParse({
    reviewId: formData.get("reviewId"),
    slug: formData.get("slug"),
    response: formData.get("response"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return { fieldErrors };
  }

  const { reviewId, slug, response } = parsed.data;

  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: { business: { select: { ownerId: true } } },
  });

  if (!review) {
    return { error: "Avaliação não encontrada." };
  }

  await requireBusinessOwner(review.business.ownerId);

  if (review.status !== "PUBLISHED") {
    return { error: "Não é possível responder esta avaliação." };
  }

  await prisma.review.update({
    where: { id: reviewId },
    data: { ownerResponse: response, ownerRespondedAt: new Date() },
  });

  revalidatePath("/painel/avaliacoes");
  revalidatePath(`/empresas/${slug}`);
  revalidatePath("/minha-conta/minhas-avaliacoes");

  return {};
}

export async function deleteOwnerResponseAction(
  _prevState: OwnerResponseState,
  formData: FormData
): Promise<OwnerResponseState> {
  await requireSession();

  const parsed = ownerResponseDeleteSchema.safeParse({
    reviewId: formData.get("reviewId"),
    slug: formData.get("slug"),
  });

  if (!parsed.success) {
    return { error: "Ação inválida." };
  }

  const { reviewId, slug } = parsed.data;

  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: { business: { select: { ownerId: true } } },
  });

  if (!review) {
    return { error: "Avaliação não encontrada." };
  }

  await requireBusinessOwner(review.business.ownerId);

  await prisma.review.update({
    where: { id: reviewId },
    data: { ownerResponse: null, ownerRespondedAt: null },
  });

  revalidatePath("/painel/avaliacoes");
  revalidatePath(`/empresas/${slug}`);
  revalidatePath("/minha-conta/minhas-avaliacoes");

  return {};
}
