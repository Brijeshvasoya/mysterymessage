import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be at most 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters");

export const SignUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Email must be valid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  cpassword: z.string().optional(),
});
