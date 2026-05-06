import { z } from "zod";

export const createQueueSchema = z.object({
  name: z.string().trim().min(2, "Queue name must be at least 2 characters.").max(100),
  description: z.string().trim().max(500).optional().default(""),
});

export type CreateQueueInput = z.infer<typeof createQueueSchema>;
