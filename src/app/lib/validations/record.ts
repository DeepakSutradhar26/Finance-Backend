import { z } from "zod";

export const recordSchema = z.object({
    amount : z.number().int(),
    type : z.enum(["Income", "Expense"]),
    category : z.string(),
    date : z.coerce.date(),
});

export const recordPatchSchema = z.object({
    amount : z.number().int().optional(),
    type : z.enum(["Income", "Expense"]).optional(),
    category : z.string().optional(),
    date : z.coerce.date().optional(),
});