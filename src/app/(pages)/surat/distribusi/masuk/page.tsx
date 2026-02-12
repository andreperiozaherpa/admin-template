"use client";

import React, { useState, useEffect } from "react";
import {
    Inbox, UploadCloud, Calendar, FileText,
    Building, Search, Eye, Download, FileCheck,
    Trash2, Clock, Plus
} from "lucide-react";
import {
    Button, Card, Badge, Modal,
    Table, TableRow, TableCell, FileUploader, Select
} from "@/components/ui/Index";
import { toast } from "sonner";

// --- IMPORT SERVICE ---
import {
    distribusiService,
    IncomingLetter
} from "@/services/surat/distribusiService";

export default function RegistrasiMasukPage() {
    // --- STATE DATA (Dari Service) ---
    const [letters, setLetters] = useState<IncomingLetter[]>([]);

    // --- STATE UI ---
    const [searchQuery, setSearchQuery] = useState("");
    const [modalMode, setModalMode] = useState<"none" | "register" | "detail">("none");
    const [selectedLetter, setSelectedLetter] = useState<IncomingLetter | null>(null);

    // Form & Upload State
    const [formReg, setFormReg] = useState({
        noSurat: "",
        pengirim: "",
        perihal: "",
        tglSurat: "",
        sifat: "Biasa",
        tujuan: "Kepala Dinas"
    });
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    // --- 1. LOAD DATA ON MOUNT ---
    useEffect(() => {
        setLetters(distribusiService.getIncomingLetters());
    }, []);

    // --- HANDLERS ---

    const handleOpenRegister = () => {
        setFormReg({
            noSurat: "",
            pengirim: "",
            perihal: "",
            tglSurat: "",
            sifat: "Biasa",
            tujuan: "Kepala Dinas"
        });
        setUploadedFile(null);
        setModalMode("register");
    };

    const handleSubmitRegister = () => {
        // Validasi
        if (!formReg.noSurat || !formReg.pengirim) return toast.error("Data wajib belum diisi");
        if (!uploadedFile) return toast.error("File surat belum diunggah");

        // 1. Panggil Service untuk Simpan
        distribusiService.registerLetter({
            noSuratAsli: formReg.noSurat,
            pengirim: formReg.pengirim,
            perihal: formReg.perihal,
            tglTerima: new Date().toISOString().split('T')[0],
            tglSurat: formReg.tglSurat || new Date().toISOString().split('T')[0],
            sifat: formReg.sifat as any,
            fileUrl: URL.createObjectURL(uploadedFile),
            tujuanSurat: formReg.tujuan
        });

        // 2. Refresh State Lokal
        setLetters(distribusiService.getIncomingLetters());

        toast.success("Surat Berhasil Diregistrasi ke Agenda");
        setModalMode("none");
    };

    const handleDelete = (id: string) => {
        // 1. Panggil Service Hapus
        distribusiService.deleteIncomingLetter(id);

        // 2. Refresh State Lokal
        setLetters(distribusiService.getIncomingLetters());

        toast.success("Surat dihapus dari agenda");
    };

    // --- HELPER ---
    const getSifatBadge = (sifat: string) => {
        switch (sifat) {
            case "Penting": return <Badge variant="soft" color="danger">Penting</Badge>;
            case "Rahasia": return <Badge variant="soft" color="dark">Rahasia</Badge>;
            default: return <Badge variant="soft" color="info">Biasa</Badge>;
        }
    };

    return (
        <div className="space-y-8 pb-10">
            {/* HEADER */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-text-primary">
                        Buku Agenda <span className="text-primary-base">Surat Masuk</span>
                    </h1>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                        Registrasi & Digitalisasi Dokumen Fisik
                    </p>
                </div>
                <Button variant="primary" className="!bg-primary-base text-white shadow-neumorph gap-2 px-6 hover:brightness-110" onClick={handleOpenRegister}>
                    <Plus size={16} /> Registrasi Baru
                </Button>
            </header>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="flex items-center gap-4 border-none shadow-neumorph p-4 bg-surface">
                    <div className="w-12 h-12 rounded-2xl bg-primary-base/10 text-primary-base flex items-center justify-center shadow-inner">
                        <Inbox size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-text-primary">{letters.length}</h3>
                        <p className="text-[9px] uppercase text-text-muted font-bold tracking-wider">Total Teragenda</p>
                    </div>
                </Card>
                <Card className="flex items-center gap-4 border-none shadow-neumorph p-4 bg-surface">
                    <div className="w-12 h-12 rounded-2xl bg-success-base/10 text-success-base flex items-center justify-center shadow-inner">
                        <Clock size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-text-primary">{new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</h3>
                        <p className="text-[9px] uppercase text-text-muted font-bold tracking-wider">Periode Berjalan</p>
                    </div>
                </Card>
            </div>

            {/* TABLE LIST */}
            <Card variant="standard" padding="lg" className="border-none shadow-neumorph bg-surface">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-border-main/20 pb-6 gap-4">
                    <div className="w-full md:w-1/3 space-y-2">
                        <label className="text-[10px] font-black uppercase text-text-muted ml-1 flex items-center gap-1">
                            <Search size={10} /> Cari Agenda
                        </label>
                        <div className="relative group">
                            <input
                                className="w-full pl-4 pr-4 py-3 bg-surface-secondary/50 rounded-xl text-xs font-bold text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary-base/20 transition-all shadow-neumorph-inset"
                                placeholder="No. Agenda / Pengirim / Perihal..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <Table headers={["No. Agenda", "Identitas Surat", "Sifat", "Aksi"]}>
                    {letters.filter(l => l.pengirim.toLowerCase().includes(searchQuery.toLowerCase()) || l.perihal.toLowerCase().includes(searchQuery.toLowerCase())).map((surat, i) => (
                        <TableRow key={surat.id} index={i}>
                            <TableCell>
                                <div className="space-y-1.5">
                                    <Badge variant="soft" color="primary" size="sm" className="font-mono text-[9px]">{surat.id}</Badge>
                                    <span className="font-bold text-[10px] text-text-muted uppercase block flex items-center gap-1">
                                        <Calendar size={10} /> {surat.tglTerima}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="max-w-md">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-primary-base tracking-wide">
                                        <Building size={12} /> {surat.pengirim}
                                    </div>
                                    <p className="font-bold text-text-primary text-xs leading-snug line-clamp-2 italic">"{surat.perihal}"</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] font-mono text-text-muted bg-surface-secondary px-1.5 rounded">No: {surat.noSuratAsli}</span>
                                        <span className="text-[9px] font-mono text-text-muted bg-surface-secondary px-1.5 rounded">Tgl: {surat.tglSurat}</span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{getSifatBadge(surat.sifat)}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button variant="inset" className="!p-2.5 text-text-muted hover:text-primary-base bg-surface-secondary shadow-neumorph-inset" onClick={() => { setSelectedLetter(surat); setModalMode("detail"); }}>
                                        <Eye size={16} />
                                    </Button>
                                    <Button variant="inset" className="!p-2.5 text-text-muted hover:text-danger-base bg-surface-secondary shadow-neumorph-inset" onClick={() => handleDelete(surat.id)}>
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </Table>
            </Card>

            {/* MODAL REGISTRASI */}
            <Modal isOpen={modalMode === "register"} onClose={() => setModalMode("none")} title="Registrasi Surat Masuk">
                <div className="flex flex-col h-full">
                    {/* AREA SCROLLABLE */}
                    <div className="flex-1 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* KOLOM KIRI: METADATA */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-text-muted ml-1">Instansi Pengirim</label>
                                    <input className="w-full p-3 bg-surface-secondary/50 rounded-xl text-xs font-bold shadow-neumorph-inset focus:outline-none focus:ring-2 focus:ring-primary-base/20"
                                        placeholder="Contoh: Kemenag / PT. PLN" value={formReg.pengirim} onChange={e => setFormReg({ ...formReg, pengirim: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-text-muted ml-1">Nomor Surat Asli</label>
                                    <input className="w-full p-3 bg-surface-secondary/50 rounded-xl text-xs font-bold shadow-neumorph-inset focus:outline-none focus:ring-2 focus:ring-primary-base/20"
                                        placeholder="Nomor surat..." value={formReg.noSurat} onChange={e => setFormReg({ ...formReg, noSurat: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-text-muted ml-1">Tanggal Surat</label>
                                    <input type="date" className="w-full p-3 bg-surface-secondary/50 rounded-xl text-xs font-bold shadow-neumorph-inset focus:outline-none focus:ring-2 focus:ring-primary-base/20"
                                        value={formReg.tglSurat} onChange={e => setFormReg({ ...formReg, tglSurat: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-text-muted ml-1">
                                        Ditujukan Kepada Yth.
                                    </label>
                                    <Select
                                        options={[
                                            { label: "Bupati Tubaba", value: "Bupati Tubaba" },
                                            { label: "Wakil Bupati", value: "Wakil Bupati" },
                                            { label: "Sekretaris Daerah", value: "Sekretaris Daerah" },
                                            { label: "Kepala Dinas (Internal)", value: "Kepala Dinas" }
                                        ]}
                                        value={formReg.tujuan}
                                        onChange={(val) => setFormReg({ ...formReg, tujuan: val as string })}
                                    />
                                    <p className="text-[9px] text-info-base italic">
                                        *Pilih "Bupati" jika surat fisik tertulis untuk Bupati, meskipun diterima di Dinas.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-text-muted ml-1">Perihal</label>
                                    <textarea className="w-full p-3 bg-surface-secondary/50 rounded-xl text-xs font-bold shadow-neumorph-inset focus:outline-none focus:ring-2 focus:ring-primary-base/20 resize-none"
                                        rows={3} placeholder="Ringkasan isi..." value={formReg.perihal} onChange={e => setFormReg({ ...formReg, perihal: e.target.value })} />
                                </div>
                            </div>

                            {/* KOLOM KANAN: UPLOAD & SIFAT */}
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <FileUploader
                                        label="Scan Dokumen Fisik (PDF)"
                                        accept=".pdf"
                                        maxFiles={1}
                                        maxSize={5}
                                        isSimulated={true}
                                        onFilesSelected={(files) => {
                                            if (files.length > 0) setUploadedFile(files[0]);
                                            else setUploadedFile(null);
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-text-muted ml-1">Sifat Surat</label>
                                    <div className="flex gap-2 bg-surface-secondary/50 p-1.5 rounded-xl shadow-neumorph-inset">
                                        {["Biasa", "Penting", "Rahasia"].map(s => (
                                            <button key={s} onClick={() => setFormReg({ ...formReg, sifat: s as any })}
                                                className={`flex-1 py-2.5 rounded-lg text-[9px] font-black uppercase transition-all ${formReg.sifat === s ? 'bg-primary-base text-white shadow-md' : 'text-text-muted hover:text-text-primary'}`}>{s}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FIXED FOOTER */}
                    <div className="pt-4 mt-2 border-t border-border-main/10 bg-surface flex gap-3">
                        <Button variant="ghost" className="flex-1 text-text-muted hover:text-danger-base" onClick={() => setModalMode("none")}>Batal</Button>
                        <Button variant="primary" className="flex-1 bg-primary-base text-white shadow-neumorph gap-2 hover:brightness-110" onClick={handleSubmitRegister}>
                            <UploadCloud size={16} /> Simpan ke Agenda
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* MODAL DETAIL */}
            <Modal isOpen={modalMode === "detail"} onClose={() => setModalMode("none")} title="Detail Surat Agenda">
                {selectedLetter && (
                    <div className="space-y-6">
                        <div className="bg-surface-secondary/30 p-5 rounded-2xl border border-border-main/20 shadow-neumorph-inset relative overflow-hidden">
                            <FileText size={100} className="absolute -right-4 -bottom-4 text-text-muted opacity-5 rotate-12" />
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="soft" color="primary" className="font-mono">{selectedLetter.id}</Badge>
                                    {getSifatBadge(selectedLetter.sifat)}
                                </div>
                                <h3 className="text-sm font-black uppercase text-text-primary leading-relaxed italic mb-4">"{selectedLetter.perihal}"</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[9px] font-bold text-text-muted uppercase">Pengirim</p>
                                        <p className="text-[11px] font-bold text-primary-base flex items-center gap-1"><Building size={12} /> {selectedLetter.pengirim}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-text-muted uppercase">Ditujukan Yth.</p>
                                        <p className="text-[11px] font-bold text-primary-base flex items-center gap-1">
                                            <Building size={12} /> {selectedLetter.tujuanSurat}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-text-muted uppercase">Tanggal Surat</p>
                                        <p className="text-[11px] font-bold text-text-primary flex items-center gap-1"><Calendar size={12} /> {selectedLetter.tglSurat}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-text-muted uppercase">Nomor Asli</p>
                                        <p className="text-[11px] font-mono text-text-primary bg-surface/50 inline-block px-1 rounded">
                                            {selectedLetter.noSuratAsli}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-text-muted uppercase">Diterima Tgl</p>
                                        <p className="text-[11px] font-bold text-text-primary">
                                            {selectedLetter.tglTerima}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-surface p-4 rounded-xl border border-border-main/10 shadow-neumorph flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-danger-base/10 text-danger-base rounded-lg flex items-center justify-center"><FileCheck size={20} /></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-text-primary">Dokumen Digital</p>
                                    <p className="text-[9px] text-text-muted">Format PDF • Hasil Scan</p>
                                </div>
                            </div>
                            <Button variant="ghost" className="gap-2 text-[10px]" onClick={() => window.open(selectedLetter.fileUrl || '#', '_blank')}>
                                <Download size={14} /> Unduh / Lihat
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}