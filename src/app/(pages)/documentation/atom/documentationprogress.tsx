"use client";

import React, { useState, useEffect } from "react";
import { Progress, Card } from "@/components/ui/Index";
import { Activity, Code2, Info, Database, Cpu, Zap, Battery, SignalHigh, Volume2 } from "lucide-react";
import { motion } from "framer-motion";

export const DocumentationProgress = () => {
    const [dynamicValue, setDynamicValue] = useState(6.59);
    const calculatedPercentage = (dynamicValue / 10) * 100;

    useEffect(() => {
        const interval = setInterval(() => {
            setDynamicValue((prev) => (prev >= 10 ? 0 : +(prev + 0.15).toFixed(2)));
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="space-y-4">
            {/* Header Dokumentasi */}
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-[var(--theme-base)] transition-colors"
            >
                <Activity size={18} />
                <h2 className="text-xl font-black tracking-tight uppercase italic">Progress Indicators</h2>
            </motion.div>

            <Card variant="standard" padding="lg">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

                    {/* Sisi Kiri: Visual Showcase (3 Kolom) */}
                    <div className="lg:col-span-3 space-y-12">

                        {/* 1. Circular & Vertical Showcase */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-surface-secondary/20 rounded-[40px] shadow-neumorph-inset items-center justify-items-center">

                            {/* Circular (Storage Context) */}
                            <div className="flex flex-col items-center gap-4">
                                <Progress
                                    variant="circular"
                                    value={dynamicValue}
                                    total={10}
                                    unit="Gb"
                                    color="danger"
                                    size="md"
                                    icon={Database}
                                    showValue
                                />
                                <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest">Main Storage</p>
                            </div>

                            {/* Vertical Bars (System Metrics Context) */}
                            <div className="flex items-end gap-10 h-48">
                                <Progress variant="vertical" value={calculatedPercentage} color="success" size="sm" icon={Battery} showValue />
                                <Progress variant="vertical" value={85} color="info" size="sm" icon={SignalHigh} />
                                <Progress variant="vertical" value={45} color="warning" size="sm" icon={Volume2} />
                            </div>
                        </div>

                        {/* 2. Linear Showcase */}
                        <div className="space-y-8 px-2">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <Zap size={14} className="text-[var(--success-base)]" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-primary">System Refreshing</span>
                                </div>
                                <Progress value={calculatedPercentage} color="success" size="md" showValue />
                            </div>
                            <Progress value={60} color="primary" size="sm" />
                        </div>

                        {/* Info Teknis */}
                        <div className="pt-6 border-t border-border-main/20">
                            <div className="flex gap-2 items-start text-text-secondary">
                                <Info size={14} className="mt-0.5 text-[var(--theme-base)]" />
                                <p className="text-xs font-light leading-relaxed">
                                    Gunakan varian <span className="font-semibold text-text-primary">Vertical</span> untuk panel samping atau mixer audio. Semua varian mendukung <span className="italic">pendaran glow</span> yang selaras dengan palet warna vibrant Tubaba 2026.
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

                        <Card variant="inset" padding="md" className="relative group bg-surface-secondary/50 border-none overflow-hidden text-text-secondary font-mono text-[11px] leading-relaxed">
                            <pre className="text-[11px] font-medium leading-relaxed font-mono text-text-secondary whitespace-pre overflow-x-auto selection:bg-[var(--theme-base)]/30">

                                {`PROGRESS API (Tubaba 2026):
variant : "linear" | "circular" | 
          "vertical"
color   : "primary" | "success" | 
          "danger" | "info" | "warning"
icon    : LucideIcon (Optional)

1. VERTICAL (BATTERY)
<Progress 
  variant="vertical" 
  value={80} 
  color="success" 
  icon={Battery} 
/>

2. STORAGE CIRCULAR
<Progress 
  variant="circular" 
  value={6.5} 
  total={10} 
  unit="Gb" 
  icon={Database} 
/>`}
                            </pre>
                            <div className="absolute -top-12 -right-12 w-24 h-24 bg-[var(--theme-base)]/10 blur-[40px] rounded-full pointer-events-none" />
                        </Card>
                    </div>

                </div>
            </Card>
        </section>
    );
};