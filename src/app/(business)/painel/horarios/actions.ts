"use server";

import { revalidatePath } from "next/cache";
import { requireSession, requireBusinessOwner } from "@/lib/auth-utils";
import { getOwnedBusiness } from "@/lib/business";
import { prisma } from "@/lib/prisma";
import { DAYS, businessHoursRowSchema } from "@/lib/validations/business";

export interface BusinessHoursState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function updateBusinessHoursAction(
  _prevState: BusinessHoursState,
  formData: FormData
): Promise<BusinessHoursState> {
  const session = await requireSession();
  const business = await getOwnedBusiness(session.user.id);
  if (!business) {
    return { error: "Empresa não encontrada." };
  }
  await requireBusinessOwner(business.ownerId);

  const fieldErrors: Record<string, string> = {};
  const rows: { day: (typeof DAYS)[number]; isClosed: boolean; openTime?: string; closeTime?: string }[] = [];

  for (const day of DAYS) {
    const parsed = businessHoursRowSchema.safeParse({
      isClosed: formData.get(`${day}_isClosed`) === "on",
      openTime: formData.get(`${day}_openTime`),
      closeTime: formData.get(`${day}_closeTime`),
    });

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      fieldErrors[`${day}_openTime`] = issue?.message ?? "Horário inválido";
      continue;
    }

    rows.push({ day, ...parsed.data });
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  await prisma.$transaction(
    rows.map((row) =>
      prisma.businessHours.upsert({
        where: { businessId_dayOfWeek: { businessId: business.id, dayOfWeek: row.day } },
        create: {
          businessId: business.id,
          dayOfWeek: row.day,
          isClosed: row.isClosed,
          openTime: row.openTime,
          closeTime: row.closeTime,
        },
        update: {
          isClosed: row.isClosed,
          openTime: row.openTime ?? null,
          closeTime: row.closeTime ?? null,
        },
      })
    )
  );

  revalidatePath("/painel/horarios");

  return {};
}
