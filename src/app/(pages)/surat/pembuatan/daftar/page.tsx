"use client";

import React, { useState, useMemo } from "react";
import {
    Plus, Clock, CheckCircle2,
    FileEdit, Send, ArrowUpRight, Trash2,
    AlertCircle, GitMerge, Trophy, Lock, Stamp, FileText
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
    Button, Card, Badge, Select, SearchInput, Progress,
    Table, TableRow, TableCell, TablePagination,
} from "@/components/ui/Index";
import { toast } from "sonner";

// 1. DATA DUMMY DENGAN STATUS BARU ("draft", "revision", "current", "waiting", "verified")
const INITIAL_DRAFTS = [
    {
        id: "DFT-2026-001",
        perihal: "Nota Dinas Pengadaan Server Hub Tubaba",
        tanggal: "01 Feb 2026",
        status: "draft", // Status awal (Masih di Editor)
        progress: 25,
        kategori: "nota"
    },
    {
        id: "DFT-2026-002",
        perihal: "Undangan Rapat Evaluasi Kinerja Triwulan",
        tanggal: "31 Jan 2026",
        status: "revision", // Status MERAH (Perlu Perbaikan di Koordinasi)
        progress: 60,
        kategori: "undangan"
    },
    {
        id: "DFT-2026-003",
        perihal: "Surat Edaran Protokol Keamanan Data",
        tanggal: "30 Jan 2026",
        status: "current", // Status BIRU/KUNING (Sedang berproses paraf)
        progress: 80,
        kategori: "edaran"
    },
    {
        id: "DFT-2026-004",
        perihal: "SK Tim Teknis Transformasi Digital",
        tanggal: "29 Jan 2026",
        status: "waiting", // Status ORANGE (Menunggu TTE Bupati)
        progress: 90,
        kategori: "sk"
    },
    {
        id: "DFT-2026-005",
        perihal: "Laporan Perjalanan Dinas Sekretariat",
        tanggal: "28 Jan 2026",
        status: "verified", // Status HIJAU (Selesai/Terbit)
        progress: 100,
        kategori: "nota"
    },
];

export default function PembuatanSuratListPage() {
    const router = useRouter();
    const [drafts, setDrafts] = useState(INITIAL_DRAFTS);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterJenis, setFilterJenis] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // --- LOGIKA NAVIGASI ---

    const handleCreateNew = () => {
        router.push("/surat/pembuatan/editor");
    };

    const handleEdit = (id: string, status: string) => {
        // Jika status draft, edit ke editor biasa.
        // Jika status revision/current, user diarahkan untuk memperbaiki lewat alur koordinasi
        if (["revision", "draf"].includes(status)) {
            router.push(`/surat/pembuatan/editor?id=${id}`);
        } else {
            router.push(`/surat/pembuatan/koordinasi?id=${id}`);
        }
    };

    const handleDelete = (id: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus draf ${id}?`)) {
            setDrafts(prev => prev.filter(s => s.id !== id));
            toast.error(`Draf ${id} berhasil dihapus`);
        }
    };

    // --- FILTER & PAGINATION ---

    const filteredDrafts = useMemo(() => {
        return drafts.filter((surat) => {
            const matchSearch = surat.perihal.toLowerCase().includes(searchQuery.toLowerCase()) ||
                surat.id.toLowerCase().includes(searchQuery.toLowerCase());
            const matchCategory = filterJenis === "all" || surat.kategori === filterJenis;
            return matchSearch && matchCategory;
        });
    }, [searchQuery, filterJenis, drafts]);

    const totalPages = Math.ceil(filteredDrafts.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredDrafts.slice(start, start + itemsPerPage);
    }, [filteredDrafts, currentPage, itemsPerPage]);

    // 2. CONFIG TAMPILAN STATUS BARU
    const getStatusConfig = (status: string) => {
        switch (status) {
            case "draft":
                return { color: "primary" as const, icon: FileEdit, label: "Draft Awal" };
            case "revision":
                return { color: "danger" as const, icon: AlertCircle, label: "Perlu Revisi" };
            case "current":
                return { color: "warning" as const, icon: GitMerge, label: "Proses Paraf" };
            case "waiting":
                return { color: "info" as const, icon: Clock, label: "Menunggu TTE" };
            case "verified":
                return { color: "success" as const, icon: Trophy, label: "Terbit / Sah" };
            default:
                return { color: "primary" as const, icon: FileEdit, label: "Draft" };
        }
    };

    return (
        <div className="space-y-8 pb-10">
            {/* HEADER SECTION */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-text-primary">
                        Daftar <span className="text-[var(--theme-base)]">Surat</span>
                    </h1>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Manajemen Siklus Dokumen Digital</p>
                </div>
                <Button
                    variant="primary"
                    onClick={handleCreateNew}
                    className="text-[10px] font-black uppercase tracking-widest px-6 !bg-[var(--theme-base)] text-white gap-2 shadow-[0_0_15px_var(--theme-glow)]"
                >
                    <Plus size={16} /> Buat Surat Baru
                </Button>
            </header>

            {/* 3. SUMMARY CARDS (Statistik) */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {["draft", "revision", "current", "waiting", "verified"].map((statKey) => {
                    const config = getStatusConfig(statKey);
                    const count = drafts.filter(s => s.status === statKey).length;

                    return (
                        <Card
                            key={statKey}
                            padding="sm"
                            onClick={() => {
                                // Filter sederhana (Opsional: bisa dikembangkan untuk filter tabel otomatis)
                                toast.info(`Memfilter status: ${config.label}`);
                            }}
                            className="flex flex-col items-center justify-center gap-2 shadow-neumorph border-none cursor-pointer hover:scale-105 transition-transform text-center py-6"
                        >
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface-secondary shadow-neumorph" style={{ color: `var(--${config.color}-base)` }}>
                                <config.icon size={16} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black italic text-text-primary leading-none mb-1">{count}</h3>
                                <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest leading-none opacity-70">{config.label}</p>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* TABLE SECTION */}
            <Card variant="standard" padding="lg" className="border-none shadow-neumorph">
                {/* Filter Controls */}
                <div className="flex flex-col xl:flex-row gap-6 items-end justify-between mb-8 pb-8 border-b border-border-main/10">
                    <div className="flex flex-col md:flex-row gap-6 flex-1 w-full xl:w-auto">
                        <div className="w-full md:flex-1 space-y-2">
                            <span className="text-[10px] font-black uppercase text-text-muted ml-1">Search Protocol</span>
                            <SearchInput
                                value={searchQuery}
                                onChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
                                showMenu={false}
                            />
                        </div>
                        <div className="w-full md:w-64 space-y-2">
                            <span className="text-[10px] font-black uppercase text-text-muted ml-1">Kategori</span>
                            <Select
                                searchable
                                options={[
                                    { label: "Semua", value: "all" },
                                    { label: "Nota Dinas", value: "nota" },
                                    { label: "Undangan", value: "undangan" },
                                    { label: "Surat Edaran", value: "edaran" }
                                ]}
                                value={filterJenis}
                                onChange={(val) => { setFilterJenis(val); setCurrentPage(1); }}
                            />
                        </div>
                    </div>
                </div>

                <Table
                    headers={["ID Dokumen", "Perihal & Tanggal", "Status Terkini", "Kesiapan", "Aksi"]}
                    isEmpty={paginatedData.length === 0}
                    footer={
                        totalPages > 0 && (
                            <TablePagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        )
                    }
                >
                    {paginatedData.map((surat, i) => {
                        const config = getStatusConfig(surat.status);
                        return (
                            <TableRow key={surat.id} index={i} statusColor={config.color}>
                                <TableCell isFirst statusColor={config.color} className="font-black text-[10px] tracking-widest">
                                    {surat.id}
                                </TableCell>
                                <TableCell className="max-w-xs">
                                    <div className="space-y-1">
                                        <p className="font-bold text-text-primary truncate uppercase italic">{surat.perihal}</p>
                                        <p className="text-[9px] text-text-muted italic flex items-center gap-1">
                                            <Clock size={10} /> {surat.tanggal}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="soft" color={config.color} className="italic font-bold uppercase gap-1">
                                        {surat.status === 'verified' && <Lock size={10} />}
                                        {config.label}
                                    </Badge>
                                </TableCell>
                                <TableCell className="min-w-[150px]">
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-[8px] font-black uppercase text-text-muted">
                                            <span>Completeness</span>
                                            <span style={{ color: `var(--${config.color}-base)` }}>{surat.progress}%</span>
                                        </div>
                                        <Progress value={surat.progress} color={config.color} size="sm" />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {/* Edit / Process / View Button */}
                                        <Button
                                            variant="expel"
                                            className={`!p-2.5 rounded-xl transition-colors ${surat.status === 'verified'
                                                ? 'hover:text-success-base hover:bg-success-base/10' // Hijau jika Verified
                                                : 'hover:text-[var(--theme-base)]'
                                                }`}
                                            onClick={() => handleEdit(surat.id, surat.status)}
                                            title={surat.status === 'verified' ? "Buka Dokumen Sah" : "Edit / Proses"}
                                        >
                                            {(() => {
                                                // KONDISI 1: SUDAH SAH/VERIFIED -> Ikon File (Open File)
                                                if (surat.status === 'verified') {
                                                    return <FileText size={16} />;
                                                }
                                                // KONDISI 2: MASIH DRAFT/REVISI -> Ikon Edit
                                                if (["draft", "revision"].includes(surat.status)) {
                                                    return <FileEdit size={16} />;
                                                }
                                                // KONDISI 3: SEDANG PROSES TTE -> Ikon Stamp
                                                return <Stamp size={16} />;
                                            })()}
                                        </Button>

                                        {/* Delete Button */}
                                        <Button
                                            variant="expel"
                                            className="!p-2.5 rounded-xl hover:bg-danger-base/10 hover:text-danger-base"
                                            onClick={() => handleDelete(surat.id)}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </Table>
            </Card>
        </div>
    );
}