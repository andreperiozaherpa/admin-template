"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
    ChevronLeft,
    FileSearch,
    Paperclip,
    Send,
    FileWarning,
    RotateCcw,
    Zap,
    Info,
    UploadCloud,
    Calendar,
    Hash,
    AlignLeft
} from "lucide-react";
import {
    Button,
    Badge,
    FileUploader,
    Typography,
    Card,
    Select
} from "@/components/ui/Index";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function SuratEditorPage() {
    const router = useRouter();

    // --- STATES: METADATA ---
    const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
    const [attachments, setAttachments] = useState<File[]>([]);
    const [penandatangan, setPenandatangan] = useState("");
    const [template, setTemplate] = useState("nota");
    const [tanggal, setTanggal] = useState("");
    const [nomorSurat, setNomorSurat] = useState("");
    const [perihal, setPerihal] = useState("");

    // --- STATE: VALIDATION ---
    const [showErrors, setShowErrors] = useState(false);

    // --- LOGIC: PDF PREVIEW URL ---
    const previewUrl = useMemo(() => {
        const pdfFile = attachedFiles.find(f => f.type === "application/pdf");
        if (pdfFile) return URL.createObjectURL(pdfFile);
        return null;
    }, [attachedFiles]);

    // Cleanup URL to prevent memory leaks
    useEffect(() => {
        return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
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

    // --- ACTION: SUBMIT HANDLER ---
    const handleSubmit = () => {
        if (!isFormComplete) {
            setShowErrors(true);
            toast.error("Tidak Lengkap", {
                description: "Silakan lengkapi berkas dan seluruh metadata naskah.",
            });
            return;
        }

        // Simulasi Proses Kirim
        toast.success("Pengajuan Berhasil", {
            description: "Naskah sedang diteruskan ke otoritas penandatangan.",
        });

        // Logika pengiriman data ke backend bisa diletakkan di sini
        console.log("Data Terkirim:", {
            nomorSurat,
            perihal,
            tanggal,
            penandatangan,
            mainDocument: attachedFiles[0]?.name,
            attachmentsCount: attachments.length,
            attachmentsList: attachments.map(a => a.name)
        });
    };

    return (
        <div className="flex flex-col min-h-screen lg:h-[calc(100vh-80px)] lg:overflow-hidden -m-4 md:-m-8 bg-surface transition-all duration-500">

            {/* --- 1. HEADER ACTION BAR --- */}
            <header className="sticky top-0 lg:relative flex items-center justify-between px-4 md:px-8 py-4 bg-surface/80 backdrop-blur-md z-30 shadow-sm border-b border-border-main/5 shrink-0">
                <div className="flex items-center gap-3 md:gap-4 min-w-0">
                    <Button variant="inset" className="!p-2 h-9 w-9 md:h-10 md:w-10 shrink-0" onClick={() => router.back()}>
                        <ChevronLeft size={18} />
                    </Button>
                    <div className="min-w-0">
                        <Typography variant="heading" className="text-xs md:text-sm !font-black uppercase italic tracking-tighter truncate">
                            <span className="text-primary-base">Finalisasi</span>
                        </Typography>
                        <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${isFormComplete ? 'bg-success-base' : 'bg-warning-base'} animate-pulse`} />
                            <Typography variant="caption" color={isFormComplete ? "success" : "warning"} className="font-black text-[8px] md:text-[9px] tracking-widest opacity-80 uppercase">
                                {isFormComplete ? "Ready for TTE" : "Awaiting Data"}
                            </Typography>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        className={`!bg-primary-base text-white gap-2 px-4 md:px-7 h-9 md:h-11 rounded-main shadow-neumorph transition-all active:scale-95 ${!isFormComplete && 'opacity-40 grayscale-50'}`}
                    >
                        <Send size={16} />
                        <span className="hidden sm:inline text-[10px] font-black uppercase tracking-[0.1em] text-white">Ajukan TTE</span>
                    </Button>
                </div>
            </header>

            {/* --- 2. MAIN CONTENT: 2 GRID SYSTEM --- */}
            <div className="flex flex-1 flex-col lg:flex-row lg:overflow-hidden">

                {/* GRID 1: WORKSPACE AREA (LEFT/TOP) */}
                <main className="w-full lg:flex-1 p-4 md:p-8 flex flex-col items-center bg-surface-secondary/20 relative overflow-y-auto custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {previewUrl ? (
                            /* --- MODE A: PDF VIEW --- */
                            <motion.div
                                key="pdf" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                                className="w-full h-full max-w-[900px] flex flex-col gap-4"
                            >
                                <div className="flex items-center justify-between px-2 shrink-0">
                                    <Typography variant="overline" color="primary" className="flex items-center gap-2 !text-[10px]">
                                        <FileSearch size={14} /> Digital Preview Rendered
                                    </Typography>
                                    <Button variant="inset" onClick={() => setAttachedFiles([])} className="!p-2 h-8 w-8 text-danger-base rounded-lg shadow-sm">
                                        <RotateCcw size={14} />
                                    </Button>
                                </div>

                                <div className="w-full h-[500px] lg:h-full bg-white shadow-main rounded-main overflow-hidden relative border border-white/20 shrink-0 lg:shrink">
                                    <iframe src={`${previewUrl}#toolbar=0&view=FitH`} className="w-full h-full border-none" title="Naskah Preview" />
                                    <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/5 rounded-main" />
                                </div>
                            </motion.div>
                        ) : (
                            /* --- MODE B: CENTRAL UPLOADER --- */
                            <motion.div
                                key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                className={`flex-1 flex flex-col items-center justify-center w-full max-w-xl p-6 space-y-8 ${showErrors && !previewUrl ? 'animate-shake' : ''}`}
                            >
                                <div className="text-center space-y-3">
                                    <Typography variant="heading" className="!text-lg">Siapkan <span className="text-primary-base">Naskah Dinas</span></Typography>
                                    <Typography variant="body" className="text-[11px] opacity-60 italic max-w-xs mx-auto leading-relaxed">
                                        Unggah naskah PDF asli untuk memulai proses verifikasi TTE.
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

                {/* GRID 2: ACTION SIDEBAR (RIGHT/BOTTOM) */}
                <aside className="w-full lg:w-[400px] bg-surface p-6 md:p-10 flex flex-col gap-8 z-10 shadow-[-15px_0_40px_rgba(0,0,0,0.02)] border-t lg:border-t-0 lg:border-l border-border-main/5 overflow-y-auto custom-scrollbar">
                    <section className="space-y-6">
                        <Typography variant="overline" color="muted" className="flex items-center gap-2 italic text-[10px]">
                            <Zap size={12} /> Dokumen Metadata
                        </Typography>

                        <div className="grid grid-cols-1 gap-6">
                            {/* Jenis & Pejabat */}
                            <div className="space-y-4">
                                {/* Jenis Naskah */}
                                <div className="space-y-2">
                                    <Typography variant="caption" className="ml-1 !font-black uppercase tracking-tighter text-[10px]">
                                        Jenis Naskah
                                    </Typography>
                                    <Select
                                        searchable
                                        options={[
                                            { label: "Nota Dinas", value: "nota" },
                                            { label: "Undangan", value: "undangan" }
                                        ]}
                                        value={template}
                                        onChange={(v) => {
                                            setTemplate(v as string);
                                            if (showErrors) setShowErrors(false);
                                        }}
                                        // Penambahan Logic Error
                                        className={`transition-all duration-300 
                                            ${showErrors && !template
                                                ? "ring-1 ring-danger-base/50 shadow-[inset_0_0_9px_rgba(244,63,94,0.4)] rounded-main"
                                                : ""
                                            }`}
                                    />
                                </div>

                                {/* Penandatangan */}
                                <div className="space-y-2">
                                    <Typography variant="caption" className="ml-1 !font-black uppercase tracking-tighter text-[10px]">
                                        Penandatangan
                                    </Typography>
                                    <Select
                                        searchable
                                        options={[
                                            { label: "Bupati Tubaba", value: "bupati" },
                                            { label: "Sekretaris Daerah", value: "sekda" }
                                        ]}
                                        placeholder="Pilih Pejabat..."
                                        value={penandatangan}
                                        onChange={(v) => {
                                            setPenandatangan(v as string);
                                            setShowErrors(false);
                                        }}
                                        // Penambahan Logic Error
                                        className={`transition-all duration-300
                                            ${showErrors && !penandatangan
                                                ? "ring-1 ring-danger-base/50 shadow-[inset_0_0_10px_rgba(244,63,94,0.4)] rounded-main"
                                                : ""
                                            }`}
                                    />
                                </div>
                            </div>

                            {/* Nomor & Tanggal */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Typography variant="caption" className="ml-1 !font-black uppercase tracking-tighter text-[10px] flex items-center gap-1.5"><Hash size={10} /> Nomor Surat</Typography>
                                    <input
                                        type="text" placeholder="000/00/..."
                                        value={nomorSurat} onChange={(e) => setNomorSurat(e.target.value)}
                                        className={`w-full h-11 px-4 rounded-main bg-surface-secondary/20 transition-all focus:outline-none text-[11px] font-bold italic border-none 
                                            ${showErrors && !nomorSurat.trim()
                                                ? 'ring-1 ring-danger-base/50 shadow-inner shadow-danger-base/10'
                                                : 'shadow-neumorph-inset'
                                            }`}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Typography variant="caption" className="ml-1 !font-black uppercase tracking-tighter text-[10px] flex items-center gap-1.5"><Calendar size={10} /> Tanggal</Typography>
                                    <input
                                        type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)}
                                        className={`w-full h-11 px-4 rounded-main bg-surface-secondary/20 transition-all focus:outline-none text-[11px] font-bold border-none ${showErrors && !tanggal ? 'ring-1 ring-danger-base/50 shadow-inner shadow-danger-base/10' : 'shadow-neumorph-inset'}`}
                                    />
                                </div>
                            </div>

                            {/* Perihal */}
                            <div className="space-y-2">
                                <Typography variant="caption" className="ml-1 !font-black uppercase tracking-tighter text-[10px] flex items-center gap-1.5"><AlignLeft size={10} /> Perihal Surat</Typography>
                                <textarea
                                    placeholder="Tuliskan perihal naskah dinas secara singkat..."
                                    value={perihal} onChange={(e) => setPerihal(e.target.value)} rows={3}
                                    className={`w-full p-5 rounded-main bg-surface-secondary/20 transition-all focus:outline-none text-[11px] font-bold italic resize-none border-none leading-relaxed ${showErrors && !perihal.trim() ? 'ring-1 ring-danger-base/50 shadow-inner shadow-danger-base/10' : 'shadow-neumorph-inset'}`}
                                />
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <Typography variant="overline" color="muted" className="flex items-center gap-2 italic text-[10px]">
                                <Paperclip size={12} /> Berkas Lampiran
                            </Typography>
                            <Badge variant="outline" color="primary" className="text-[8px] px-2 py-0.5">
                                Opsional
                            </Badge>
                        </div>

                        <FileUploader
                            label="Lampiran Pendukung"
                            description="Unggah dokumen pendukung atau lampiran"
                            accept=".pdf"
                            maxFiles={1} // Mengizinkan hingga 5 lampiran
                            maxSize={20}   // Batas ukuran per file 2MB
                            onFilesSelected={(files) => setAttachments(prev => [...prev, ...files])}
                            onAbort={(file) => setAttachments(prev => prev.filter(f => f.name !== file.name))}
                            className="shadow-neumorph bg-surface-secondary/10 border-dashed border-border-main/10 rounded-2xl p-2"
                        />
                    </section>

                    {/* Info Footer */}
                    <footer className="mt-auto pt-4 border-t border-border-main/5">
                        <Card variant="inset" className="bg-info-base/5 !border-none p-5 space-y-2 rounded-main">
                            <Typography variant="caption" color="info" className="flex items-center gap-2 !font-black uppercase italic text-[10px]"><Info size={12} /> Panduan Keamanan</Typography>
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