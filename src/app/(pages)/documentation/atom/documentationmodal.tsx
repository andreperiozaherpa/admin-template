"use client";

import React, { useState } from "react";
import {
    Modal,
    Card,
    Button,
    Badge,
    Skeleton,
    Input
} from "@/components/ui/Index";
import { useToast } from "@/components/providers/ToastProvider";
import {
    Layers,
    Code2,
    MoveUpRight,
    Settings2,
    User,
    Trash2,
    Save
} from "lucide-react";

export const DocumentationModal = () => {
    const { success } = useToast();

    // State untuk berbagai ukuran modal
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Simulasi aksi simpan
    const handleSave = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setActiveModal(null);
            success("Data Tersimpan", "Profil sistem telah diperbarui secara global.");
        }, 1500);
    };

    return (
        <section id="modal" className="space-y-6">
            <div className="flex items-center gap-2 text-[var(--theme-base)] transition-colors duration-smooth">
                <Layers size={20} />
                <h2 className="text-xl font-black italic uppercase">Overlay Systems (Modal)</h2>
            </div>

            <Card padding="lg">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

                    {/* Sisi Kiri: Playground Kontrol */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="space-y-4">
                            <Badge variant="soft">Size Variants</Badge>
                            <p className="text-xs text-text-secondary leading-relaxed">
                                Modal mendukung berbagai ukuran untuk menyesuaikan kompleksitas konten,
                                mulai dari konfirmasi singkat hingga formulir data besar.
                            </p>

                            <div className="flex flex-wrap gap-3">
                                <Button variant="inset" onClick={() => setActiveModal("sm")}>Small</Button>
                                <Button variant="inset" onClick={() => setActiveModal("md")}>Medium (Default)</Button>
                                <Button variant="inset" onClick={() => setActiveModal("lg")}>Large</Button>
                                <Button variant="inset" onClick={() => setActiveModal("full")}>Full Screen</Button>
                            </div>
                        </div>

                        {/* Interactive Scenario */}
                        <div className="pt-6 border-t border-border-main/20">
                            <div className="space-y-4">
                                <Badge variant="soft">Scenario: Data Management</Badge>
                                <Card variant="inset" padding="lg" className="flex items-center justify-between bg-surface-secondary/20 border-none">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-surface shadow-neumorph flex items-center justify-center text-primary-base">
                                            <Settings2 size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase text-text-primary">System Config</p>
                                            <p className="text-[10px] text-text-secondary">Terakhir diubah: 29 Jan 2026</p>
                                        </div>
                                    </div>
                                    <Button variant="primary" onClick={() => setActiveModal("md")}>
                                        Edit Config
                                    </Button>
                                </Card>
                            </div>
                        </div>
                    </div>

                    {/* Sisi Kanan: Technical Guide */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-text-muted">
                                <Code2 size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Modal API</span>
                            </div>
                            <Card variant="inset" padding="md" className="bg-surface-secondary/50 border-none">
                                <pre className="text-[11px] font-medium leading-relaxed font-mono whitespace-pre overflow-x-auto text-text-secondary">
                                    {`MODAL API (Tubaba 2026):
isOpen  : boolean (State kontrol)
onClose : () => void (Handler tutup)
size    : "sm" | "md" | "lg" | "full"
title   : string (Judul header)

1. BASIC USAGE
<Modal 
  isOpen={open} 
  onClose={() => setOpen(false)}
  title="Edit Profile"
>
  <YourContent />
</Modal>

2. WITH FOOTER
<Modal
  footer={
    <Button onClick={save}>
      Save Changes
    </Button>
  }
>
  ...
</Modal>`}
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
                                    <span>**Focus Locking**: Menghapus kemampuan scroll pada body saat modal aktif.</span>
                                </li>
                                <li className="flex gap-2">
                                    <div className="w-1 h-1 rounded-full bg-primary-base mt-1.5 shrink-0" />
                                    <span>**Spring Physics**: Animasi masuk menggunakan massa 0.8 untuk kesan taktil.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </Card>

            {/* IMPLEMENTASI MODAL DEMO */}
            <Modal
                isOpen={!!activeModal}
                onClose={() => !isLoading && setActiveModal(null)}
                title={activeModal === "full" ? "System Protocol Monitoring" : "Update System Node"}
                size={activeModal as any}
                footer={
                    <>
                        <Button variant="inset" onClick={() => setActiveModal(null)} disabled={isLoading}>
                            Batal
                        </Button>
                        <Button variant="primary" onClick={handleSave} disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </>
                }
            >
                <div className="space-y-6">
                    {isLoading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-10 w-3/4" />
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-secondary/50 border border-border-main/5">
                                <div className="w-12 h-12 rounded-full bg-surface shadow-neumorph flex items-center justify-center text-text-muted">
                                    <User size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-text-primary">Admin Protocol</p>
                                    <p className="text-[10px] text-text-muted uppercase tracking-tighter">Level 04 Clearance</p>
                                </div>
                            </div>
                            <Input label="Node Identifier" placeholder="Contoh: Node-A1" />
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Deskripsi Protokol</label>
                                <Card variant="inset" padding="md" className="min-h-[100px] text-xs text-text-secondary leading-relaxed italic">
                                    "Semua perubahan pada node ini akan direplikasi ke seluruh jaringan Tubaba dalam waktu 5ms."
                                </Card>
                            </div>
                        </>
                    )}
                </div>
            </Modal>
        </section>
    );
};