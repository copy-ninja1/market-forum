import { z } from "zod";

export const signInSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const signUpSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  displayName: z
    .string()
    .trim()
    .min(2, "Display name must be at least 2 characters.")
    .max(60, "Display name must be 60 characters or fewer."),
  institution: z
    .string()
    .trim()
    .min(2, "Institution must be at least 2 characters.")
    .max(80, "Institution must be 80 characters or fewer."),
});

export const passwordResetSchema = z.object({
  email: z.email("Enter a valid email address."),
});

export const updateProfileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Display name must be at least 2 characters.")
    .max(60, "Display name must be 60 characters or fewer."),
  institution: z
    .string()
    .trim()
    .min(2, "Institution must be at least 2 characters.")
    .max(80, "Institution must be 80 characters or fewer."),
  preferredContactType: z.enum(["email", "phone", "other"]),
  preferredContactValue: z
    .string()
    .trim()
    .min(3, "Contact value must be at least 3 characters.")
    .max(120, "Contact value must be 120 characters or fewer."),
});

export type SignInSchema = z.infer<typeof signInSchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;
export type PasswordResetSchema = z.infer<typeof passwordResetSchema>;
export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
