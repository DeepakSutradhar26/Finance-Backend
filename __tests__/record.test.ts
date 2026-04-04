import {GET, POST} from "@/app/api/record/route";
import { setupAdmin, getToken } from "../src/app/utils/setup";
import { prisma } from "@/app/utils/prisma";
import { makeRequest } from "@/app/utils/request";

const endpointRecord = "http://localhost/app/api/record/route";

describe("GET /api/record", () => {
    beforeAll(async() => {
        await prisma.record.deleteMany();
        await prisma.user.deleteMany();
        await setupAdmin();
    });

    afterAll(async() => {
        await prisma.record.deleteMany();
        await prisma.user.deleteMany();
        await prisma.$disconnect();
    });

    it("Get all the records", async() => {
        const user = await prisma.user.findUnique({
            where : {
                email : "abhishek88@gmail.com",
            }
        });

        await prisma.record.create({
            data : {
                amount : 500,
                type : "Expense",
                category : "Bank",
                createdAt : new Date("2026-04-05"),
                description : "Urgent",
                userId : user?.id as string,
            }
        });
        await prisma.record.create({
            data : {
                amount : 70,
                type : "Expense",
                category : "Stock",
                createdAt : new Date("2026-04-05"),
                description : "New",
                userId : user?.id as string,
            }
        });

        const res = await GET(makeRequest(endpointRecord, "GET", undefined, getToken()));
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body.records).toHaveLength(2);
    });
});

describe("POST /api/record", () => {
    beforeEach(async() => {
        await prisma.record.deleteMany();
    });

    beforeAll(async() => {
        await setupAdmin();
    });

    afterAll(async() => {
        await prisma.record.deleteMany();
        await prisma.user.deleteMany();
        await prisma.$disconnect();
    });

    it("Invalid input format", async() => {
        const res = await POST(makeRequest(endpointRecord, "POST", 
            {
                amount : "tggg",
                type : "Income",
                category : "Toys",
                createdAt : new Date(Date.now()),
            }, 
            getToken()));
        const body = await res.json();

        expect(res.status).toBe(400);
        expect(body.message).toBe("Validation Failed");
    });

    it("Creating new Record", async() => {
        const res = await POST(makeRequest(endpointRecord, "POST", 
            {
                amount : 600,
                type : "Income",
                category : "Toys",
            }, 
            getToken()));
        const body = await res.json();

        expect(res.status).toBe(201);
        expect(body.record.amount).toBe(600);
        expect(body.record.userId).toBeDefined();
    });
});