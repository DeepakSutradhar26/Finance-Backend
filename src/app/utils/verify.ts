import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

interface UserPayload{
    id : string,
    role : "Viewer" | "Analyst" | "Admin"
}

export async function verifyUser(req? : Request) : Promise<UserPayload | null>{
    try{
        let token : string | undefined;

        //Get token from headers in Authorization for tests
        if(req){
            token = req.headers.get("Authorization")?.split(" ")[1];
        }

        //Get token from cookies if present in cookies
        if(!token){
            const cookieUser = await cookies();
            token = cookieUser.get("token")?.value;
        }

        if(!token) return null;

        const decoder = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;

        return decoder;
    }catch(err:any){
        return null;
    }
}