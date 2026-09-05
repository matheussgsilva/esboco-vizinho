"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { sendEmail } from "@/lib/email";
import { BusinessApprovedEmail } from "@/emails/business-approved";
import { resolveTransition } from "@/lib/business-status";
import { businessModerationSchema } from "@/lib/validations/admin";

export interface BusinessModerationState {
  error?: string;
}

export async function moderateBusinessAction(
  _prevState: BusinessModerationState,
  formData: FormData
): Promise<BusinessModerationState> {
  const session = await requireRole(["ADMIN"]);

  const parsed = businessModerationSchema.safeParse({
    id: formData.get("id"),
    intent: formData.get("intent"),
  });

  if (!parsed.success) {
    return { error: "Ação inválida." };
  }

  const { id, intent } = parsed.data;

  const business = await prisma.business.findUnique({
    where: { id },
    include: { owner: { select: { name: true, email: true } } },
  });

  if (!business) {
    return { error: "Empresa não encontrada." };
  }

  const transition = resolveTransition(business.status, intent);
  if (!transition) {
    return {
      error: "Esta ação não é mais válida para o status atual da empresa. Atualize a página.",
    };
  }

  const fromStatus = business.status;

  await prisma.business.update({
    where: { id },
    data: { status: transition.nextStatus },
  });

  await logAudit({
    actorId: session.user.id,
    action: `business.${intent}`,
    targetType: "Business",
    targetId: id,
    metadata: { fromStatus, toStatus: transition.nextStatus },
  });

  if (fromStatus === "PENDING" && transition.nextStatus === "APPROVED" && business.owner.email) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
    await sendEmail({
      to: business.owner.email,
      type: "BUSINESS_APPROVED",
      subject: "Sua empresa foi aprovada!",
      react: BusinessApprovedEmail({
        ownerName: business.owner.name,
        businessName: business.name,
        businessUrl: `${appUrl}/empresas/${business.slug}`,
      }),
    });
  }

  revalidatePath(`/admin/empresas/${id}`);
  revalidatePath("/admin/empresas");

  return {};
}
