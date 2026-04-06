import { NextResponse } from "next/server";
import { RateLimiterMemory } from "rate-limiter-flexible";

const limiter = new RateLimiterMemory({
    points : 10,
    duration : 60,
});

export async function middleware(req : Request){
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

    try{
        await limiter.consume(ip);
        return NextResponse.next();
    }catch{
        return NextResponse.json(
            {message : "Too many Request"},
            {status : 429},
        );
    }
}

export const config = {
    matcher : "/api/:path*",
};