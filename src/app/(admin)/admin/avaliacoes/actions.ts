"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { recalculateBusinessRating } from "@/lib/reviews";
import { reviewModerationSchema } from "@/lib/validations/admin";

export interface ReviewModerationState {
  error?: string;
}

const NEXT_STATUS = {
  restore: "PUBLISHED",
  remove: "REMOVED",
} as const;

export async function moderateReviewAction(
  _prevState: ReviewModerationState,
  formData: FormData
): Promise<ReviewModerationState> {
  const session = await requireRole(["ADMIN"]);

  const parsed = reviewModerationSchema.safeParse({
    id: formData.get("id"),
    intent: formData.get("intent"),
  });

  if (!parsed.success) {
    return { error: "Ação inválida." };
  }

  const { id, intent } = parsed.data;

  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) {
    return { error: "Avaliação não encontrada." };
  }

  if (review.status !== "FLAGGED") {
    return { error: "Esta avaliação não está mais na fila de denúncias. Atualize a página." };
  }

  const nextStatus = NEXT_STATUS[intent];

  await prisma.$transaction(async (tx) => {
    await tx.review.update({
      where: { id },
      data: { status: nextStatus },
    });
    await recalculateBusinessRating(tx, review.businessId);
  });

  await logAudit({
    actorId: session.user.id,
    action: `review.${intent}`,
    targetType: "Review",
    targetId: id,
    metadata: { fromStatus: review.status, toStatus: nextStatus },
  });

  revalidatePath("/admin/avaliacoes");

  return {};
}
