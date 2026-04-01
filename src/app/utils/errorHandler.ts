import { NextResponse } from "next/server";

export function errorHandler(handler : Function){
    return async (req : Request) => {
        try{
            return await handler(req);
        }catch(err:any){
            return NextResponse.json(
                {message : "Internal Server Error", error : err.message},
                {status : 500},
            );
        }
    }
}