import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Please enter your password"),
});

// Types
export type RegisterInput = z.infer<typeof registerSchema>;
export type RegisterErrors = Partial<Record<keyof RegisterInput, string[]>>;
export type LoginInput = z.infer<typeof loginSchema>;
