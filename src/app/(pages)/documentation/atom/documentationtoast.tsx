"use client";

import React from "react";
import { Card, Button, Badge } from "@/components/ui/Index";
// Mengambil hook dan tipe posisi dari provider
import { useToast } from "@/components/providers/ToastProvider";
import { ToastPosition } from "@/components/ui/atom/Toast";
import {
    Layout,
    Code2,
    Zap,
    Maximize2,
    MoveUpRight
} from "lucide-react";

export const DocumentationToast = () => {
    // 1. Ambil setPosition dari context
    const { toast, setPosition } = useToast();

    /**
     * Helper untuk mengubah posisi sistem secara global 
     * sebelum menampilkan pesan
     */
    const triggerDemo = (variant: any, title: string, pos: ToastPosition) => {
        // Update posisi di provider
        setPosition(pos);

        // Berikan jeda mikroskopis agar DOM container berpindah
        setTimeout(() => {
            toast({
                title,
                description: `Sistem notifikasi berpindah ke koordinat ${pos}.`,
                variant,
                duration: 3000,
            });
        }, 10);
    };

    return (
        <section id="toast" className="space-y-6">
            <div className="flex items-center gap-2 text-[var(--theme-base)]">
                <Layout size={20} className="animate-pulse" />
                <h2 className="text-xl font-black tracking-tight uppercase italic">
                    Advanced Toast System
                </h2>
            </div>

            <Card padding="lg">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

                    {/* Sisi Kiri: Playground Kontrol */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="space-y-4">
                            <Badge variant="soft">Positioning Playground</Badge>
                            <p className="text-xs text-text-secondary leading-relaxed">
                                Notifikasi sekarang mendukung **6 titik koordinat** dengan arah masuk (*entry*) yang disesuaikan secara otomatis.
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                                {/* Memasukkan argumen posisi ke fungsi helper */}
                                <Button variant="inset" className="text-[10px]" onClick={() => triggerDemo("info", "Top Left", "top-left")}>
                                    Top Left
                                </Button>
                                <Button variant="inset" className="text-[10px]" onClick={() => triggerDemo("success", "Top Center", "top-center")}>
                                    Top Center
                                </Button>
                                <Button variant="inset" className="text-[10px]" onClick={() => triggerDemo("warning", "Top Right", "top-right")}>
                                    Top Right
                                </Button>
                                <Button variant="inset" className="text-[10px]" onClick={() => triggerDemo("danger", "Bottom Left", "bottom-left")}>
                                    Bottom Left
                                </Button>
                                <Button variant="inset" className="text-[10px]" onClick={() => triggerDemo("default", "Bottom Center", "bottom-center")}>
                                    Bottom Center
                                </Button>
                                <Button variant="primary" className="text-[10px]" onClick={() => triggerDemo("success", "Bottom Right", "bottom-right")}>
                                    Bottom Right
                                </Button>
                            </div>
                        </div>

                        {/* Detail Animasi Teknis */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-border-main/20">
                            <div className="flex gap-3">
                                <Maximize2 size={16} className="text-primary-base shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-[11px] font-bold text-text-primary uppercase">Spring Physics</p>
                                    <p className="text-[10px] text-text-secondary leading-normal">
                                        Massa 0.8 dan damping 30 untuk efek pantulan taktil.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Zap size={16} className="text-warning-base shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-[11px] font-bold text-text-primary uppercase">Adaptive Entry</p>
                                    <p className="text-[10px] text-text-secondary leading-normal">
                                        Arah geseran (X/Y) berubah otomatis sesuai posisi.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sisi Kanan: Technical Guide */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-text-muted">
                                <Code2 size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Global State Control</span>
                            </div>
                            <Card variant="inset" padding="md" className="bg-surface-secondary/50 border-none font-mono text-[10px]">
                                <pre className="text-[11px] font-medium leading-relaxed font-mono whitespace-pre overflow-x-auto text-text-secondary">
                                    {`TOAST API (Tubaba 2026):
title       : string
description : string (optional)
variant     : "success" | "danger" | 
              "warning" | "info"
duration    : number (default 5k ms)
position    : "top-right" | "top-left" | 
              "bottom-right" | ...

1. QUICK SUCCESS
const { success } = useToast();
success("Vault Secured", "Data encrypted.");

2. CUSTOM CONFIG
const { toast, setPosition } = useToast();
setPosition("top-center");
toast({
  variant: "danger",
  title: "Breach Detected",
  duration: 10000
});`}
                                </pre>
                            </Card>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-text-muted">
                                <MoveUpRight size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Logic Flow</span>
                            </div>
                            <ul className="text-[10px] space-y-2 text-text-secondary">
                                <li className="flex items-start gap-2">
                                    <div className="w-1 h-1 rounded-full bg-primary-base mt-1.5 shrink-0" />
                                    <span>Panggilan `setPosition` memperbarui state kontainer di Provider.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-1 h-1 rounded-full bg-primary-base mt-1.5 shrink-0" />
                                    <span>Kontainer berpindah dengan transisi CSS halus.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-1 h-1 rounded-full bg-primary-base mt-1.5 shrink-0" />
                                    <span>Toast baru merender dengan animasi masuk yang sesuai arah.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </Card>
        </section>
    );
};