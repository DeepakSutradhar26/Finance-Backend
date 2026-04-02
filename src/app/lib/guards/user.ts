import { verifyUser } from "../../utils/verify";

export async function verifyRole(){
    const user = await verifyUser();
    
    if(!user){
        throw new Error("Unauthorized access");
    }

    if(user.role != "Admin"){
        throw new Error("Forbidden access");
    }
}