import { GraphQLError } from "graphql";
import { GraphQLContext } from "../context";

export const dashboardResolver = {
    Query : {
        dashboardSummary : async(
            _ : unknown,
            __: unknown,
            ctx : GraphQLContext
        ) => {
            if(!ctx.user){
                throw new GraphQLError("Forbidden access", {
                    extensions : {code : "FORBIDDEN"}
                });
            }

            const whereIncome : any = {
                deletedAt : null,
                type : "Income",
                userId : ctx.user.id,
            }

            const whereExpense : any = {
                deletedAt : null,
                type : "Expense",
                userId : ctx.user.id,
            }

            const [
            income, 
            expense] = await Promise.all([
                ctx.prisma.record.aggregate({
                    where : whereIncome,
                    _sum : {amount : true},
                    _count : true
                }),
                ctx.prisma.record.aggregate({
                    where : whereExpense,
                    _sum : {amount : true},
                    _count : true
                }),
            ]);

            return {
                totalIncome : income._sum.amount ?? 0,
                totalExpense : expense._sum.amount ?? 0,
                netBalance : (income._sum.amount ?? 0) - (expense._sum.amount ?? 0),
                recordCount : (income._count ?? 0) + (expense._count ?? 0),
            }
        },
        categoryTotals : async(
            _:unknown,
            __:unknown,
            ctx : GraphQLContext
        ) => {
            if(!ctx.user){
                throw new GraphQLError("Forbidden access", {
                    extensions : {code : "FORBIDDEN"}
                });
            }

            const where : any = {
                deletedAt : null,
                userId : ctx.user?.id,
            }

            const records = await ctx.prisma.record.groupBy({
                by : ["category"],
                where : where,
                _sum : {amount : true},
                _count : true
            });

            return records.map((r) => ({
                category : r.category,
                total : r._sum.amount ?? 0,
                count : r._count
            }));
        },
        monthlyTrends : async(
            _:unknown,
            args : {year? : number},
            ctx : GraphQLContext
        ) => {
            if(!ctx.user){
                throw new GraphQLError("Forbidden access", {
                    extensions : {code : "FORBIDDEN"}
                });
            }

            const year = args.year ?? new Date().getFullYear();

            const trends = await ctx.prisma.$queryRaw`
            SELECT 
                TO_CHAR("createdAt", 'YYYY-MM') as month,
                SUM(CASE WHEN type = 'Income' THEN amount ELSE 0 END) as income,
                SUM(CASE WHEN type = 'Expense' THEN amount ELSE 0 END) as expense
            FROM "Record"
            WHERE "userId" = ${ctx.user?.id}
            AND "deletedAt" IS null
            AND EXTRACT(YEAR FROM "createdAt") = ${year}
            GROUP BY TO_CHAR("createdAt", 'YYYY-MM')
            ORDER BY month ASC
            `;

            return ((trends as any[]).map((t) => ({
                month : t.month,
                income : Number(t.income ?? 0),
                expense : Number(t.expense ?? 0)
            })));
        }
    }
}