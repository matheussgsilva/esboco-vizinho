import type { ReactNode } from "react";
import { resend } from "@/lib/resend";
import { prisma } from "@/lib/prisma";
import type { EmailType } from "../../generated/enums";

interface SendEmailParams {
  to: string;
  type: EmailType;
  subject: string;
  react: ReactNode;
}

export async function sendEmail({ to, type, subject, react }: SendEmailParams): Promise<void> {
  const from = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  try {
    const { data, error } = await resend.emails.send({ from, to, subject, react });

    await prisma.emailLog.create({
      data: {
        to,
        type,
        resendId: data?.id,
        status: error ? `error: ${error.message}` : "sent",
      },
    });

    if (error) {
      console.error(`[email] falha ao enviar ${type} para ${to}:`, error.message);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "erro desconhecido";
    await prisma.emailLog.create({
      data: { to, type, status: `error: ${message}` },
    });
    console.error(`[email] falha ao enviar ${type} para ${to}:`, message);
  }
}
