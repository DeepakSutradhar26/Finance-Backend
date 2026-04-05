"use client";

import { useState } from "react";
import { GET_RECORDS } from "../lib/queries/record";
import { useQuery } from "@apollo/client/react";

type Record = {
    id: string;
    amount: number;
    type: string;
    category: string;
    description: string;
    createdAt: string;
};

type Data = {
    records: {
        records: Record[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    };
};

export default function RecordTab() {
    const [page, setPage] = useState(1);
    const { data, loading, error, refetch } = useQuery<Data>(GET_RECORDS, {
        variables: { page, limit: 10 },
    });

    const records = data?.records.records ?? [];
    const meta = data?.records.meta;

    if (error) return <div className="px-4 py-3 rounded bg-red-900/40 border border-red-700 text-red-300 text-sm">Error: {error.message}</div>;

    return (
        <div className="space-y-3">
            {loading && <div className="text-sm text-gray-500 animate-pulse px-1">Loading...</div>}

            {records.map((r) => (
                <RecordComponent key={r.id} record={r} refetch={refetch} />
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

function RecordComponent({ record, refetch }: { record: Record; refetch: () => void }) {
    const [update, setUpdate] = useState(false);
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");

    const handleUpdate = async () => {
        await fetch(`/api/records/${record.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                ...(amount && { amount: Number(amount) }),
                ...(category && { category }),
                ...(description && { description }),
            }),
        });
        await refetch();
        setUpdate(false);
        setAmount(""); setCategory(""); setDescription("");
    };

    const handleDelete = async () => {
        await fetch(`/api/records/${record.id}`, {
            method: "DELETE",
            credentials: "include",
        });
        await refetch();
    };

    return (
        <>
            {update ? (
                <div className="bg-gray-800 border border-gray-700 rounded-lg px-5 py-4 space-y-3">
                    <input value={amount} placeholder="Amount" type="number" onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-gray-400 placeholder-gray-500 transition" />
                    <input value={category} placeholder="Category" onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-gray-400 placeholder-gray-500 transition" />
                    <input value={description} placeholder="Description" onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-gray-400 placeholder-gray-500 transition" />
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
                    <div className="text-sm font-medium text-white">{record.category}</div>
                    <div className="text-xs text-gray-400">{record.description}</div>
                    <div className="text-xs px-2.5 py-1 rounded-full bg-gray-700 text-gray-300 border border-gray-600">{record.type}</div>
                    <div className={`text-xs font-medium ${record.type === "Income" ? "text-green-400" : "text-red-400"}`}>
                        {record.type === "Income" ? "+" : "-"}${record.amount}
                    </div>
                    <div className="text-xs text-gray-400">{new Date(record.createdAt).toLocaleDateString()}</div>
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