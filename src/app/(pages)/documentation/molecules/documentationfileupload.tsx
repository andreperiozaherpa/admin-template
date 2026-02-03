"use client";

import React, { useState } from "react";
import {
    FileUploader,
    Card,
    Badge,
    Typography,
    Button
} from "@/components/ui/Index";
import {
    UploadCloud,
    Code2,
    MoveUpRight,
    Zap,
    Paperclip,
    Sparkles,
    ShieldCheck,
    RefreshCcw
} from "lucide-react";
import { motion } from "framer-motion";

export const DocumentationFileUpload = () => {
    const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

    return (
        <section id="file-uploader" className="space-y-6">
            {/* --- SECTION HEADER --- */}
            <div className="flex items-center gap-2 text-[var(--theme-base)] transition-colors">
                <UploadCloud size={20} />
                <Typography variant="heading" className="!text-text-primary">
                    Attachment & Protocol Upload
                </Typography>
            </div>

            <Card padding="lg" variant="standard">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

                    {/* SISI KIRI: VISUAL SHOWCASE (INTERACTIVE) */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="flex items-center justify-between">
                            <Badge variant="soft" color="primary">Tactile Dropzone</Badge>
                            <div className="flex items-center gap-2">
                                <Typography variant="caption" color="muted">Status:</Typography>
                                <Badge variant="soft" color={attachedFiles.length > 0 ? "success" : "info"}>
                                    {attachedFiles.length > 0 ? "Files Detected" : "Idle State"}
                                </Badge>
                            </div>
                        </div>

                        {/* Interactive Instance */}
                        <div className="max-w-md mx-auto w-full">
                            <FileUploader
                                label="Lampiran Naskah Dinas"
                                description="Tarik naskah pendukung atau klik untuk mencari"
                                accept=".pdf,.doc,.docx"
                                maxSize={10}
                                maxFiles={3}
                                onFilesSelected={(files) => setAttachedFiles(prev => [...prev, ...files])}
                                className="shadow-neumorph bg-surface/50 rounded-[18px]"
                            />
                        </div>

                        {/* Reset Control */}
                        {attachedFiles.length > 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center">
                                <Button
                                    variant="expel"
                                    onClick={() => setAttachedFiles([])}
                                    className="text-[9px] font-black uppercase tracking-widest gap-2"
                                >
                                    <RefreshCcw size={12} /> Reset Protocol
                                </Button>
                            </motion.div>
                        )}
                    </div>

                    {/* SISI KANAN: USAGE GUIDE */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-2 text-text-muted px-1">
                            <Code2 size={14} />
                            <Typography variant="overline">Usage Guide</Typography>
                        </div>

                        <Card variant="inset" padding="md" className="relative group bg-surface-secondary/50 border-none overflow-hidden">
                            <pre className="text-[10px] font-medium leading-relaxed font-mono text-text-secondary whitespace-pre overflow-x-auto selection:bg-[var(--theme-base)]/30">
                                {`FILE UPLOADER API (Tubaba 2026):
label       : string (Judul Protokol)
accept      : string (Format File: .pdf, .jpg)
maxSize     : number (Limit MB, Default: 5)
maxFiles    : number (Limit Jumlah File)
isSimulated : boolean (Progress Otomatis)

1. BASIC IMPLEMENTATION
<FileUploader 
  label="Lampiran"
  accept=".pdf"
  onFilesSelected={(f) => handleUpload(f)}
/>

2. CONTROLLED SYNC (NON-SIMULATED)
<FileUploader 
  isSimulated={false}
  uploadProgress={{ "doc.pdf": 80 }}
  uploadErrors={{ "err.exe": "Forbidden" }}
/>`}
                            </pre>
                            <div className="absolute -top-12 -right-12 w-24 h-24 bg-[var(--theme-base)]/10 blur-[40px] rounded-full pointer-events-none" />
                        </Card>

                        {/* FEATURES LIST */}
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center gap-2 text-text-muted">
                                <MoveUpRight size={14} />
                                <Typography variant="overline">Core Systems</Typography>
                            </div>
                            <ul className="space-y-4 px-1">
                                <li className="flex gap-3">
                                    <Sparkles size={14} className="shrink-0 text-warning-base" />
                                    <div className="space-y-1">
                                        <Typography variant="caption" className="!font-black block leading-none">AI Integration Ready</Typography>
                                        <Typography variant="body" className="text-[10px] opacity-60 italic leading-tight">
                                            Komponen siap menerima protokol AI untuk pemindaian teks otomatis.
                                        </Typography>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <ShieldCheck size={14} className="shrink-0 text-success-base" />
                                    <div className="space-y-1">
                                        <Typography variant="caption" className="!font-black block leading-none">Security Validation</Typography>
                                        <Typography variant="body" className="text-[10px] opacity-60 italic leading-tight">
                                            Pengecekan otomatis terhadap integritas berkas dan batas memori.
                                        </Typography>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <Paperclip size={14} className="shrink-0 text-info-base" />
                                    <div className="space-y-1">
                                        <Typography variant="caption" className="!font-black block leading-none">Multi-Stack Queue</Typography>
                                        <Typography variant="body" className="text-[10px] opacity-60 italic leading-tight">
                                            Antrian unggah simultan dengan pelacakan progres individu.
                                        </Typography>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </Card>
        </section>
    );
};