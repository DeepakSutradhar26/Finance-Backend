import { NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authSchema } from "@/app/lib/validations/auth";
import { errorHandler } from "@/app/utils/errorHandler";

// Login user and save token inside cookies
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

    const user = await prisma.user.findUnique({
        where : {
            email : email
        }
    });

    if(!user){
        return NextResponse.json(
            {message : "User not found"},
            {status : 404},
        );
    }

    const isValid = await bcrypt.compare(password, user.password);

    if(!isValid){
        return NextResponse.json(
            {message : "Invalid password"},
            {status : 401},
        );
    }

    const token = jwt.sign(
        {id : user.id, role : user.role},
        process.env.JWT_SECRET!,
        {expiresIn : '1d'}
    );

    const {password : _, ...userWithoutPassword} = user;

    const response =  NextResponse.json(
        {token, user : userWithoutPassword},
        {status : 200}
    );

    response.cookies.set("token", token);

    return response;
});