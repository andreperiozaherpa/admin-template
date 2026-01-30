"use client";

import React, { useState, useEffect } from "react";
// Import komponen UI dari index utama
import { Select, Card, Badge, Button, type SelectOption } from "@/components/ui/Index";
import { useToast } from "@/components/providers/ToastProvider";
import {
    ListFilter,
    Database,
    Globe,
    Layers,
    Code2,
    MoveUpRight,
    RefreshCcw
} from "lucide-react";

export const DocumentationSelect = () => {
    const { toast } = useToast();

    // 1. State untuk Pilihan Tunggal
    const [single, setSingle] = useState<string>("id");

    // 2. State untuk Pilihan Ganda (Tags)
    const [multi, setMulti] = useState<string[]>(["react"]);

    // 3. State untuk Simulasi API
    const [apiValue, setApiValue] = useState<string>("");
    const [apiData, setApiData] = useState<SelectOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fungsi simulasi pemanggilan API ke cloud node
    const fetchCloudNodes = async () => {
        setLoading(true);
        setError(null);
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const mockResponse: SelectOption[] = [
                { label: "US-East-1 (Virginia)", value: "us-east-1" },
                { label: "AP-Southeast-1 (Jakarta)", value: "ap-southeast-1" },
                { label: "EU-Central-1 (Frankfurt)", value: "eu-central-1" },
            ];
            setApiData(mockResponse);
        } catch (err) {
            setError("Gagal sinkronisasi dengan cloud node.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCloudNodes();
    }, []);

    return (
        <section id="select" className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[var(--theme-base)] transition-colors duration-smooth">
                    <ListFilter size={20} />
                    <h2 className="text-xl font-black italic uppercase">Selection System</h2>
                </div>
                <Button variant="inset" onClick={fetchCloudNodes} disabled={loading}>
                    <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
                </Button>
            </div>

            <Card padding="lg">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

                    {/* Sisi Kiri: Playground Kontrol */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Varian: Single + Searchable */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Globe size={14} className="text-text-muted" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Localization</span>
                                </div>
                                <Select
                                    label="Bahasa Utama"
                                    searchable
                                    options={[
                                        { label: "Bahasa Indonesia", value: "id" },
                                        { label: "English (US)", value: "en" },
                                        { label: "日本語 (Japanese)", value: "jp" }
                                    ]}
                                    value={single}
                                    onChange={(val) => {
                                        setSingle(val);
                                        toast({ title: "Bahasa Diperbarui", variant: "info" });
                                    }}
                                />
                            </div>

                            {/* Varian: Multiple Tags */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Layers size={14} className="text-text-muted" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Tech Stack</span>
                                </div>
                                <Select
                                    label="Keahlian"
                                    multiple
                                    searchable
                                    options={[
                                        { label: "React JS", value: "react" },
                                        { label: "Next.js 16", value: "next" },
                                        { label: "Tailwind CSS", value: "tailwind" },
                                        { label: "Framer Motion", value: "framer" }
                                    ]}
                                    value={multi}
                                    onChange={setMulti}
                                />
                            </div>
                        </div>

                        {/* Varian: API Driven */}
                        <div className="pt-6 border-t border-border-main/20">
                            <div className="max-w-md space-y-3">
                                <div className="flex items-center gap-2">
                                    <Database size={14} className="text-text-muted" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Dynamic API Data</span>
                                </div>
                                <Select
                                    label="Target Deployment Node"
                                    isLoading={loading}
                                    options={apiData}
                                    value={apiValue}
                                    onChange={setApiValue}
                                    error={error || undefined}
                                    placeholder="Pilih node yang aktif..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sisi Kanan: Technical Guide */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-text-muted">
                                <Code2 size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Select API</span>
                            </div>
                            <Card variant="inset" padding="md" className="bg-surface-secondary/50 border-none">
                                <pre className="text-[11px] font-medium leading-relaxed font-mono whitespace-pre overflow-x-auto text-text-secondary">
                                    {`SELECT API (Tubaba 2026):
options    : { label, value }[]
value      : string | number | array
onChange   : (value) => void
multiple   : boolean (default false)
searchable : boolean (default false)
isLoading  : boolean (loading state)

1. SEARCHABLE
<Select 
  searchable 
  options={langOptions}
  value={lang}
  onChange={setLang}
/>

2. MULTIPLE
<Select 
  multiple 
  placeholder="Pilih Tag..."
  value={tags}
  onChange={setTags}
/>`}
                                </pre>
                            </Card>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-text-muted">
                                <MoveUpRight size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Arsitektur</span>
                            </div>
                            <ul className="text-[10px] space-y-2 text-text-secondary leading-relaxed px-1">
                                <li className="flex gap-2">
                                    <div className="w-1 h-1 rounded-full bg-primary-base mt-1.5 shrink-0" />
                                    <span>**Hydration-Safe**: ID sinkron antara SSR dan Client.</span>
                                </li>
                                <li className="flex gap-2">
                                    <div className="w-1 h-1 rounded-full bg-primary-base mt-1.5 shrink-0" />
                                    <span>**A11y**: Mendukung `role="combobox"` dan `aria-expanded`.</span>
                                </li>
                                <li className="flex gap-2">
                                    <div className="w-1 h-1 rounded-full bg-primary-base mt-1.5 shrink-0" />
                                    <span>**Performance**: Filtering menggunakan `useMemo`.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </Card>
        </section>
    );
};