"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    ChevronLeft, CheckCircle2, Fingerprint, QrCode, GitMerge, Lock, Clock,
    AlertCircle, XCircle, RefreshCcw, ListChecks, FileEdit, Trophy, Stamp,
    ArrowUpRight // <-- TAMBAHAN: Import Icon ini
} from "lucide-react";
import {
    Button, Typography, Card, Badge, Avatar, Modal,
} from "@/components/ui/Index";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import dynamic from 'next/dynamic';

// IMPORT PENTING: PDFDocument dari pdf-lib untuk memproses file
import { PDFDocument } from "pdf-lib";

// Import Type untuk Ref dan EditorElement
import { PdfEditorRef, EditorElement } from '@/components/ui/organisms/PdfEditor';

// Interface Data Workflow
interface WorkflowStep {
    id: number;
    id_user: string;
    name: string;
    role: string;
    status: string;
    metadata: string | null;
    isTTE: boolean;
    noteTitle?: string;
    instructionPoints?: string[];
}

// Dynamic Import Komponen Editor
const PdfEditor = dynamic(
    () => import('@/components/ui/organisms/PdfEditor').then((mod) => mod.PdfEditor),
    { ssr: false }
);

export default function KoordinasiTTEPage() {
    const router = useRouter();

    // --- STATE UTAMA ---
    const [isSigned, setIsSigned] = useState(false);
    const [activePdfUrl, setActivePdfUrl] = useState("/uploads/dokumen/laporan.pdf");

    // Ref ke Editor
    const pdfEditorRef = useRef<PdfEditorRef>(null);

    // --- STATE MODAL INPUT REVISI (Untuk Pejabat Memberi Revisi) ---
    const [showRevisionForm, setShowRevisionForm] = useState(false);
    const [revisionReason, setRevisionReason] = useState("");

    // --- STATE MODAL LIHAT CATATAN (Untuk Pendraft Melihat Revisi) ---
    const [showNoteModal, setShowNoteModal] = useState(false); // <--- PERBAIKAN STATE
    const [selectedNote, setSelectedNote] = useState<{ title: string, points: string[] } | null>(null); // <--- TAMBAHAN STATE

    // Fungsi Helper untuk membuka catatan
    const handleOpenNote = (title: string, points: string[]) => {
        setSelectedNote({ title, points });
        setShowNoteModal(true);
    };

    // --- WORKFLOW DATA ---
    const [workflowData, setWorkflowData] = useState<WorkflowStep[]>([
        {
            id: 1,
            id_user: "USR-TBB-001",
            name: "Zaidir Alami",
            role: "Penyusun Naskah (Pendraft)",
            status: "completed",
            metadata: "BSR-DRFT-2026-X1",
            isTTE: false
        },
        {
            id: 2,
            id_user: "USR-TBB-042",
            name: "Irsyad, M.Kom",
            role: "Kepala Dinas Kominfo",
            status: "revision",
            metadata: null,
            isTTE: false
        },
        {
            id: 3,
            id_user: "USR-TBB-003",
            name: "Dr. Zaidir Alami",
            role: "Sekretaris Daerah",
            status: "current",
            metadata: null,
            isTTE: false,
            noteTitle: "Instruksi Sekretaris Daerah",
            instructionPoints: [
                "Margin penulisan kop surat tidak presisi (sesuaikan 3cm).",
                "Dasar hukum UU No. 1 Tahun 2026, belum dimasukkan ke konsideran.",
                "Lampiran koordinasi harus mencantumkan ID digital masing-masing bidang.",
                "Perbaiki ejaan pada paragraf kedua."
            ]
        },
        {
            id: 7,
            id_user: "USR-TBB-049",
            name: "nadir, M.Kom",
            role: "Wakil Bupati",
            status: "waiting",
            metadata: null,
            isTTE: false
        },
        {
            id: 4,
            id_user: "USR-TBB-000",
            name: "Bupati Tubaba",
            role: "Bupati Tulang Bawang Barat",
            status: "waiting",
            metadata: null,
            isTTE: true
        },
    ]);

    const currentActiveStep = workflowData.find(s => s.status === 'current' || s.status === 'revision');
    const isFinalTTE = currentActiveStep?.isTTE;
    const actionLabel = isFinalTTE ? "Verifikasi TTE" : "Paraf Koordinasi";

    // --- LOGIKA UTAMA PEMROSESAN PDF ---
    const handleProcessSigning = async () => {
        if (!pdfEditorRef.current) return;
        const elements = pdfEditorRef.current.getElements();

        if (elements.length === 0) {
            toast.error("Tambahkan tanda tangan atau stempel terlebih dahulu!");
            return;
        }

        const loadingId = toast.loading("Memproses dokumen digital...");

        try {
            if (activePdfUrl && activePdfUrl.startsWith('blob:')) {
                URL.revokeObjectURL(activePdfUrl);
            }

            const existingPdfBytes = await fetch(activePdfUrl).then(res => res.arrayBuffer());
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const pages = pdfDoc.getPages();

            for (const el of elements) {
                if (!el.image) continue;

                const imgBytes = await fetch(el.image).then(res => res.arrayBuffer());

                let image;
                try {
                    image = await pdfDoc.embedPng(imgBytes);
                } catch (e) {
                    try {
                        image = await pdfDoc.embedJpg(imgBytes);
                    } catch (err) {
                        console.error("Gagal embed gambar:", el.image);
                        continue;
                    }
                }

                let accumulatedHeight = 0;
                let targetPage = null;
                let pdfPageHeight = 0;
                let pageRatio = 1;

                for (let i = 0; i < pages.length; i++) {
                    const page = pages[i];
                    const { width, height } = page.getSize();
                    const ratio = width / 800;
                    const visualHeight = height / ratio;

                    if (el.y >= accumulatedHeight && el.y < (accumulatedHeight + visualHeight)) {
                        targetPage = page;
                        pdfPageHeight = height;
                        pageRatio = ratio;
                        break;
                    }
                    accumulatedHeight += visualHeight;
                }

                if (targetPage) {
                    const relativeY = el.y - accumulatedHeight;
                    const drawW = el.width * pageRatio;
                    const drawH = el.height * pageRatio;
                    const drawX = el.x * pageRatio;
                    const drawY = pdfPageHeight - (relativeY * pageRatio) - drawH;

                    targetPage.drawImage(image, {
                        x: drawX,
                        y: drawY,
                        width: drawW,
                        height: drawH,
                    });
                }
            }

            const pdfBytes = await pdfDoc.save();
            const signedBlob = new Blob([pdfBytes as any], { type: "application/pdf" });
            const signedFile = new File([signedBlob], `Signed_${Date.now()}.pdf`, { type: "application/pdf" });

            const newObjectUrl = URL.createObjectURL(signedFile);
            setActivePdfUrl(newObjectUrl);
            setIsSigned(true);

            pdfEditorRef.current.reset();

            toast.success("Dokumen berhasil ditandatangani!", { id: loadingId });

            setWorkflowData(prev => {
                const newData = prev.map((step, index) => {
                    if (step.status === 'current') {
                        return { ...step, status: 'completed', metadata: `BSR-${Date.now().toString().slice(-6)}` };
                    }
                    const prevStep = prev[index - 1];
                    if (prevStep?.status === 'current' && step.status === 'waiting') {
                        return { ...step, status: 'current' };
                    }
                    return step;
                });

                if (newData[1]) { newData[1].status = "completed"; newData[1].metadata = "DIGITAL-SIG-VALID"; }
                if (newData[2]) { newData[2].status = "current"; }

                return newData;
            });

        } catch (error) {
            console.error("Signing Error:", error);
            toast.error("Gagal memproses dokumen", { id: loadingId });
        }
    };

    useEffect(() => {
        return () => {
            if (activePdfUrl && activePdfUrl.startsWith('blob:')) {
                URL.revokeObjectURL(activePdfUrl);
            }
        };
    }, [activePdfUrl]);

    return (
        <div className="flex flex-col min-h-screen lg:h-[calc(100vh-80px)] lg:overflow-hidden -m-4 md:-m-8 bg-surface">

            {/* --- HEADER --- */}
            <header className="sticky top-0 lg:relative flex flex-col sm:flex-row items-center justify-between px-6 py-4 gap-4 bg-surface z-30 border-b border-border-main/5 shadow-sm">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <Button variant="inset" className="!p-2 h-10 w-10 shrink-0 shadow-neumorph" onClick={() => router.back()}>
                        <ChevronLeft size={18} />
                    </Button>
                    <div className="min-w-0">
                        <Typography variant="heading" className="text-sm">
                            Protokol <span className="text-primary-base">Hierarki Digital</span>
                        </Typography>
                        <Typography variant="overline" color="primary" className="flex items-center gap-1.5 mt-0.5 opacity-60 italic">
                            <Lock size={10} className="text-success-base" /> Quantum Secure Layer
                        </Typography>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <Button variant="inset" className="!bg-danger-base/5 text-danger-base border border-danger-base/10 gap-2 px-4 h-10 transition-all hover:bg-danger-base hover:text-white" onClick={() => setShowRevisionForm(true)}>
                        <FileEdit size={16} />
                        <Typography variant="caption" className="text-inherit">Revisi</Typography>
                    </Button>

                    <Button
                        variant="primary"
                        disabled={isSigned}
                        className={`!bg-primary-base text-white gap-2 px-6 h-10 shadow-neumorph transition-all active:scale-95 ${isSigned ? 'opacity-50 grayscale' : ''}`}
                        onClick={handleProcessSigning}
                    >
                        {isFinalTTE ? <Fingerprint size={16} /> : <Stamp size={16} />}
                        <Typography variant="caption" className="text-white">
                            {isSigned ? "Telah Diparaf" : actionLabel}
                        </Typography>
                    </Button>
                </div>
            </header>

            {/* --- LAYOUT GRID --- */}
            <div className="flex flex-1 flex-col md:grid md:grid-cols-[1.5fr_1fr] lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_420px] md:overflow-hidden">

                {/* KIRI: CANVAS EDITOR */}
                <main className="flex-1 p-2 sm:p-3 md:p-4 bg-surface-secondary/20 relative overflow-hidden flex flex-col items-center">
                    <PdfEditor
                        ref={pdfEditorRef}
                        fileUrl={activePdfUrl}
                        stampImg="/uploads/visualisasi/user.jpg"
                        signatureImg="/uploads/visualisasi/user.jpg"
                    />
                </main>

                {/* KANAN: WORKFLOW TIMELINE */}
                <aside className="bg-surface p-5 lg:p-8 flex flex-col gap-6 shadow-[-10px_0_40px_rgba(0,0,0,0.02)] border-t md:border-t-0 md:border-l border-border-main/5 overflow-y-auto custom-scrollbar">
                    <Typography variant="overline" color="muted" className="flex items-center gap-2">
                        <GitMerge size={12} /> Alur Komando & Otoritas
                    </Typography>

                    <div className="relative">
                        <div className="space-y-0">
                            {workflowData.map((step, index) => {
                                const supervisorStep = workflowData[index + 1];
                                const showNoteOnThisCard = step.status === 'revision' && supervisorStep?.instructionPoints;

                                return (
                                    <div key={step.id} className="relative pl-12 pb-10 last:pb-0">
                                        {/* GARIS PENGHUBUNG */}
                                        {index !== workflowData.length - 1 && (
                                            <div className={`absolute left-[23px] top-10 bottom-0 w-0.5 transition-colors duration-1000 ${step.status === 'completed' || step.status === 'verified' ? 'bg-success-base' :
                                                step.status === 'revision' ? 'bg-danger-base animate-pulse' : 'bg-border-main/10'
                                                }`} />
                                        )}

                                        {/* BULATAN STATUS */}
                                        <div className="absolute left-0 top-1 w-12 h-12 flex items-center justify-center z-10">
                                            <div className={`relative w-4 h-4 rounded-full border-2 bg-surface transition-all duration-500 ${step.status === 'completed' || step.status === 'verified' ? 'border-success-base shadow-[0_0_12px_var(--success-base)]' :
                                                step.status === 'current' ? 'border-primary-base shadow-[0_0_15px_var(--primary-base)]' :
                                                    step.status === 'revision' ? 'border-danger-base shadow-[0_0_15px_var(--danger-base)]' : 'border-border-main'
                                                }`}>
                                                {(step.status === 'current' || step.status === 'revision') && (
                                                    <div className={`absolute inset-0 rounded-full animate-ping opacity-30 ${step.status === 'current' ? 'bg-primary-base' : 'bg-danger-base'}`} />
                                                )}
                                                {step.status === 'verified' && <Trophy size={8} className="absolute inset-0 m-auto text-success-base" />}
                                            </div>
                                        </div>

                                        {/* KARTU PEJABAT */}
                                        <Card
                                            variant={step.isTTE ? "standard" : "inset"}
                                            className={`p-4 rounded-[24px] !border-none relative transition-all duration-500 ${step.isTTE ? 'glass-effect !bg-glass-main shadow-main' : 'shadow-neumorph-inset bg-surface-secondary/20'
                                                } ${step.status === 'revision' ? 'ring-2 ring-danger-base/20 bg-danger-base/5' : ''} ${step.status === 'current' ? 'ring-2 ring-primary-base/20' : ''}`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex gap-3 items-center min-w-0">
                                                    {step.isTTE && <Avatar size="sm" src="/logotubaba.png" className="shadow-neumorph ring-2 ring-white" />}
                                                    <div className="min-w-0">
                                                        <Typography variant="caption" className="block truncate">{step.name}</Typography>
                                                        <div className="flex items-center gap-2">
                                                            <Typography variant="overline" color="muted" className="text-[7px] opacity-40 uppercase">{step.id_user}</Typography>
                                                            <Typography variant="caption" color="muted" className="text-[9px] opacity-60 block truncate lowercase italic">{step.role}</Typography>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Badge
                                                    variant="soft"
                                                    color={step.status === 'verified' || step.status === 'completed' ? 'success' : step.status === 'current' ? 'primary' : step.status === 'revision' ? 'danger' : 'info'}
                                                    className={`!text-[7px] font-black uppercase italic ${(step.status === 'current' || step.status === 'revision') && 'animate-pulse'}`}
                                                >
                                                    {step.status}
                                                </Badge>
                                            </div>

                                            {/* --- LOGIKA TOMBOL REVISI (PERBAIKAN UTAMA) --- */}
                                            {showNoteOnThisCard && (
                                                <Button
                                                    variant="inset"
                                                    className="mt-4 w-full !justify-start gap-3 border border-danger-base/20 !bg-danger-base/5 hover:!bg-danger-base/10 group transition-all h-auto py-3 px-4"

                                                    // --- PERBAIKAN LOGIKA DISINI ---
                                                    // JANGAN ambil dari 'step' (Kadis), tapi ambil dari 'supervisorStep' (Sekda)
                                                    onClick={() => handleOpenNote(
                                                        supervisorStep?.noteTitle || "Instruksi Perbaikan",
                                                        supervisorStep?.instructionPoints || []
                                                    )}
                                                >
                                                    <div className="p-1.5 bg-danger-base/10 rounded-lg text-danger-base group-hover:scale-110 transition-transform">
                                                        <AlertCircle size={14} />
                                                    </div>
                                                    <div className="text-left flex-1">
                                                        <Typography variant="overline" className="text-danger-base block leading-none font-black text-[9px]">
                                                            Lihat Catatan Revisi
                                                        </Typography>

                                                        {/* PERBAIKAN LABEL JUMLAH POIN JUGA */}
                                                        <Typography variant="caption" className="text-[8px] opacity-60 uppercase tracking-tighter">
                                                            {supervisorStep?.instructionPoints?.length || 0} Poin Instruksi
                                                        </Typography>
                                                    </div>
                                                    <ArrowUpRight size={14} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                                </Button>
                                            )}
                                        </Card>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </aside>
            </div>

            {/* --- MODAL INPUT REVISI (Formulir Pejabat) --- */}
            <Modal
                isOpen={showRevisionForm}
                onClose={() => setShowRevisionForm(false)}
                title="FORMULIR INSTRUKSI REVISI"
            >
                <div className="space-y-6">
                    <div className="p-4 bg-primary-base/5 rounded-main border border-primary-base/10 flex items-center gap-4">
                        <AlertCircle size={24} className="text-primary-base opacity-60" />
                        <div>
                            <Typography variant="overline" color="primary" className="text-[10px]">Catatan Protokol:</Typography>
                            <Typography variant="body" className="block text-xs opacity-70 italic">
                                Berikan instruksi spesifik agar draft naskah dapat segera diperbaiki oleh pendraft.
                            </Typography>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Typography variant="overline" color="muted">Alasan Revisi / Instruksi:</Typography>
                        <textarea
                            className="w-full h-32 p-4 rounded-xl shadow-neumorph-inset border border-border-main/10 bg-surface-secondary/20 focus:ring-2 focus:ring-primary-base/20 focus:border-primary-base outline-none transition-all text-xs font-tubaba"
                            placeholder="Contoh: Margin kiri kurang 1cm..."
                            value={revisionReason}
                            onChange={(e) => setRevisionReason(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="ghost" onClick={() => setShowRevisionForm(false)}>
                            <Typography variant="caption">Batal</Typography>
                        </Button>
                        <Button
                            variant="primary"
                            className="!bg-danger-base text-white shadow-neumorph gap-2"
                            onClick={() => {
                                if (!revisionReason) return toast.error("Alasan revisi wajib diisi!");
                                toast.success("Instruksi revisi berhasil dikirim");
                                setShowRevisionForm(false);
                            }}
                        >
                            <GitMerge size={16} />
                            <Typography variant="caption" className="text-white">Kirim Revisi</Typography>
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* --- MODAL LIHAT DETAIL INSTRUKSI (Untuk Pendraft) --- */}
            <Modal
                isOpen={showNoteModal}
                onClose={() => setShowNoteModal(false)}
                title={selectedNote?.title || "Detail Instruksi"}
            >
                <div className="space-y-6">
                    <div className="p-4 bg-danger-base/5 rounded-2xl border border-danger-base/10 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-danger-base/10 flex items-center justify-center text-danger-base shadow-sm">
                            <FileEdit size={24} />
                        </div>
                        <div>
                            <Typography variant="overline" className="text-danger-base font-black italic">
                                Perhatian Pendraft
                            </Typography>
                            <Typography variant="body" className="block text-[11px] opacity-70 italic leading-tight">
                                Mohon segera lakukan perbaikan pada dokumen sesuai dengan poin-poin instruksi di bawah ini.
                            </Typography>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Typography variant="overline" color="muted" className="ml-1 tracking-[0.2em]">
                            Daftar Koreksi:
                        </Typography>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {selectedNote?.points.map((point, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-4 bg-surface-secondary/50 rounded-xl border border-border-main/5 flex gap-4 hover:border-danger-base/20 transition-colors shadow-sm"
                                >
                                    <div className="font-black text-danger-base opacity-30 italic text-xs">
                                        {(idx + 1).toString().padStart(2, '0')}
                                    </div>
                                    <Typography variant="caption" className="text-text-primary leading-relaxed text-xs">
                                        {point}
                                    </Typography>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <Button
                        variant="primary"
                        className="w-full h-12 !bg-primary-base shadow-neumorph uppercase font-black tracking-widest text-[10px] text-white"
                        onClick={() => setShowNoteModal(false)}
                    >
                        Saya Mengerti, Perbaiki Sekarang
                    </Button>
                </div>
            </Modal>
        </div>
    );
}