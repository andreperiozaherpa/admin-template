"use client";

import React from "react";
import { Tooltip, Button, Card, Badge } from "@/components/ui/Index";
import { HelpCircle, Code2, Info, Settings, Trash2, Send } from "lucide-react";
import { motion } from "framer-motion";

export const DocumentationTooltip = () => {
    return (
        <section id="tooltip" className="space-y-4">
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-[var(--theme-base)] transition-colors"
            >
                <HelpCircle size={18} />
                <h2 className="text-xl font-black tracking-tight uppercase italic">Info Overlays (Tooltip)</h2>
            </motion.div>

            <Card variant="standard" padding="lg">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

                    {/* Showcase Visual */}
                    <div className="lg:col-span-3 space-y-12">
                        <div className="flex flex-wrap items-center justify-center gap-12 p-16 bg-surface-secondary/20 rounded-[40px] shadow-neumorph-inset">

                            <Tooltip content="System Settings" position="top">
                                <Button variant="expel" className="p-4 rounded-full">
                                    <Settings size={20} />
                                </Button>
                            </Tooltip>

                            <Tooltip content="Permanently Delete" position="bottom" className="text-danger-base">
                                <Button variant="inset" className="p-4 rounded-full">
                                    <Trash2 size={20} />
                                </Button>
                            </Tooltip>

                            <Tooltip content="Send Transmission" position="right" variant="glass">
                                <Button variant="primary" className="p-4 rounded-full">
                                    <Send size={20} />
                                </Button>
                            </Tooltip>

                        </div>

                        <div className="pt-6 border-t border-border-main/20">
                            <div className="flex gap-2 items-start text-text-secondary">
                                <Info size={14} className="mt-0.5 text-[var(--theme-base)]" />
                                <div className="text-xs font-light leading-relaxed space-y-2">
                                    <p>
                                        Varian <span className="font-semibold text-text-primary">Neumorph</span> memberikan efek timbul yang konsisten dengan permukaan dashboard.
                                    </p>
                                    <p>
                                        Gunakan varian <span className="font-semibold text-text-primary">Glass</span> untuk interaksi yang lebih modern dan ringan, terutama di atas area yang memiliki banyak konten visual.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Usage Guide */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-2 text-text-muted px-1">
                            <Code2 size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Usage Guide</span>
                        </div>

                        <Card variant="inset" padding="md" className="relative group bg-surface-secondary/50 border-none overflow-hidden text-text-secondary font-mono text-[11px] leading-relaxed">
                            <pre className="text-[11px] font-medium leading-relaxed font-mono whitespace-pre overflow-x-auto">
                                {`TOOLTIP API (Tubaba 2026):
content  : string | JSX
position : "top" | "bottom" | 
           "left" | "right"
variant  : "neumorph" | "glass"
delay    : number (default 0.2s)

1. SIMPLE TEXT
<Tooltip content="Save Changes">
  <ButtonIcon />
</Tooltip>

2. GLASS VARIANT
<Tooltip 
  variant="glass" 
  position="right"
  content={<Badge>Beta</Badge>}
>
  <Settings />
</Tooltip>`}
                            </pre>
                            <div className="absolute -top-12 -right-12 w-24 h-24 bg-[var(--theme-base)]/10 blur-[40px] rounded-full pointer-events-none" />
                        </Card>
                    </div>

                </div>
            </Card>
        </section>
    );
};