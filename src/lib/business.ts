import "server-only";
import { prisma } from "@/lib/prisma";

export function getOwnedBusiness(ownerId: string) {
  return prisma.business.findUnique({ where: { ownerId } });
}
