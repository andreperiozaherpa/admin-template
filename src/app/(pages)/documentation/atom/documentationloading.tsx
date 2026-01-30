// src/app/(pages)/documentation/atom/documentationloading.tsx
"use client";

import React from "react";
import { Loading, Card } from "@/components/ui/Index";
import { Loader2, Code2, Info } from "lucide-react";
import { motion } from "framer-motion";

export const DocumentationLoading = () => {
    return (
        <section className="space-y-4">
            {/* Header Seksi dengan Entry Animation */}
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-[var(--theme-base)] transition-colors"
            >
                <Loader2 size={18} />
                <h2 className="text-xl font-black tracking-tight uppercase italic">Loading States</h2>
            </motion.div>

            <Card variant="standard" padding="lg">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

                    {/* Sisi Kiri: Demo Interaktif (3 Kolom) */}
                    <div className="lg:col-span-3 space-y-12">
                        {/* Grid Varian Utama */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center text-center">
                            <div>
                                <p className="text-[8px] uppercase font-bold text-text-muted mb-6 tracking-[0.2em]">Tactile Ring</p>
                                <Loading variant="tactile" size="md" />
                            </div>
                            <div>
                                <p className="text-[8px] uppercase font-bold text-text-muted mb-6 tracking-[0.2em]">Classic Ring</p>
                                <Loading variant="classic" size="md" />
                            </div>
                            <div>
                                <p className="text-[8px] uppercase font-bold text-text-muted mb-6 tracking-[0.2em]">Tactile Pulse</p>
                                <Loading variant="pulse" size="md" />
                            </div>
                            <div>
                                <p className="text-[8px] uppercase font-bold text-text-muted mb-6 tracking-[0.2em]">Orbit Pair</p>
                                <Loading variant="orbit" size="md" />
                            </div>
                        </div>

                        {/* Showcase Besar untuk Varian Tactile */}
                        <div className="flex flex-col items-center p-10 bg-surface-secondary/20 rounded-[32px] border border-border-main/5 shadow-neumorph-inset">
                            <Loading variant="tactile" size="lg" label="Processing Haptic Data..." />
                        </div>

                        <div className="pt-6 border-t border-border-main/20">
                            <div className="flex gap-2 items-start text-text-secondary">
                                <Info size={14} className="mt-0.5 text-[var(--theme-base)]" />
                                <p className="text-xs font-light leading-relaxed">
                                    Varian <span className="font-semibold text-text-primary">Tactile</span> direkomendasikan untuk loading utama. Menggunakan gradasi yang memudar (flat tail) untuk mensimulasikan komponen fisik yang menyatu dengan permukaan UI.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sisi Kanan: Usage Guide (2 Kolom) */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-2 text-text-muted px-1">
                            <Code2 size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Usage Guide</span>
                        </div>

                        <Card variant="inset" padding="md" className="relative group bg-surface-secondary/50 border-none overflow-hidden">
                            <pre className="text-[11px] font-medium leading-relaxed font-mono text-text-secondary whitespace-pre overflow-x-auto selection:bg-[var(--theme-base)]/30">
                                {`LOADING API (Tubaba 2026):
variant : "tactile" | "classic" | 
          "pulse" | "orbit"
size    : "sm" | "md" | "lg"
label   : string (Opsional)

1. TACTILE (RECOMMENDED)
<Loading variant="tactile" />

2. WITH LABEL & SIZE
<Loading 
  variant="tactile"
  label="Processing..." 
  size="lg" 
/>

3. PULSE VARIANT
<Loading variant="pulse" />`}
                            </pre>
                            {/* Efek Ambient Glow sesuai Tema */}
                            <div className="absolute -top-12 -right-12 w-24 h-24 bg-[var(--theme-base)]/10 blur-[40px] rounded-full pointer-events-none group-hover:bg-[var(--theme-base)]/20 transition-colors duration-700" />
                        </Card>
                    </div>

                </div>
            </Card>
        </section>
    );
};