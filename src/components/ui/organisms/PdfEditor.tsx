"use client";

import React, { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { motion, AnimatePresence } from "framer-motion";
import {
    Stamp, Fingerprint, QrCode, Trash2,
    RotateCcw, Loader2, ZoomIn, ZoomOut,
    Maximize2
} from "lucide-react";
import { Button, Typography } from "@/components/ui/Index";
import { toast } from "sonner";
import { PDFDocument } from "pdf-lib";

if (typeof window !== "undefined") {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

export interface PdfEditorRef {
    handleSave: () => Promise<void>;
}

interface EditorElement {
    id: string;
    type: 'stamp' | 'signature' | 'qr';
    image?: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

interface PdfEditorProps {
    fileUrl?: string | null;
    stampImg?: string;
    signatureImg?: string;
    qrImg?: string;
}

export const PdfEditor = forwardRef<PdfEditorRef, PdfEditorProps>(({
    fileUrl,
    stampImg = "",
    signatureImg = "",
    qrImg = ""
}, ref) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [numPages, setNumPages] = useState<number>(0);
    const [elements, setElements] = useState<EditorElement[]>([]);
    const [scale, setScale] = useState<number>(1.0);
    const [isClient, setIsClient] = useState(false);
    const [resizingId, setResizingId] = useState<string | null>(null);

    const workspaceRef = useRef<HTMLDivElement>(null);
    const paperRef = useRef<HTMLDivElement>(null);
    const gestureOriginRef = useRef<{ x: number, y: number, w: number, h: number } | null>(null);

    /**
     * RESPONSIVE ENGINE: fitToWidth
     * Menyesuaikan skala PDF berdasarkan 3 rentang layar yang diminta
     */
    const fitToWidth = useCallback(() => {
        if (workspaceRef.current) {
            // Ambil lebar kontainer sebenarnya yang tersedia setelah dikurangi sidebar
            const containerWidth = workspaceRef.current.clientWidth;

            // Tentukan padding dinamis berdasarkan lebar kontainer
            // Jika kontainer sempit (seperti pada 1025px dengan sidebar), gunakan padding kecil
            const padding = containerWidth < 800 ? 32 : 80;

            const availableWidth = containerWidth - padding;
            const newScale = availableWidth / 800;

            // Set skala dengan batas minimal agar tetap terbaca
            setScale(Math.max(newScale, 0.4));
        }
    }, []);

    // Listener untuk mendeteksi perubahan ukuran layar secara real-time
    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("resize", fitToWidth);
            // Jalankan setelah render singkat untuk memastikan DOM sudah siap
            const timer = setTimeout(fitToWidth, 300);
            return () => {
                window.removeEventListener("resize", fitToWidth);
                clearTimeout(timer);
            };
        }
    }, [fitToWidth, fileUrl]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useImperativeHandle(ref, () => ({
        handleSave: async () => {
            if (!fileUrl || elements.length === 0) {
                toast.error("Tambahkan elemen terlebih dahulu!");
                return;
            }
            const loadingId = toast.loading("Merender naskah...");
            try {
                const existingPdfBytes = await fetch(fileUrl).then(res => res.arrayBuffer());
                const pdfDoc = await PDFDocument.load(existingPdfBytes);
                const firstPage = pdfDoc.getPages()[0];
                const { width: pdfWidth, height: pdfHeight } = firstPage.getSize();
                const ratio = pdfWidth / 800;

                for (const el of elements) {
                    if (!el.image) continue;
                    const imgBytes = await fetch(el.image).then(res => res.arrayBuffer());
                    const image = el.image.toLowerCase().endsWith('.png')
                        ? await pdfDoc.embedPng(imgBytes)
                        : await pdfDoc.embedJpg(imgBytes);

                    const drawW = el.width * ratio;
                    const drawH = el.height * ratio;
                    firstPage.drawImage(image, {
                        x: el.x * ratio,
                        y: pdfHeight - (el.y * ratio) - drawH,
                        width: drawW,
                        height: drawH,
                    });
                }

                const pdfBase64 = await pdfDoc.saveAsBase64({ dataUri: true });
                const link = document.createElement('a');
                link.href = pdfBase64;
                link.download = `Signed_${Date.now()}.pdf`;
                link.click();

                toast.success("Dokumen berhasil dirender!", { id: loadingId });
            } catch (error) {
                toast.error("Gagal memproses PDF", { id: loadingId });
            }
        }
    }), [elements, fileUrl]);

    const spawnElement = (type: EditorElement['type'], w: number, h: number, img?: string) => {
        if (!workspaceRef.current || !paperRef.current) return;

        const workspaceRect = workspaceRef.current!.getBoundingClientRect();
        const paperRect = paperRef.current!.getBoundingClientRect();

        const logicalX = (workspaceRect.left + workspaceRect.width / 2 - paperRect.left) / scale - w / 2;
        const logicalY = (workspaceRect.top + workspaceRect.height / 2 - paperRect.top) / scale - h / 2;

        const newId = `el-${Date.now()}`;
        setElements(prev => [...prev, {
            id: newId,
            type,
            image: img || undefined,
            x: logicalX,
            y: logicalY,
            width: w,
            height: h
        }]);
        setSelectedId(newId);
    };

    const addElementInViewport = (type: EditorElement['type'], imageSrc: string) => {
        const baseWidth = 150;
        if (imageSrc && imageSrc.trim() !== "") {
            if (!workspaceRef.current || !paperRef.current || !imageSrc) return;
            const img = new Image();
            img.src = imageSrc;
            img.onload = () => {
                const baseWidth = 150;
                const calculatedHeight = baseWidth * (img.naturalHeight / img.naturalWidth);
                const workspaceRect = workspaceRef.current!.getBoundingClientRect();
                const paperRect = paperRef.current!.getBoundingClientRect();
                const logicalX = (workspaceRect.left + workspaceRect.width / 2 - paperRect.left) / scale - baseWidth / 2;
                const logicalY = (workspaceRect.top + workspaceRect.height / 2 - paperRect.top) / scale - calculatedHeight / 2;

                setElements(prev => [...prev, {
                    id: `el-${Date.now()}`,
                    type,
                    image: imageSrc,
                    x: logicalX,
                    y: logicalY,
                    width: baseWidth,
                    height: calculatedHeight
                }]);
            };
        } else {
            // JIKA KOSONG: Gunakan kotak persegi (Default Lucide Icon Placeholder)
            spawnElement(type, baseWidth, baseWidth);
        }
    };

    const handleResizeUpdate = (id: string, offsetX: number) => {
        const start = gestureOriginRef.current;
        if (!start) return;
        setElements(prev => prev.map(el => {
            if (el.id !== id) return el;
            const newWidth = Math.max(60, start.w + (offsetX / scale));
            return { ...el, width: newWidth, height: newWidth * (start.h / start.w) };
        }));
    };

    if (!isClient) return null;

    return (
        <div className="w-full h-full flex flex-col gap-4 font-tubaba overflow-hidden select-none"
            onClick={() => setSelectedId(null)}
        >

            {/* TOOLBAR RESPONSIF: Stack di layar sangat kecil, horizontal di sedang/besar */}
            <div className="w-full flex flex-col min-[1025px]:flex-row items-center justify-between p-3 gap-4 bg-surface/40 backdrop-blur-xl border border-white/10 rounded-main shrink-0 z-50 shadow-sm">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" className="!p-2.5 rounded-xl border border-transparent hover:border-primary-base/20" onClick={() => addElementInViewport('stamp', stampImg)}>
                        <Stamp size={18} className="text-primary-base" />
                    </Button>
                    <Button variant="ghost" className="!p-2.5 rounded-xl border border-transparent hover:border-success-base/20" onClick={() => addElementInViewport('signature', signatureImg)}>
                        <Fingerprint size={18} className="text-success-base" />
                    </Button>
                    <Button variant="ghost" className="!p-2.5 rounded-xl border border-transparent hover:border-info-base/20" onClick={() => addElementInViewport('qr', qrImg)}>
                        <QrCode size={18} className="text-info-base" />
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-surface/60 rounded-2xl p-1 shadow-neumorph-inset border border-white/5">
                        <Button variant="ghost" className="!p-2 h-8 w-8 rounded-xl" onClick={() => setScale(s => Math.max(s - 0.1, 0.35))}><ZoomOut size={14} /></Button>
                        <div className="px-3 min-w-[70px] text-center font-black text-[10px] italic opacity-70">{Math.round(scale * 100)}%</div>
                        <Button variant="ghost" className="!p-2 h-8 w-8 rounded-xl" onClick={() => setScale(s => Math.min(s + 0.1, 2.0))}><ZoomIn size={14} /></Button>
                    </div>
                    <Button variant="ghost" className="!p-2.5 rounded-xl text-danger-base hover:bg-danger-base/10" onClick={() => setElements([])}>
                        <RotateCcw size={18} />
                    </Button>
                </div>
            </div>

            {/* WORKSPACE */}
            <div ref={workspaceRef}
                className="flex-1 bg-surface-secondary/20 shadow-main rounded-main overflow-auto custom-scrollbar p-4 md:p-6 flex flex-col items-center">
                <div ref={paperRef} className="relative shadow-2xl bg-white origin-top mb-40"
                    style={{
                        width: `${800 * scale}px`
                    }}>
                    <Document file={fileUrl} onLoadSuccess={({ numPages }) => setNumPages(numPages)} loading={<div className="p-20 text-center"><Loader2 className="animate-spin text-primary-base mx-auto mb-2" /></div>}>
                        {Array.from(new Array(numPages), (_, index) => (
                            <Page key={index} pageNumber={index + 1} renderTextLayer={false} renderAnnotationLayer={false} scale={scale} width={800} className="shadow-sm border-b border-border-main/5" />
                        ))}
                    </Document>

                    <div className="absolute inset-0 z-20 pointer-events-none">
                        <AnimatePresence>
                            {elements.map((el) => {
                                // Tentukan apakah kontrol harus terlihat
                                const isSelected = selectedId === el.id || resizingId === el.id;

                                return (
                                    <motion.div
                                        key={el.id}
                                        drag={resizingId !== el.id}
                                        dragMomentum={false}
                                        dragConstraints={paperRef}
                                        dragElastic={0}
                                        initial={false}
                                        animate={{ x: el.x * scale, y: el.y * scale, width: el.width * scale, height: el.height * scale }}
                                        style={{ x: el.x * scale, y: el.y * scale }}
                                        transition={{ duration: 0 }}
                                        className="absolute left-0 top-0 pointer-events-auto group"
                                        onPointerDown={(e) => {
                                            e.stopPropagation();
                                            setSelectedId(el.id); // Set sebagai elemen terpilih saat disentuh
                                        }}
                                        onDragStart={() => {
                                            gestureOriginRef.current = { x: el.x, y: el.y, w: el.width, h: el.height };
                                        }}
                                        onDragEnd={(e, info) => {
                                            const start = gestureOriginRef.current;
                                            if (start) {
                                                setElements(prev => prev.map(item =>
                                                    item.id === el.id ? { ...item, x: start.x + (info.offset.x / scale), y: start.y + (info.offset.y / scale) } : item
                                                ));
                                            }
                                            gestureOriginRef.current = null;
                                        }}
                                    >
                                        <div className={`w-full h-full bg-surface/40 backdrop-blur-md border flex items-center justify-center relative cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-primary-base/30 transition-all ${isSelected ? 'ring-2 ring-primary-base border-primary-base' : 'border-white/30'
                                            }`}>
                                            {el.image ? (
                                                <img src={el.image} className="w-full h-full object-fill pointer-events-none select-none" alt={el.type} />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center opacity-40">
                                                    {el.type === 'stamp' && <Stamp size={el.width * scale * 0.4} className="text-primary-base" />}
                                                    {el.type === 'signature' && <Fingerprint size={el.width * scale * 0.4} className="text-success-base" />}
                                                    {el.type === 'qr' && <QrCode size={el.width * scale * 0.4} className="text-info-base" />}
                                                    <span className="text-[9px] font-black mt-1 uppercase tracking-widest opacity-60">Tubaba</span>
                                                </div>
                                            )}

                                            {/* TOMBOL RESIZE: Muncul jika hover (Desktop) ATAU jika dipilih (Mobile) */}
                                            <motion.div
                                                onPointerDown={(e) => {
                                                    e.stopPropagation();
                                                    setResizingId(el.id);
                                                }}
                                                onPanStart={() => { gestureOriginRef.current = { x: el.x, y: el.y, w: el.width, h: el.height }; }}
                                                onPan={(e, info) => handleResizeUpdate(el.id, info.offset.x)}
                                                onPanEnd={() => { setResizingId(null); gestureOriginRef.current = null; }}
                                                className={`absolute -right-3 -bottom-3 w-10 h-10 md:w-8 md:h-8 bg-primary-base rounded-full shadow-lg flex items-center justify-center cursor-nwse-resize z-50 border-4 border-white transition-opacity active:scale-125 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                                    }`}
                                            >
                                                <Maximize2 size={12} className="text-white rotate-90" />
                                            </motion.div>

                                            {/* TOMBOL DELETE: Muncul jika hover (Desktop) ATAU jika dipilih (Mobile) */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setElements(elements.filter(i => i.id !== el.id));
                                                }}
                                                className={`absolute -top-4 -right-4 p-2.5 bg-danger-base text-white rounded-full shadow-lg z-50 border-2 border-white transition-opacity hover:scale-110 active:scale-90 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                                    }`}
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
});

PdfEditor.displayName = "PdfEditor";