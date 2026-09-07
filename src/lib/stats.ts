import { prisma } from "@/lib/prisma";

export async function getPlatformStats() {
  const [businessCount, cities, reviewCount] = await Promise.all([
    prisma.business.count({ where: { status: "APPROVED" } }),
    prisma.business.groupBy({
      by: ["city"],
      where: { status: "APPROVED", city: { not: null } },
    }),
    prisma.review.count({ where: { status: "PUBLISHED" } }),
  ]);

  return {
    businessCount,
    cityCount: cities.length,
    reviewCount,
  };
}
