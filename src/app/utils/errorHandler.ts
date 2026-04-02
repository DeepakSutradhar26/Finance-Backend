import { NextResponse } from "next/server";

type Handler = (...args : any[]) => Promise<Response>;

export function errorHandler(handler : Handler){
    return async (...args : any[]) => {
        try{
            return await handler(...args);
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