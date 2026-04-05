"use client";

import { useState } from "react";
import { GET_RECORDS, GET_RECENT_ACTIVITY } from "../lib/queries/record";
import { useQuery } from "@apollo/client/react";

type Record = {
    id: string;
    amount: number;
    type: string;
    category: string;
    description: string;
    createdAt: string;
};

type RecordsData = {
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

type RecentData = {
    recentActivity: Record[];
};

export default function RecordTab() {
    const [tab, setTab] = useState<"records" | "recent">("records");

    return (
        <div>
            <div className="flex gap-2 mb-4 border-b border-gray-700">
                <button
                    onClick={() => setTab("records")}
                    className={`cursor-pointer pb-2 px-3 text-sm font-medium transition ${tab === "records" ? "text-white border-b-2 border-white" : "text-gray-500 hover:text-gray-300"}`}
                >
                    Records
                </button>
                <button
                    onClick={() => setTab("recent")}
                    className={`cursor-pointer pb-2 px-3 text-sm font-medium transition ${tab === "recent" ? "text-white border-b-2 border-white" : "text-gray-500 hover:text-gray-300"}`}
                >
                    Recent Activity
                </button>
            </div>

            {tab === "records" ? <Records /> : <RecentActivity />}
        </div>
    );
}

function Records() {
    const [page, setPage] = useState(1);
    const { data, loading, error, refetch } = useQuery<RecordsData>(GET_RECORDS, {
        variables: { page, limit: 5 },
        fetchPolicy: "cache-and-network",
    });

    const records = data?.records.records ?? [];
    const meta = data?.records.meta;

    async function handleDelete(id: string) {
        await fetch(`/api/records/${id}`, {
            method: "DELETE",
            credentials: "include",
        });
        refetch();
    }

    if (loading) return <p className="text-sm text-gray-500 animate-pulse px-1">Loading...</p>;
    if (error) return <p className="text-red-400 text-sm">{error.message}</p>;

    return (
        <div className="space-y-3">
            {records.map((r) => (
                <RecordCard key={r.id} record={r} onDelete={() => handleDelete(r.id)} />
            ))}

            {meta && (
                <div className="flex gap-2 mt-4 items-center">
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                        className="cursor-pointer bg-gray-700 text-gray-300 px-3 py-1.5 rounded text-xs font-medium hover:bg-gray-600 transition disabled:opacity-40">
                        Prev
                    </button>
                    <span className="text-xs text-gray-400">{meta.page} / {meta.totalPages}</span>
                    <button disabled={page === meta.totalPages} onClick={() => setPage(p => p + 1)}
                        className="cursor-pointer bg-gray-700 text-gray-300 px-3 py-1.5 rounded text-xs font-medium hover:bg-gray-600 transition disabled:opacity-40">
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

function RecentActivity() {
    const { data, loading, error } = useQuery<RecentData>(GET_RECENT_ACTIVITY, {
        variables: { limit: 10 },
    });

    const records = data?.recentActivity ?? [];

    if (loading) return <p className="text-sm text-gray-500 animate-pulse px-1">Loading...</p>;
    if (error) return <p className="text-red-400 text-sm">{error.message}</p>;

    return (
        <div className="space-y-3">
            {records.map((r) => (
                <RecordCard key={r.id} record={r} />
            ))}
        </div>
    );
}

function RecordCard({ record, onDelete }: { record: Record; onDelete?: () => void }) {
    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="text-sm font-medium text-white">{record.category}</div>
            <div className="text-xs text-gray-400">{record.description}</div>
            <div className="text-xs px-2.5 py-1 rounded-full bg-gray-700 text-gray-300 border border-gray-600">{record.type}</div>
            <div className={`text-xs font-medium ${record.type === "Income" ? "text-green-400" : "text-red-400"}`}>
                {record.type === "Income" ? "+" : "-"}${record.amount}
            </div>
            <div className="text-xs text-gray-400">{new Date(record.createdAt).toLocaleDateString()}</div>
            {onDelete && (
                <button onClick={onDelete}
                    className="cursor-pointer bg-red-900/40 text-red-400 border border-red-800 px-3 py-1.5 rounded text-xs font-medium hover:bg-red-900/70 transition">
                    Delete
                </button>
            )}
        </div>
    );
}