import { GraphQLError } from "graphql";
import { GraphQLContext } from "../context";

interface UserArgs {
    page? : number,
    limit? : number,
}

export const userResolver = {
    Query : {
        users : async(
            _ : unknown,
            args : UserArgs,
            ctx : GraphQLContext
        ) => {
            if(ctx.user?.role !== "Admin"){
                throw new GraphQLError("Forbidden Access", {
                    extensions : {code : "FORBIDDEN"}
                });
            }

            const page = args.page ?? 1;
            const limit = args.limit ?? 10;
            const skip = (page - 1) * limit;

            const [users, total] = await Promise.all([
                ctx.prisma.user.findMany({
                skip : skip,
                take : limit,
                select : {
                    id : true,
                    name : true,
                    email : true,
                    role : true,
                    isActive : true,
                    records : {
                        where : {deletedAt : null},
                        select : {
                            id : true,
                            amount : true,
                            type : true,
                            category : true,
                            description : true,
                            createdAt : true,
                            updatedAt : true,
                            userId : true,
                        }
                    }
                }
            }),
            ctx.prisma.user.count()
        ]);

        return {
            users : users,
            meta : {
                total : total,
                page : args.page,
                limit : args.limit,
                totalPages : Math.ceil(total / limit) ?? 0
            }
        }
        }
    }
}
