import { z } from "zod";

export const trackEventSchema = z.object({
  businessId: z.string().min(1),
  type: z.enum(["CLICK_PHONE", "CLICK_WHATSAPP", "CLICK_SOCIAL"]),
});

export type TrackEventInput = z.infer<typeof trackEventSchema>;
