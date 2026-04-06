import { verifyRole } from "@/app/lib/guards/user";
import { prisma } from "@/app/utils/prisma";
import { userSchema } from "@/app/lib/validations/auth";
import { errorHandler } from "@/app/utils/errorHandler";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

// Admins accesspoint only. Viewer and Analyst cannot access this endpoint 
// Get all users logic
// export const GET = errorHandler(async(req : Request) => {
//     await verifyRole(req);

//     const users = await prisma.user.findMany({
//         select : {
//             id : true,
//             role : true,
//             email : true,
//         }
//     });

//     return NextResponse.json(
//         {users},
//         {status : 200},
//     );
// });

// Create user logic
export const POST = errorHandler(async (req : Request) => {
    await verifyRole(req);

    const body = await req.json();

    const result = userSchema.safeParse(body);

    if(!result.success){
        throw new Error("Validation Failed");
    }

    const {name, email, password, role} = body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data : {
            name,
            email,
            password : hashedPassword,
            role,
            isActive : false,
        }
    });

    const {password : _, ...userWithoutPassword} = user;

    return NextResponse.json(
        {user : userWithoutPassword},
        {status : 201},
    );
});