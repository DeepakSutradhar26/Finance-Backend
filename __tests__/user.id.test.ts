import {PATCH, DELETE} from "@/app/api/user/[id]/route";
import { prisma } from "@/app/utils/prisma";
import { makeRequest } from "@/app/utils/request";
import { setupAdmin, getToken } from "@/app/utils/setup";
import bcrypt from "bcryptjs";

const endpointUser = "http://localhost/app/api/user";

describe("PATCH /app/api/user/[id]", () => {
    beforeEach(async() => {
        await prisma.user.deleteMany();
        await setupAdmin();
    });

    afterAll(async() => {
        await prisma.user.deleteMany();
        await prisma.$disconnect();
    });

    it("User not found", async() => {
        const res = await PATCH(makeRequest(endpointUser + `/difnie`, "PATCH", 
            {
                email : "justin@gmail.com",
                role : "Analyst",
            },
            getToken()),
            {params : {id : "difnie"}}
        );
        const body = await res.json();

        expect(res.status).toBe(404);
        expect(body.message).toBe("User not found");
    });

    it("Admin cannot update another admin", async() => {
        const user = await prisma.user.create({
            data : {
                email : "tony@gmail.com",
                password : await bcrypt.hash("startman", 10),
                role : "Admin",
            }
        });
        const res = await PATCH(makeRequest(endpointUser + `/${user.id}`, "PATCH", 
            {
                email : "justin@gmail.com",
                role : "Analyst",
            },
            getToken()),
            {params : {id : user.id}}
        );
        const body = await res.json();

        expect(res.status).toBe(403);
        expect(body.message).toBe("Forbidden access");
    });

    it("Admin updates user successfully", async() => {
        const user = await prisma.user.create({
            data : {
                email : "tony@gmail.com",
                password : await bcrypt.hash("startman", 10),
                role : "Viewer",
            }
        });
        const res = await PATCH(makeRequest(endpointUser + `/${user.id}`, "PATCH", 
            {
                email : "justin@gmail.com",
                role : "Analyst",
            },
            getToken()),
            {params : {id : user.id}}
        );
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body.user).toBeDefined();
    });
});

describe("DELETE /app/api/user/[id]", () => {
    beforeEach(async() => {
        await prisma.record.deleteMany();
        await prisma.user.deleteMany();
        await setupAdmin();
    });

    afterAll(async() => {
        await prisma.record.deleteMany();
        await prisma.user.deleteMany();
        await prisma.$disconnect();
    });

    it("User not found", async() => {
        const res = await DELETE(makeRequest(endpointUser + `/difnie`, "DELETE", 
            undefined,
            getToken()),
            {params : {id : "difnie"}}
        );
        const body = await res.json();

        expect(res.status).toBe(404);
        expect(body.message).toBe("User not found");
    });

    it("Admin cannot delete another admin", async() => {
        const user = await prisma.user.create({
            data : {
                email : "tony@gmail.com",
                password : await bcrypt.hash("startman", 10),
                role : "Admin",
            }
        });
        const res = await DELETE(makeRequest(endpointUser + `/${user.id}`, "DELETE", 
            undefined,
            getToken()),
            {params : {id : user.id}}
        );
        const body = await res.json();

        expect(res.status).toBe(403);
        expect(body.message).toBe("Forbidden access");
    });

    it("Admin deletes user successfully", async() => {
        const user = await prisma.user.create({
            data : {
                email : "tony@gmail.com",
                password : await bcrypt.hash("startman", 10),
                role : "Viewer",
            }
        });
        const res = await DELETE(makeRequest(endpointUser + `/${user.id}`, "DELETE", 
            undefined,
            getToken()),
            {params : {id : user.id}}
        );
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body.message).toBe("User Deleted Successfully");
    });
});