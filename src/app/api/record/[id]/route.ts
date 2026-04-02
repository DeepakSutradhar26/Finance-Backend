import { verifyRole } from "@/app/lib/guards/user";
import { recordSchema } from "@/app/lib/validations/record";
import { errorHandler } from "@/app/utils/errorHandler";
import { prisma } from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export const PATCH = errorHandler(async (req : Request, {params} : {params: {id : string}}) => {
    const user = await verifyRole();

    const body = await req.json();

    const result = recordSchema.safeParse(body);

    if(!result.success){
        throw new Error("Validation Failed");
    }

    const {amount, type, category, date} = result.data; 

    const {id} = await params;

    const record = await prisma.record.findUnique({
        where : {
            id : id,
        }
    });

    if(!record){
        return NextResponse.json(
            {message : "Record does not exist"},
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
            date,
        }
    });

    return NextResponse.json(
        {recordUpdate},
        {status : 200},
    );
});

export const DELETE = errorHandler(async (req : Request, {params} : {params : {id : string}}) => {
    const user = await verifyRole();

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

    await prisma.record.delete({
        where : {
            id : id,
        }
    });

    return NextResponse.json(
        {message : "Record deleted successfully"},
        {status : 200},
    );
});