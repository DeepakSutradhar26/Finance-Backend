import {GET, POST} from "@/app/api/user/route";
import { prisma } from "@/app/utils/prisma"; 
import { makeRequest } from "@/app/utils/request";
import bcrypt from "bcryptjs";
import { setupAdmin, getToken } from "@/app/utils/setup";

const endpointUser = "http://localhost/app/api/user/route";

describe("GET /app/api/user", () => {
    beforeEach(async() => {
        await prisma.user.deleteMany();

        await setupAdmin();
    });

    afterAll(async() => {
        await prisma.$disconnect();
    });

    it("Get all users", async() => {
        await prisma.user.create({
            data : {
                name : "Alik",
                email : "vbvmxbvm@gmail.com",
                password : await bcrypt.hash("djfnenfef", 10),
                role : "Viewer",
                isActive : false,
            }
        });
        const res = await GET(makeRequest(endpointUser, "POST", undefined, getToken()));
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body.users).toHaveLength(2);
    });
});

describe("POST /app/api/user", () => {
    beforeEach(async() => {
        await prisma.user.deleteMany();

        await setupAdmin();
    });

    afterAll(async() => {
        await prisma.$disconnect();
    });

    it("Invalid input format", async() => {
        const res = await POST(makeRequest(endpointUser, "POST", 
            {
                email : "jinifmf",
                password : await bcrypt.hash("fjniienf", 10),
                role : "Analyst",
            },
            getToken(),
        ));
        const body = await res.json();

        expect(res.status).toBe(400);
        expect(body.message).toBe("Validation Failed");
    });

    it("Admin create new user", async() => {
        const res = await POST(makeRequest(endpointUser, "POST", 
            {
                email : "jinifmf@gmail.com",
                password : await bcrypt.hash("fjniienf", 10),
                role : "Analyst",
            },
            getToken(),
        ));
        const body = await res.json();

        expect(res.status).toBe(201);
        expect(body.user).toBeDefined();
    });
});