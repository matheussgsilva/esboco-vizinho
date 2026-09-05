import { z } from "zod";

const optionalTrimmed = (max: number) =>
  z.preprocess(
    (v) => (v === "" || v == null ? undefined : v),
    z.string().trim().max(max).optional()
  );

const optionalUrl = z.preprocess(
  (v) => (v === "" || v == null ? undefined : v),
  z.string().trim().url("URL inválida").optional()
);

const optionalEmail = z.preprocess(
  (v) => (v === "" || v == null ? undefined : v),
  z.string().trim().email("Email inválido").optional()
);

export const businessProfileSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do negócio").max(120),
  description: optionalTrimmed(2000),
  phone: optionalTrimmed(30),
  whatsapp: optionalTrimmed(30),
  website: optionalUrl,
  email: optionalEmail,
  addressLine: optionalTrimmed(200),
  city: optionalTrimmed(100),
  state: optionalTrimmed(2),
  zipCode: optionalTrimmed(20),
});

export type BusinessProfileInput = z.infer<typeof businessProfileSchema>;

export const socialLinkAddSchema = z.object({
  platform: z.string().trim().min(1, "Informe a rede social").max(40),
  url: z.string().trim().url("URL inválida"),
});

export const socialLinkDeleteSchema = z.object({
  id: z.string().min(1),
});

export const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;
export type DayCode = (typeof DAYS)[number];

export const DAY_LABELS: Record<DayCode, string> = {
  MON: "Segunda",
  TUE: "Terça",
  WED: "Quarta",
  THU: "Quinta",
  FRI: "Sexta",
  SAT: "Sábado",
  SUN: "Domingo",
};

const timeField = z.preprocess(
  (v) => (v === "" || v == null ? undefined : v),
  z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use o formato HH:MM")
    .optional()
);

export const businessHoursRowSchema = z
  .object({
    isClosed: z.boolean(),
    openTime: timeField,
    closeTime: timeField,
  })
  .refine((data) => data.isClosed || (data.openTime && data.closeTime), {
    message: "Informe abertura e fechamento, ou marque como fechado",
    path: ["openTime"],
  })
  .refine(
    (data) => data.isClosed || !data.openTime || !data.closeTime || data.openTime < data.closeTime,
    { message: "Abertura deve ser antes do fechamento", path: ["openTime"] }
  );

export type BusinessHoursRowInput = z.infer<typeof businessHoursRowSchema>;

const priceField = z.preprocess(
  (v) => (v === "" || v == null ? undefined : v),
  z.coerce.number().nonnegative("Preço não pode ser negativo").optional()
);

export const productCreateSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do produto").max(120),
  description: optionalTrimmed(2000),
  price: priceField,
  isActive: z.preprocess((v) => v === "on" || v === true, z.boolean()),
});

export const productUpdateSchema = productCreateSchema.extend({
  id: z.string().min(1),
});

export const productDeleteSchema = z.object({
  id: z.string().min(1),
});
