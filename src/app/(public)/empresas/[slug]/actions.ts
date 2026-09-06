"use server";

import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { requireSession } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { recalculateBusinessRating } from "@/lib/reviews";
import {
  reviewUpsertSchema,
  reviewDeleteSchema,
  favoriteToggleSchema,
} from "@/lib/validations/reviews";

export interface ReviewState {
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

export async function upsertReviewAction(
  _prevState: ReviewState,
  formData: FormData
): Promise<ReviewState> {
  const session = await requireSession();

  const parsed = reviewUpsertSchema.safeParse({
    businessId: formData.get("businessId"),
    slug: formData.get("slug"),
    rating: formData.get("rating"),
    comment: formData.get("comment"),
  });

  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const { businessId, slug, rating, comment } = parsed.data;

  const business = await prisma.business.findUnique({ where: { id: businessId } });
  if (!business) {
    return { error: "Empresa não encontrada." };
  }

  if (business.ownerId === session.user.id) {
    return { error: "Você não pode avaliar seu próprio negócio." };
  }

  await prisma.$transaction(async (tx) => {
    await tx.review.upsert({
      where: { businessId_userId: { businessId, userId: session.user.id } },
      create: { businessId, userId: session.user.id, rating, comment },
      update: { rating, comment, status: "PUBLISHED" },
    });
    await recalculateBusinessRating(tx, businessId);
  });

  revalidatePath(`/empresas/${slug}`);
  revalidatePath("/minha-conta/minhas-avaliacoes");

  return {};
}

export async function deleteReviewAction(
  _prevState: ReviewState,
  formData: FormData
): Promise<ReviewState> {
  const session = await requireSession();

  const parsed = reviewDeleteSchema.safeParse({
    businessId: formData.get("businessId"),
    slug: formData.get("slug"),
  });

  if (!parsed.success) {
    return { error: "Ação inválida." };
  }

  const { businessId, slug } = parsed.data;

  const review = await prisma.review.findUnique({
    where: { businessId_userId: { businessId, userId: session.user.id } },
  });

  if (!review) {
    return { error: "Avaliação não encontrada." };
  }

  await prisma.$transaction(async (tx) => {
    await tx.review.delete({ where: { id: review.id } });
    await recalculateBusinessRating(tx, businessId);
  });

  revalidatePath(`/empresas/${slug}`);
  revalidatePath("/minha-conta/minhas-avaliacoes");

  return {};
}

export interface FavoriteState {
  error?: string;
}

export async function toggleFavoriteAction(
  _prevState: FavoriteState,
  formData: FormData
): Promise<FavoriteState> {
  const session = await requireSession();

  const parsed = favoriteToggleSchema.safeParse({
    businessId: formData.get("businessId"),
    slug: formData.get("slug"),
  });

  if (!parsed.success) {
    return { error: "Ação inválida." };
  }

  const { businessId, slug } = parsed.data;

  const existing = await prisma.favorite.findUnique({
    where: { userId_businessId: { userId: session.user.id, businessId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
  } else {
    const business = await prisma.business.findUnique({ where: { id: businessId } });
    if (!business) {
      return { error: "Empresa não encontrada." };
    }
    await prisma.favorite.create({ data: { userId: session.user.id, businessId } });
  }

  revalidatePath(`/empresas/${slug}`);
  revalidatePath("/minha-conta/favoritos");

  return {};
}
