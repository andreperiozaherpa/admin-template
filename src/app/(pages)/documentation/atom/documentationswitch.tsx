// src/app/(pages)/documentation/atom/documentationswitch.tsx
"use client";

import React, { useState } from "react";
import { Switch, Card } from "@/components/ui/Index";
import { ToggleRight, Code2, Info } from "lucide-react";
import { motion } from "framer-motion";

export const DocumentationSwitch = () => {
  const [enabled1, setEnabled1] = useState(true);
  const [enabled2, setEnabled2] = useState(false);

  return (
    <section className="space-y-4">
      {/* Header Seksi dengan Entry Animation */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 text-[var(--theme-base)] transition-colors duration-smooth"
      >
        <ToggleRight size={18} />
        <h2 className="text-xl font-black tracking-tight uppercase italic">Switches</h2>
      </motion.div>

      {/* Main Card Wrapper */}
      <Card variant="standard" padding="lg" className="overflow-hidden border-border-main/10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

          {/* Sisi Kiri: Demo Interaktif (3 Kolom) */}
          <div className="lg:col-span-3 space-y-8">
            <div className="space-y-6">
              <header>
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-text-muted mb-4 opacity-80">
                  Interactive States
                </p>
                <div className="flex flex-col gap-6">
                  <Switch
                    label="Haptic Feedback"
                    checked={enabled1}
                    onChange={setEnabled1}
                  />
                  <Switch
                    label="Dynamic Theming"
                    checked={enabled2}
                    onChange={setEnabled2}
                  />
                </div>
              </header>
            </div>

            {/* Penjelasan Teknis - Apple Style Typography */}
            <div className="pt-6 border-t border-border-main/20">
              <div className="flex gap-2 items-start text-text-secondary">
                <Info size={14} className="mt-0.5 text-[var(--theme-base)]" />
                <p className="text-xs font-light leading-relaxed">
                  Komponen Switch menggunakan <span className="font-semibold text-text-primary">Spring Physics</span> untuk simulasi gerak organik. Ideal untuk pengaturan instan tanpa perlu tombol simpan.
                </p>
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Code Snippet (2 Kolom) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 text-text-muted">
                <Code2 size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Usage Guide</span>
              </div>
            </div>

            {/* Card Inset untuk pembungkus kode */}
            <Card variant="inset" padding="md" className="relative group bg-surface-secondary/50 border-none">
              <pre className="text-[11px] font-medium leading-relaxed font-mono text-text-secondary whitespace-pre overflow-x-auto selection:bg-[var(--theme-base)]/30">
                {`SWITCH API (Tubaba 2026):
label    : string (Judul toggle)
checked  : boolean (Status on/off)
onChange : (val: boolean) => void
disabled : boolean (Opsional)

1. BASIC USAGE
<Switch 
  label="Notifications" 
  checked={enabled} 
  onChange={setEnabled} 
/>

2. WITHOUT LABEL
<Switch 
  checked={enabled} 
  onChange={setEnabled} 
/>

3. CONTROLLED STATE
const [status, setStatus] = useState(false);
<Switch 
  label="System Active" 
  checked={status} 
  onChange={setStatus} 
/>`}
              </pre>

              {/* Efek Ambient Glow yang lebih halus */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-[var(--theme-base)]/10 blur-[40px] rounded-full pointer-events-none group-hover:bg-[var(--theme-base)]/20 transition-colors duration-700" />
            </Card>
          </div>

        </div>
      </Card>
    </section>
  );
};