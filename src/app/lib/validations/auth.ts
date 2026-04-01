import z from "zod";

export const passwordSchema = z.string()
.min(8, "Password must longer than 8 characters");

export const emailSchema = z.string()
.email("Invalid email format");

export const authSchema = z.object({
    email : emailSchema,
    password : passwordSchema,
});