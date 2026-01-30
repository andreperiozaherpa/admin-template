"use client";

import React, { useState } from "react";
import { Slider, Card } from "@/components/ui/Index";
import { Sliders, Code2, Info, Volume2, Sun, Thermometer, Fan, Zap } from "lucide-react";
import { motion } from "framer-motion";

export const DocumentationSlider = () => {
    // State untuk demo interaktif
    const [volume, setVolume] = useState(49);
    const [temp, setTemp] = useState(24);
    const [fanSpeed, setFanSpeed] = useState(6);
    const [brightness, setBrightness] = useState(80);

    return (
        <section className="space-y-4">
            {/* Header Dokumentasi */}
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-[var(--theme-base)] transition-colors"
            >
                <Sliders size={18} />
                <h2 className="text-xl font-black tracking-tight uppercase italic">Interactive Sliders</h2>
            </motion.div>

            <Card variant="standard" padding="lg">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

                    {/* Sisi Kiri: Visual Showcase (3 Kolom) */}
                    <div className="lg:col-span-3 space-y-12">

                        {/* 1. Circular Knobs Showcase - Menggunakan Flex Wrap agar tidak bertabrakan */}
                        <div className="flex flex-wrap items-center justify-center gap-12 lg:gap-16 p-10 md:p-14 bg-surface-secondary/20 rounded-[48px] shadow-neumorph-inset overflow-visible">
                            <div className="flex flex-col items-center transition-transform hover:scale-105 duration-500">
                                <Slider
                                    variant="circular"
                                    label="Volume"
                                    value={volume}
                                    onChange={setVolume}
                                    color="primary"
                                    size="md"
                                    icon={Volume2}
                                />
                            </div>

                            <div className="flex flex-col items-center transition-transform hover:scale-105 duration-500">
                                <Slider
                                    variant="circular"
                                    label="Temp"
                                    value={temp}
                                    min={16}
                                    max={30}
                                    onChange={setTemp}
                                    color="danger"
                                    size="md"
                                    icon={Thermometer}
                                />
                            </div>

                            <div className="flex flex-col items-center transition-transform hover:scale-105 duration-500">
                                <Slider
                                    variant="circular"
                                    label="Fan Speed"
                                    value={fanSpeed}
                                    onChange={setFanSpeed}
                                    color="info"
                                    size="sm"
                                    icon={Fan}
                                />
                            </div>
                        </div>

                        {/* 2. Linear Sliders Showcase */}
                        <div className="space-y-10 px-4">
                            <Slider
                                label="Display Brightness"
                                value={brightness}
                                onChange={setBrightness}
                                color="warning"
                                icon={Sun}
                            />
                            <Slider
                                label="System Performance"
                                value={volume}
                                onChange={setVolume}
                                color="success"
                                icon={Zap}
                            />
                        </div>

                        {/* Info Teknis */}
                        <div className="pt-6 border-t border-border-main/20">
                            <div className="flex gap-2 items-start text-text-secondary">
                                <Info size={14} className="mt-0.5 text-[var(--theme-base)]" />
                                <div className="text-xs font-light leading-relaxed">
                                    <p>
                                        Varian <span className="font-semibold text-text-primary">Circular Slider</span> menggunakan sistem bezel raised dengan deteksi rotasi presisi.
                                        Efek <span className="italic text-text-primary">vibrant glow</span> pada jalur progres memastikan indikator tetap jelas di berbagai kondisi pencahayaan.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sisi Kanan: Usage Guide (2 Kolom) - Menggunakan format raw text pre */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-2 text-text-muted px-1">
                            <Code2 size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Usage Guide</span>
                        </div>

                        <Card variant="inset" padding="md" className="relative group bg-surface-secondary/50 border-none overflow-hidden text-text-secondary font-mono text-[11px] leading-relaxed">
                            <pre className="text-[11px] font-medium leading-relaxed font-mono text-text-secondary whitespace-pre overflow-x-auto selection:bg-[var(--theme-base)]/30">
                                {`SLIDER API (Tubaba 2026):
variant : "linear" | "circular"
color   : "primary" | "success" | 
          "danger" | "info" | "warning"
value   : number (State)
min/max : number (Default 0-100)
icon    : LucideIcon (Optional)
size    : "sm" | "md" | "lg" (Circular)

1. TACTILE CIRCULAR (DIAL)
<Slider 
  variant="circular"
  value={temp} 
  onChange={setTemp}
  min={16} max={30}
  color="danger" 
  icon={Thermometer} 
/>

2. VIBRANT LINEAR BAR
<Slider 
  value={volume}
  onChange={setVolume}
  color="primary"
  icon={Volume2}
  label="Main Audio"
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