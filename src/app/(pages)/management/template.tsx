"use client";

import React from "react";
import { Info, Layout, Search, Plus } from "lucide-react";
import { Button, Card, Typography, Table, TableRow, TableCell, SearchInput } from "@/components/ui/Index";

export default function PlaceholderManagementPage({ title, subtitle }: { title: string, subtitle: string }) {
    return (
        <div className="space-y-8 pb-10">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-text-primary">
                        {title}
                    </h1>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">{subtitle}</p>
                </div>
                <Button variant="primary" className="text-[10px] font-black uppercase tracking-widest px-6 !bg-primary-base text-white gap-2 shadow-neumorph">
                    <Plus size={16} /> Tambah Data
                </Button>
            </header>

            <Card variant="standard" padding="lg" className="border-none shadow-neumorph p-20 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-surface-secondary shadow-neumorph-inset flex items-center justify-center text-primary-base">
                    <Layout size={40} />
                </div>
                <div className="max-w-md">
                    <h2 className="text-xl font-black italic uppercase text-text-primary italic">Modul Sedang Dikembangkan</h2>
                    <p className="text-xs text-text-muted mt-2 leading-relaxed">
                        Halaman <strong>{title}</strong> sedang dalam tahap implementasi teknis untuk integrasi dengan sistem E-Office.
                    </p>
                </div>
            </Card>
        </div>
    );
}

// Internal pages will export this with specific props
