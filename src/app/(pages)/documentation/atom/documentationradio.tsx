// src/app/(pages)/documentation/atom/documentationradio.tsx
"use client";

import React, { useState } from "react";
import { Radio, Card } from "@/components/ui/Index";
import { CircleDot, Code2, Info } from "lucide-react";
import { motion } from "framer-motion";

export const DocumentationRadio = () => {
    const [selectedValue, setSelectedValue] = useState("option-1");

    return (
        <section className="space-y-4">
            {/* Header Seksi */}
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-[var(--theme-base)] transition-colors duration-smooth"
            >
                <CircleDot size={18} />
                <h2 className="text-xl font-black tracking-tight uppercase italic">Radio Buttons</h2>
            </motion.div>

            {/* Main Card Wrapper */}
            <Card variant="standard" padding="lg">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

                    {/* Sisi Kiri: Demo Interaktif (3 Kolom) */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="space-y-6">
                            <header>
                                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-text-muted mb-4 opacity-80">
                                    Single Selection Group
                                </p>
                                <div className="flex flex-col gap-5 p-2">
                                    <Radio
                                        label="Pilihan Pertama (Default)"
                                        value="option-1"
                                        checked={selectedValue === "option-1"}
                                        onChange={setSelectedValue}
                                        name="demo-group"
                                    />
                                    <Radio
                                        label="Pilihan Kedua (Taktil)"
                                        value="option-2"
                                        checked={selectedValue === "option-2"}
                                        onChange={setSelectedValue}
                                        name="demo-group"
                                    />
                                    <Radio
                                        label="Pilihan Ketiga (Sistem)"
                                        value="option-3"
                                        checked={selectedValue === "option-3"}
                                        onChange={setSelectedValue}
                                        name="demo-group"
                                    />
                                </div>
                            </header>
                        </div>

                        {/* Penjelasan Teknis */}
                        <div className="pt-6 border-t border-border-main/20">
                            <div className="flex gap-2 items-start text-text-secondary">
                                <Info size={14} className="mt-0.5 text-[var(--theme-base)]" />
                                <p className="text-xs font-light leading-relaxed">
                                    Gunakan Radio untuk pilihan eksklusif. Komponen ini menggunakan <span className="font-semibold text-text-primary">shadow-neumorph-inset</span> pada keadaan tidak aktif untuk mensimulasikan lubang fisik pada permukaan UI.
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

                        <Card variant="inset" padding="md" className="relative group bg-surface-secondary/50 border-none overflow-hidden">
                            <pre className="text-[11px] font-medium leading-relaxed font-mono text-text-secondary whitespace-pre overflow-x-auto selection:bg-[var(--theme-base)]/30">
                                {`RADIO API (Tubaba 2026):
label    : string (Opsional)
value    : string (Wajib)
checked  : boolean (Status)
onChange : (val: string) => void
name     : string (Grup HTML)

1. BASIC USAGE
<Radio 
  label="Opsi A" 
  value="a" 
  checked={val === "a"} 
  onChange={setVal} 
/>

2. GROUP LOGIC
const [selected, setSelected] = useState("1");

<Radio label="1" value="1" checked={selected === "1"} onChange={setSelected} />
<Radio label="2" value="2" checked={selected === "2"} onChange={setSelected} />`}
                            </pre>
                            <div className="absolute -top-12 -right-12 w-24 h-24 bg-[var(--theme-base)]/10 blur-[40px] rounded-full pointer-events-none" />
                        </Card>
                    </div>

                </div>
            </Card>
        </section>
    );
};