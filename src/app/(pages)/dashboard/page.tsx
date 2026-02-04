"use client";

import React, { useState, useEffect } from 'react';
import { FinancialComparisonCard } from "@/components/ui/organisms/FinancialComparisonCard";
import { Card } from "@/components/ui/Index";
import { useFinancialData } from "@/hooks/useFinancialData";
import {
    Wallet,
    Landmark,
    GraduationCap,
    ReceiptText,
    BarChart3,
    Users2,
    TrendingUp
} from "lucide-react";

// --- UTILITY FORMAT RUPIAH ---
const formatIDR = (val: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(val);

// --- MAP ICON BERDASARKAN NAMA KATEGORI ---
const getCategoryIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('kasda')) return <Landmark className="w-5 h-5 text-blue-400" />;
    if (lower.includes('sekolah')) return <GraduationCap className="w-5 h-5 text-emerald-400" />;
    if (lower.includes('escrow')) return <ReceiptText className="w-5 h-5 text-amber-400" />;
    return <Wallet className="w-5 h-5 text-[var(--theme-base)]" />;
};

export default function DashboardPage() {
    const [allData, setAllData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch data utama
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/uploads/saldo.json');
                const data = await response.json();
                setAllData(data);
            } catch (err) {
                console.error("API Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Menggunakan custom hook untuk mengolah data
    const { categorySummaries, grandTotals } = useFinancialData(allData);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-main-bg">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[var(--theme-base)] border-t-transparent rounded-full animate-spin" />
                <p className="text-text-muted font-black italic uppercase tracking-widest animate-pulse">
                    Synchronizing Data...
                </p>
            </div>
        </div>
    );

    return (
        <div className="p-8 bg-main-bg min-h-screen space-y-8 overflow-hidden">

            {/* --- HEADER DASHBOARD --- */}
            <header className="flex flex-col md:flex-row justify-between items-end border-b border-border-main pb-6 gap-4">
                <div className="flex-1">
                    <h1 className="text-3xl font-black italic uppercase text-text-primary tracking-tighter leading-none">
                        Financial <span className="text-[var(--theme-base)]">Monitoring</span>
                    </h1>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.4em] mt-3">
                        Government Asset & Fund Tracking System
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-surface/50 px-4 py-2 rounded-2xl border border-white/5">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-black text-text-primary uppercase italic">System Active</span>
                </div>
            </header>

            {/* --- TOP ROW: SUMMARY CARDS (Grand Totals & Categories) --- */}
            {/* Grid ini akan otomatis menyesuaikan jumlah kolom berdasarkan jumlah kategori */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                {/* 1. KARTU GRAND TOTAL BALANCE */}
                <Card variant="glass" padding="none" className="relative overflow-hidden group hover:bg-white/5 transition-all duration-300 shadow-neumorph"
                >
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-2 bg-[var(--theme-base)]/10 rounded-xl">
                                <BarChart3 className="w-5 h-5 text-[var(--theme-base)]" />
                            </div>
                            <span className="text-[7px] font-black bg-[var(--theme-base)]/10 text-[var(--theme-base)] px-2 py-1 rounded-md uppercase">Overview</span>
                        </div>
                        <p className="text-[9px] font-black text-text-muted uppercase italic mb-1">Total Saldo Terintegrasi</p>
                        <h3 className="text-xl font-black text-text-primary tracking-tighter">
                            {formatIDR(grandTotals.balance)}
                        </h3>
                    </div>
                </Card>

                {/* 2. KARTU TOTAL DATA/REKENING */}
                <Card variant="glass" padding="none" className="relative overflow-hidden group hover:bg-white/5 transition-all duration-300 shadow-neumorph">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-2 bg-emerald-400/10 rounded-xl">
                                <Users2 className="w-5 h-5 text-emerald-400" />
                            </div>
                            <span className="text-[7px] font-black bg-emerald-400/10 text-emerald-400 px-2 py-1 rounded-md uppercase">Record</span>
                        </div>
                        <p className="text-[9px] font-black text-text-muted uppercase italic mb-1">Total Akun Rekening</p>
                        <h3 className="text-xl font-black text-text-primary tracking-tighter">
                            {grandTotals.records} <span className="text-[10px] text-text-muted tracking-widest">RECORDS</span>
                        </h3>
                    </div>
                </Card>

                {/* 3. KARTU KATEGORI DINAMIS (Looping dari categorySummaries) */}
                {categorySummaries.map((cat) => (
                    <Card
                        key={cat.key}
                        variant="glass"
                        padding="none"
                        className="relative overflow-hidden group hover:bg-white/5 transition-all duration-300 shadow-neumorph"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-surface rounded-xl shadow-inset-sm">
                                    {getCategoryIcon(cat.name)}
                                </div>
                                <div className="text-right">
                                    <p className="text-[8px] font-bold text-text-muted uppercase">Account</p>
                                    <p className="text-xs font-black text-[var(--theme-base)]">{cat.count}</p>
                                </div>
                            </div>
                            <p className="text-[9px] font-black text-text-muted uppercase italic mb-1 group-hover:text-text-primary transition-colors">
                                {cat.name}
                            </p>
                            <h3 className="text-lg font-black text-text-primary tracking-tighter group-hover:scale-105 origin-left transition-transform">
                                {formatIDR(cat.total)}
                            </h3>
                        </div>
                    </Card>
                ))}
            </div>

            {/* --- BOTTOM ROW: MAIN CHART CARD --- */}
            <div className="grid grid-cols-1">
                {/* Komponen ini menangani animasinya sendiri di dalamnya */}
                <FinancialComparisonCard data={allData} />
            </div>

            {/* --- FOOTER INFO --- */}
            <footer className="flex justify-center pt-4">
                <p className="text-[8px] font-bold text-text-muted uppercase tracking-[0.5em]">
                    Data as of {allData[allData.length - 1]?.date || 'N/A'} • Secure Encryption Active
                </p>
            </footer>
        </div>
    );
}