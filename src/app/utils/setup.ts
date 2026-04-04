import { POST as login} from "@/app/api/auth/login/route";
import { prisma } from "@/app/utils/prisma";
import { makeRequest } from "@/app/utils/request";
import bcrypt from "bcryptjs";

const endpointLogin = "http://localhost/app/api/auth/login/route";

let _token : string;

export const getToken = () => _token;

export async function setupAdmin(){
    await prisma.user.deleteMany();
    
    await prisma.user.create({
        data : {
            name : "Abhisek",
            email : "abhishek88@gmail.com",
            password : await bcrypt.hash("45657593",10),
            role : "Admin",
            isActive : false,
        }
    });

    const res = await login(makeRequest(endpointLogin, "POST", 
        {
            email : "abhishek88@gmail.com",
            password : "45657593",
        }
    ));

    const body = await res.json();
    _token = body.token;
}

