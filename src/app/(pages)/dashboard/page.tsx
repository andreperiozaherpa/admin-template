"use client";

import React, { useState, useMemo } from "react";
import rawData from "../../../../public/uploads/saldo.json";
import { FinancialSnapshot, FinancialRecord } from "@/types/finance";
import { processFinancialData } from "@/lib/finance-utils";
import { prepareComparisonData } from "@/lib/chart-utils";

// Components
import { StatsCard } from "@/components/ui/molecules/StatsCard";
import { ComparisonChart } from "@/components/ui/molecules/ComparisonChart";
import { Select, SelectOption } from "@/components/ui/atom/Select";
import { Card } from "@/components/ui/molecules/Card";
import { Chart } from "@/components/ui/molecules/Chart";
import { PageSkeleton } from "@/components/ui/molecules/PageSkeleton"
import { Wallet, Landmark, School, Building2, Calendar as CalendarIcon, AlertCircle } from "lucide-react";


// --- HELPER FUNCTIONS ---
const getNumericDateFromJson = (dateStr: string) => {
    if (!dateStr) return 0;
    const [month, day, year] = dateStr.split('/').map(Number);
    return (year * 10000) + (month * 100) + day;
};

const EmptyStateMessage = () => (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-400">
        <AlertCircle size={48} className="mb-4 opacity-20" />
        <h3 className="text-lg font-bold text-gray-600">Data Tidak Ditemukan</h3>
        <p className="text-sm">Silakan periksa kembali rentang tanggal filter Anda.</p>
    </div>
);

const getNumericDateFromInput = (inputVal: string) => {
    if (!inputVal) return 0;
    const [year, month, day] = inputVal.split('-').map(Number);
    return (year * 10000) + (month * 100) + day;
};

const sumSaldo = (records: any[]) => {
    if (!Array.isArray(records)) return 0;
    return records.reduce((acc, curr) => acc + (curr.saldo || 0), 0);
};

// Sorting Data Mentah
const financialData = (rawData as FinancialSnapshot[]).sort((a, b) =>
    getNumericDateFromJson(a.date) - getNumericDateFromJson(b.date)
);

const CATEGORY_OPTIONS: SelectOption[] = [
    { label: "Kas Daerah (KASDA)", value: "kasda" },
    { label: "Escrow / Titipan", value: "escrow" },
    { label: "SKPD Pengeluaran", value: "skpd_pengeluaran" },
    { label: "SKPD Penerimaan", value: "skpd_penerimaan" },
    { label: "BLUD & Puskesmas", value: "blud_pasar_puskes" },
    { label: "Sekolah & Pendidikan", value: "sekolah" },
];

export default function DashboardPage() {
    const summary = processFinancialData(financialData);
    const [selectedCategory, setSelectedCategory] = useState("kasda");
    const [detailData, setDetailData] = useState<{ title: string; items: FinancialRecord[] } | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    const formatDateForInput = (dateStr: string) => {
        const [month, day, year] = dateStr.split('/').map(String);
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };
    const [startDate, setStartDate] = useState(formatDateForInput(financialData[0].date));
    const [endDate, setEndDate] = useState(formatDateForInput(financialData[financialData.length - 1].date));

    // Simulasi loading 2 detik
    React.useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    // --- Filter Logic ---
    const filteredData = useMemo(() => {
        const startNum = getNumericDateFromInput(startDate);
        const endNum = getNumericDateFromInput(endDate);
        return financialData.filter(snapshot => {
            const snapshotNum = getNumericDateFromJson(snapshot.date);
            return snapshotNum >= startNum && snapshotNum <= endNum;
        });
    }, [startDate, endDate]);

    const dynamicComparison = useMemo(() => {
        return prepareComparisonData(filteredData, selectedCategory as keyof FinancialSnapshot);
    }, [filteredData, selectedCategory]);

    const latestSnapshot = filteredData[filteredData.length - 1];

    // --- CHART DATA PREPARATION ---

    // 1. GLOBAL COMPOSITION (Total per Kategori)
    const summaryChartData = useMemo(() => {
        if (!latestSnapshot) return { labels: [], data: [], itemsGrouped: [] };

        const labels: string[] = [];
        const data: number[] = [];
        const itemsGrouped: FinancialRecord[][] = [];

        CATEGORY_OPTIONS.forEach(opt => {
            const records = (latestSnapshot[opt.value as keyof FinancialSnapshot] || []) as FinancialRecord[];
            labels.push(opt.label);
            data.push(sumSaldo(records));
            // Simpan semua record kategori ini untuk ditampilkan saat diklik
            itemsGrouped.push(records);
        });

        return { labels, data, itemsGrouped };
    }, [latestSnapshot]);

    // Helper untuk mengambil semua data flat dari snapshot
    const getAllRecordsFlat = () => {
        if (!latestSnapshot) return [];
        let all: FinancialRecord[] = [];
        CATEGORY_OPTIONS.forEach(opt => {
            const recs = (latestSnapshot[opt.value as keyof FinancialSnapshot] || []) as FinancialRecord[];
            all = all.concat(recs);
        });
        return all;
    };

    // Helper nama bersih
    const cleanName = (name: string) => name.replace(/^[0-9\s]+/, "").substring(0, 20) + (name.length > 20 ? "..." : "");

    // 2. TOP GLOBAL DATA (5 Tertinggi + Lainnya)
    const topGlobalData = useMemo(() => {
        const allRecords = getAllRecordsFlat();
        if (allRecords.length === 0) return { labels: [], data: [], itemsGrouped: [] };

        // Sortir dari Terbesar
        const sorted = [...allRecords].sort((a, b) => b.saldo - a.saldo);
        const top5 = sorted.slice(0, 5);
        const others = sorted.slice(5);

        const labels = top5.map(i => cleanName(i.nama_rekening));
        const data = top5.map(i => i.saldo);
        // Setiap slice Top 5 berisi 1 item spesifik
        const itemsGrouped = top5.map(i => [i]);

        if (others.length > 0) {
            labels.push(`Lainnya (${others.length})`);
            data.push(sumSaldo(others));
            // Slice "Lainnya" berisi sisanya
            itemsGrouped.push(others);
        }

        return { labels, data, itemsGrouped };
    }, [latestSnapshot]);

    // 3. BOTTOM GLOBAL DATA (5 Terendah + Lainnya)
    const bottomGlobalData = useMemo(() => {
        const allRecords = getAllRecordsFlat();
        if (allRecords.length === 0) return { labels: [], data: [], itemsGrouped: [] };

        // Sortir dari Terkecil
        const sorted = [...allRecords].sort((a, b) => a.saldo - b.saldo);
        const bottom5 = sorted.slice(0, 5);
        const others = sorted.slice(5);

        const labels = bottom5.map(i => cleanName(i.nama_rekening));
        const data = bottom5.map(i => i.saldo);
        const itemsGrouped = bottom5.map(i => [i]);

        if (others.length > 0) {
            labels.push(`Lainnya (${others.length})`);
            data.push(sumSaldo(others));
            itemsGrouped.push(others);
        }

        return { labels, data, itemsGrouped };
    }, [latestSnapshot]);


    // --- HANDLER KLIK UNIVERSAL ---
    // Menerima index slice yang diklik DAN data sumber chart tersebut
    const handleChartClick = (index: number, sourceData: { labels: string[], itemsGrouped: FinancialRecord[][] }) => {
        if (!sourceData.itemsGrouped[index]) return;

        // Ambil items yang sesuai dengan slice
        const items = sourceData.itemsGrouped[index];

        // Urutkan item di list detail berdasarkan saldo terbesar agar rapi
        const sortedItems = [...items].sort((a, b) => b.saldo - a.saldo);

        setDetailData({
            title: sourceData.labels[index], // Judul sesuai label slice (misal: "Sekolah" atau "Lainnya")
            items: sortedItems
        });
    };

    const currentLabel = CATEGORY_OPTIONS.find(opt => opt.value === selectedCategory)?.label;
    const isDataEmpty = filteredData.length === 0;
    const isSingleData = filteredData.length === 1;

    if (isLoading) {
        return <PageSkeleton />;
    }

    if (!latestSnapshot) {
        return <EmptyStateMessage />;
    }

    return (
        <div className="p-6 md:p-8 space-y-8 min-h-screen font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Keuangan</h1>
                    <p className="text-gray-500 mt-1 flex items-center gap-2">
                        <CalendarIcon size={14} /> Data Terakhir Sistem: {summary.lastUpdated}
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Kas Daerah (KASDA)" value={summary.categoryTotals.kasda} variant="primary" icon={<Landmark size={22} />} trend={2.4} />
                <StatsCard title="Escrow / Titipan" value={summary.categoryTotals.escrow} variant="secondary" icon={<Wallet size={22} />} trend={-0.8} />
                <StatsCard title="Total Saldo SKPD" value={summary.categoryTotals.skpd} variant="success" icon={<Building2 size={22} />} trend={5.1} />
                <StatsCard title="BLUD & Sekolah" value={summary.categoryTotals.blud + summary.categoryTotals.sekolah} variant="warning" icon={<School size={22} />} trend={1.2} />
            </div>

            {/* --- Main Grid --- */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">

                {/* KOLOM KIRI (3/4): Grafik Comparison */}
                <div className="lg:col-span-3">
                    <Card className="p-6 h-full shadow-neumorph border border-white/50 bg-white">
                        <div className="flex flex-col gap-6 mb-8 border-b border-gray-100 pb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">Analisis Perbandingan</h2>
                                <p className="text-sm text-gray-400 mt-1">Pilih periode dan kategori untuk melihat tren.</p>
                            </div>
                            <div className="flex flex-col lg:flex-row gap-4 w-full items-stretch lg:items-center">
                                {/* Date Range Picker Group */}
                                <div className="flex-1 flex flex-col sm:flex-row items-center gap-2 sm:gap-0 bg-gray-50 p-1.5 rounded-xl border border-gray-200 w-full">
                                    <div className="relative flex-1 w-full sm:w-auto min-w-0">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold uppercase pointer-events-none">Mulai</span>
                                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="pl-12 pr-2 py-2 w-full bg-transparent text-sm font-medium text-gray-700 outline-none focus:ring-0 cursor-pointer" />
                                    </div>
                                    <div className="hidden sm:block w-[1px] h-8 bg-gray-300 mx-2"></div>
                                    <div className="block sm:hidden w-full h-[1px] bg-gray-200 my-1"></div>
                                    <div className="relative flex-1 w-full sm:w-auto min-w-0">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold uppercase pointer-events-none">Sampai</span>
                                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="pl-14 pr-2 py-2 w-full bg-transparent text-sm font-medium text-gray-700 outline-none focus:ring-0 cursor-pointer" />
                                    </div>
                                </div>
                                <div className="w-full lg:w-72 z-20">
                                    <Select label="" options={CATEGORY_OPTIONS} value={selectedCategory} onChange={(val) => setSelectedCategory(val)} placeholder="Pilih Kategori" variant="neumorph" />
                                </div>
                            </div>
                        </div>

                        <div className="w-full min-h-[450px]">
                            {isDataEmpty ? (
                                <div className="h-[450px] flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
                                    <AlertCircle size={48} className="mb-4 opacity-20" />
                                    <p className="font-medium">Tidak ada data pada rentang tanggal ini.</p>
                                </div>
                            ) : isSingleData ? (
                                <div className="h-[450px] flex flex-col items-center justify-center text-blue-500 border-2 border-dashed border-blue-50 rounded-2xl bg-blue-50/10">
                                    <AlertCircle size={48} className="mb-4 opacity-50" />
                                    <p className="font-medium text-lg mb-1">Hanya 1 Data Tersedia</p>
                                    <p className="text-sm opacity-80 mb-4">{filteredData[0].date}</p>
                                    <div className="text-xs bg-white px-3 py-1 rounded-full text-blue-600 shadow-sm">Perluas tanggal untuk melihat perbandingan (Awal vs Akhir)</div>
                                </div>
                            ) : (
                                <ComparisonChart className="h-[450px] shadow-none border-none p-0" title={`Tren Saldo: ${currentLabel}`} data={dynamicComparison.chartData} periodStart={dynamicComparison.periods.start} periodEnd={dynamicComparison.periods.end} itemsPerView={6} />
                            )}
                        </div>
                    </Card>
                </div>

                {/* KOLOM KANAN */}
                <div className="lg:col-span-1 flex flex-col gap-6">

                    {/* 1. Global Composition */}
                    <div className="bg-white rounded-3xl p-1 shadow-neumorph border border-white/50 ">
                        <Chart
                            type="doughnut"
                            title="Komposisi Global"
                            subtitle="Total Aset per Kategori"
                            data={summaryChartData.data}
                            labels={summaryChartData.labels}
                            height="100%"
                            className="shadow-none border-none"
                            // Klik di sini mengirim data summaryChartData
                            onSliceClick={(idx) => handleChartClick(idx, summaryChartData)}
                        />
                    </div>
                </div>

                {/* KOLOM Donat Bawah */}
                <div className="lg:col-span-1 bg-white rounded-3xl p-1 shadow-neumorph border border-white/50 h-full">
                    {/* 2. Top Global */}
                    <Chart
                        type="doughnut"
                        title="5 Rekening Tertinggi"
                        subtitle="Ranking Global"
                        data={topGlobalData.data}
                        labels={topGlobalData.labels}
                        height="100%"
                        className="shadow-none border-none"
                        trend="Top 5"
                        // Klik di sini mengirim data topGlobalData
                        onSliceClick={(idx) => handleChartClick(idx, topGlobalData)}
                    />
                </div>

                <div className="lg:col-span-1 bg-white rounded-3xl p-1 shadow-neumorph border border-white/50 h-full">
                    {/* 3. Bottom Global */}
                    <Chart
                        type="doughnut"
                        title="5 Rekening Terendah"
                        subtitle="Ranking Global"
                        data={bottomGlobalData.data}
                        labels={bottomGlobalData.labels}
                        height="100%"
                        className="shadow-none border-none"
                        trend="- Down 5"
                        // Klik di sini mengirim data bottomGlobalData
                        onSliceClick={(idx) => handleChartClick(idx, bottomGlobalData)}
                    />
                </div>

                {/* PANEL DETAIL (Dynamic List) */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-neumorph border border-white/50 h-full min-h-[450px] max-h-[500px] flex flex-col overflow-hidden relative">
                    {!detailData ? (
                        // Default State
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-5 p-6 animate-in fade-in duration-500">
                            <div className="w-20 h-20 bg-blue-50/80 rounded-full flex items-center justify-center text-blue-500 mb-2 shadow-sm">
                                <CalendarIcon size={36} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Periode Data</h3>
                                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Data Dari Waktu Terbaru</p>
                            </div>
                            <div className="flex gap-4 w-full max-w-sm">
                                <div className="flex-1 bg-gray-50 border border-gray-100 p-3 rounded-2xl text-left">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Tanggal Data Terakhir</p>
                                    <p className="text-sm font-bold text-gray-700">{endDate}</p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 px-4 leading-relaxed max-w-xs">
                                Klik salah satu irisan pada <strong>GRAFIK MANAPUN</strong> di atas untuk melihat rincian rekening.
                            </p>
                        </div>
                    ) : (
                        // Active State (List)
                        <div className="flex flex-col h-full animate-in slide-in-from-right duration-300 bg-white">
                            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-white z-10 shrink-0">
                                <div className="overflow-hidden">
                                    <h3 className="text-xs font-bold uppercase text-blue-500 tracking-wider mb-1">Rincian Data</h3>
                                    <h2 className="text-xl font-black text-gray-800 leading-none truncate pr-4" title={detailData.title}>{detailData.title}</h2>
                                </div>
                                <button onClick={() => setDetailData(null)} className="text-xs font-bold text-gray-500 hover:text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all border border-transparent hover:border-red-100 flex-shrink-0">
                                    Tutup
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                                {detailData.items.map((item, idx) => (
                                    <div key={idx} className="group flex items-center justify-between p-3 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200">
                                        <div className="flex items-center gap-4 overflow-hidden">
                                            <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 text-xs font-bold text-gray-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">{idx + 1}</span>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-gray-700 truncate group-hover:text-blue-700 transition-colors" title={item.nama_rekening}>{item.nama_rekening}</p>
                                                <p className="text-[10px] text-gray-400 font-mono mt-0.5">{item.nomor_rekening}</p>
                                            </div>
                                        </div>
                                        <div className="text-right pl-4 flex-shrink-0">
                                            <p className="text-sm font-black text-gray-800 group-hover:text-blue-600">
                                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.saldo)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-3 border-t border-gray-100 bg-gray-50/50 text-center">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total {detailData.items.length} Rekening</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}