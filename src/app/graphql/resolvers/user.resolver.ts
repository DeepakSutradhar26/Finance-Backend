import { GraphQLError } from "graphql";
import { GraphQLContext } from "../context";

export const userResolver = {
    Query : {
        users : async(
            _ : unknown,
            __ : unknown,
            ctx : GraphQLContext
        ) => {
            if(ctx.user?.role !== "Admin"){
                throw new GraphQLError("Forbidden Access", {
                    extensions : {code : "FORBIDDEN"}
                });
            }

            return ctx.prisma.user.findMany({
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
            });
        },

        userById : async(
            _ : unknown,
            args : {id : string},
            ctx : GraphQLContext,
        ) => {
            if(ctx.user?.role !== "Admin"){
                throw new GraphQLError("Forbidden Access", {
                    extensions : {code : "FORBIDDEN"}
                });
            }

            return ctx.prisma.user.findUnique({
                where : {id : args.id},
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
            });
        }
    }
}
