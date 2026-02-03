"use client";

import React, { useState, useEffect } from "react";
import {
    Mail, FileEdit, Send, Inbox, FileCheck,
    Clock, FilePlus, TrendingUp
} from "lucide-react";
import { Button, Card, Badge, Chart } from "@/components/ui/Index";
import { motion } from "framer-motion";

export default function Dashboard() {
    const [themeColor, setThemeColor] = useState('#a855f7'); // Default purple

    // Ambil warna tema dinamis dari CSS Variable
    useEffect(() => {
        const style = getComputedStyle(document.documentElement);
        const color = style.getPropertyValue('--primary-base').trim();
        if (color) setThemeColor(color);
    }, []);

    const officeStats = [
        { label: "Surat Masuk", value: "48", icon: Inbox, trend: "8 Baru", isNew: true },
        { label: "Draft Surat", value: "12", icon: FileEdit, trend: "Dalam Proses", isNew: false },
        { label: "Disposisi Aktif", value: "5", icon: Mail, trend: "Perlu Tindakan", isNew: true },
    ];

    // Konfigurasi Data Grafik Tren Surat
    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                fill: true,
                label: 'Surat Masuk',
                data: [30, 45, 38, 52, 48, 60],
                borderColor: themeColor,
                backgroundColor: `${themeColor}20`, // Transparency 20%
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: themeColor,
                borderWidth: 3,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1c2128',
                titleFont: { family: 'var(--font-sans)', size: 12, weight: 'bold' },
                bodyFont: { family: 'var(--font-sans)', size: 11 },
                padding: 12,
                cornerRadius: 12,
                displayColors: false,
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#768390', font: { size: 10, weight: 'bold' } }
            },
            y: {
                grid: { color: 'rgba(255,255,255,0.03)' },
                ticks: { color: '#768390', font: { size: 10 } }
            }
        }
    };

    return (
        <div className="space-y-10 pb-10">
            {/* 1. HEADER SECTION */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-text-primary">
                        Guway <span className="text-[var(--theme-base)]">E-Office</span>
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-success-base animate-pulse shadow-[0_0_8px_var(--success-glow)]" />
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Surat Menyurat v1.0</p>
                    </div>
                </div>
                <Button variant="expel" className="text-[10px] font-black uppercase tracking-widest px-6 !bg-[var(--theme-base)] text-white gap-2">
                    <FilePlus size={14} /> Buat Surat Baru
                </Button>
            </header>

            {/* 2. STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {officeStats.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                        <Card className="group hover-tactile p-6 shadow-neumorph border border-white/5 bg-surface relative overflow-hidden">
                            <div className="flex justify-between items-start relative z-10">
                                <div className="space-y-3">
                                    <div className="w-10 h-10 rounded-xl bg-surface shadow-neumorph flex items-center justify-center text-text-muted group-hover:text-[var(--theme-base)] transition-colors">
                                        <stat.icon size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">{stat.label}</p>
                                        <h3 className="text-2xl font-black italic text-text-primary mt-1">{stat.value}</h3>
                                    </div>
                                </div>
                                {stat.isNew && <Badge variant="neumorph" size="sm" className="rounded-lg italic animate-bounce">{stat.trend}</Badge>}
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* 3. CHART & ANALYTICS SECTION */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* GRAFIK ANALITIK (Glass Effect) */}
                <Chart
                    type="bar"
                    title="Tren Surat"
                    data={[20, 40, 30, 70]}
                    labels={['W1', 'W2', 'W3', 'W4']}
                    trend="+12%"
                    className="xl:col-span-2"
                />

                {/* Doughnut Chart untuk Kategori */}
                <Chart
                    type="doughnut"
                    title="Kategori Dokumen"
                    subtitle="Distribusi Jenis Surat"
                    data={[45, 25, 30]}
                    labels={['Surat Masuk', 'Surat Keluar', 'Nota Dinas']}
                    height={300}
                />

                {/* STATUS PEMBUATAN */}
                <Card className="shadow-neumorph p-8 border border-white/5 flex flex-col">
                    <h2 className="text-sm font-black italic uppercase tracking-widest text-text-primary mb-8">Status <span className="text-[var(--theme-base)]">Pembuatan</span></h2>
                    <div className="space-y-6">
                        <div className="p-4 shadow-neumorph-inset rounded-2xl bg-surface-secondary/20">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[9px] font-black uppercase text-text-muted">Drafting</span>
                                <span className="text-[10px] font-black text-[var(--theme-base)]">75%</span>
                            </div>
                            <div className="h-1.5 w-full bg-surface-secondary shadow-inner rounded-full overflow-hidden">
                                <div className="h-full bg-[var(--theme-base)] rounded-full shadow-[0_0_8px_var(--theme-glow)] w-[75%]" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Clock size={14} className="text-warning-base" />
                                <span className="text-[10px] font-bold text-text-secondary uppercase">3 Menunggu Persetujuan</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FileCheck size={14} className="text-success-base" />
                                <span className="text-[10px] font-bold text-text-secondary uppercase">15 Surat Terbit</span>
                            </div>
                        </div>
                        <Button variant="inset" className="w-full mt-4 text-[9px] font-black uppercase tracking-widest py-4">Unduh Laporan</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}