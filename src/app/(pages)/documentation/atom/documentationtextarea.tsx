// src/app/(pages)/documentation/atom/documentationtextarea.tsx
"use client";

import React from "react";
import { TextArea, Card } from "@/components/ui/Index";
import { AlignLeft, Code2, Info } from "lucide-react";
import { motion } from "framer-motion";

export const DocumentationTextArea = () => {
    return (
        <section className="space-y-4">
            {/* Header Seksi dengan Entry Animation */}
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-[var(--theme-base)] transition-colors duration-smooth"
            >
                <AlignLeft size={18} />
                <h2 className="text-xl font-black tracking-tight uppercase italic">TextArea</h2>
            </motion.div>

            {/* Main Card Wrapper */}
            <Card variant="standard" padding="lg" className="overflow-hidden border-border-main/10">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

                    {/* Sisi Kiri: Demo Interaktif (3 Kolom) */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="space-y-6">
                            <header>
                                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-text-muted mb-4 opacity-80">
                                    Multiline Input Variations
                                </p>
                                <div className="max-w-md space-y-6">
                                    <TextArea
                                        label="Catatan Proyek"
                                        placeholder="Tulis deskripsi detail di sini..."
                                        rows={4}
                                    />
                                    <TextArea
                                        label="Feedback Pengguna"
                                        placeholder="Masukkan saran Anda..."
                                        error="Pesan terlalu pendek (min. 20 karakter)"
                                        rows={3}
                                    />
                                </div>
                            </header>
                        </div>

                        {/* Penjelasan Teknis */}
                        <div className="pt-6 border-t border-border-main/20">
                            <div className="flex gap-2 items-start text-text-secondary">
                                <Info size={14} className="mt-0.5 text-[var(--theme-base)]" />
                                <p className="text-xs font-light leading-relaxed">
                                    TextArea menggunakan material <span className="font-semibold text-text-primary">shadow-neumorph-inset</span> yang sama dengan input biasa, namun dengan area ketik yang lebih luas dan fitur <span className="font-semibold text-text-primary">resize-none</span> untuk menjaga integritas tata letak dashboard.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sisi Kanan: Code Snippet (2 Kolom) */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-2 text-text-muted px-1">
                            <Code2 size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Usage Guide</span>
                        </div>

                        {/* Card Inset untuk pembungkus kode */}
                        <Card variant="inset" padding="md" className="relative group bg-surface-secondary/50 border-none">
                            <pre className="text-[11px] font-medium leading-relaxed font-mono text-text-secondary whitespace-pre overflow-x-auto selection:bg-[var(--theme-base)]/30">
                                {`TEXTAREA API (Tubaba 2026):
label       : string
placeholder : string
error       : string (Validation)
rows        : number (Def: 4)

1. BASIC USAGE
<TextArea 
  label="Description" 
  placeholder="Start typing..." 
/>

2. CUSTOM HEIGHT
<TextArea 
  rows={6} 
  label="Long Message" 
/>

3. VALIDATION ERROR
<TextArea 
  error="Wajib diisi" 
/>`}
                            </pre>

                            {/* Efek Ambient Glow */}
                            <div className="absolute -top-12 -right-12 w-24 h-24 bg-[var(--theme-base)]/10 blur-[40px] rounded-full pointer-events-none group-hover:bg-[var(--theme-base)]/20 transition-colors duration-700" />
                        </Card>
                    </div>

                </div>
            </Card>
        </section>
    );
};