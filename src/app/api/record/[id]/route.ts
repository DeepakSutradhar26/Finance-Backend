import { verifyRole } from "@/app/lib/guards/user";
import { recordPatchSchema} from "@/app/lib/validations/record";
import { errorHandler } from "@/app/utils/errorHandler";
import { prisma } from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export const PATCH = errorHandler(async (req : Request, {params} : {params: {id : string}}) => {
    const user = await verifyRole(req);

    const body = await req.json();

    const result = recordPatchSchema.safeParse(body);

    if(!result.success){
        throw new Error("Validation Failed");
    }

    const {amount, type, category, description} = result.data; 

    const {id} = await params;

    const record = await prisma.record.findUnique({
        where : {
            id : id,
        }
    });

    if(!record){
        return NextResponse.json(
            {message : "Record not found"},
            {status : 404},
        );
    }

    if(record.userId != user.id){
        throw new Error("Forbidden access");
    }

    const recordUpdate = await prisma.record.update({
        where : {
            id : id,
        },
        data : {
            amount,
            type,
            category,
            description,
        }
    });

    return NextResponse.json(
        recordUpdate,
        {status : 200},
    );
});

export const DELETE = errorHandler(async (req : Request, {params} : {params : {id : string}}) => {
    const user = await verifyRole(req);

    const {id} = await params;

    const record = await prisma.record.findUnique({
        where : {
            id : id,
        }
    });

    if(!record){
        return NextResponse.json(
            {message : "Record not found"},
            {status : 404},
        );
    }

    if(record.userId != user.id){
        throw new Error("Forbidden access");
    }

    await prisma.record.update({
        where : {
            id : id,
        },
        data : {
            deletedAt : new Date(Date.now())
        }
    });

    return NextResponse.json(
        {message : "Record deleted successfully"},
        {status : 200},
    );
});