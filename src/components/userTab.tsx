"use client";

import { GET_USERS } from "@/app/lib/queries/user";
import { useEffect, useState } from "react";

export function UserTab(){
    const [users, setUsers] = useState<any[]>([]);

    useEffect(()=>{
        async function getUsers(){
            const res = await fetch("/api/graphql", {
                method : "POST",
                headers : {
                    'Content-type' : 'application-json'
                },
                credentials : 'include',
                body : JSON.stringify({query : GET_USERS}),
            });
            const body = await res.json();
            setUsers(body.users);
        } 
        getUsers();
    },[])

    return (
        <div>
            {users.map((user) => (
                <UserComponent key={user.id} user={user}/>
            ))}
        </div>
    );
}

function UserComponent({user} : {user : any}){
    return (
        <div>
            <div>{user.name}</div>
            <div>{user.email}</div>
            <div>{user.role}</div>
            <div>{user.isActive}</div>
        </div>
    );
}