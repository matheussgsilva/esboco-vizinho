"use server";

import { revalidatePath } from "next/cache";
import { requireSession, requireBusinessOwner } from "@/lib/auth-utils";
import { getOwnedBusiness } from "@/lib/business";
import { prisma } from "@/lib/prisma";
import {
  businessProfileSchema,
  socialLinkAddSchema,
  socialLinkDeleteSchema,
} from "@/lib/validations/business";

export interface BusinessProfileState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function updateBusinessProfileAction(
  _prevState: BusinessProfileState,
  formData: FormData
): Promise<BusinessProfileState> {
  const session = await requireSession();
  const business = await getOwnedBusiness(session.user.id);
  if (!business) {
    return { error: "Empresa não encontrada." };
  }
  await requireBusinessOwner(business.ownerId);

  const parsed = businessProfileSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    phone: formData.get("phone"),
    whatsapp: formData.get("whatsapp"),
    website: formData.get("website"),
    email: formData.get("email"),
    addressLine: formData.get("addressLine"),
    city: formData.get("city"),
    state: formData.get("state"),
    zipCode: formData.get("zipCode"),
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

  await prisma.business.update({
    where: { id: business.id },
    data: parsed.data,
  });

  revalidatePath("/painel/perfil");
  revalidatePath("/painel");

  return {};
}

export interface SocialLinkState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function manageSocialLinkAction(
  _prevState: SocialLinkState,
  formData: FormData
): Promise<SocialLinkState> {
  const session = await requireSession();
  const intent = formData.get("intent");

  if (intent === "add") {
    const business = await getOwnedBusiness(session.user.id);
    if (!business) {
      return { error: "Empresa não encontrada." };
    }
    await requireBusinessOwner(business.ownerId);

    const parsed = socialLinkAddSchema.safeParse({
      platform: formData.get("platform"),
      url: formData.get("url"),
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

    await prisma.socialLink.create({
      data: { businessId: business.id, ...parsed.data },
    });

    revalidatePath("/painel/perfil");
    return {};
  }

  if (intent === "delete") {
    const parsed = socialLinkDeleteSchema.safeParse({ id: formData.get("id") });
    if (!parsed.success) {
      return { error: "Ação inválida." };
    }

    const link = await prisma.socialLink.findUnique({
      where: { id: parsed.data.id },
      include: { business: { select: { ownerId: true } } },
    });

    if (!link) {
      return { error: "Link não encontrado." };
    }

    await requireBusinessOwner(link.business.ownerId);

    await prisma.socialLink.delete({ where: { id: link.id } });

    revalidatePath("/painel/perfil");
    return {};
  }

  return { error: "Ação inválida." };
}
