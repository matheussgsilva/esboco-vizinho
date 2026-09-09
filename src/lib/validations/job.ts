import { z } from "zod";
import { optionalEmail, optionalTrimmed, optionalUrl, priceField } from "@/lib/validations/business";

export const JOB_TYPES = ["CLT", "PJ", "ESTAGIO", "FREELANCE", "TEMPORARIO"] as const;
export type JobTypeCode = (typeof JOB_TYPES)[number];

export const JOB_TYPE_LABELS: Record<JobTypeCode, string> = {
  CLT: "CLT",
  PJ: "PJ",
  ESTAGIO: "Estágio",
  FREELANCE: "Freelance",
  TEMPORARIO: "Temporário",
};

export const WORK_MODES = ["PRESENCIAL", "REMOTO", "HIBRIDO"] as const;
export type WorkModeCode = (typeof WORK_MODES)[number];

export const WORK_MODE_LABELS: Record<WorkModeCode, string> = {
  PRESENCIAL: "Presencial",
  REMOTO: "Remoto",
  HIBRIDO: "Híbrido",
};

export const JOB_STATUSES = ["OPEN", "CLOSED"] as const;
export type JobStatusCode = (typeof JOB_STATUSES)[number];

export const JOB_STATUS_LABELS: Record<JobStatusCode, string> = {
  OPEN: "Aberta",
  CLOSED: "Fechada",
};

export const JOB_DEFAULT_DURATION_DAYS = 90;

const jobBaseFields = {
  title: z.string().trim().min(1, "Informe o título da vaga").max(150),
  description: z.string().trim().min(1, "Descreva a vaga").max(5000),
  type: z.enum(JOB_TYPES, { message: "Selecione o tipo de contratação" }),
  workMode: z.enum(WORK_MODES, { message: "Selecione a modalidade" }),
  city: optionalTrimmed(100),
  state: optionalTrimmed(2),
  salaryMin: priceField,
  salaryMax: priceField,
  showSalary: z.preprocess((v) => v === "on" || v === true, z.boolean()),
  contactEmail: optionalEmail,
  applicationUrl: optionalUrl,
};

const hasContactMethod = (data: { contactEmail?: string; applicationUrl?: string }) =>
  Boolean(data.contactEmail || data.applicationUrl);

const salaryRangeIsValid = (data: { salaryMin?: number; salaryMax?: number }) =>
  data.salaryMin == null || data.salaryMax == null || data.salaryMax >= data.salaryMin;

const optionalFutureDate = z.preprocess(
  (v) => (v === "" || v == null ? undefined : v),
  z.coerce.date().optional()
);

export const jobCreateSchema = z
  .object({
    ...jobBaseFields,
    closesAt: optionalFutureDate,
  })
  .refine(hasContactMethod, {
    message: "Informe um email de contato ou um link de candidatura",
    path: ["contactEmail"],
  })
  .refine(salaryRangeIsValid, {
    message: "Salário máximo deve ser maior ou igual ao mínimo",
    path: ["salaryMax"],
  })
  .refine((data) => !data.closesAt || data.closesAt > new Date(), {
    message: "A data de fechamento deve ser no futuro",
    path: ["closesAt"],
  });

export type JobCreateInput = z.infer<typeof jobCreateSchema>;

export const jobUpdateSchema = z
  .object({
    id: z.string().min(1),
    ...jobBaseFields,
    status: z.enum(JOB_STATUSES, { message: "Selecione o status" }),
    closesAt: z.coerce.date({ message: "Data de fechamento inválida" }),
  })
  .refine(hasContactMethod, {
    message: "Informe um email de contato ou um link de candidatura",
    path: ["contactEmail"],
  })
  .refine(salaryRangeIsValid, {
    message: "Salário máximo deve ser maior ou igual ao mínimo",
    path: ["salaryMax"],
  });

export type JobUpdateInput = z.infer<typeof jobUpdateSchema>;

export const jobDeleteSchema = z.object({
  id: z.string().min(1),
});
