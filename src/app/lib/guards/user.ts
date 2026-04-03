import { verifyUser } from "../../utils/verify";

export async function verifyRole(req? : Request){
    const user = await verifyUser(req);
    
    if(!user){
        throw new Error("Unauthorized access");
    }

    if(user.role != "Admin"){
        throw new Error("Forbidden access");
    }

    return user;
}