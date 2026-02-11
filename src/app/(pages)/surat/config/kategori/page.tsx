"use client";

import React, { useState, useMemo } from "react";
import {
    Plus, Search, Tag, Hash, FileText,
    Edit, Trash2, CheckCircle2, XCircle,
    Layers, AlertCircle, Save, Info
} from "lucide-react";
import {
    Button, Card, Typography, Badge,
    Table, TableRow, TableCell, TablePagination,
    Modal, SearchInput
} from "@/components/ui/Index"; // Sesuaikan path import komponen UI Anda
import { toast } from "sonner";

// --- TIPE DATA ---
interface Category {
    id: string;
    nama: string;
    kode: string; // Prefix Nomor Surat (Misal: ND, UND, SE)
    deskripsi: string;
    status: "active" | "inactive";
    jumlahDokumen: number; // Simulasi jumlah dokumen terkait
}

// --- DATA DUMMY ---
const INITIAL_DATA: Category[] = [
    { id: "KAT-001", nama: "Nota Dinas", kode: "ND", deskripsi: "Naskah dinas internal antar pejabat.", status: "active", jumlahDokumen: 142 },
    { id: "KAT-002", nama: "Undangan", kode: "UND", deskripsi: "Surat pemanggilan acara resmi.", status: "active", jumlahDokumen: 89 },
    { id: "KAT-003", nama: "Surat Edaran", kode: "SE", deskripsi: "Pemberitahuan/instruksi massal.", status: "active", jumlahDokumen: 34 },
    { id: "KAT-004", nama: "Surat Keputusan", kode: "SK", deskripsi: "Penetapan kebijakan atau keputusan.", status: "inactive", jumlahDokumen: 12 },
    { id: "KAT-005", nama: "Berita Acara", kode: "BA", deskripsi: "Dokumentasi kejadian atau serah terima.", status: "active", jumlahDokumen: 56 },
];

export default function KategoriConfigPage() {
    // --- STATES ---
    const [data, setData] = useState<Category[]>(INITIAL_DATA);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    // State Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // State Form
    const [formId, setFormId] = useState("");
    const [formNama, setFormNama] = useState("");
    const [formKode, setFormKode] = useState("");
    const [formDeskripsi, setFormDeskripsi] = useState("");
    const [formStatus, setFormStatus] = useState<"active" | "inactive">("active");

    // --- LOGIC: FILTER & PAGINATION ---
    const filteredData = useMemo(() => {
        return data.filter(item =>
            item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.kode.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [data, searchQuery]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // --- HANDLERS ---

    const handleOpenModal = (item?: Category) => {
        if (item) {
            // Mode Edit
            setIsEditing(true);
            setFormId(item.id);
            setFormNama(item.nama);
            setFormKode(item.kode);
            setFormDeskripsi(item.deskripsi);
            setFormStatus(item.status);
        } else {
            // Mode Tambah Baru
            setIsEditing(false);
            setFormId(`KAT-${Math.floor(Math.random() * 1000)}`); // Simulasi ID
            setFormNama("");
            setFormKode("");
            setFormDeskripsi("");
            setFormStatus("active");
        }
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!formNama || !formKode) {
            toast.error("Nama dan Kode Kategori wajib diisi!");
            return;
        }

        if (isEditing) {
            // Update Data
            setData(prev => prev.map(item =>
                item.id === formId
                    ? { ...item, nama: formNama, kode: formKode, deskripsi: formDeskripsi, status: formStatus }
                    : item
            ));
            toast.success("Kategori berhasil diperbarui");
        } else {
            // Tambah Data Baru
            const newItem: Category = {
                id: formId,
                nama: formNama,
                kode: formKode,
                deskripsi: formDeskripsi,
                status: formStatus,
                jumlahDokumen: 0
            };
            setData(prev => [newItem, ...prev]);
            toast.success("Kategori baru ditambahkan");
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
            setData(prev => prev.filter(item => item.id !== id));
            toast.success("Kategori dihapus");
        }
    };

    // --- RENDER ---
    return (
        <div className="space-y-8 pb-10">
            {/* 1. HEADER SECTION */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-text-primary">
                        Konfigurasi <span className="text-primary-base">Kategori</span>
                    </h1>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Manajemen Jenis Naskah & Klasifikasi</p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => handleOpenModal()}
                    className="text-[10px] font-black uppercase tracking-widest px-6 !bg-primary-base text-white gap-2 shadow-neumorph"
                >
                    <Plus size={16} /> Tambah Kategori
                </Button>
            </header>

            {/* 2. STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card padding="sm" className="flex items-center gap-4 border-none shadow-neumorph">
                    <div className="w-12 h-12 rounded-xl bg-primary-base/10 text-primary-base flex items-center justify-center shadow-inner">
                        <Layers size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black italic text-text-primary">{data.length}</h3>
                        <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Total Kategori</p>
                    </div>
                </Card>
                <Card padding="sm" className="flex items-center gap-4 border-none shadow-neumorph">
                    <div className="w-12 h-12 rounded-xl bg-success-base/10 text-success-base flex items-center justify-center shadow-inner">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black italic text-text-primary">{data.filter(i => i.status === 'active').length}</h3>
                        <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Status Aktif</p>
                    </div>
                </Card>
                <Card padding="sm" className="flex items-center gap-4 border-none shadow-neumorph">
                    <div className="w-12 h-12 rounded-xl bg-text-muted/10 text-text-muted flex items-center justify-center shadow-inner">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black italic text-text-primary">
                            {data.reduce((acc, curr) => acc + curr.jumlahDokumen, 0)}
                        </h3>
                        <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Dokumen Terkait</p>
                    </div>
                </Card>
            </div>

            {/* 3. MAIN TABLE CONTENT */}
            <Card variant="standard" padding="lg" className="border-none shadow-neumorph">
                {/* Search Bar */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-6 pb-6 border-b border-border-main/10 gap-4">
                    <div className="w-full md:w-1/3 space-y-2">
                        <span className="text-[10px] font-black uppercase text-text-muted ml-1">Cari Kategori</span>
                        <SearchInput
                            value={searchQuery}
                            onChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
                            placeholder="Cari nama atau kode..."
                        />
                    </div>
                </div>

                <Table
                    headers={["Kode / Prefix", "Nama Kategori", "Deskripsi", "Status", "Aksi"]}
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
                    {paginatedData.map((item, idx) => (
                        <TableRow key={item.id} index={idx}>
                            <TableCell className="font-bold">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-surface-secondary shadow-sm text-primary-base">
                                        <Hash size={12} />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-wider">{item.kode}</span>
                                </div>
                            </TableCell>
                            <TableCell className="font-bold text-text-primary">
                                {item.nama}
                            </TableCell>
                            <TableCell className="text-xs text-text-muted italic max-w-xs truncate">
                                {item.deskripsi}
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant="soft"
                                    color={item.status === 'active' ? 'success' : 'muted'}
                                    className="uppercase font-black text-[9px]"
                                >
                                    {item.status === 'active' ? "Aktif" : "Non-Aktif"}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="inset"
                                        className="!p-2 rounded-lg hover:text-primary-base transition-colors"
                                        onClick={() => handleOpenModal(item)}
                                    >
                                        <Edit size={14} />
                                    </Button>
                                    <Button
                                        variant="inset"
                                        className="!p-2 rounded-lg hover:text-danger-base transition-colors"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </Table>
            </Card>

            {/* 4. MODAL ADD / EDIT */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={isEditing ? "Edit Kategori" : "Buat Kategori Baru"}
            >
                <div className="space-y-6">
                    {/* Header Info */}
                    <div className="p-4 bg-surface-secondary/30 rounded-xl border border-border-main/10 flex gap-3 items-start">
                        <Info size={18} className="text-primary-base mt-0.5 shrink-0" />
                        <div>
                            <Typography variant="caption" className="font-bold text-primary-base uppercase">Informasi Sistem</Typography>
                            <Typography variant="body" className="text-[10px] opacity-70 italic leading-relaxed">
                                Kategori yang dibuat akan muncul pada pilihan jenis surat di halaman Editor. Pastikan Kode (Prefix) unik untuk penomoran otomatis.
                            </Typography>
                        </div>
                    </div>

                    {/* Form Inputs */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-text-muted ml-1">Nama Kategori</label>
                            <div className="relative">
                                <Tag size={14} className="absolute left-4 top-3.5 text-text-muted opacity-50" />
                                <input
                                    type="text"
                                    placeholder="Contoh: Nota Dinas"
                                    value={formNama}
                                    onChange={(e) => setFormNama(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-surface-secondary/20 rounded-xl text-xs font-bold shadow-neumorph-inset focus:outline-none focus:ring-2 focus:ring-primary-base/20 transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-text-muted ml-1">Kode / Prefix</label>
                                <div className="relative">
                                    <Hash size={14} className="absolute left-4 top-3.5 text-text-muted opacity-50" />
                                    <input
                                        type="text"
                                        placeholder="Contoh: ND"
                                        value={formKode}
                                        onChange={(e) => setFormKode(e.target.value.toUpperCase())}
                                        className="w-full pl-10 pr-4 py-3 bg-surface-secondary/20 rounded-xl text-xs font-bold shadow-neumorph-inset focus:outline-none focus:ring-2 focus:ring-primary-base/20 transition-all uppercase"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-text-muted ml-1">Status</label>
                                <div className="flex gap-2 p-1 bg-surface-secondary/20 rounded-xl shadow-neumorph-inset">
                                    <button
                                        onClick={() => setFormStatus("active")}
                                        className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${formStatus === 'active' ? 'bg-success-base text-white shadow-md' : 'text-text-muted hover:bg-white/10'}`}
                                    >
                                        Aktif
                                    </button>
                                    <button
                                        onClick={() => setFormStatus("inactive")}
                                        className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${formStatus === 'inactive' ? 'bg-text-muted text-white shadow-md' : 'text-text-muted hover:bg-white/10'}`}
                                    >
                                        Arsip
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-text-muted ml-1">Deskripsi Singkat</label>
                            <textarea
                                placeholder="Jelaskan fungsi kategori ini..."
                                rows={3}
                                value={formDeskripsi}
                                onChange={(e) => setFormDeskripsi(e.target.value)}
                                className="w-full p-4 bg-surface-secondary/20 rounded-xl text-xs font-medium shadow-neumorph-inset focus:outline-none focus:ring-2 focus:ring-primary-base/20 transition-all resize-none"
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-2 flex gap-3">
                        <Button
                            variant="ghost"
                            className="flex-1"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="primary"
                            className="flex-1 !bg-primary-base text-white shadow-neumorph gap-2"
                            onClick={handleSave}
                        >
                            <Save size={16} />
                            Simpan Data
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}