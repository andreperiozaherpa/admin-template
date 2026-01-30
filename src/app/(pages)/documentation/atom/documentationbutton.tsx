// src/app/(pages)/dokumentation/atom/dokumentasibutton.tsx
"use client";

import { Button } from "@/components/ui/atom/Button";
import { MousePointer2, Code2 } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Index";

export const DokumentationButton = () => {
    return (
        <section className="space-y-4">
            {/* Header Seksi - Menggunakan warna aksen dinamis dan Font Tubaba */}
            <div className="flex items-center gap-2 text-[var(--theme-base)] transition-colors duration-smooth">
                <MousePointer2 size={18} />
                <h2 className="text-xl font-black tracking-tight uppercase">Buttons</h2>
            </div>

            {/* Main Card - Neumorphic Style */}
            <Card variant="standard" padding="lg">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                    {/* Sisi Kiri: Demo Interaktif */}
                    <div className="lg:col-span-3 space-y-6">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-text-muted mb-4">
                                Interactive States
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Button variant="primary">Primary</Button>
                                <Button variant="default">Default</Button>
                                <Button variant="inset">Inset</Button>
                                <Button variant="expel">Expel</Button>
                                <Button variant="danger">Danger</Button>
                                <Button variant="success">Success</Button>
                            </div>
                        </div>

                        {/* Penjelasan Singkat */}
                        <div className="pt-4 border-t border-border-main/30">
                            <p className="text-xs text-text-secondary font-light leading-relaxed">
                                Seluruh tombol menggunakan utilitas <span className="font-medium text-[var(--theme-base)]">hover-tactile</span> untuk memberikan feedback fisik saat ditekan.
                            </p>
                        </div>
                    </div>

                    {/* Sisi Kanan: Code Snippet */}
                    <div className="lg:col-span-2 space-y-3">
                        <div className="flex items-center gap-2 text-text-muted px-1">
                            <Code2 size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Usage Guide</span>
                        </div>

                        <div className="p-5 bg-surface-secondary shadow-neumorph-inset rounded-2xl group relative overflow-hidden">
                            {/* Menggunakan Template Literal untuk kemudahan penulisan */}
                            <pre className="text-[11px] font-medium leading-relaxed font-mono text-text-secondary whitespace-pre selection:bg-[var(--theme-base)]/30">
                                {`BUTTON API (Guway Tubaba 2026):
variant : "primary" | "default" | "inset" | "danger"
size    : "sm" | "md" | "lg"
color   : var(--theme-base)

1. PRIMARY ACTION
<Button variant="primary">
  Action
</Button>

2. SEMANTIC STATE
<Button variant="danger">
  Delete
</Button>`}
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