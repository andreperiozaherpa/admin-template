"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, X, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { Typography, Button } from "@/components/ui/Index";
import { toast } from "sonner";

// --- INTERFACES ---
interface FileStatus {
    id: string;
    file: File;
    progress: number;
    status: "uploading" | "completed" | "error";
    errorMessage?: string;
}

interface FileUploaderProps {
    label?: string;
    description?: string;
    accept?: string;
    maxSize?: number;
    maxFiles?: number;
    isSimulated?: boolean;
    folder?: string;
    uploadProgress?: Record<string, number>;
    uploadErrors?: Record<string, string>;
    onFilesSelected?: (files: File[]) => void;
    onAbort?: (file: File) => void;
    className?: string;
}

export const FileUploader = ({
    label,
    description = "Lepas berkas di sini atau klik untuk mencari",
    accept = "*",
    maxSize = 5,
    maxFiles = 3,
    isSimulated = true,
    folder = "uploads",
    uploadProgress = {},
    uploadErrors = {},
    onFilesSelected,
    onAbort,
    className = ""
}: FileUploaderProps) => {
    const [fileList, setFileList] = useState<FileStatus[]>([]);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const intervalsRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

    useEffect(() => {
        return () => Object.values(intervalsRef.current).forEach(clearInterval);
    }, []);

    // --- LOGIC: SYNC STATUS ---
    useEffect(() => {
        if (!isSimulated) {
            setFileList(prev => prev.map(item => {
                const externalError = uploadErrors[item.file.name];
                const externalProgress = uploadProgress[item.file.name];

                if (externalError) {
                    return { ...item, status: "error", errorMessage: externalError, progress: 0 };
                }

                if (externalProgress !== undefined) {
                    return {
                        ...item,
                        progress: externalProgress,
                        status: externalProgress >= 100 ? "completed" : "uploading"
                    };
                }
                return item;
            }));
        }
    }, [uploadProgress, uploadErrors, isSimulated]);

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    };

    const updateFileStatus = useCallback((id: string, progress: number, status: FileStatus["status"]) => {
        setFileList(prev => prev.map(item =>
            item.id === id ? { ...item, progress, status } : item
        ));
    }, []);

    const simulateUpload = useCallback(async (id: string, file: File) => {
        let currentProgress = 0;
        if (intervalsRef.current[id]) clearInterval(intervalsRef.current[id]);

        // Kita jalankan progress bar simulasi agar visual tetap taktil
        intervalsRef.current[id] = setInterval(() => {
            currentProgress += Math.floor(Math.random() * 10) + 2;
            if (currentProgress >= 90) {
                clearInterval(intervalsRef.current[id]);
            } else {
                updateFileStatus(id, currentProgress, "uploading");
            }
        }, 300);

        try {
            // PROSES KIRIM FILE KE SERVER
            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", folder);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            let result;
            try {
                result = await response.json();
            } catch (e) {
                result = { error: "Format respon server tidak valid" };
            }

            if (response.ok) {
                clearInterval(intervalsRef.current[id]);
                updateFileStatus(id, 100, "completed");

                toast.success("File Berhasil", {
                    description: `File "${file.name}" telah diamankan di server.`,
                    duration: 4000,
                    position: "top-right"
                });
            } else {
                throw new Error(result.error || "Gagal menyimpan file");
            }
        } catch (error: any) {
            clearInterval(intervalsRef.current[id]);
            updateFileStatus(id, 0, error.message ? "error" : "error");

            toast.error("Protokol Gagal", {
                description: `Gagal mengunggah ${file.name}. Silakan periksa koneksi.`,
                duration: 5000,
                position: "top-right"
            });
            console.error("Upload Error:", error);
        }
    }, [updateFileStatus]);

    const handleFiles = (incomingFiles: File[]) => {
        setGlobalError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";

        const remainingSlots = maxFiles - fileList.length;
        if (remainingSlots <= 0) {
            setGlobalError(`Limit ${maxFiles} files reached.`);
            return;
        }

        const filesToAdd: FileStatus[] = [];
        incomingFiles.forEach(f => {
            const isSizeValid = f.size <= maxSize * 1024 * 1024;
            const isDuplicate = fileList.some(item => item.file.name === f.name);

            if (isSizeValid && !isDuplicate && filesToAdd.length < remainingSlots) {
                const uniqueId = `${f.name}-${Date.now()}`;
                filesToAdd.push({ id: uniqueId, file: f, progress: 0, status: "uploading" });
            }
        });

        if (filesToAdd.length === 0) return;

        setFileList(prev => [...prev, ...filesToAdd]);
        onFilesSelected?.(filesToAdd.map(item => item.file));
        if (isSimulated) {
            filesToAdd.forEach(item => {
                // Sekarang kirim item.id DAN item.file
                simulateUpload(item.id, item.file);
            });
        }
    };

    const handleRemove = (id: string, file: File) => {
        if (intervalsRef.current[id]) clearInterval(intervalsRef.current[id]);
        onAbort?.(file);
        setFileList(prev => prev.filter(item => item.id !== id));
    };

    return (
        <div className={`flex flex-col p-2 w-full ${className}`}>
            {/* Header Info */}
            <div className="flex justify-between items-end p-2">
                {label && (
                    <Typography variant="overline" color="muted">
                        {label}
                    </Typography>
                )}
                <Typography variant="caption" color="muted">
                    {fileList.length} / {maxFiles}
                </Typography>
            </div>

            {/* DROPZONE: Quantum Style */}
            <motion.div
                tabIndex={0} role="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files) handleFiles(Array.from(e.dataTransfer.files)); }}
                whileTap={{ scale: 0.995 }}
                className={`
                    relative cursor-pointer flex flex-col items-center justify-center gap-4 p-8 rounded-[32px] border-2 border-dashed transition-all duration-500 outline-none
                    ${isDragging
                        ? "border-[var(--theme-base)] bg-[var(--theme-base)]/5 shadow-[0_0_20px_rgba(var(--theme-base-rgb),0.1)]"
                        : "border-border-main/10 bg-surface-secondary/20 hover:border-[var(--theme-base)]/30 hover:bg-surface "}
                `}
            >
                <input type="file" ref={fileInputRef} className="hidden" multiple onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))} accept={accept} />

                <div className={`
                    p-4 rounded-2xl transition-all duration-500
                    ${isDragging ? "bg-[var(--theme-base)] text-white shadow-[0_0_15px_var(--theme-glow)]" : "bg-surface shadow-neumorph text-text-muted"}
                `}>
                    <UploadCloud size={24} />
                </div>

                <div className="text-center space-y-1">
                    <Typography variant="body" className="font-black italic uppercase tracking-tight">
                        {isDragging ? "Release to Protocol" : description}
                    </Typography>
                    <Typography variant="caption" color="muted" className="lowercase italic opacity-60">
                        {accept} • Max {maxSize}MB
                    </Typography>
                </div>
            </motion.div>

            {/* ERROR NOTIFICATION */}
            <AnimatePresence>
                {globalError && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2 px-3 py-2 bg-danger-base/10 border border-danger-base/20 rounded-xl text-danger-base">
                        <AlertCircle size={14} className="shrink-0" />
                        <Typography variant="caption" className="font-black">{globalError}</Typography>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* PROGRESS LIST: Tactile Inset Style */}
            <div className="space-y-3 mt-2">
                <AnimatePresence>
                    {fileList.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="p-4 bg-surface-secondary/10 border border-white/5 rounded-[24px] shadow-neumorph-inset"
                        >
                            <div className="flex items-center justify-between mb-3 gap-3">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className={`
                                        p-2.5 rounded-xl shrink-0 shadow-sm
                                        ${item.status === 'completed' ? 'bg-success-base/10 text-success-base' :
                                            item.status === 'error' ? 'bg-danger-base/10 text-danger-base' :
                                                'bg-[var(--theme-base)]/10 text-[var(--theme-base)]'}
                                    `}>
                                        <FileText size={16} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <Typography variant="body" truncate className="font-black italic uppercase text-[11px] leading-none mb-1">
                                            {item.file.name}
                                        </Typography>
                                        <Typography variant="caption" color="muted" className="italic opacity-50">
                                            {item.status === 'error'
                                                ? (item.errorMessage || "Protocol Error")
                                                : `${formatSize(item.file.size)} • ${Math.round(item.progress)}%`}
                                        </Typography>
                                    </div>
                                </div>

                                <div className="shrink-0">
                                    <Button
                                        variant="inset"
                                        className={`!p-2 rounded-lg ${item.status === 'completed' ? 'text-success-base' : 'text-text-muted hover:text-danger-base'}`}
                                        onClick={() => handleRemove(item.id, item.file)}
                                    >
                                        {item.status === 'completed' ? <CheckCircle2 size={16} /> : <X size={16} />}
                                    </Button>
                                </div>
                            </div>

                            {/* PROGRESS BAR: Quantum Stream */}
                            <div className="w-full h-1 bg-surface-secondary/30 rounded-full overflow-hidden">
                                <motion.div
                                    className={`h-full ${item.status === 'completed' ? 'bg-success-base shadow-[0_0_8px_var(--success-glow)]' : item.status === 'error' ? 'bg-danger-base' : 'bg-[var(--theme-base)] shadow-[0_0_8px_var(--theme-glow)]'}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.progress}%` }}
                                    transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};