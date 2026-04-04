import z from "zod";

export const passwordSchema = z.string()
.min(8, "Password must longer than 8 characters");

export const emailSchema = z.string()
.email("Invalid email format");

export const roleSchema = z.enum(["Viewer", "Analyst", "Admin"]);

export const authSchema = z.object({
    name : z.string().default("Newbie"),
    email : emailSchema,
    password : passwordSchema,
    isActive : z.boolean().default(false),
});

export const userSchema = z.object({
    name : z.string().default("Newbie"),
    email : emailSchema,
    password : passwordSchema,
    role : roleSchema,
    isActive : z.boolean().default(false),
});

export const userPutSchema = z.object({
    email : emailSchema,
    role : roleSchema,
});

export const userDeleteSchema = z.object({
    email : emailSchema,
});