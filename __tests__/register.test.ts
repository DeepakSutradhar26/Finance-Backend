import {POST} from "@/app/api/auth/register/route";
import { prisma } from "@/app/utils/prisma";
import { makeRequest } from "@/app/utils/request";

const registerEndpoint = "http://localhost/app/api/auth/register/route";

describe("POST /api/auth/register", () => {
    beforeEach(async ()=>{
        await prisma.user.deleteMany();
        const count = prisma.user.count();

        console.log("Count:", count);
        console.log("Current Databse:", process.env.DATABASE_URL);
    });

    afterAll(async ()=> {
        await prisma.$disconnect();
    });

    // Not testing wrong email and number seperatly to keep it simple
    it("Incorrect input format", async ()=> {
        const res = await POST(makeRequest(registerEndpoint, "POST", {
            email : "ghghgh",
            password : "7898",
        }));
        const body = await res.json();

        expect(res.status).toBe(400);
        expect(body.message).toBe("Validation Failed");
    });

    it("Creating a new user", async ()=> {
        const res = await POST(makeRequest(registerEndpoint, "POST", {
            email : "ghghgh@gmail.com",
            password : "456789673"
        }));
        const body = await res.json();

        console.log(res);

        expect(res.status).toBe(201);
        expect(body.email).toBe("ghghgh@gmail.com");
        expect(body.password).toBeUndefined();
        expect(body.role).toBe("Viewer");
    });

    it("Email already exist in database", async ()=> {
        await POST(makeRequest(registerEndpoint, "POST", {
            email : "ghghgh@gmail.com",
            password : "456789673"
        }));
        const res = await POST(makeRequest(registerEndpoint, "POST", {
            email : "ghghgh@gmail.com",
            password : "456789673"
        }));
        const body = await res.json();

        expect(res.status).toBe(409);
        expect(body.message).toBe("Email already exist");
    });
});