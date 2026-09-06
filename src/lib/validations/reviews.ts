import { z } from "zod";

const optionalComment = z.preprocess(
  (v) => (v === "" || v == null ? undefined : v),
  z.string().trim().max(1000, "Comentário muito longo").optional()
);

export const reviewUpsertSchema = z.object({
  businessId: z.string().min(1),
  slug: z.string().min(1),
  rating: z.coerce.number().int().min(1, "Escolha de 1 a 5 estrelas").max(5),
  comment: optionalComment,
});

export type ReviewUpsertInput = z.infer<typeof reviewUpsertSchema>;

export const reviewDeleteSchema = z.object({
  businessId: z.string().min(1),
  slug: z.string().min(1),
});

export const favoriteToggleSchema = z.object({
  businessId: z.string().min(1),
  slug: z.string().min(1),
});
