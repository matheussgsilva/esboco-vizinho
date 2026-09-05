"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateUniqueBusinessSlug } from "@/lib/slug";
import { registerSchema } from "@/lib/validations/auth";

export interface RegisterState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

const ROLE_REDIRECT: Record<string, string> = {
  ADMIN: "/admin",
  BUSINESS: "/painel",
  USER: "/minha-conta",
};

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    role: formData.get("role"),
    businessName: formData.get("businessName") || undefined,
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

  const { name, email, password, role, businessName } = parsed.data;
  const callbackUrl = formData.get("callbackUrl");

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { fieldErrors: { email: "Já existe uma conta com esse email." } };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { name, email, passwordHash, role },
    });

    if (role === "BUSINESS" && businessName) {
      const slug = await generateUniqueBusinessSlug(businessName);
      await tx.business.create({
        data: { ownerId: user.id, name: businessName, slug },
      });
    }
  });

  const redirectTo =
    (typeof callbackUrl === "string" && callbackUrl) || ROLE_REDIRECT[role] || "/";

  try {
    await signIn("credentials", { email, password, redirectTo });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Conta criada, mas não foi possível entrar automaticamente. Faça login." };
    }
    throw error;
  }

  return {};
}
