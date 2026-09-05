import { prisma } from "@/lib/prisma";
import type { Prisma } from "../../generated/client";

interface LogAuditParams {
  actorId: string;
  action: string;
  targetType: string;
  targetId: string;
  metadata?: Prisma.InputJsonValue;
}

export async function logAudit({
  actorId,
  action,
  targetType,
  targetId,
  metadata,
}: LogAuditParams): Promise<void> {
  await prisma.auditLog.create({
    data: { actorId, action, targetType, targetId, metadata },
  });
}
