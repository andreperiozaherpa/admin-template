"use client";

import React, { useState } from "react";
import {
    Save,
    Send,
    ChevronLeft,
    Sparkles,
    FileSearch,
    Users,
    FileText
} from "lucide-react";
import {
    Button,
    Card,
    Select,
    SearchInput,
    Badge
} from "@/components/ui/Index";

export default function SuratEditorPage() {
    const [template, setTemplate] = useState("nota");
    const [isSaving, setIsSaving] = useState(false);
    const [penandatangan, setPenandatangan] = useState(false);

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden -m-8">
            {/* 1. TOP ACTION BAR */}
            <div className="flex items-center justify-between px-8 py-4 bg-surface border-b border-border-main/5 z-20">
                <div className="flex items-center gap-4">
                    <Button variant="inset" className="!p-2 h-10 w-10">
                        <ChevronLeft size={18} />
                    </Button>
                    <div>
                        <h1 className="text-sm font-black italic uppercase tracking-tighter">
                            Editor <span className="text-[var(--theme-base)]">Naskah Dinas</span>
                        </h1>
                        <p className="text-[9px] font-bold text-success-base uppercase animate-pulse">
                            • Cloud Synchronizing
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="expel" className="gap-2 text-[10px] font-black uppercase tracking-widest">
                        <FileSearch size={14} /> Preview
                    </Button>
                    <Button variant="primary" className="!bg-[var(--theme-base)] text-white gap-2 text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_var(--theme-glow)]">
                        <Send size={14} /> Ajukan TTE
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* 2. LEFT PANEL: PROPERTIES (320px) */}
                <aside className="w-80 bg-surface-secondary/10 border-r border-border-main/5 p-6 overflow-y-auto custom-scrollbar">
                    <div className="space-y-6">
                        <section className="space-y-3">
                            <span className="text-[10px] font-black uppercase text-text-muted tracking-[0.2em]">Dokumen Protocol</span>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold uppercase ml-1">Jenis Naskah</label>
                                    <Select
                                        options={[
                                            { label: "Nota Dinas", value: "nota" },
                                            { label: "Surat Undangan", value: "undangan" },
                                            { label: "Surat Edaran", value: "edaran" }
                                        ]}
                                        value={template}
                                        onChange={setTemplate}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold uppercase ml-1">Penandatangan (Auto-Role)</label>
                                    <Select
                                        options={[
                                            { label: "Bupati Tulang Bawang Barat", value: "bupati" },
                                            { label: "Sekretaris Daerah", value: "sekda" }
                                        ]}
                                        placeholder="Pilih Pejabat..."
                                        onChange={setPenandatangan}
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="space-y-3 pt-6 border-t border-border-main/5">
                            <span className="text-[10px] font-black uppercase text-text-muted tracking-[0.2em]">Tujuan Distribusi</span>
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold uppercase ml-1">Penerima (Multiple)</label>
                                <Button variant="inset" className="w-full justify-between h-12 text-[10px] font-bold italic">
                                    Pilih OPD / Unit... <Users size={14} />
                                </Button>
                            </div>
                        </section>
                    </div>
                </aside>

                {/* 3. CENTER PANEL: MAIN WORKSPACE */}
                <main className="flex-1 bg-surface-secondary/30 p-12 overflow-y-auto custom-scrollbar flex flex-col items-center">
                    <Card variant="standard" padding="none" className="w-full max-w-[800px] min-h-[1000px] shadow-2xl border-none bg-white p-[80px] text-black">
                        {/* Area Pengetikan Naskah Dinas */}
                        <div className="space-y-12">
                            {/* Kop Surat Placeholder */}
                            <div className="border-b-4 border-black pb-4 text-center space-y-1">
                                <h2 className="text-xl font-bold uppercase">Pemerintah Kabupaten Tulang Bawang Barat</h2>
                                <h3 className="text-2xl font-black uppercase tracking-widest">Sekretariat Daerah</h3>
                                <p className="text-xs italic">Jl. Raya Panaragan Jaya No. 01, Tulang Bawang Tengah</p>
                            </div>

                            {/* Header Dokumen */}
                            <div className="text-center space-y-1">
                                <h4 className="text-lg font-black uppercase underline decoration-2">Nota Dinas</h4>
                                <p className="text-sm">Nomor: 800 / _____ / II.01 / TUBABA / 2026</p>
                            </div>

                            {/* Editor Body */}
                            <div className="min-h-[400px] focus:outline-none text-base leading-relaxed" contentEditable spellCheck="false">
                                <p className="text-gray-400 italic">Mulai mengetik naskah dinas di sini...</p>
                            </div>
                        </div>
                    </Card>
                </main>

                {/* 4. RIGHT PANEL: AI & TOOLS (64px) */}
                <aside className="w-16 bg-surface border-l border-border-main/5 flex flex-col items-center py-6 gap-6">
                    <Button variant="inset" className="!p-0 h-10 w-10 rounded-xl hover:text-warning-base">
                        <Sparkles size={18} />
                    </Button>
                    <Button variant="inset" className="!p-0 h-10 w-10 rounded-xl">
                        <FileText size={18} />
                    </Button>
                </aside>
            </div>
        </div>
    );
}