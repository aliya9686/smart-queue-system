import { z } from "zod";

export const generateTokenSchema = z.object({
  queueId: z.string().trim().min(1, "Queue id is required."),
});

export type GenerateTokenInput = z.infer<typeof generateTokenSchema>;
