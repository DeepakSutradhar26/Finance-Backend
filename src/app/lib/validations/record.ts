import { z } from "zod";

export const recordSchema = z.object({
    amount : z.number().int(),
    type : z.enum(["Income", "Expense"]),
    category : z.string(),
    date : z.coerce.date(),
});