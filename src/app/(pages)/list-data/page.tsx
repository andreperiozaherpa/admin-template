"use client";

import React, { useState, useEffect, useCallback } from "react";
import { api } from "@/services/api.service";
import { Card } from "@/components/ui/molecules/Card";
import { Button } from "@/components/ui/atom/Button";
import { Select, SelectOption } from "@/components/ui/atom/Select";
import { PageSkeleton, ListDataSkeleton } from "@/components/ui/molecules/PageSkeleton";
import { FileSpreadsheet, Calendar, ChevronRight, Search, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";

interface DateSummary {
    tanggal: string;
    total_rekening: number;
    summary: {
        kasda: number;
        escrow: number;
        skpd_pengeluaran: number;
        skpd_penerimaan: number;
        blud_pasar_puskes: number;
        sekolah: number;
        total: number;
    };
}

const CATEGORY_OPTIONS: SelectOption[] = [
    { label: "Semua Kategori", value: "" },
    { label: "Kas Daerah (KASDA)", value: "kasda" },
    { label: "Escrow / Titipan", value: "escrow" },
    { label: "SKPD Pengeluaran", value: "skpd_pengeluaran" },
    { label: "SKPD Penerimaan", value: "skpd_penerimaan" },
    { label: "BLUD & Puskesmas", value: "blud_pasar_puskes" },
    { label: "Sekolah & Pendidikan", value: "sekolah" },
];

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(value);
};

const formatDate = (dateStr: string) => {
    if (!dateStr) return "";

    // Format dari API: YYYY-MM-DD (ISO standard)
    // Contoh: "2026-03-02" = 2 Maret 2026
    const dateOnly = dateStr.replace(/T.*$/, '').split(' ')[0];
    
    const [year, month, day] = dateOnly.split('-').map(Number);
    
    if (!year || !month || !day) {
        return dateStr;
    }

    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

export default function ListDataPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [dateList, setDateList] = useState<DateSummary[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedDateOnly, setSelectedDateOnly] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [detailData, setDetailData] = useState<any[]>([]);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);
    const [canDelete, setCanDelete] = useState(false);
    const [deletingDate, setDeletingDate] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchDateList();
        const userRole = authService.getRole();
        setCanDelete(userRole === 'admin' || userRole === 'bank');
    }, []);

    const fetchDateList = async () => {
        try {
            setIsLoading(true);
            const response = await api.getSaldo() as { data: DateSummary[] };
            setDateList(response.data || []);
        } catch (err) {
            console.error("Error fetching date list:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDetail = useCallback(async (tanggal: string, category?: string, search?: string) => {
        try {
            setIsLoadingDetail(true);
            const params: Record<string, string> = { tanggal };
            if (category) params.jenis = category;
            if (search) params.search = search;

            const response = await api.getSaldo(params);

            if (response && typeof response === 'object' && Array.isArray(response.data)) {
                setDetailData(response.data);
            } else if (Array.isArray(response)) {
                setDetailData(response);
            } else {
                setDetailData([]);
            }
        } catch (err) {
            console.error("Error fetching detail:", err);
            setDetailData([]);
        } finally {
            setIsLoadingDetail(false);
        }
    }, []);

    const handleDateClick = (tanggal: string) => {
        setSelectedDate(tanggal);
        setSelectedCategory("");
        setSearchQuery("");
        const dateOnly = tanggal.substring(0, 10);
        setSelectedDateOnly(dateOnly);
        fetchDetail(dateOnly, "", "");
    };

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
        if (selectedDateOnly) {
            fetchDetail(selectedDateOnly, value, searchQuery);
        }
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        if (selectedDateOnly) {
            fetchDetail(selectedDateOnly, selectedCategory, value);
        }
    };

    const handleDeleteDate = async (e: React.MouseEvent, tanggal: string) => {
        e.stopPropagation();
        
        if (!confirm(`Apakah Anda yakin ingin menghapus semua data pada tanggal ${formatDate(tanggal)}?\n\nData yang dihapus tidak dapat dikembalikan.`)) {
            return;
        }

        try {
            setDeletingDate(tanggal);
            const dateOnly = tanggal.substring(0, 10);
            await api.deleteSaldoByDate(dateOnly);
            toast.success(`Data pada tanggal ${formatDate(tanggal)} berhasil dihapus`);
            fetchDateList();
        } catch (err: any) {
            console.error("Error deleting data:", err);
            toast.error(err.message || "Gagal menghapus data");
        } finally {
            setDeletingDate(null);
        }
    };

    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearchChange(searchInput);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInput]);

    if (isLoading) {
        return <ListDataSkeleton />;
    }
    
    return (
        <div className="p-6 md:p-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Riwayat Data Upload</h1>
                <p className="text-gray-500 mt-1 flex items-center gap-2">
                    <Calendar size={14} /> Daftar data yang telah diupload berdasarkan tanggal
                </p>
            </div>

            {/* List Tanggal */}
            <div className="grid gap-4">
                {dateList.map((item) => (
                    <Card
                        key={item.tanggal}
                        className={`p-4 cursor-pointer transition-all hover:shadow-lg ${selectedDate === item.tanggal ? "ring-2 ring-blue-500" : ""}`}
                        onClick={() => handleDateClick(item.tanggal)}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                    <FileSpreadsheet className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{formatDate(item.tanggal)}</h3>
                                    <p className="text-sm text-gray-500">
                                        {item.total_rekening} rekening
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Total Saldo</p>
                                    <p className="font-bold text-lg text-blue-600">
                                        {formatCurrency(item.summary.total)}
                                    </p>
                                </div>
                                
                                {/* Tombol Hapus di List */}
                                {canDelete && (
                                    <Button
                                        variant="ghost"
                                        onClick={(e) => handleDeleteDate(e, item.tanggal)}
                                        disabled={deletingDate === item.tanggal}
                                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                        title="Hapus data pada tanggal ini"
                                    >
                                        <Trash2 size={20} />
                                    </Button>
                                )}
                                
                                <ChevronRight className="text-gray-400" size={20} />
                            </div>
                        </div>

                        {/* Summary per kategori */}
                        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-6 gap-4">
                            <div className="text-center">
                                <p className="text-xs text-gray-400">KASDA</p>
                                <p className="font-semibold text-sm">{formatCurrency(item.summary.kasda)}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-400">Escrow</p>
                                <p className="font-semibold text-sm">{formatCurrency(item.summary.escrow)}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-400">SKPD Pengeluaran</p>
                                <p className="font-semibold text-sm">{formatCurrency(item.summary.skpd_pengeluaran)}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-400">SKPD Penerimaan</p>
                                <p className="font-semibold text-sm">{formatCurrency(item.summary.skpd_penerimaan)}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-400">BLUD/Puskes</p>
                                <p className="font-semibold text-sm">{formatCurrency(item.summary.blud_pasar_puskes)}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-400">Sekolah</p>
                                <p className="font-semibold text-sm">{formatCurrency(item.summary.sekolah)}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Detail Panel */}
            {selectedDate && (
                <div className="fixed inset-0 bg-black/50 z-[120] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col">
                        {/* Header with filters */}
                        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <h2 className="text-xl font-bold">Detail: {formatDate(selectedDate)}</h2>
                                <p className="text-sm text-gray-500">
                                    Total {detailData.length} data
                                </p>
                            </div>

                            {/* Search Input */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Cari norek atau nama..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {searchInput && (
                                    <button
                                        onClick={() => setSearchInput("")}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <Select
                                    label=""
                                    options={CATEGORY_OPTIONS}
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                    variant="neumorph"
                                />
                                <Button variant="ghost" onClick={() => setSelectedDate(null)}>
                                    Tutup
                                </Button>
                            </div>
                        </div>

                        {/* Data List */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {isLoadingDetail ? (
                                <div className="text-center py-8">Loading...</div>
                            ) : detailData.length === 0 ? (
                                <div className="text-center py-8 text-gray-400">Tidak ada data</div>
                            ) : (
                                <div className="space-y-2">
                                    {detailData.map((item: any, idx: number) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50"
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                                    {idx + 1}
                                                </span>
                                                <div>
                                                    <p className="font-medium text-sm">{item.rekening?.nama_rekening || item.nama_rekening}</p>
                                                    <p className="text-xs text-gray-400 font-mono">
                                                        {item.rekening?.nomor_rekening || item.nomor_rekening}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold">
                                                    {formatCurrency(item.saldo || 0)}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {item.rekening?.jenis_rekening || "-"}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}