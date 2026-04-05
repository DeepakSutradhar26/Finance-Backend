import { GraphQLError } from "graphql";
import { GraphQLContext } from "../context";

interface RecordArgs {
    type? : "Income" | "Expense",
    category : string,
    from? : string,
    to? : string,
    page? : number,
    limit? : number,
}

export const recordResolver = {
    Query : {
        records : async(
            _ : unknown,
            args : RecordArgs,
            ctx : GraphQLContext
        )=>{
            console.log("ctx.user:", ctx.user);
            if(!ctx.user || ctx.user.role === "Viewer"){
                throw new GraphQLError("Forbidden access", {
                    extensions : {code : "FORBIDDEN"},
                });
            }

            const page = args.page ?? 1;
            const limit = args.limit ?? 10;
            const skip = (page - 1) * limit;

            const where : any = {
                deletedAt : null,
                ...(ctx.user.role === "Analyst" && {userId : ctx.user.id}),
                ...(args.type && {type : args.type}),
                ...(args.category && {category : args.category}),
                ...((args.from || args.to) && {
                    createdAt: {
                        ...(args.from && { gte: new Date(args.from) }),
                        ...(args.to && { lte: new Date(args.to) }),
                    }
                }),
            }

            const [records, total] = await Promise.all([
                ctx.prisma.record.findMany({
                    where : where,
                    skip : skip,
                    take : limit,
                    orderBy : {createdAt : "desc"},
                    select : {
                        id : true,
                        amount : true,
                        type : true,
                        category : true,
                        description : true,
                        createdAt : true,
                    }
                }),
                ctx.prisma.record.count({where : where}),
            ]);

            return {
                records : records.map((r) => ({
                    ...r,
                    createdAt : r.createdAt.toISOString(),
                })),
                meta : {
                    total : total,
                    page : page,
                    limit : limit,
                    totalPages: Math.ceil(total/limit) || 1,
                }
            };
        },
        recentActivity : async(
            _:unknown,
            args:{limit? : number},
            ctx:GraphQLContext,
        ) => {
            if(!ctx.user || ctx.user.role === "Viewer"){
                throw new GraphQLError("Forbidden access", {
                    extensions : {code : "FORBIDDEN"},
                });
            }

            const where : any = {
                deletedAt : null,
                ...(ctx.user?.role === "Analyst" && {userId : ctx.user.id}),
            };

            const records = await ctx.prisma.record.findMany({
                where,
                take: args.limit ?? 5,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    amount: true,
                    type: true,
                    category: true,
                    description: true,
                    createdAt: true,
                }
            });

            return records.map((r) => ({
                ...r,
                createdAt: r.createdAt.toISOString()
            }));
        }
    }
}