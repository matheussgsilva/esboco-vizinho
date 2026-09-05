"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";

export interface LoginState {
  error?: string;
}

const ROLE_REDIRECT: Record<string, string> = {
  ADMIN: "/admin",
  BUSINESS: "/painel",
  USER: "/minha-conta",
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Email ou senha inválidos." };
  }

  const { email, password } = parsed.data;
  const callbackUrl = formData.get("callbackUrl");

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { role: true },
  });

  const redirectTo =
    (typeof callbackUrl === "string" && callbackUrl) ||
    (existingUser ? ROLE_REDIRECT[existingUser.role] : undefined) ||
    "/";

  try {
    await signIn("credentials", { email, password, redirectTo });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Email ou senha inválidos." };
    }
    throw error;
  }

  return {};
}

export async function googleSignInAction(formData: FormData): Promise<void> {
  const callbackUrl = formData.get("callbackUrl");
  await signIn("google", {
    redirectTo: (typeof callbackUrl === "string" && callbackUrl) || "/",
  });
}
