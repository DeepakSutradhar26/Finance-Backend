import { NextRequest } from "next/server";
import { prisma } from "../utils/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

interface UserPayload {
    id : string,
    role : "Viewer" | "Analyst" | "Admin"
}

export type GraphQLContext = {
    prisma : typeof prisma,
    user : UserPayload | null,
}

export async function createContext(req : NextRequest) : Promise<GraphQLContext>{
    try {
        let token = req.headers.get("Authorization")?.split(" ")[1];

        if(!token){
            const cookieStore = await cookies();
            token = cookieStore.get("token")?.value;
        }

        if(!token){
            return {prisma, user : null};
        }

        const decoder = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;

        return {prisma, user : decoder};
    }catch(err:any){
        return {prisma, user : null};
    }
}