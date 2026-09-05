"use server";

import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { sendEmail } from "@/lib/email";
import { ResetPasswordEmail } from "@/emails/reset-password";

export interface ForgotPasswordState {
  submitted?: boolean;
  error?: string;
}

const TOKEN_TTL_MS = 60 * 60 * 1000;

export async function forgotPasswordAction(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: "Informe um email válido." };
  }

  const { email } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  if (user?.passwordHash) {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    await prisma.verificationToken.deleteMany({ where: { identifier: email } });
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: hashedToken,
        expires: new Date(Date.now() + TOKEN_TTL_MS),
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/redefinir-senha?token=${rawToken}&email=${encodeURIComponent(email)}`;

    if (process.env.NODE_ENV !== "production") {
      console.log(`[reset-password] link de redefinição para ${email}: ${resetUrl}`);
    }

    await sendEmail({
      to: email,
      type: "RESET_PASSWORD",
      subject: "Redefinir senha - Esboço Páginas Amarelas",
      react: ResetPasswordEmail({ name: user.name, resetUrl }),
    });
  }

  return { submitted: true };
}
