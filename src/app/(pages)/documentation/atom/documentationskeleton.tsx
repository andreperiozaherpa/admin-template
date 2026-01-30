"use client";

import React from "react";
import { Skeleton, Card, Badge } from "@/components/ui/Index";
import {
    Loader2,
    Code2,
    Info,
    MoveUpRight,
    Zap,
    Layers
} from "lucide-react";

export const DocumentationSkeleton = () => {
    return (
        <section id="skeleton" className="space-y-6">
            <div className="flex items-center gap-2 text-[var(--theme-base)] transition-colors duration-smooth">
                <Loader2 size={20} className="animate-spin" />
                <h2 className="text-xl font-black tracking-tight uppercase italic text-text-primary">
                    Skeleton Systems
                </h2>
            </div>

            <Card padding="lg" variant="standard">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

                    {/* Sisi Kiri: Visual Showcase */}
                    <div className="lg:col-span-3 space-y-8">

                        {/* DEMO 1: Profile Loading State */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Badge variant="soft">Scenario: Profile Sync</Badge>
                            </div>
                            <div className="p-6 bg-surface-secondary/30 rounded-[32px] shadow-neumorph-inset flex items-center gap-4">
                                <Skeleton variant="circle" className="w-16 h-16 shadow-neumorph" />
                                <div className="flex-1 space-y-3">
                                    <Skeleton className="h-5 w-1/2" />
                                    <Skeleton className="h-3 w-3/4" />
                                </div>
                            </div>
                        </div>

                        {/* DEMO 2: Content Feed Loading */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Badge variant="soft">Scenario: Data Feed</Badge>
                            </div>
                            <div className="p-6 bg-surface-secondary/30 rounded-[32px] shadow-neumorph-inset space-y-4">
                                <div className="flex justify-between items-center">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton variant="circle" className="w-8 h-8" />
                                </div>
                                <Skeleton className="h-24 w-full" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-8 flex-1" />
                                    <Skeleton className="h-8 flex-1" />
                                </div>
                            </div>
                        </div>

                        {/* Technical Note */}
                        <div className="flex gap-3 p-4 rounded-2xl bg-primary-base/5 border border-primary-base/10 text-text-secondary">
                            <Info size={16} className="mt-0.5 shrink-0 text-primary-base" />
                            <p className="text-[10px] leading-relaxed">
                                Skeleton ini menggunakan <strong>Soft Pulse Animation</strong> (rentang opasitas 0.85 - 1) untuk menjaga ketenangan visual selama proses pemuatan data berlangsung.
                            </p>
                        </div>
                    </div>

                    {/* Sisi Kanan: Technical Guide (Usage) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-text-muted">
                                <Code2 size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Skeleton API</span>
                            </div>
                            <Card variant="inset" padding="md" className="bg-surface-secondary/50 border-none">
                                <pre className="text-[11px] font-medium leading-relaxed font-mono whitespace-pre overflow-x-auto text-text-secondary">
                                    {`SKELETON API (Tubaba 2026):
variant   : "rect" | "circle"
className : string (size/spacing)

1. RECTANGLE
<Skeleton className="h-4 w-full" />

2. CIRCULAR
<Skeleton 
  variant="circle" 
  className="w-12 h-12" 
/>

3. COMPOSITE
<div className="space-y-2">
  <Skeleton className="h-4 w-1/2" />
  <Skeleton className="h-20" />
</div>`}
                                </pre>
                            </Card>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-text-muted">
                                <MoveUpRight size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Arsitektur</span>
                            </div>
                            <ul className="text-[10px] space-y-3 text-text-secondary leading-relaxed px-1">
                                <li className="flex gap-2">
                                    <Zap size={14} className="shrink-0 text-warning-base" />
                                    <span>**Adaptive Colors**: Otomatis menyesuaikan dengan variabel `--skeleton` yang selaras dengan tema dashboard.</span>
                                </li>
                                <li className="flex gap-2">
                                    <Layers size={14} className="shrink-0 text-primary-base" />
                                    <span>**Shimmer Layer**: Memiliki lapisan kilauan (*shimmer*) yang bergerak halus dari kiri ke kanan secara terus-menerus.</span>
                                </li>
                                <li className="flex gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary-base mt-1.5 shrink-0" />
                                    <span>**Rim Lighting**: Menggunakan border transparan untuk memberikan kesan kedalaman fisik (neumorphic).</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </Card>
        </section>
    );
};