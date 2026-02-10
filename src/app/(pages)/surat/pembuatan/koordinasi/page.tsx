"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    ChevronLeft,
    CheckCircle2,
    Fingerprint,
    QrCode,
    GitMerge,
    Lock,
    Clock,
    AlertCircle,
    XCircle,
    RefreshCcw,
    ListChecks,
    FileEdit,
    Trophy,
    Stamp
} from "lucide-react";
import {
    Button,
    Typography,
    Card,
    Badge,
    Avatar,
    Modal,
} from "@/components/ui/Index";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import dynamic from 'next/dynamic';

// Import Type untuk Ref
import { PdfEditorRef } from '@/components/ui/organisms/PdfEditor';

interface WorkflowStep {
    id: number;
    id_user: string;
    name: string;
    role: string;
    status: string; // Bisa diganti union type: 'completed' | 'current' | 'waiting' | 'revision'
    metadata: string | null; // Izinkan string ATAU null
    isTTE: boolean;
    noteTitle?: string; // Tanda tanya (?) berarti field ini OPSIONAL
    instructionPoints?: string[]; // Optional array of strings
}

// Dynamic Import untuk Komponen (SSR False agar canvas jalan)
const PdfEditor = dynamic(
    () => import('@/components/ui/organisms/PdfEditor').then((mod) => mod.PdfEditor),
    { ssr: false }
);

export default function KoordinasiTTEPage() {
    const router = useRouter();

    // --- STATE UTAMA ---
    const [isSigned, setIsSigned] = useState(false);

    // State untuk URL PDF Aktif (Agar bisa berubah setelah ditandatangani)
    const [activePdfUrl, setActivePdfUrl] = useState("/uploads/dokumen/laporan.pdf");

    // Ref ke Editor
    const pdfEditorRef = useRef<PdfEditorRef>(null);

    // --- STATE MODAL & REVISI ---
    const [showModal, setShowModal] = useState(false);
    const [showRevisionForm, setShowRevisionForm] = useState(false);
    const [revisionReason, setRevisionReason] = useState("");
    const [activeCorrection, setActiveCorrection] = useState<any>(null);

    /**
     * WORKFLOW DATA (Gunakan useState agar bisa di-update)
     */
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
            status: "current",
            metadata: null, // Sekarang valid karena tipe data: string | null
            isTTE: false
        },
        {
            id: 3,
            id_user: "USR-TBB-003",
            name: "Dr. Zaidir Alami",
            role: "Sekretaris Daerah",
            status: "waiting",
            metadata: null,
            isTTE: false,
            noteTitle: "Instruksi Sekretaris Daerah", // Valid karena tipe data: string | undefined
            instructionPoints: [
                "Margin penulisan kop surat tidak presisi (sesuaikan 3cm).",
                "Dasar hukum UU No. 1 Tahun 2026, belum dimasukkan ke konsideran.",
                "Lampiran koordinasi harus mencantumkan ID digital masing-masing bidang.",
            ]
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

    // Logika Label Tombol
    const currentActiveStep = workflowData.find(s => s.status === 'current' || s.status === 'revision');
    const isFinalTTE = currentActiveStep?.isTTE;
    const actionLabel = isFinalTTE ? "Verifikasi TTE" : "Paraf Koordinasi";

    /**
     * HANDLER: PROSES TANDA TANGAN
     * Menghubungkan tombol header dengan PdfEditor
     */
    const handleProcessSigning = async () => {
        if (pdfEditorRef.current) {
            // 1. Panggil handleSave dan tunggu FILE hasil balikan
            const signedFile = await pdfEditorRef.current.handleSave();

            if (signedFile) {
                // 2. Buat URL objek baru agar PDF di layar terupdate dengan tanda tangan
                const newObjectUrl = URL.createObjectURL(signedFile);
                setActivePdfUrl(newObjectUrl);

                // 3. Update Status Tombol
                setIsSigned(true);

                // 4. Update Workflow Secara Visual
                // Update Workflow Secara Visual
                setWorkflowData(prev => prev.map((step, index) => {
                    // 1. Logika untuk langkah yang SEDANG AKTIF (Current -> Completed)
                    if (step.status === 'current') {
                        return {
                            ...step,
                            status: 'completed', // Ubah status jadi selesai
                            metadata: `BSR-${Date.now().toString().slice(-6)}`
                        };
                    }

                    // 2. Logika untuk langkah BERIKUTNYA (Waiting -> Current)
                    // Kita cek apakah step SEBELUMNYA (index - 1) status aslinya adalah 'current'
                    const prevStep = prev[index - 1];

                    if (prevStep?.status === 'current' && step.status === 'waiting') {
                        return {
                            ...step,
                            status: 'current' // <--- BAGIAN INI YANG SEBELUMNYA HILANG
                        };
                    }

                    // 3. Jika bukan keduanya, kembalikan data apa adanya
                    return step;
                }));

                // Update khusus untuk demo: user 2 selesai, user 3 aktif
                setWorkflowData(prev => {
                    const newData = [...prev];
                    newData[1].status = "completed"; // Kadis Selesai
                    newData[1].metadata = "DIGITAL-SIG-VALID";
                    newData[2].status = "current";   // Sekda Aktif
                    return newData;
                });

                toast.success("Proses Berhasil", {
                    description: "Dokumen telah ditandatangani dan diteruskan ke tahap berikutnya."
                });
            }
        }
    };

    // Cleanup URL object saat unmount
    useEffect(() => {
        return () => {
            if (activePdfUrl && activePdfUrl.startsWith('blob:')) {
                URL.revokeObjectURL(activePdfUrl);
            }
        };
    }, [activePdfUrl]);

    return (
        <div className="flex flex-col min-h-screen lg:h-[calc(100vh-80px)] lg:overflow-hidden -m-4 md:-m-8 bg-surface">

            {/* --- HEADER PROTOKOL --- */}
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
                    <Button
                        variant="inset"
                        className="!bg-danger-base/5 text-danger-base border border-danger-base/10 gap-2 px-4 h-10 transition-all hover:bg-danger-base hover:text-white"
                        onClick={() => setShowRevisionForm(true)}
                    >
                        <FileEdit size={16} />
                        <Typography variant="caption" className="text-inherit">Revisi</Typography>
                    </Button>

                    <Button
                        variant="primary"
                        disabled={isSigned} // Disable jika sudah tanda tangan
                        className={`!bg-primary-base text-white gap-2 px-6 h-10 shadow-neumorph transition-all active:scale-95 ${isSigned ? 'opacity-50 grayscale' : ''}`}
                        onClick={handleProcessSigning} // Panggil Handler Baru
                    >
                        {isFinalTTE ? <Fingerprint size={16} /> : <Stamp size={16} />}
                        <Typography variant="caption" className="text-white">
                            {isSigned ? "Telah Diparaf" : actionLabel}
                        </Typography>
                    </Button>
                </div>
            </header>

            <div className="flex flex-1 flex-col md:grid md:grid-cols-[1.5fr_1fr] lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_420px] md:overflow-hidden">
                {/* --- CANVAS EDITOR (KIRI) --- */}
                <main className="flex-1 p-2 sm:p-3 md:p-4 bg-surface-secondary/20 relative overflow-hidden flex flex-col items-center">
                    <PdfEditor
                        ref={pdfEditorRef}
                        // Gunakan state activePdfUrl agar tampilan berubah real-time
                        fileUrl={activePdfUrl}
                        // Gunakan PNG transparan untuk hasil terbaik (Optional)
                        stampImg="/uploads/visualisasi/user.jpg"
                        signatureImg="/uploads/visualisasi/user.jpg"
                    />
                </main>

                {/* --- WORKFLOW TIMELINE (KANAN) --- */}
                <aside className="bg-surface p-5 lg:p-8 flex flex-col gap-6 shadow-[-10px_0_40px_rgba(0,0,0,0.02)] border-t md:border-t-0 md:border-l border-border-main/5 overflow-y-auto custom-scrollbar">
                    <Typography variant="overline" color="muted" className="flex items-center gap-2">
                        <GitMerge size={12} /> Alur Komando & Otoritas
                    </Typography>

                    <div className="relative">
                        <div className="space-y-0">
                            {workflowData.map((step, index) => {
                                // LOGIKA TAMPILAN INSTRUKSI
                                const supervisorStep = workflowData[index + 1];
                                const showNoteOnThisCard = step.status === 'revision' && supervisorStep?.instructionPoints;

                                return (
                                    <div key={step.id} className="relative pl-12 pb-10 last:pb-0">

                                        {/* DYNAMIC LINE CONNECTOR */}
                                        {index !== workflowData.length - 1 && (
                                            <div className={`absolute left-[23px] top-10 bottom-0 w-0.5 transition-colors duration-1000 ${step.status === 'completed' || step.status === 'verified' ? 'bg-success-base' :
                                                step.status === 'revision' ? 'bg-danger-base animate-pulse' : 'bg-border-main/10'
                                                }`} />
                                        )}

                                        {/* NODE POINT */}
                                        <div className="absolute left-0 top-1 w-12 h-12 flex items-center justify-center z-10">
                                            <div className={`relative w-4 h-4 rounded-full border-2 bg-surface transition-all duration-500 ${step.status === 'completed' || step.status === 'verified' ? 'border-success-base shadow-[0_0_12px_var(--success-base)]' :
                                                step.status === 'current' ? 'border-primary-base shadow-[0_0_15px_var(--primary-base)]' :
                                                    step.status === 'revision' ? 'border-danger-base shadow-[0_0_15px_var(--danger-base)]' : 'border-border-main'
                                                }`}>
                                                {(step.status === 'current' || step.status === 'revision') && (
                                                    <div className={`absolute inset-0 rounded-full animate-ping opacity-30 ${step.status === 'current' ? 'bg-primary-base' : 'bg-danger-base'
                                                        }`} />
                                                )}
                                                {step.status === 'verified' && <Trophy size={8} className="absolute inset-0 m-auto text-success-base" />}
                                            </div>
                                        </div>

                                        {/* CARD STEP */}
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
                                                    color={
                                                        step.status === 'verified' || step.status === 'completed' ? 'success' :
                                                            step.status === 'current' ? 'primary' :
                                                                step.status === 'revision' ? 'danger' : 'info'
                                                    }
                                                    className={`!text-[7px] font-black uppercase italic ${(step.status === 'current' || step.status === 'revision') && 'animate-pulse'}`}
                                                >
                                                    {step.status}
                                                </Badge>
                                            </div>

                                            {/* Instruksi Revisi */}
                                            {showNoteOnThisCard && (
                                                <div className="mt-4 p-3 bg-white/50 rounded-xl border border-danger-base/10 shadow-sm">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <XCircle size={12} className="text-danger-base" />
                                                        <Typography variant="overline" color="danger" className="text-[7px] opacity-80">
                                                            Pesan: {supervisorStep.noteTitle}
                                                        </Typography>
                                                    </div>
                                                    <Button
                                                        variant="primary"
                                                        className="w-full h-8 !bg-danger-base text-white gap-2 shadow-neumorph hover:scale-[1.01] transition-all"
                                                        onClick={() => { setActiveCorrection(supervisorStep); setShowModal(true); }}
                                                    >
                                                        <ListChecks size={12} />
                                                        <Typography variant="overline" className="text-[7px] text-white">Buka Instruksi Perbaikan</Typography>
                                                    </Button>
                                                </div>
                                            )}

                                            {/* Barcode Metadata (Paraf Valid) */}
                                            {(step.status === 'completed' || step.status === 'verified') && step.metadata && (
                                                <div className="mt-3 flex items-center gap-3 p-2 bg-surface rounded-xl border border-white/40 shadow-neumorph">
                                                    <QrCode size={20} className="opacity-30 text-success-base" />
                                                    <div className="min-w-0">
                                                        <Typography variant="overline" className="text-[7px] block opacity-40 leading-none mb-1">Checksum_Valid</Typography>
                                                        <Typography variant="caption" color="success" className="text-[8px] font-mono truncate">{step.metadata}</Typography>
                                                    </div>
                                                    <CheckCircle2 size={12} className="text-success-base ml-auto" />
                                                </div>
                                            )}

                                            {/* Indikator Penelaahan Aktif */}
                                            {step.status === 'current' && (
                                                <div className="mt-3 flex items-center gap-2 text-primary-base animate-pulse">
                                                    <Clock size={10} className="animate-spin" />
                                                    <Typography variant="overline" color="primary" className="text-[8px]">Validasi Berjalan...</Typography>
                                                </div>
                                            )}
                                        </Card>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <footer className="mt-auto p-4 bg-primary-base/5 rounded-[20px] border border-primary-base/10">
                        <Typography variant="body" className="text-[10px] leading-relaxed opacity-60 italic text-center">
                            Protokol Tubaba 2026: Status <span className="text-danger-base font-black">REVISION</span> membatalkan validasi level bawah secara otomatis demi integritas data.
                        </Typography>
                    </footer>
                </aside>
            </div>

            {/* --- MODAL DAN FORM REVISI (Sama seperti sebelumnya) --- */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="DAFTAR INSTRUKSI REVISI">
                {/* ... konten modal ... */}
                <div className="space-y-6">
                    <div className="p-4 bg-danger-base/5 rounded-main border border-danger-base/10 flex items-center gap-4">
                        <Avatar size="sm" src="/logotubaba.png" className="ring-2 ring-danger-base/20 shadow-sm" />
                        <div>
                            <Typography variant="overline" color="danger" className="text-[10px]">Pemberi Perintah:</Typography>
                            <Typography variant="caption" className="block font-black uppercase italic text-lg tracking-tighter">
                                {activeCorrection?.name}
                            </Typography>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Typography variant="overline" color="muted">Point-point Koreksi:</Typography>
                        {activeCorrection?.instructionPoints?.map((point: string, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex gap-3 p-3 bg-white/60 rounded-xl border border-white/40 shadow-sm"
                            >
                                <div className="h-5 w-5 rounded-full bg-danger-base text-white flex items-center justify-center text-[9px] font-black shrink-0">{i + 1}</div>
                                <Typography variant="body" className="text-[11px] leading-relaxed opacity-80">{point}</Typography>
                            </motion.div>
                        ))}
                    </div>

                    <Button variant="primary" className="w-full h-12 gap-2 shadow-neumorph" onClick={() => setShowModal(false)}>
                        <RefreshCcw size={16} />
                        <Typography variant="caption" className="text-white">Eksekusi Perbaikan Sekarang</Typography>
                    </Button>
                </div>
            </Modal>

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
                            placeholder="Contoh: Margin kiri kurang 1cm, dasar hukum poin 3 salah ketik..."
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
                                toast.success("Instruksi revisi berhasil dikirim ke pendraft");
                                setShowRevisionForm(false);
                            }}
                        >
                            <GitMerge size={16} />
                            <Typography variant="caption" className="text-white">Kirim Revisi</Typography>
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}