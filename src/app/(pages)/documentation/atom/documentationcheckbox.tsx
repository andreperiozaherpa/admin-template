// src/app/(pages)/documentation/atom/documentationcheckbox.tsx
"use client";

import React, { useState } from "react";
import { Card, Checkbox } from "@/components/ui/Index";
import { CheckSquare, Code2 } from "lucide-react";

export const DocumentationCheckbox = () => {
    const [checked1, setChecked1] = useState(true);
    const [checked2, setChecked2] = useState(false);

    return (
        <section className="space-y-6">
            {/* Header Seksi */}
            <div className="flex items-center gap-2 text-[var(--theme-base)] transition-colors duration-smooth">
                <CheckSquare size={20} />
                <h2 className="text-xl font-black tracking-tight uppercase">Checkboxes</h2>
            </div>

            {/* Main Card Container */}
            <Card padding="lg">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Sisi Kiri: Demo Interaktif (3 Kolom) */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="space-y-4">
                            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-text-muted mb-2">
                                Selection States
                            </p>
                            <div className="flex flex-col gap-4">
                                <Checkbox
                                    label="Aktifkan Notifikasi"
                                    checked={checked1}
                                    onChange={setChecked1}
                                />
                                <Checkbox
                                    label="Terima Syarat & Ketentuan"
                                    checked={checked2}
                                    onChange={setChecked2}
                                />
                            </div>
                        </div>

                        {/* Penjelasan Teknis */}
                        <div className="pt-4 border-t border-border-main/30">
                            <p className="text-xs text-text-secondary font-light leading-relaxed">
                                Checkbox ini menggunakan perpaduan <span className="font-medium text-[var(--theme-base)]">shadow-neumorph-inset</span> saat kosong dan warna aksen solid saat aktif untuk kejelasan visual maksimal.
                            </p>
                        </div>
                    </div>

                    {/* Sisi Kanan: Code Snippet (2 Kolom) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-text-muted">
                                <Code2 size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Usage Guide</span>
                            </div>

                            <Card variant="inset" padding="md" className="bg-surface-secondary/50 border-none">
                                <pre className="text-[11px] font-medium leading-relaxed font-mono whitespace-pre overflow-x-auto text-text-secondary">
                                    {`CHECKBOX API (Tubaba 2026):
label    : string (Teks samping)
checked  : boolean (Status centang)
onChange : (val: boolean) => void
id       : string (Opsional)

1. BASIC USAGE
<Checkbox 
  label="Ingat Saya" 
  checked={val} 
  onChange={setVal} 
/>

2. WITHOUT LABEL
<Checkbox 
  checked={val} 
  onChange={setVal} 
/>

3. STATE CONTROL
const [checked, setChecked] = useState(true);
<Checkbox 
  label="Active" 
  checked={checked} 
  onChange={setChecked} 
/>`}
                                </pre>
                            </Card>
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--theme-base)]/5 blur-3xl pointer-events-none" />
                        </div>
                    </div>
                </div>


            </Card>
        </section >
    );
};