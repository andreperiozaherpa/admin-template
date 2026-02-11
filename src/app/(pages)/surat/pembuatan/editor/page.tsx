"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
    ChevronLeft, FileSearch, Paperclip, Send, RotateCcw,
    Zap, Info, Calendar, Hash, AlignLeft, Save
} from "lucide-react";
import {
    Button, Badge, FileUploader, Typography, Card, Select
} from "@/components/ui/Index";
import { useRouter, useSearchParams } from "next/navigation"; // 1. Import useSearchParams
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// --- 2. DATA DUMMY (SIMULASI DATABASE) ---
// Data ini harusnya dari API Backend berdasarkan ID
const MOCK_DATABASE: Record<string, any> = {
    "DFT-2026-001": {
        id: "DFT-2026-001",
        nomorSurat: "005/12/KOMINFO/2026",
        perihal: "Nota Dinas Pengadaan Server Hub Tubaba",
        tanggal: "2026-02-01",
        penandatangan: "sekda",
        template: "nota",
        visualisasi: "true",
        // Anggap ini URL file PDF yang tersimpan di server/cloud storage
        fileUrl: "/uploads/dokumen/nota-dinas-dummy.pdf"
    },
    "DFT-2026-002": {
        id: "DFT-2026-002",
        nomorSurat: "005/99/UND/2026",
        perihal: "Undangan Rapat Evaluasi Kinerja Triwulan",
        tanggal: "2026-01-31",
        penandatangan: "bupati",
        template: "undangan",
        visualisasi: "false",
        fileUrl: "/uploads/dokumen/undangan-dummy.pdf"
    }
};

export default function SuratEditorPage() {
    const router = useRouter();
    const searchParams = useSearchParams(); // 3. Ambil Params
    const suratId = searchParams.get('id'); // Ambil ID dari URL (?id=...)

    // --- STATES: METADATA ---
    const [attachedFiles, setAttachedFiles] = useState<File[]>([]); // File Lokal (Upload baru)
    const [serverPdfUrl, setServerPdfUrl] = useState<string | null>(null); // File Server (Edit mode)

    const [attachments, setAttachments] = useState<File[]>([]);
    const [penandatangan, setPenandatangan] = useState("");
    const [template, setTemplate] = useState("nota");
    const [visualisasi, setVisualisasi] = useState("true"); // State baru visualisasi
    const [tanggal, setTanggal] = useState("");
    const [nomorSurat, setNomorSurat] = useState("");
    const [perihal, setPerihal] = useState("");

    const [isLoadingData, setIsLoadingData] = useState(false);
    const [showErrors, setShowErrors] = useState(false);

    // --- 4. LOGIC: FETCH DATA BY ID ---
    useEffect(() => {
        if (suratId) {
            setIsLoadingData(true);
            // Simulasi fetch delay
            setTimeout(() => {
                const data = MOCK_DATABASE[suratId];
                if (data) {
                    setNomorSurat(data.nomorSurat);
                    setPerihal(data.perihal);
                    setTanggal(data.tanggal);
                    setPenandatangan(data.penandatangan);
                    setTemplate(data.template);
                    setVisualisasi(data.visualisasi);

                    // Set URL PDF dari server agar tampil di preview
                    // Catatan: Pastikan file dummy ada di folder public/uploads/...
                    // Jika tidak ada, ganti string ini dengan null untuk tes upload manual
                    setServerPdfUrl(data.fileUrl || null);

                    toast.success("Data Draf Dimuat", { description: `ID: ${suratId}` });
                } else {
                    toast.error("Draf tidak ditemukan");
                }
                setIsLoadingData(false);
            }, 800);
        }
    }, [suratId]);

    // --- 5. LOGIC: PDF PREVIEW URL (HYBRID) ---
    // Mengutamakan File Upload Lokal, jika tidak ada baru pakai URL Server
    const previewUrl = useMemo(() => {
        const localPdf = attachedFiles.find(f => f.type === "application/pdf");
        if (localPdf) return URL.createObjectURL(localPdf);
        return serverPdfUrl; // Fallback ke file server saat edit
    }, [attachedFiles, serverPdfUrl]);

    // Cleanup URL lokal
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    // --- LOGIC: VALIDATION CHECK ---
    const isFormComplete = useMemo(() => {
        return (
            !!previewUrl &&
            !!penandatangan &&
            !!template &&
            !!nomorSurat.trim() &&
            !!tanggal &&
            !!perihal.trim()
        );
    }, [previewUrl, penandatangan, template, nomorSurat, tanggal, perihal]);

    // --- HANDLER: RESET / CANCEL EDIT ---
    const handleResetFile = () => {
        setAttachedFiles([]);
        setServerPdfUrl(null); // Hapus juga referensi server url
    };

    const handleSubmit = () => {
        if (!isFormComplete) {
            setShowErrors(true);
            toast.error("Data Belum Lengkap");
            return;
        }

        // Logic Save vs Update
        if (suratId) {
            toast.success("Perubahan Disimpan", { description: `Draf ${suratId} diperbarui.` });
        } else {
            toast.success("Pengajuan Baru Berhasil");
        }

        // Redirect balik ke daftar
        setTimeout(() => router.push("/surat/pembuatan/daftar"), 1000);
    };

    return (
        <div className="flex flex-col min-h-screen lg:h-[calc(100vh-80px)] lg:overflow-hidden -m-4 md:-m-8 bg-surface transition-all duration-500">

            {/* HEADER */}
            <header className="sticky top-0 lg:relative flex items-center justify-between px-4 md:px-8 py-4 bg-surface/80 backdrop-blur-md z-30 shadow-sm border-b border-border-main/5 shrink-0">
                <div className="flex items-center gap-3 md:gap-4 min-w-0">
                    <Button variant="inset" className="!p-2 h-9 w-9 md:h-10 md:w-10 shrink-0" onClick={() => router.back()}>
                        <ChevronLeft size={18} />
                    </Button>
                    <div className="min-w-0">
                        <Typography variant="heading" className="text-xs md:text-sm !font-black uppercase italic tracking-tighter truncate">
                            <span className="text-primary-base">{suratId ? "Edit Draf" : "Finalisasi"}</span>
                        </Typography>
                        <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${isFormComplete ? 'bg-success-base' : 'bg-warning-base'} animate-pulse`} />
                            <Typography variant="caption" color={isFormComplete ? "success" : "warning"} className="font-black text-[8px] md:text-[9px] tracking-widest opacity-80 uppercase">
                                {suratId ? `Ref: ${suratId}` : (isFormComplete ? "Ready for TTE" : "Awaiting Data")}
                            </Typography>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={isLoadingData}
                        className={`!bg-primary-base text-white gap-2 px-4 md:px-7 h-9 md:h-11 rounded-main shadow-neumorph transition-all active:scale-95 ${!isFormComplete && 'opacity-40 grayscale-50'}`}
                    >
                        {suratId ? <Save size={16} /> : <Send size={16} />}
                        <span className="hidden sm:inline text-[10px] font-black uppercase tracking-[0.1em] text-white">
                            {suratId ? "Simpan Perubahan" : "Ajukan TTE"}
                        </span>
                    </Button>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <div className={`flex flex-1 flex-col lg:flex-row lg:overflow-hidden transition-opacity duration-500 ${isLoadingData ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>

                {/* LEFT: WORKSPACE / PDF PREVIEW */}
                <main className="w-full lg:flex-1 p-4 md:p-8 flex flex-col items-center bg-surface-secondary/20 relative overflow-y-auto custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {previewUrl ? (
                            <motion.div
                                key="pdf" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                                className="w-full h-full max-w-[900px] flex flex-col gap-4"
                            >
                                <div className="flex items-center justify-between px-2 shrink-0">
                                    <Typography variant="overline" color="primary" className="flex items-center gap-2 !text-[10px]">
                                        <FileSearch size={14} /> {serverPdfUrl && attachedFiles.length === 0 ? "Server File (Read Only)" : "Local Preview Rendered"}
                                    </Typography>
                                    <Button variant="inset" onClick={handleResetFile} className="!p-2 h-8 w-8 text-danger-base rounded-lg shadow-sm">
                                        <RotateCcw size={14} />
                                    </Button>
                                </div>

                                <div className="w-full h-[500px] lg:h-full bg-white shadow-main rounded-main overflow-hidden relative border border-white/20 shrink-0 lg:shrink">
                                    {/* Gunakan iframe atau PDF viewer bawaan */}
                                    <iframe src={`${previewUrl}#toolbar=0&view=FitH`} className="w-full h-full border-none" title="Naskah Preview" />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                className={`flex-1 flex flex-col items-center justify-center w-full max-w-xl p-6 space-y-8 ${showErrors && !previewUrl ? 'animate-shake' : ''}`}
                            >
                                <div className="text-center space-y-3">
                                    <Typography variant="heading" className="!text-lg">
                                        {suratId ? "Ganti Naskah Dinas?" : "Siapkan Naskah Dinas"}
                                    </Typography>
                                    <Typography variant="body" className="text-[11px] opacity-60 italic max-w-xs mx-auto leading-relaxed">
                                        {suratId ? "Unggah file baru jika ingin merevisi dokumen PDF." : "Unggah naskah PDF asli untuk memulai proses verifikasi TTE."}
                                    </Typography>
                                </div>

                                <FileUploader
                                    description="Tarik berkas PDF naskah ke sini"
                                    accept=".pdf"
                                    maxFiles={1}
                                    onFilesSelected={(files) => { setAttachedFiles(files); setShowErrors(false); }}
                                    className={`p-3 rounded-main transition-all ${showErrors && !previewUrl ? 'ring-2 ring-danger-base/40 bg-danger-base/5 shadow-none' : 'shadow-neumorph bg-surface/40'}`}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>

                {/* RIGHT: METADATA FORM */}
                {/* RIGHT: METADATA FORM */}
                <aside className="w-full lg:w-[400px] bg-surface p-6 md:p-10 flex flex-col gap-8 z-10 shadow-[-15px_0_40px_rgba(0,0,0,0.02)] border-t lg:border-t-0 lg:border-l border-border-main/5 overflow-y-auto custom-scrollbar">

                    {/* 1. SECTION METADATA UTAMA */}
                    <section className="space-y-6">
                        <Typography variant="overline" color="muted" className="flex items-center gap-2 italic text-[10px]">
                            <Zap size={12} /> Dokumen Metadata {suratId && "(Mode Edit)"}
                        </Typography>

                        <div className="grid grid-cols-1 gap-6">
                            {/* Jenis & Pejabat */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Typography variant="caption" className="ml-1 !font-black uppercase tracking-tighter text-[10px]">Jenis Naskah</Typography>
                                    <Select
                                        searchable
                                        options={[{ label: "Nota Dinas", value: "nota" }, { label: "Undangan", value: "undangan" }]}
                                        value={template}
                                        onChange={(v) => { setTemplate(v as string); setShowErrors(false); }}
                                        className={showErrors && !template ? "ring-1 ring-danger-base/50" : ""}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Typography variant="caption" className="ml-1 !font-black uppercase tracking-tighter text-[10px]">Penandatangan</Typography>
                                    <Select
                                        searchable
                                        options={[{ label: "Bupati Tubaba", value: "bupati" }, { label: "Sekretaris Daerah", value: "sekda" }]}
                                        value={penandatangan}
                                        onChange={(v) => { setPenandatangan(v as string); setShowErrors(false); }}
                                        className={showErrors && !penandatangan ? "ring-1 ring-danger-base/50" : ""}
                                    />
                                </div>
                            </div>

                            {/* Visualisasi */}
                            <div className="space-y-2">
                                <Typography variant="caption" className="ml-1 !font-black uppercase tracking-tighter text-[10px]">Visualisasi TTE</Typography>
                                <Select
                                    searchable
                                    options={[{ label: "Terlihat (Visible)", value: "true" }, { label: "Tidak Terlihat (Invisible)", value: "false" }]}
                                    value={visualisasi}
                                    onChange={(v) => { setVisualisasi(v as string); }}
                                />
                            </div>

                            {/* Nomor & Tanggal */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Typography variant="caption" className="ml-1 !font-black uppercase tracking-tighter text-[10px] flex items-center gap-1.5"><Hash size={10} /> Nomor Surat</Typography>
                                    <input
                                        type="text" value={nomorSurat} onChange={(e) => setNomorSurat(e.target.value)}
                                        className={`w-full h-11 px-4 rounded-main bg-surface-secondary/20 transition-all focus:outline-none text-[11px] font-bold italic border-none ${showErrors && !nomorSurat.trim() ? 'ring-1 ring-danger-base/50 shadow-inner' : 'shadow-neumorph-inset'}`}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Typography variant="caption" className="ml-1 !font-black uppercase tracking-tighter text-[10px] flex items-center gap-1.5"><Calendar size={10} /> Tanggal</Typography>
                                    <input
                                        type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)}
                                        className={`w-full h-11 px-4 rounded-main bg-surface-secondary/20 transition-all focus:outline-none text-[11px] font-bold border-none ${showErrors && !tanggal ? 'ring-1 ring-danger-base/50 shadow-inner' : 'shadow-neumorph-inset'}`}
                                    />
                                </div>
                            </div>

                            {/* Perihal */}
                            <div className="space-y-2">
                                <Typography variant="caption" className="ml-1 !font-black uppercase tracking-tighter text-[10px] flex items-center gap-1.5"><AlignLeft size={10} /> Perihal Surat</Typography>
                                <textarea
                                    value={perihal} onChange={(e) => setPerihal(e.target.value)} rows={3}
                                    className={`w-full p-5 rounded-main bg-surface-secondary/20 transition-all focus:outline-none text-[11px] font-bold italic resize-none border-none leading-relaxed ${showErrors && !perihal.trim() ? 'ring-1 ring-danger-base/50 shadow-inner' : 'shadow-neumorph-inset'}`}
                                />
                            </div>
                        </div>
                    </section>

                    {/* 2. SECTION LAMPIRAN (YANG SEMPAT HILANG) */}
                    <section className="space-y-4">
                        <Typography variant="overline" color="muted" className="flex items-center gap-2 italic text-[10px]">
                            <Paperclip size={12} /> Lampiran Pendukung
                        </Typography>

                        <FileUploader
                            description="Unggah dokumen pendukung atau lampiran"
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
                            maxFiles={5} // Mengizinkan hingga 5 lampiran
                            maxSize={20}   // Batas ukuran per file 20MB
                            onFilesSelected={(files) => setAttachments(prev => [...prev, ...files])}
                            onAbort={(file) => setAttachments(prev => prev.filter(f => f.name !== file.name))}
                            className="shadow-neumorph bg-surface-secondary/10 border-dashed border-border-main/10 rounded-2xl p-4"
                        />

                        {/* List Lampiran Terpilih */}
                        {attachments.length > 0 && (
                            <div className="space-y-2">
                                {attachments.map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-surface rounded-xl border border-border-main/10 shadow-sm">
                                        <span className="text-[10px] truncate max-w-[150px] font-bold opacity-70">{file.name}</span>
                                        <Button variant="ghost" className="!p-1 h-6 w-6 text-danger-base" onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}>
                                            <RotateCcw size={12} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* 3. FOOTER INFO (YANG SEMPAT HILANG) */}
                    <footer className="mt-auto pt-4 border-t border-border-main/5">
                        <Card variant="inset" className="bg-info-base/5 !border-none p-5 space-y-2 rounded-main">
                            <Typography variant="caption" color="info" className="flex items-center gap-2 !font-black uppercase italic text-[10px]">
                                <Info size={12} /> Panduan Keamanan
                            </Typography>
                            <Typography variant="body" className="text-[10px] leading-relaxed opacity-60 italic">
                                Seluruh metadata akan dienkripsi ke dalam kode QR BSrE untuk memvalidasi integritas dokumen fisik dan digital.
                            </Typography>
                        </Card>
                    </footer>
                </aside>
            </div>
        </div>
    );
}