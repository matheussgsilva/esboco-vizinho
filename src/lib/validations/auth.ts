import { z } from "zod";

const emailField = z.string().trim().min(1, "Informe o email").email("Email inválido");
const passwordField = z.string().min(8, "A senha deve ter pelo menos 8 caracteres");

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Informe a senha"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Informe seu nome"),
    email: emailField,
    password: passwordField,
    confirmPassword: z.string().min(1, "Confirme a senha"),
    role: z.enum(["USER", "BUSINESS"]),
    businessName: z.string().trim().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })
  .refine((data) => data.role !== "BUSINESS" || (data.businessName?.length ?? 0) > 0, {
    message: "Informe o nome do negócio",
    path: ["businessName"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    email: emailField,
    password: passwordField,
    confirmPassword: z.string().min(1, "Confirme a senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
