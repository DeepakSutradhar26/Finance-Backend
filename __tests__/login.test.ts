import {POST} from "@/app/api/auth/login/route";
import {POST as register} from "@/app/api/auth/register/route";
import { prisma } from "@/app/utils/prisma";
import { makeRequest } from "@/app/utils/request";

const endpointRegister = "http://localhost/app/api/auth/register/route";
const endpointLogin = "http://localhost/app/api/auth/login/route";

describe("POST /app/api/auth/login", () => {
    beforeEach(async ()=>{
        await prisma.user.deleteMany();

        await register(makeRequest(endpointRegister, "POST", {
            email : "ghghgh@gmail.com",
            password : "456789673"
        }));
    });

    afterAll(async ()=> {
        await prisma.$disconnect();
    });

    // Not testing wrong email and number seperatly to keep it simple
    it("Incorrect input format", async ()=> {
        const res = await POST(makeRequest(endpointLogin, "POST", {
            email : "ghghgh",
            password : "7898",
        }));
        const body = await res.json();

        expect(res.status).toBe(400);
        expect(body.message).toBe("Validation Failed");
    });

    it("Incorrect email entered", async () =>{
        const res = await POST(makeRequest(endpointLogin, "POST", {
            email : "ghghghrrr@gmail.com",
            password : "456789673"
        }));
        const body = await res.json();

        expect(res.status).toBe(404);
        expect(body.message).toBe("User not found");
    });

    it("Incorrect password entered", async () =>{
        const res = await POST(makeRequest(endpointLogin, "POST", {
            email : "ghghgh@gmail.com",
            password : "456789673uuu"
        }));
        const body = await res.json();

        expect(res.status).toBe(401);
        expect(body.message).toBe("Invalid password");
    });

    it("Login successfully", async () =>{
        const res = await POST(makeRequest(endpointLogin, "POST", {
            email : "ghghgh@gmail.com",
            password : "456789673"
        }));
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body.token).toBeDefined();
    });
});