import {PATCH, DELETE} from "@/app/api/record/[id]/route"; 
import { setupAdmin, getToken } from "../src/app/utils/setup";
import { POST as login} from "@/app/api/auth/login/route";
import { prisma } from "@/app/utils/prisma";
import { makeRequest } from "@/app/utils/request";
import bcrypt from "bcryptjs";

const endpointLogin = "http://localhost/app/api/auth/login/route";
const endpointRecord = "http://localhost/app/api/record";

let recordId : string;

describe("PATCH /app/api/record/[id]", () => {
    beforeEach(async() => {
        await prisma.record.deleteMany();
        await prisma.user.deleteMany();
        await setupAdmin();

        const user = await prisma.user.findUnique({
            where : {
                email : "abhishek88@gmail.com",
            }
        });

        const record = await prisma.record.create({
            data : {
                amount : 599,
                type : "Income",
                category : "Stock",
                date : new Date("2026-04-11"),
                userId : user?.id as string,
            }
        });

        recordId = record.id;
    });

    afterAll(async() => {
        await prisma.record.deleteMany();
        await prisma.user.deleteMany();
        await prisma.$disconnect();
    });

    it("Record does not exist", async() => {
        const res = await PATCH(makeRequest(endpointRecord + `/randomstring`, "PATCH", 
            {
                amount : 4556,
            },
            getToken(),),
            {params : {id : "randomstring"}}
        );
        const body = await res.json();

        expect(res.status).toBe(404);
        expect(body.message).toBe("Record not found");
    });

    it("Admin cannot update another admin records", async() => {
        await prisma.user.create({
            data : {
                email : "fjjgjf@gmial.com",
                password : await bcrypt.hash("funbusnfinf", 10),
                role : "Admin",
            }
        });

        const res1 = await login(makeRequest(endpointLogin, "POST", 
            {
                email : "fjjgjf@gmial.com",
                password : "funbusnfinf",
            }
        )); 
        const body1 = await res1.json();

        const res2 = await PATCH(makeRequest(endpointRecord + `/${recordId}`, "PATCH", 
            {
                amount : 4556,
            },
            body1.token),
            {params : {id : recordId}}
        );
        const body2 = await res2.json();

        expect(res2.status).toBe(403);
        expect(body2.message).toBe("Forbidden access");
    });

    it("Admin updates his record", async() => {
        const res = await PATCH(makeRequest(endpointRecord + `/${recordId}`, "PATCH", 
            {
                amount : 5666,
            },
            getToken(),),
            {params : {id : recordId}}
        );
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body.amount).toBe(5666);
    });
});

describe("DELETE /app/api/record/[id]", () => {
    beforeAll(async() => {
        await setupAdmin();
    });

    beforeEach(async() => {
        await prisma.record.deleteMany();

        const user = await prisma.user.findUnique({
            where : {
                email : "abhishek88@gmail.com",
            }
        });

        const record = await prisma.record.create({
            data : {
                amount : 599,
                type : "Income",
                category : "Stock",
                date : new Date("2026-04-11"),
                userId : user?.id as string,
            }
        });

        recordId = record.id;
    });

    afterAll(async() => {
        await prisma.record.deleteMany();
        await prisma.user.deleteMany();
        await prisma.$disconnect();
    });

    it("Record does not exist", async() => {
        const res = await DELETE(makeRequest(endpointRecord + `/randomstring`, "DELETE", 
            undefined,
            getToken()),
            {params : {id : "randomstirng"}}
        );
        const body = await res.json();

        expect(res.status).toBe(404);
        expect(body.message).toBe("Record not found");
    });

    it("Another cannot delete another admin records", async() => {
        await prisma.user.create({
            data : {
                email : "fjjgjf@gmial.com",
                password : await bcrypt.hash("funbusnfinf", 10),
                role : "Admin",
            }
        });

        const res1 = await login(makeRequest(endpointLogin, "POST", 
            {
                email : "fjjgjf@gmial.com",
                password : "funbusnfinf",
            }
        )); 
        const body1 = await res1.json();

        const res2 = await DELETE(makeRequest(endpointRecord + `/${recordId}`, "DELETE", 
            undefined,
            body1.token),
            {params : {id : recordId}}
        );
        const body2 = await res2.json();

        expect(res2.status).toBe(403);
        expect(body2.message).toBe("Forbidden access");
    });

    it("Admin delete his record", async() => {
        const res = await DELETE(makeRequest(endpointRecord + `/${recordId}`, "DELETE", 
            undefined,
            getToken()),
            {params : {id : recordId}}
        );
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body.message).toBe("Record deleted successfully");
    });
});