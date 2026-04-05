"use client";

import { useState } from "react";
import { GET_USERS } from "../lib/queries/user";
import { useQuery } from "@apollo/client/react";

type User = {
    id: string;
    name: string;
    email: string;
    role: "Viewer" | "Analyst" | "Admin";
    isActive: boolean;
};

type Data = {
    users: {
        users: User[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    };
};

export default function UserTab() {
    const [page, setPage] = useState(1);
    const [showAdd, setShowAdd] = useState(false);
    const { data, loading, error, refetch } = useQuery<Data>(GET_USERS, {
        variables: { page, limit: 5 },
    });

    const users = data?.users.users ?? [];
    const meta = data?.users.meta;

    if (error) return <div className="px-4 py-3 rounded bg-red-900/40 border border-red-700 text-red-300 text-sm">Error: {error.message}</div>;

    return (
        <div className="space-y-3">
            <button
                onClick={() => setShowAdd(!showAdd)}
                className="cursor-pointer bg-gray-700 text-gray-300 px-3 py-1.5 rounded text-xs font-medium hover:bg-gray-600 transition"
            >
                {showAdd ? "Cancel" : "Add User"}
            </button>
            {showAdd && <AddUser onSuccess={() => { setShowAdd(false); refetch(); }} />}
            {loading && <div className="text-sm text-gray-500 animate-pulse px-1">Loading...</div>}

            {users.map((u) => (
                <UserComponent key={u.id} user={u} onSuccess={() => refetch()} />
            ))}

            {meta && (
                <div className="flex items-center gap-3 pt-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="cursor-pointer bg-gray-700 text-gray-300 px-3 py-1.5 rounded text-xs font-medium hover:bg-gray-600 transition disabled:opacity-40"
                    >
                        Prev
                    </button>
                    <span className="text-xs text-gray-400">{meta.page} / {meta.totalPages}</span>
                    <button
                        disabled={page === meta.totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="cursor-pointer bg-gray-700 text-gray-300 px-3 py-1.5 rounded text-xs font-medium hover:bg-gray-600 transition disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

function AddUser({ onSuccess }: { onSuccess: () => void }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Viewer");

    const handleSubmit = async () => {
        await fetch("/api/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ name, email, password, role }),
        });
        onSuccess();
    };

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg px-5 py-4 space-y-3">
            <input value={name} placeholder="Name" onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-gray-400 placeholder-gray-500 transition" />
            <input value={email} placeholder="Email" type="email" onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-gray-400 placeholder-gray-500 transition" />
            <input value={password} placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-gray-400 placeholder-gray-500 transition" />
            <select value={role} onChange={(e) => setRole(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-gray-400 transition">
                <option value="Viewer">Viewer</option>
                <option value="Analyst">Analyst</option>
                <option value="Admin">Admin</option>
            </select>
            <button onClick={handleSubmit}
                className="cursor-pointer bg-white text-gray-900 px-4 py-1.5 rounded text-sm font-medium hover:bg-gray-200 transition">
                Submit
            </button>
        </div>
    );
}

function UserComponent({ user, onSuccess }: { user: User; onSuccess: () => void }) {
    const [update, setUpdate] = useState(false);
    const [name, setName] = useState("");
    const [role, setRole] = useState<string>(user.role);
    const [isActive, setIsActive] = useState<string>(String(user.isActive));

    const handleUpdate = async () => {
        await fetch(`/api/user/${user.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                ...(name && { name }),
                role,
                isActive: isActive === "true",
            }),
        });
        setUpdate(false);
        setName("");
        onSuccess();
    };

    const handleDelete = async () => {
        await fetch(`/api/user/${user.id}`, {
            method: "DELETE",
            credentials: "include",
        });
        onSuccess();
    };

    const roleBadgeColor: Record<string, string> = {
        Admin: "text-purple-400 border-purple-800 bg-purple-900/40",
        Analyst: "text-blue-400 border-blue-800 bg-blue-900/40",
        Viewer: "text-gray-300 border-gray-600 bg-gray-700",
    };

    return (
        <>
            {update ? (
                <div className="bg-gray-800 border border-gray-700 rounded-lg px-5 py-4 space-y-3">
                    <input value={name} placeholder="Name" onChange={(e) => setName(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-gray-400 placeholder-gray-500 transition" />
                    <select value={role} onChange={(e) => setRole(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-gray-400 transition">
                        <option value="Viewer">Viewer</option>
                        <option value="Analyst">Analyst</option>
                        <option value="Admin">Admin</option>
                    </select>
                    <select value={isActive} onChange={(e) => setIsActive(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-gray-400 transition">
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                    <div className="flex gap-2">
                        <button onClick={handleUpdate}
                            className="cursor-pointer bg-white text-gray-900 px-4 py-1.5 rounded text-sm font-medium hover:bg-gray-200 transition">
                            Submit
                        </button>
                        <button onClick={() => setUpdate(false)}
                            className="cursor-pointer bg-gray-700 text-gray-300 px-4 py-1.5 rounded text-sm font-medium hover:bg-gray-600 transition">
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-gray-800 border border-gray-700 rounded-lg px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
                    <div className="text-sm font-medium text-white">{user.name}</div>
                    <div className="text-xs text-gray-400">{user.email}</div>
                    <div className={`text-xs px-2.5 py-1 rounded-full border ${roleBadgeColor[user.role]}`}>
                        {user.role}
                    </div>
                    <div className={`text-xs font-medium ${user.isActive ? "text-green-400" : "text-red-400"}`}>
                        {user.isActive ? "Active" : "Inactive"}
                    </div>
                    <button onClick={() => setUpdate(true)}
                        className="cursor-pointer bg-gray-700 text-gray-300 px-3 py-1.5 rounded text-xs font-medium hover:bg-gray-600 transition">
                        Update
                    </button>
                    <button onClick={handleDelete}
                        className="cursor-pointer bg-red-900/40 text-red-400 border border-red-800 px-3 py-1.5 rounded text-xs font-medium hover:bg-red-900/70 transition">
                        Delete
                    </button>
                </div>
            )}
        </>
    );
}