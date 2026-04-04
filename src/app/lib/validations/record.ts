import { z } from "zod";

export const recordSchema = z.object({
    amount : z.number().int(),
    type : z.enum(["Income", "Expense"]),
    category : z.string(),
    description : z.string().optional(),
});

export const recordPatchSchema = z.object({
    amount : z.number().int().optional(),
    type : z.enum(["Income", "Expense"]).optional(),
    category : z.string().optional(),
    createdAt : z.coerce.date().optional(),
    description : z.string().optional(),
});