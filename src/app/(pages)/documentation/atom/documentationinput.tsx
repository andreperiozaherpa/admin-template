// src/app/(pages)/dokumentation/atom/dokumentasinput.tsx
"use client";

import { Input } from "@/components/ui/atom/Input";
import { Card } from "@/components/ui/molecules/Card"; // Pastikan path benar
import { Type, Code2 } from "lucide-react";

export const DocumentationInput = () => {
    return (
        <section className="space-y-4">
            {/* Header Seksi - Konsisten dengan Dokumentasi Button */}
            <div className="flex items-center gap-2 text-[var(--theme-base)] transition-colors duration-smooth">
                <Type size={18} />
                <h2 className="text-xl font-black tracking-tight uppercase">Inputs</h2>
            </div>

            {/* Main Card - Neumorphic Style */}
            <Card>

                {/* Sisi Kiri: Demo Interaktif (3 Kolom) */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="max-w-md space-y-5">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-text-muted mb-2">
                            Field Variations
                        </p>
                        <Input
                            label="Standard Field"
                            placeholder="Ketik sesuatu..."
                        />
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="admin@tubaba.go.id"
                            error="Format email tidak sesuai sistem"
                        />
                    </div>

                    {/* Penjelasan Singkat */}
                    <div className="pt-4 border-t border-border-main/30">
                        <p className="text-xs text-text-secondary font-light leading-relaxed">
                            Elemen input menggunakan <span className="font-medium text-[var(--theme-base)]">shadow-neumorph-inset</span> untuk menciptakan efek kedalaman fisik saat menerima fokus teks.
                        </p>
                    </div>
                </div>

                {/* Sisi Kanan: Code Snippet (2 Kolom) */}
                <div className="lg:col-span-2 space-y-3">
                    <div className="flex items-center gap-2 text-text-muted px-1">
                        <Code2 size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Usage Guide</span>
                    </div>

                    <div className="p-5 bg-surface-secondary shadow-neumorph-inset rounded-2xl group relative overflow-hidden">
                        {/* Menggunakan Template Literal agar tidak ribet */}
                        <pre className="text-[11px] font-medium leading-relaxed font-mono text-text-secondary whitespace-pre selection:bg-[var(--theme-base)]/30">
                            {`INPUT API (Tubaba 2026):
label       : string
placeholder : string
error       : string (Validasi)
type        : "text" | "email" | "pass"

1. BASIC USAGE
<Input 
  label="Username" 
  placeholder="admin" 
/>

2. WITH ERROR STATE
<Input 
  label="Email" 
  error="Format salah" 
/>`}
                        </pre>

                        {/* Dekorasi Aksen Dinamis sesuai Layout */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--theme-base)]/5 blur-3xl pointer-events-none" />
                    </div>
                </div>

            </Card>
        </section>
    );
};