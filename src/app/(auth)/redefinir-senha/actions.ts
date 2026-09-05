"use server";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validations/auth";

export interface ResetPasswordState {
  error?: string;
}

export async function resetPasswordAction(
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { token, email, password } = parsed.data;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const verificationToken = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier: email, token: hashedToken } },
  });

  if (!verificationToken || verificationToken.expires < new Date()) {
    return { error: "Link inválido ou expirado. Solicite uma nova recuperação de senha." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.$transaction([
    prisma.user.update({ where: { email }, data: { passwordHash } }),
    prisma.verificationToken.deleteMany({ where: { identifier: email } }),
  ]);

  redirect("/login?reset=sucesso");
}
