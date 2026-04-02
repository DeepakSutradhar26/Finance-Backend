import { NextResponse } from "next/server";

export function errorHandler(handler : Function){
    return async (req : Request) => {
        try{
            return await handler(req);
        }catch(err:any){
            if(err.message == "Validation Failed"){
                return NextResponse.json(
                    {message : "Validation Failed", error : err.message},
                    {status : 400},
                );
            }

            if(err.message == "Unauthorized access"){
                return NextResponse.json(
                    {message : err.message},
                    {status : 401},
                );
            }

            if(err.message == "Forbidden access"){
                return NextResponse.json(
                    {message : err.message},
                    {status : 403},
                );
            }

            if(err.code == "P2025" || err.message == "User Not Found"){
                return NextResponse.json(
                    {message : "User Not Found"},
                    {status : 404},
                );
            }

            return NextResponse.json(
                {message : "Internal Server Error", error : err.message},
                {status : 500},
            );
        }
    }
}