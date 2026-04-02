import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

interface UserPayload{
    id : string,
    role : "Viewer" | "Analyst" | "Admin"
}

export async function verifyUser() : Promise<UserPayload | null>{
    try{
        const cookieUser = await cookies();

        const token = cookieUser.get("token")?.value;
        if(!token) return null;

        const decoder = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;

        return decoder;
    }catch(err:any){
        return null;
    }
}