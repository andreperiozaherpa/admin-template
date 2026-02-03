"use client";

import React, { useState, useMemo } from "react";
import {
    Plus, Filter, FileText, Clock, CheckCircle2,
    FileEdit, Trash2, Send, ArrowUpRight
} from "lucide-react";
import { motion } from "framer-motion";
import {
    Button, Card, Badge, Select, SearchInput, Progress,
    Table, TableRow, TableCell, TablePagination, TableEntries,
    type SelectOption
} from "@/components/ui/Index";

const DRAFT_SURAT = [
    { id: "DFT-2026-001", perihal: "Nota Dinas Pengadaan Server Hub Tubaba", tanggal: "01 Feb 2026", status: "Draf", progress: 25, kategori: "nota" },
    { id: "DFT-2026-002", perihal: "Undangan Rapat Evaluasi Kinerja Triwulan", tanggal: "31 Jan 2026", status: "Review", progress: 60, kategori: "undangan" },
    { id: "DFT-2026-003", perihal: "Surat Edaran Protokol Keamanan Data", tanggal: "30 Jan 2026", status: "Finalisasi", progress: 90, kategori: "edaran" },
    { id: "DFT-2026-004", perihal: "Nota Dinas Perjalanan Dinas Sekretariat", tanggal: "29 Jan 2026", status: "Terdistribusi", progress: 100, kategori: "nota" },
    { id: "DFT-2026-005", perihal: "Draf Peraturan Bupati No. 12", tanggal: "28 Jan 2026", status: "Draf", progress: 10, kategori: "nota" },
    { id: "DFT-2026-006", perihal: "Undangan Pelantikan Pejabat", tanggal: "27 Jan 2026", status: "Review", progress: 50, kategori: "undangan" },
];

export default function PembuatanSuratListPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterJenis, setFilterJenis] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const filteredDrafts = useMemo(() => {
        return DRAFT_SURAT.filter((surat) => {
            const matchSearch = surat.perihal.toLowerCase().includes(searchQuery.toLowerCase()) ||
                surat.id.toLowerCase().includes(searchQuery.toLowerCase());
            const matchCategory = filterJenis === "all" || surat.kategori === filterJenis;
            return matchSearch && matchCategory;
        });
    }, [searchQuery, filterJenis]);

    const totalPages = Math.ceil(filteredDrafts.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredDrafts.slice(start, start + itemsPerPage);
    }, [filteredDrafts, currentPage, itemsPerPage]);

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "Draf": return { color: "primary" as const, icon: FileEdit };
            case "Review": return { color: "warning" as const, icon: Clock };
            case "Finalisasi": return { color: "success" as const, icon: CheckCircle2 };
            case "Terdistribusi": return { color: "info" as const, icon: Send };
            default: return { color: "primary" as const, icon: FileEdit };
        }
    };

    return (
        <div className="space-y-8 pb-10">
            {/* 1. HEADER SECTION */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-text-primary">
                        Daftar <span className="text-[var(--theme-base)]">Surat</span>
                    </h1>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Daftar Draf & Siklus Dokumen</p>
                </div>
                <Button variant="primary" className="text-[10px] font-black uppercase tracking-widest px-6 !bg-[var(--theme-base)] text-white gap-2 shadow-[0_0_15px_var(--theme-glow)]">
                    <Plus size={16} /> Buat Surat Baru
                </Button>
            </header>

            {/* 2. SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {["Draf", "Review", "Finalisasi", "Terdistribusi"].map((status) => {
                    const config = getStatusConfig(status);
                    const count = DRAFT_SURAT.filter(s => s.status === status).length;
                    return (
                        <Card key={status} padding="sm" className="flex items-center gap-4 shadow-neumorph border-none">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-surface-secondary shadow-neumorph-inset" style={{ color: `var(--${config.color}-base)` }}>
                                <config.icon size={20} />
                            </div>
                            <div>
                                <p className="text-[8px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">{status}</p>
                                <h3 className="text-xl font-black italic text-text-primary leading-none">{count.toString().padStart(2, '0')}</h3>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* 3. DATA GRID CONTAINER */}
            <Card variant="standard" padding="lg" className="border-none shadow-neumorph">
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
                            <span className="text-[10px] font-black uppercase text-text-muted ml-1">Category Filter</span>
                            <Select
                                searchable
                                options={[{ label: "Semua", value: "all" }, { label: "Nota Dinas", value: "nota" }, { label: "Undangan", value: "undangan" }]}
                                value={filterJenis}
                                onChange={(val) => { setFilterJenis(val); setCurrentPage(1); }}
                            />
                        </div>
                        <div className="w-full md:w-40 space-y-2">
                            <span className="text-[10px] font-black uppercase text-text-muted ml-1">Data Stream</span>
                            <TableEntries
                                value={itemsPerPage}
                                onChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
                            />
                        </div>
                    </div>
                </div>

                <Table
                    headers={["ID Draf", "Perihal Dokumen", "Status", "Progress", "Aksi"]}
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
                                {/* FIX: Gunakan isFirst agar kolom sejajar */}
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
                                    <Badge variant="soft" color={config.color} className="italic font-bold uppercase">{surat.status}</Badge>
                                </TableCell>
                                <TableCell className="min-w-[180px]">
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
                                        <Button variant="inset" className="!p-2.5 rounded-xl hover:text-[var(--theme-base)]">
                                            <FileEdit size={16} />
                                        </Button>
                                        <Button variant="expel" className="!p-2.5 rounded-xl">
                                            <ArrowUpRight size={16} />
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