import { z } from "zod";

export const categoryCreateSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome da categoria").max(80),
});

export const categoryUpdateSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1, "Informe o nome da categoria").max(80),
});

export const categoryDeleteSchema = z.object({
  id: z.string().min(1),
});

export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
