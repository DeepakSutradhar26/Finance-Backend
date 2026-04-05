import { verifyRole } from "@/app/lib/guards/user";
import { prisma } from "@/app/utils/prisma";
import { userPutSchema} from "@/app/lib/validations/auth";
import { errorHandler } from "@/app/utils/errorHandler";
import { NextResponse } from "next/server";

// Update only role of non admin user
export const PATCH = errorHandler(async (req : Request, {params} : {params : {id : string}}) => {
    await verifyRole(req);

    const body = await req.json();

    const result = userPutSchema.safeParse(body);

    if(!result.success){
        throw new Error("Validation Failed");
    }

    const {id} = await params;

    if(!id){
        return NextResponse.json(
            {message : "Params not given"},
            {status : 400},
        );
    }

    const {name, email, role} = body;  

    const userUpdate = await prisma.user.findUnique({
        where : {
            id : id,
        }
    });

    if(!userUpdate){
        throw new Error("User not found");
    }

    if(userUpdate.role == "Admin"){
        throw new Error("Forbidden access");
    }

    const user = await prisma.user.update({
        where : {id : id},
        data : {
            ...(name && {name : name}),
            ...(email && {email : email}),
            ...(role && {role : role}),
        },
    });

    const {password : _, ...userWithoutPassword} = user;

    return NextResponse.json(
        {user : userWithoutPassword},
        {status : 200},
    );
});

// Delete users which are not admins
export const DELETE = errorHandler(async (req : Request, {params} : {params : {id : string}}) => {
    await verifyRole(req);

    const {id} = await params;

    const userDelete = await prisma.user.findUnique({
        where : {
            id : id,
        }
    });

    if(!userDelete){
        throw new Error("User not found");
    }

    if(userDelete.role == "Admin"){
        throw new Error("Forbidden access")
    }

    await prisma.user.delete({
        where : {
            id : id,
        }
    });

    return NextResponse.json(
        {message : "User Deleted Successfully"},
        {status : 200},
    );
});