import { prisma } from "@/app/lib/prisma";
import { authSchema } from "@/app/lib/validations/auth";
import { errorHandler } from "@/app/utils/errorHandler";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = errorHandler(async (req : Request) => {
    const body = await req.json();

    const result = authSchema.safeParse(body);

    if(!result.success){
        return NextResponse.json(
            {message : "Validation Failed", errors : result.error.format()},
            {status : 400}
        );
    }

    const {email, password} = result.data;

    const userEmail = await prisma.user.findUnique({
        where : {
            email : email,
        }
    });

    if(userEmail != null){
        return NextResponse.json(
            {message : "Email already exist"},
            {status : 409},
        );
    }

    const hashed_password = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data : {
            role : "Viewer",
            email : email,
            password : hashed_password,
        }
    });

    const {password : _, ...userWithoutPassword} = user;

    return NextResponse.json(
        {userWithoutPassword},
        {status : 201},
    );
});