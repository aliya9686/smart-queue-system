import { z } from "zod";

export const roleSchema = z.enum(["admin", "customer"]);

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long.")
    .max(60, "Name must be at most 60 characters long."),
  email: z
    .string()
    .trim()
    .email("A valid email address is required."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .refine((value) => /[A-Z]/.test(value), {
      message: "Password must include at least one uppercase letter.",
    })
    .refine((value) => /[a-z]/.test(value), {
      message: "Password must include at least one lowercase letter.",
    })
    .refine((value) => /[0-9]/.test(value), {
      message: "Password must include at least one number.",
    }),
  role: roleSchema.optional(),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("A valid email address is required."),
  password: z.string().min(1, "Password is required."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
