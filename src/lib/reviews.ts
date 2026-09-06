import "server-only";
import type { Prisma } from "../../generated/client";

export async function recalculateBusinessRating(
  tx: Prisma.TransactionClient,
  businessId: string
) {
  const { _avg, _count } = await tx.review.aggregate({
    where: { businessId, status: "PUBLISHED" },
    _avg: { rating: true },
    _count: true,
  });

  await tx.business.update({
    where: { id: businessId },
    data: {
      averageRating: Math.round((_avg.rating ?? 0) * 10) / 10,
      reviewCount: _count,
    },
  });
}
