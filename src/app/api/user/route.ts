import { verifyRole } from "@/app/lib/guards/user";
import { prisma } from "@/app/lib/prisma";
import { userSchema } from "@/app/lib/validations/auth";
import { errorHandler } from "@/app/utils/errorHandler";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const GET = errorHandler(async() => {
    await verifyRole();

    const users = await prisma.user.findMany({
        select : {
            id : true,
            role : true,
            email : true,
            records : true,
        }
    });

    return NextResponse.json(
        {users},
        {status : 200},
    );
});

export const POST = errorHandler(async (req : Request) => {
    await verifyRole();

    const body = await req.json();

    const result = userSchema.safeParse(body);

    if(!result.success){
        return NextResponse.json(
            {message : "Validation Failed", error : result.error.format()},
            {status : 400},
        );
    }

    const {email, password, role} = body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data : {
            email,
            password : hashedPassword,
            role,
        }
    });

    const {password : _, ...userWithoutPassword} = user;

    return NextResponse.json(
        {user : userWithoutPassword},
        {status : 200},
    );
});