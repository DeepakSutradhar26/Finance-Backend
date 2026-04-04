import {ApolloServer} from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "@/app/graphql/schema";
import { resolvers } from "@/app/graphql/resolvers";
import { NextRequest } from "next/server";
import {createContext, GraphQLContext} from "@/app/graphql/context";

const server = new ApolloServer<GraphQLContext>({typeDefs, resolvers});

const handler = startServerAndCreateNextHandler<NextRequest, GraphQLContext>(server, {
    context : createContext,
});

export async function GET(req: NextRequest) {
  return handler(req);
}

export async function POST(req: NextRequest) {
  return handler(req);
}