import { verifyRole } from "@/app/lib/guards/user";
import { prisma } from "@/app/utils/prisma";
import { userDeleteSchema, userPutSchema, userSchema } from "@/app/lib/validations/auth";
import { errorHandler } from "@/app/utils/errorHandler";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { verifyUser } from "@/app/utils/verify";

export const GET = errorHandler(async() => {
    await verifyUser();
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
        throw new Error("Validation Failed");
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

export const PUT = errorHandler(async (req : Request) => {
    await verifyRole();

    const body = await req.json();

    const result = userPutSchema.safeParse(body);

    if(!result.success){
        throw new Error("Validation Failed");
    }

    const {email, role} = body;  

    const user = await prisma.user.update({
        where : {email : email},
        data : {
            role : role,
        },
    });

    const {password : _, ...userWithoutPassword} = user;

    return NextResponse.json(
        {user : userWithoutPassword},
        {status : 200},
    );
});

export const DELETE = errorHandler(async (req : Request) => {
    await verifyRole();

    const body = await req.json();

    const result = userDeleteSchema.safeParse(body);

    if(!result.success){
        throw new Error("Validation Failed");
    }

    const {email} = body;

    const userDelete = await prisma.user.findUnique({
        where : {
            email : email,
        }
    });

    if(!userDelete){
        throw new Error("User not found");
    }

    if(userDelete.role == "Admin"){
        return NextResponse.json(
            {message : "Admins cannot delete admins"},
            {status : 403},
        );
    }

    await prisma.user.delete({
        where : {
            email : email,
        }
    });

    return NextResponse.json(
        {message : "User Deleted Successfully"},
        {status : 200},
    );
});