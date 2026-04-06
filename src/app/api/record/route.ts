import { verifyRole } from "@/app/lib/guards/user";
import { recordSchema } from "@/app/lib/validations/record";
import { errorHandler } from "@/app/utils/errorHandler";
import { prisma } from "@/app/utils/prisma";
import { NextResponse } from "next/server";

// export const GET = errorHandler(async (req : Request) => {
//     await verifyRole(req);

//     const records = await prisma.record.findMany({
//         select : {
//             id : true,
//             amount : true,
//             type : true,
//             category : true,
//             description : true,
//             createdAt : true,
//         }
//     });

//     return NextResponse.json(
//         {records},
//         {status : 200},
//     );
// });

export const POST = errorHandler(async (req : Request) => {
    const user = await verifyRole(req); 

    const body = await req.json();

    const result = recordSchema.safeParse(body);

    if(!result.success){
        throw new Error("Validation Failed");
    }

    const {amount, type, category, description} = result.data;

    const record = await prisma.record.create({
        data : {
            amount,
            type,
            category,
            createdAt : new Date(Date.now()),
            description,
            userId : user.id
        }
    });

    return NextResponse.json(
        {record},
        {status : 201},
    );
});