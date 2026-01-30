// src/app/(pages)/documentation/atom/documentationbadge.tsx
"use client";

import React from "react";
import { Badge, Card } from "@/components/ui/Index";
import { Tag, Code2, CheckCircle2, AlertCircle, Zap, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export const DocumentationBadge = () => {
    return (
        <section className="space-y-4">
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-[var(--theme-base)] transition-colors"
            >
                <Tag size={18} />
                <h2 className="text-xl font-black tracking-tight uppercase italic">Badges</h2>
            </motion.div>

            <Card variant="standard" padding="lg">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

                    {/* Sisi Kiri: Demo Interaktif */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="space-y-6">
                            {/* Row 1: Varian */}
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-text-muted mb-4">Style Variants</p>
                                <div className="flex flex-wrap gap-3">
                                    <Badge variant="neumorph">Neumorph</Badge>
                                    <Badge variant="glass">Glassmorphism</Badge>
                                    <Badge variant="soft">Soft Background</Badge>
                                    <Badge variant="outline">Outline Only</Badge>
                                </div>
                            </div>

                            {/* Row 2: Status fungsional */}
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-text-muted mb-4">Functional States</p>
                                <div className="flex flex-wrap gap-3">
                                    <Badge icon={ShieldCheck}>Verified</Badge>
                                    <Badge color="danger" icon={AlertCircle}>Error</Badge>
                                    <Badge color="warning" icon={Zap}>Pending</Badge>
                                    <Badge color="info" icon={CheckCircle2}>Updates</Badge>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-border-main/20">
                            <p className="text-xs text-text-secondary font-light leading-relaxed">
                                Badge dirancang untuk memberikan penekanan visual tanpa mengganggu aliran konten. Gunakan varian <span className="font-bold">Glass</span> untuk elemen di atas gambar dan <span className="font-bold">Neumorph</span> untuk elemen UI dashboard standar.
                            </p>
                        </div>
                    </div>

                    {/* Sisi Kanan: Usage Guide */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-2 text-text-muted px-1">
                            <Code2 size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Usage Guide</span>
                        </div>

                        <Card variant="inset" padding="md" className="relative group bg-surface-secondary/50 border-none overflow-hidden">
                            <pre className="text-[11px] font-medium leading-relaxed font-mono text-text-secondary whitespace-pre overflow-x-auto selection:bg-[var(--theme-base)]/30">
                                {`BADGE API (Tubaba 2026):
variant : "neumorph" | "glass" | "soft" | "outline"
color   : "primary" | "success" | "danger" | "warning"
icon    : LucideIcon (Opsional)
size    : "sm" | "md"

1. STATUS BADGE
<Badge color="success" icon={Check}>
  Active
</Badge>

2. GLASS VARIANT
<Badge variant="glass">
  Premium
</Badge>

3. MINIMALIST
<Badge size="sm" variant="soft">
  New
</Badge>`}
                            </pre>
                            <div className="absolute -top-12 -right-12 w-24 h-24 bg-[var(--theme-base)]/10 blur-[40px] rounded-full pointer-events-none" />
                        </Card>
                    </div>

                </div>
            </Card>
        </section>
    );
};