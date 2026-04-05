"use client";

import { useState } from "react";
import { GET_SUMMARY, GET_CATEGORY_WISE, GET_MONTHLY_TRENDS } from "../lib/queries/dashboard";
import { useQuery } from "@apollo/client/react";

type Record = {
    id: string;
    amount: number;
    type: string;
    category: string;
    description: string;
    createdAt: string;
};

type SummaryData = {
    dashboardSummary: {
        totalIncome: number;
        totalExpense: number;
        netBalance: number;
        recordCount: number;
    };
};

type CategoryData = {
    categoryTotals: {
        category: string;
        total: number;
        count: number;
    }[];
};

type TrendsData = {
    monthlyTrends: {
        month: string;
        income: number;
        expense: number;
    }[];
};

export default function DashboardTab() {
    const [tab, setTab] = useState<"summary" | "category-wise" | "monthly-trends">("summary");

    return (
        <div>
            <div className="flex gap-2 mb-4 border-b border-gray-700">
                <button
                    onClick={() => setTab("summary")}
                    className={`cursor-pointer pb-2 px-3 text-sm font-medium transition ${tab === "summary" ? "text-white border-b-2 border-white" : "text-gray-500 hover:text-gray-300"}`}
                >
                    Summary
                </button>
                <button
                    onClick={() => setTab("category-wise")}
                    className={`cursor-pointer pb-2 px-3 text-sm font-medium transition ${tab === "category-wise" ? "text-white border-b-2 border-white" : "text-gray-500 hover:text-gray-300"}`}
                >
                    Category Wise
                </button>
                <button
                    onClick={() => setTab("monthly-trends")}
                    className={`cursor-pointer pb-2 px-3 text-sm font-medium transition ${tab === "monthly-trends" ? "text-white border-b-2 border-white" : "text-gray-500 hover:text-gray-300"}`}
                >
                    Monthly Trends
                </button>
            </div>

            {tab === "summary" && <Summary />}
            {tab === "category-wise" && <CategoryWise />}
            {tab === "monthly-trends" && <MonthlyTrends />}
        </div>
    );
}

function Summary() {
    const { data, loading, error } = useQuery<SummaryData>(GET_SUMMARY);

    if (loading) return <p className="text-sm text-gray-500 animate-pulse px-1">Loading...</p>;
    if (error) return <p className="text-red-400 text-sm">{error.message}</p>;

    const s = data?.dashboardSummary;

    return (
        <div className="space-y-3">
            <div className="bg-gray-800 border border-gray-700 rounded-lg px-5 py-4 flex justify-between items-center">
                <span className="text-sm text-gray-400">Total Income</span>
                <span className="text-sm font-medium text-green-400">+₹{s?.totalIncome}</span>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg px-5 py-4 flex justify-between items-center">
                <span className="text-sm text-gray-400">Total Expense</span>
                <span className="text-sm font-medium text-red-400">-₹{s?.totalExpense}</span>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg px-5 py-4 flex justify-between items-center">
                <span className="text-sm text-gray-400">Net Balance</span>
                <span className="text-sm font-medium text-white">₹{s?.netBalance}</span>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg px-5 py-4 flex justify-between items-center">
                <span className="text-sm text-gray-400">Total Records</span>
                <span className="text-sm font-medium text-white">{s?.recordCount}</span>
            </div>
        </div>
    );
}

function CategoryWise() {
    const { data, loading, error } = useQuery<CategoryData>(GET_CATEGORY_WISE);

    if (loading) return <p className="text-sm text-gray-500 animate-pulse px-1">Loading...</p>;
    if (error) return <p className="text-red-400 text-sm">{error.message}</p>;

    const categories = data?.categoryTotals ?? [];

    return (
        <div className="space-y-3">
            {categories.map((c) => (
                <div key={c.category} className="bg-gray-800 border border-gray-700 rounded-lg px-5 py-4 flex items-center justify-between gap-4">
                    <div className="text-sm font-medium text-white">{c.category}</div>
                    <div className="text-xs text-gray-400">{c.count} records</div>
                    <div className="text-sm font-medium text-white">₹{c.total}</div>
                </div>
            ))}
        </div>
    );
}

function MonthlyTrends() {
    const [year, setYear] = useState(new Date().getFullYear());
    const { data, loading, error } = useQuery<TrendsData>(GET_MONTHLY_TRENDS, {
        variables: { year },
    });

    if (loading) return <p className="text-sm text-gray-500 animate-pulse px-1">Loading...</p>;
    if (error) return <p className="text-red-400 text-sm">{error.message}</p>;

    const trends = data?.monthlyTrends ?? [];

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-400">Year</span>
                <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="bg-gray-700 border border-gray-600 text-gray-300 text-xs px-2 py-1 rounded"
                >
                    {[2025, 2024, 2023].map((y) => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
            </div>

            {trends.map((t) => (
                <div key={t.month} className="bg-gray-800 border border-gray-700 rounded-lg px-5 py-4 flex items-center justify-between gap-4">
                    <div className="text-sm font-medium text-white">{t.month}</div>
                    <div className="text-xs text-green-400">+₹{t.income}</div>
                    <div className="text-xs text-red-400">-₹{t.expense}</div>
                </div>
            ))}
        </div>
    );
}