"use client";

import Link from "next/link";
import { useState } from "react";

export default function Register(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async() => {
        try{
            const res = await fetch("/api/auth/login", {
                method : "POST",
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({email : email, password : password}),
            });
            if(res.status == 200){
                console.log("Login successfully");
            }else{
                console.log(res);
            }
        }catch(err:any){
            console.log(err.message);
        }
       
    };

    return(
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
    <div className="bg-gray-800 p-8 rounded-lg w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-6 text-white">Login</h1>

        <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1">Email</label>
        <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-gray-400 placeholder-gray-500"
            placeholder="you@example.com"
        />
        </div>

        <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-1">Password</label>
        <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-gray-400 placeholder-gray-500"
            placeholder="Min 8 characters"
        />
        </div>

        <button
        onClick={handleSubmit}
        className="cursor-pointer w-full bg-white text-gray-900 py-2 rounded text-sm font-medium hover:bg-gray-200 transition"
        >
        Login
        </button>
        <Link href="/register" className="text-sm text-gray-400 hover:text-white cursor-pointer">
        New user? Register
        </Link>
    </div>
    </div>
    );
}