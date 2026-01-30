// src/app/(pages)/dokumentation/molecules/dokumentasicard.tsx
"use client";

import { Card } from "@/components/ui/molecules/Card";
import { Layers, Code2 } from "lucide-react";
import { motion } from "framer-motion";

export const DokumentationCard = () => {
    return (
        <section className="space-y-4">
            {/* Header Seksi - Menggunakan Font Tubaba dan Aksen Dinamis */}
            <div className="flex items-center gap-2 text-[var(--theme-base)] transition-colors duration-smooth">
                <Layers size={18} />
                <h2 className="text-xl font-black tracking-tight uppercase">Cards</h2>
            </div>

            {/* Main Card Container */}
            <Card>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                    {/* Sisi Kiri: Demo Varian Card */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Standard Neumorph */}
                            <Card variant="standard" padding="sm">
                                <h3 className="text-sm font-bold mb-1">Standard</h3>
                                <p className="text-[11px] text-text-muted font-light leading-relaxed">
                                    Efek timbul fisik yang murni.
                                </p>
                            </Card>

                            {/* Glassmorphism */}
                            <Card variant="glass" padding="sm">
                                <h3 className="text-sm font-bold mb-1">Glass Effect</h3>
                                <p className="text-[11px] text-text-muted font-light leading-relaxed">
                                    Transparansi modern dengan blur.
                                </p>
                            </Card>

                            {/* Accent Border */}
                            <Card variant="accent" padding="sm">
                                <h3 className="text-sm font-bold mb-1">Accent Line</h3>
                                <p className="text-[11px] text-text-muted font-light leading-relaxed">
                                    Menonjolkan warna tema aktif.
                                </p>
                            </Card>

                            {/* Inset Style */}
                            <Card variant="inset" padding="sm">
                                <h3 className="text-sm font-bold mb-1">Inset Material</h3>
                                <p className="text-[11px] text-text-muted font-light leading-relaxed">
                                    Kedalaman cekung ke dalam.
                                </p>
                            </Card>
                        </div>

                        {/* Deskripsi Teknis */}
                        <div className="pt-4 border-t border-border-main/30">
                            <p className="text-xs text-text-secondary font-light leading-relaxed">
                                Material card secara otomatis beradaptasi dengan <span className="font-medium text-[var(--theme-base)]">Warna Aksen</span> dan <span className="font-medium text-[var(--theme-base)]">Mode Visual</span> yang dipilih di layout.
                            </p>
                        </div>
                    </div>

                    {/* Sisi Kanan: Code Snippet & Props API */}
                    <div className="lg:col-span-2 space-y-3">
                        <div className="flex items-center gap-2 text-text-muted px-1">
                            <Code2 size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Usage Guide</span>
                        </div>

                        <div className="p-5 bg-surface-secondary shadow-neumorph-inset rounded-2xl group relative overflow-hidden">
                            <pre className="text-[11px] font-medium leading-relaxed font-mono text-text-secondary whitespace-pre selection:bg-[var(--theme-base)]/30">
                                {`CARD API (Guway Tubaba 2026):
variant : "standard" | "glass" | "accent" | "inset"
padding : "none" | "sm" | "md" | "lg"

1. MODERN GLASS
<Card variant="glass">
  <Content />
</Card>

2. ACCENTED
<Card variant="accent" padding="sm">
  <Content />
</Card>`}
                            </pre>

                            {/* Dekorasi Aksen Dinamis */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--theme-base)]/5 blur-3xl pointer-events-none" />
                        </div>
                    </div>

                </div>
            </Card>
        </section>
    );
};