import { verifyRole } from "@/app/lib/guards/user";
import { recordSchema } from "@/app/lib/validations/record";
import { errorHandler } from "@/app/utils/errorHandler";
import { prisma } from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export const GET = errorHandler(async (req : Request) => {
    await verifyRole();

    const records = await prisma.record.findMany({
        select : {
            id : true,
            amount : true,
            type : true,
            category : true,
            date : true,
        }
    });

    return NextResponse.json(
        {records},
        {status : 200},
    );
});

export const POST = errorHandler(async (req : Request) => {
    const user = await verifyRole(); 

    const body = await req.json();

    const result = recordSchema.safeParse(body);

    if(!result.success){
        throw new Error("Validation Failed");
    }

    const {amount, type, category, date} = result.data;

    const record = await prisma.record.create({
        data : {
            amount,
            type,
            category,
            date,
            userId : user.id
        }
    });

    return NextResponse.json(
        {record},
        {status : 201},
    );
});