// src/app/(pages)/dokumentation/foundations/colors/page.tsx
"use client";

import { Card } from "@/components/ui/molecules/Card";
import { Palette, Sparkles, Code2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ColorsTokensDocs() {
    const functionalColors = [
        { name: "Primary", desc: "Warna aksen taktil utama (Bronze)", class: "bg-[var(--primary-base)]" },
        { name: "Success", desc: "Status positif & penyelesaian", class: "bg-success-base" },
        { name: "Danger", desc: "Peringatan kritis & error", class: "bg-danger-base" },
        { name: "Warning", desc: "Perhatian & instruksi pending", class: "bg-warning-base" },
        { name: "Info", desc: "Informasi umum & panduan", class: "bg-info-base" },
    ];

    return (
        <div className="space-y-12">
            <motion.header
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-4xl font-black tracking-tight mb-3 uppercase">
                    Colors & <span className="text-[var(--theme-base)] italic font-light">Tokens</span>
                </h1>
                <p className="text-base text-text-secondary font-light leading-relaxed max-w-2xl">
                    Sistem warna fungsional dan token efek yang membentuk identitas taktil Tubaba 2026.
                </p>
            </motion.header>

            {/* Section 1: Functional Palette */}
            <section className="space-y-6">
                <div className="flex items-center gap-2 text-[var(--theme-base)] transition-colors">
                    <Palette size={18} />
                    <h2 className="text-xl font-black tracking-tight uppercase">Functional Palette</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {functionalColors.map((color) => (
                        <Card key={color.name} variant="standard" padding="sm" className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl shadow-neumorph ${color.class} transition-colors duration-smooth`} />
                            <div>
                                <h3 className="text-sm font-bold">{color.name}</h3>
                                <p className="text-[11px] text-text-muted font-light">{color.desc}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Section 2: Effect Tokens */}
            <section className="space-y-6">
                <div className="flex items-center gap-2 text-[var(--theme-base)] transition-colors">
                    <Sparkles size={18} />
                    <h2 className="text-xl font-black tracking-tight uppercase">Effect Tokens</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="glass" padding="md">
                        <h3 className="text-sm font-bold mb-2 uppercase tracking-wider">Glass Material</h3>
                        <div className="space-y-2 text-[11px] text-text-secondary font-light">
                            <div className="flex justify-between border-b border-border-main/20 pb-1">
                                <span>Blur</span>
                                <span className="font-mono text-[var(--theme-base)]">24px</span>
                            </div>
                            <div className="flex justify-between border-b border-border-main/20 pb-1">
                                <span>Opacity</span>
                                <span className="font-mono text-[var(--theme-base)]">70%</span>
                            </div>
                        </div>
                    </Card>

                    <Card variant="inset" padding="md">
                        <h3 className="text-sm font-bold mb-2 uppercase tracking-wider">Tactile Shadow</h3>
                        <div className="space-y-2 text-[11px] text-text-secondary font-light">
                            <div className="flex justify-between border-b border-border-main/20 pb-1">
                                <span>Smoothness</span>
                                <span className="font-mono text-[var(--theme-base)]">0.4s</span>
                            </div>
                            <div className="flex justify-between border-b border-border-main/20 pb-1">
                                <span>Ease</span>
                                <span className="font-mono text-[var(--theme-base)]">Guway</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            {/* Usage Guide */}
            {/* Usage Guide - Tubaba 2026 Implementation */}
            <div className="p-6 bg-surface-secondary shadow-neumorph-inset rounded-2xl group relative overflow-hidden">
                <div className="flex items-center gap-2 text-text-muted mb-4">
                    <Code2 size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">How To Use Tokens (Tubaba 2026)</span>
                </div>

                <pre className="text-[11px] font-medium leading-relaxed font-mono text-text-secondary whitespace-pre selection:bg-[var(--theme-base)]/30">
                    {`1. DYNAMIC ACCENT (Mengikuti Pilihan Layout)
// Gunakan variabel --theme-base untuk warna yang berubah otomatis
<div className="text-[var(--theme-base)]">Teks Aksen Dinamis</div>
<div className="bg-[var(--theme-base)] text-main-bg">Latar Aksen Dinamis</div>

2. TACTILE SURFACE (Material Fisik)
// Gunakan utility shadow-neumorph untuk efek timbul
<div className="bg-surface shadow-neumorph p-6 rounded-main">
  Konten Kartu Neumorphic
</div>

3. GLASSMORPHISM (Efek Kaca Apple)
// Gunakan utility glass-effect untuk transparansi modern
<div className="glass-effect p-4 rounded-xl">
  Elemen Kaca Transparan
</div>

4. SMOOTH MOTION (Animasi Premium)
// Gabungkan durasi dan ease-guway untuk pergerakan organik
<div className="transition-all duration-smooth ease-guway hover:scale-105">
  Interaksi Halus
</div>`}
                </pre>

                {/* Aksen visual dekoratif */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--theme-base)]/5 blur-3xl pointer-events-none" />
            </div>
        </div>
    );
}