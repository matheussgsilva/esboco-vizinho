import { z } from "zod";

export const businessModerationSchema = z.object({
  id: z.string().min(1),
  intent: z.enum(["approve", "reject", "suspend", "reactivate", "reconsider"]),
});

export type BusinessModerationInput = z.infer<typeof businessModerationSchema>;

export const reviewModerationSchema = z.object({
  id: z.string().min(1),
  intent: z.enum(["restore", "remove"]),
});

export type ReviewModerationInput = z.infer<typeof reviewModerationSchema>;
