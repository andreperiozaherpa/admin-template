"use client";

import React, { useState } from "react";
import { Alert, Card, Button, Badge } from "@/components/ui/Index";
import { BellRing, Code2, Info, RefreshCcw } from "lucide-react";

export const DocumentationAlert = () => {
    const [showAlerts, setShowAlerts] = useState(true);

    return (
        <section id="alert" className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[var(--theme-base)]">
                    <BellRing size={18} />
                    <h2 className="text-xl font-black tracking-tight uppercase italic">Status Feedback (Alert)</h2>
                </div>
                <Button
                    variant="inset"
                    onClick={() => setShowAlerts(true)}
                    className="gap-2"
                >
                    <RefreshCcw size={14} /> Reset Alerts
                </Button>
            </div>

            <Card padding="lg">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

                    {/* Visual Showcase */}
                    <div className="lg:col-span-3 space-y-4">
                        <Alert
                            variant="success"
                            title="Synchronization Complete"
                            description="All local nodes have been successfully updated to the latest 2026 protocol."
                            isVisible={showAlerts}
                            onClose={() => setShowAlerts(false)}
                        />

                        <Alert
                            variant="info"
                            title="System Maintenance"
                            description="Cloud backup will be performed tonight at 00:00 UTC. Expect 2 minutes of latency."
                            isVisible={showAlerts}
                        />

                        <Alert
                            variant="warning"
                            title="Resource Warning"
                            description="CPU usage on Node-A7 is exceeding 85%. Consider load balancing."
                            isVisible={showAlerts}
                        />

                        <Alert
                            variant="danger"
                            title="Security Breach Detected"
                            description="Unauthorized access attempt blocked from IP: 192.168.1.105."
                            isVisible={showAlerts}
                        />
                    </div>

                    {/* Usage Guide */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-2 text-text-muted px-1">
                            <Code2 size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Alert API</span>
                        </div>
                        <Card variant="inset" padding="md" className="bg-surface-secondary/50 border-none text-text-secondary font-mono text-[11px]">
                            <pre className="text-[11px] font-medium leading-relaxed font-mono whitespace-pre overflow-x-auto text-text-secondary">
                                {`ALERT API (Tubaba 2026):
title       : string
description : string
variant     : "success" | "danger" | 
              "warning" | "info" | "default"
icon        : LucideIcon (optional)
isVisible   : boolean (default true)
onClose     : () => void (optional)

1. STATIC INFO
<Alert 
  variant="info"
  title="Sistem Terkunci"
  description="Enkripsi aktif otomatis."
/>

2. INTERACTIVE CLOSE
<Alert 
  variant="danger"
  title="Akses Ditolak"
  onClose={() => handleClose()}
  icon={ShieldAlert}
/>`}
                            </pre>
                        </Card>

                        <div className="flex gap-2 p-4 rounded-2xl bg-primary-base/5 border border-primary-base/10 text-text-secondary">
                            <Info size={14} className="mt-0.5 shrink-0 text-primary-base" />
                            <p className="text-[10px] leading-relaxed">
                                Alert menggunakan **AnimatePresence** untuk transisi keluar yang halus saat pengguna menekan tombol tutup.
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </section>
    );
};