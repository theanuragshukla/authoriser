import { z } from "zod";

export const signupSchema = z.object({
    firstName: z
        .string()
        .trim()
        .max(32, "Firstname cannot be more than 32 characters")
        .min(1, "Invalid Firstname"),
    lastName: z.string().max(32, "Lastname cannot be more than 32 characters"),
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .min(8, "Password cannot be less than 8 characters")
        .max(128, "Password cannot be more than 128 characters"),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string(),
});

export const refreshTokenSchema = z.object({
    userId: z.string(),
    refreshToken: z.string(),
    client_id: z.string(),
    client_secret: z.string(),
});

export const getAccessTokenSchema = z.object({
    code: z.string(),
    client_id: z.string(),
    client_secret: z.string(),
});

export const refreshAccessTokenSchema = z.object({
    refreshToken: z.string(),
    userId: z.string(),
    client_id: z.string(),
    client_secret: z.string(),
});
