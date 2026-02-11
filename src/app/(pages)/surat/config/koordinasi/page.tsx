"use client";

import React, { useState } from "react";
import {
    GitMerge, Plus, Trash2, Edit3, ArrowUp, ArrowDown,
    Save, ShieldCheck, Fingerprint, Stamp, User, Briefcase,
    AlertCircle, CheckCircle2, Layout, ArrowLeft, GitBranch,
    FileText, Layers, GripVertical
} from "lucide-react";
import {
    Button, Card, Typography, Badge, Modal, Select
} from "@/components/ui/Index";
import { toast } from "sonner";
import { motion, AnimatePresence, Reorder } from "framer-motion";

// --- TIPE DATA ---

interface ApprovalLevel {
    id: string;
    urutan: number;
    roleName: string;
    userId: string;
    type: "draft" | "review" | "paraf" | "tte";
    isFinal: boolean;
}

interface WorkflowTemplate {
    id: string;
    name: string; // Contoh: "Alur SK Bupati"
    description: string;
    finalSignerRole: string; // Contoh: "Bupati"
    levels: ApprovalLevel[];
}

// --- DATA DUMMY (MULTIPLE WORKFLOWS) ---
const INITIAL_WORKFLOWS: WorkflowTemplate[] = [
    {
        id: "WF-001",
        name: "Protokol Utama (Bupati)",
        description: "Digunakan untuk Perbup, SK Bupati, dan Surat Keluar External.",
        finalSignerRole: "Bupati Tubaba",
        levels: [
            { id: "L1", urutan: 1, roleName: "Pendraft (OPD)", userId: "ANY", type: "draft", isFinal: false },
            { id: "L2", urutan: 2, roleName: "Kabag Hukum", userId: "HUKUM-01", type: "review", isFinal: false },
            { id: "L3", urutan: 3, roleName: "Asisten I/II/III", userId: "ASISTEN-01", type: "paraf", isFinal: false },
            { id: "L4", urutan: 4, roleName: "Sekretaris Daerah", userId: "SEKDA-01", type: "paraf", isFinal: false },
            { id: "L5", urutan: 5, roleName: "Bupati Tubaba", userId: "BUPATI-01", type: "tte", isFinal: true },
        ]
    },
    {
        id: "WF-002",
        name: "Hirarki Sekretariat (Sekda)",
        description: "Untuk Nota Dinas Internal dan Surat Undangan Rapat Staf.",
        finalSignerRole: "Sekretaris Daerah",
        levels: [
            { id: "S1", urutan: 1, roleName: "Kasubag / Analis", userId: "ANY", type: "draft", isFinal: false },
            { id: "S2", urutan: 2, roleName: "Kepala Bagian", userId: "KABAG-01", type: "paraf", isFinal: false },
            { id: "S3", urutan: 3, roleName: "Asisten Terkait", userId: "ASISTEN-01", type: "paraf", isFinal: false },
            { id: "S4", urutan: 4, roleName: "Sekretaris Daerah", userId: "SEKDA-01", type: "tte", isFinal: true },
        ]
    },
    {
        id: "WF-003",
        name: "Otoritas OPD (Kepala Dinas)",
        description: "Surat Tugas, Surat Cuti, dan Nota Internal Dinas.",
        finalSignerRole: "Kepala Dinas",
        levels: [
            { id: "D1", urutan: 1, roleName: "Staf Pelaksana", userId: "ANY", type: "draft", isFinal: false },
            { id: "D2", urutan: 2, roleName: "Kasi / Kasubag", userId: "KASIE-01", type: "review", isFinal: false },
            { id: "D3", urutan: 3, roleName: "Kepala Bidang", userId: "KABID-01", type: "paraf", isFinal: false },
            { id: "D4", urutan: 4, roleName: "Kepala Dinas", userId: "KADIS-01", type: "tte", isFinal: true },
        ]
    }
];

export default function KoordinasiConfigPage() {
    // --- STATE UTAMA ---
    const [workflows, setWorkflows] = useState<WorkflowTemplate[]>(INITIAL_WORKFLOWS);
    const [activeWorkflowId, setActiveWorkflowId] = useState<string | null>(null);

    // --- STATE EDITOR (Untuk Workflow yang sedang dipilih) ---
    const [editorLevels, setEditorLevels] = useState<ApprovalLevel[]>([]);

    // --- STATE MODAL ---
    const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState<ApprovalLevel | null>(null);

    // --- STATE MODAL CREATE NEW WORKFLOW ---
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newWfName, setNewWfName] = useState("");
    const [newWfDesc, setNewWfDesc] = useState("");
    const [newWfSigner, setNewWfSigner] = useState("");

    // Form States
    const [formRole, setFormRole] = useState("");
    const [formType, setFormType] = useState<string>("paraf");
    const [formUser, setFormUser] = useState("");

    // --- LOGIC: DRAG AND DROP REORDER (FIXED) ---
    const handleReorder = (newOrder: ApprovalLevel[]) => {
        // PERBAIKAN: Jangan memutasi object (mapping ulang urutan) di sini.
        // Cukup update urutan array-nya saja agar animasi mulus.
        // Normalisasi data (urutan 1,2,3) dilakukan nanti saat Save.
        setEditorLevels(newOrder);
    };

    // --- LOGIC: CREATE NEW WORKFLOW ---
    const handleCreateWorkflow = () => {
        if (!newWfName || !newWfSigner) {
            toast.error("Nama Alur dan Penandatangan Akhir wajib diisi!");
            return;
        }

        const newId = `WF-${Date.now()}`;
        const newWorkflow: WorkflowTemplate = {
            id: newId,
            name: newWfName,
            description: newWfDesc || "Belum ada deskripsi.",
            finalSignerRole: newWfSigner,
            levels: []
        };

        setWorkflows(prev => [...prev, newWorkflow]);
        setActiveWorkflowId(newId);
        setEditorLevels([]);

        setIsCreateModalOpen(false);
        setNewWfName("");
        setNewWfDesc("");
        setNewWfSigner("");

        toast.success("Alur baru berhasil dibuat. Silakan susun level koordinasi.");
    };

    // --- LOGIC: SWITCH VIEW ---
    const handleSelectWorkflow = (wf: WorkflowTemplate) => {
        setActiveWorkflowId(wf.id);
        setEditorLevels(wf.levels);
    };

    const handleBackToList = () => {
        setActiveWorkflowId(null);
    };

    const handleSaveWorkflow = () => {
        if (!activeWorkflowId) return;

        // PERBAIKAN: Normalisasi urutan dilakukan DI SINI (saat menyimpan), bukan saat drag.
        const normalizedLevels = editorLevels.map((lvl, index) => ({
            ...lvl,
            urutan: index + 1
        }));

        setWorkflows(prev => prev.map(wf =>
            wf.id === activeWorkflowId
                ? { ...wf, levels: normalizedLevels }
                : wf
        ));

        // Update state lokal juga agar sinkron
        setEditorLevels(normalizedLevels);

        toast.success("Struktur Alur Berhasil Disimpan!");
        setActiveWorkflowId(null);
    };

    const handleAddLevel = () => {
        setSelectedLevel(null);
        setFormRole("");
        setFormUser("");
        setFormType("paraf");
        setIsLevelModalOpen(true);
    };

    const handleEditLevel = (lvl: ApprovalLevel) => {
        setSelectedLevel(lvl);
        setFormRole(lvl.roleName);
        setFormUser(lvl.userId);
        setFormType(lvl.type);
        setIsLevelModalOpen(true);
    };

    const handleDeleteLevel = (id: string) => {
        setEditorLevels(prev => prev.filter(l => l.id !== id));
    };

    const handleSaveLevelForm = () => {
        if (selectedLevel) {
            setEditorLevels(prev => prev.map(l => l.id === selectedLevel.id ? {
                ...l, roleName: formRole, userId: formUser, type: formType as any, isFinal: formType === 'tte'
            } : l));
        } else {
            const newLvl: ApprovalLevel = {
                id: `LVL-${Date.now()}`,
                urutan: editorLevels.length + 1,
                roleName: formRole,
                userId: formUser || "ANY",
                type: formType as any,
                isFinal: formType === 'tte'
            };
            setEditorLevels(prev => [...prev, newLvl]);
        }
        setIsLevelModalOpen(false);
    };

    // --- HELPER UI ---
    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'draft': return <Edit3 size={14} />;
            case 'review': return <CheckCircle2 size={14} />;
            case 'paraf': return <Stamp size={14} />;
            case 'tte': return <Fingerprint size={14} />;
            default: return <Stamp size={14} />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'draft': return 'info';
            case 'review': return 'warning';
            case 'paraf': return 'primary';
            case 'tte': return 'success';
            default: return 'primary';
        }
    };

    // ================= RENDER =================

    // 1. VIEW: DAFTAR WORKFLOW (DASHBOARD)
    if (!activeWorkflowId) {
        return (
            <div className="space-y-8 pb-10">
                <header className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-text-primary">
                            Master <span className="text-primary-base">Alur Koordinasi</span>
                        </h1>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Manajemen Template Hierarki Persetujuan</p>
                    </div>
                    <Button
                        variant="primary"
                        className="!bg-primary-base text-white shadow-neumorph gap-2 px-6"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        <Plus size={16} /> Buat Alur Baru
                    </Button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {workflows.map((wf) => (
                        <Card
                            key={wf.id}
                            onClick={() => handleSelectWorkflow(wf)}
                            className="group relative overflow-hidden cursor-pointer hover:border-primary-base/50 transition-all hover:scale-[1.02] shadow-neumorph border-none"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <GitBranch size={80} className="text-primary-base" />
                            </div>

                            <div className="space-y-4 relative z-10">
                                <div className="flex items-start justify-between">
                                    <div className="p-3 bg-surface-secondary rounded-xl shadow-inner text-primary-base">
                                        <Layers size={24} />
                                    </div>
                                    <Badge variant="soft" color="success" className="uppercase font-black text-[9px]">
                                        Aktif
                                    </Badge>
                                </div>

                                <div>
                                    <h3 className="text-lg font-black text-text-primary uppercase leading-tight mb-1 group-hover:text-primary-base transition-colors">
                                        {wf.name}
                                    </h3>
                                    <p className="text-[10px] text-text-muted leading-relaxed line-clamp-2">
                                        {wf.description}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-border-main/10 grid grid-cols-2 gap-4">
                                    <div>
                                        <Typography variant="caption" color="muted" className="block text-[8px] uppercase">Final Signer</Typography>
                                        <Typography variant="body" className="font-bold text-xs truncate">{wf.finalSignerRole}</Typography>
                                    </div>
                                    <div className="text-right">
                                        <Typography variant="caption" color="muted" className="block text-[8px] uppercase">Jumlah Layer</Typography>
                                        <Typography variant="body" className="font-bold text-xs">{wf.levels.length} Tingkatan</Typography>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
                {/* MODAL CREATE NEW WORKFLOW */}
                <Modal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    title="Buat Template Alur Baru"
                >
                    <div className="space-y-6">
                        <div className="p-4 bg-primary-base/5 rounded-xl border border-primary-base/10 flex gap-3 items-start">
                            <GitBranch size={20} className="text-primary-base mt-0.5 shrink-0" />
                            <div>
                                <Typography variant="caption" className="font-bold text-primary-base uppercase">Definisi Template</Typography>
                                <Typography variant="body" className="text-[10px] opacity-70 italic leading-relaxed">
                                    Template ini akan digunakan untuk menentukan siapa saja yang harus memaraf surat sebelum ditandatangani oleh pejabat akhir.
                                </Typography>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-text-muted ml-1">Nama Alur / Template</label>
                                <div className="relative">
                                    <Layout size={14} className="absolute left-4 top-3.5 text-text-muted opacity-50" />
                                    <input
                                        type="text"
                                        placeholder="Contoh: Protokol Surat Keputusan (SK)"
                                        value={newWfName}
                                        onChange={(e) => setNewWfName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-surface-secondary/20 rounded-xl text-xs font-bold shadow-neumorph-inset focus:outline-none focus:ring-2 focus:ring-primary-base/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-text-muted ml-1">Pejabat Penandatangan Akhir (Final Signer)</label>
                                <div className="relative">
                                    <Fingerprint size={14} className="absolute left-4 top-3.5 text-text-muted opacity-50" />
                                    <input
                                        type="text"
                                        placeholder="Contoh: Bupati Tubaba / Kepala Dinas"
                                        value={newWfSigner}
                                        onChange={(e) => setNewWfSigner(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-surface-secondary/20 rounded-xl text-xs font-bold shadow-neumorph-inset focus:outline-none focus:ring-2 focus:ring-primary-base/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-text-muted ml-1">Deskripsi Singkat</label>
                                <div className="relative">
                                    <FileText size={14} className="absolute left-4 top-3.5 text-text-muted opacity-50" />
                                    <textarea
                                        rows={3}
                                        placeholder="Jelaskan kegunaan alur ini..."
                                        value={newWfDesc}
                                        onChange={(e) => setNewWfDesc(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-surface-secondary/20 rounded-xl text-xs font-medium shadow-neumorph-inset focus:outline-none focus:ring-2 focus:ring-primary-base/20 transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 flex gap-3">
                            <Button variant="ghost" className="flex-1" onClick={() => setIsCreateModalOpen(false)}>
                                Batal
                            </Button>
                            <Button
                                variant="primary"
                                className="flex-1 !bg-primary-base text-white shadow-neumorph gap-2"
                                onClick={handleCreateWorkflow}
                            >
                                <Plus size={16} />
                                Buat & Konfigurasi
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }

    // 2. VIEW: EDITOR TREE (DETAIL)
    const activeWorkflowName = workflows.find(w => w.id === activeWorkflowId)?.name;

    return (
        <div className="space-y-8 pb-20">
            {/* EDITOR HEADER */}
            <header className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-border-main/10 pb-6 sticky top-0 bg-surface/95 backdrop-blur-sm z-30 py-4 -mt-4">
                <div className="flex items-center gap-4 w-full">
                    <Button variant="inset" onClick={handleBackToList} className="!p-2.5 rounded-xl shadow-sm hover:text-primary-base">
                        <ArrowLeft size={18} />
                    </Button>
                    <div>
                        <Typography variant="caption" color="muted" className="uppercase tracking-widest text-[9px]">Editing Workflow</Typography>
                        <h2 className="text-xl font-black italic uppercase text-text-primary">{activeWorkflowName}</h2>
                    </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto justify-end">
                    <Button variant="ghost" onClick={handleBackToList}>Batal</Button>
                    <Button variant="primary" onClick={handleSaveWorkflow} className="!bg-primary-base text-white shadow-neumorph gap-2 px-6">
                        <Save size={16} /> Simpan Perubahan
                    </Button>
                </div>
            </header>

            {/* AREA EDITOR TREE */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
                {/* KIRI: VISUAL TREE */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <Typography variant="overline" color="muted" className="flex items-center gap-2">
                            <GitMerge size={12} /> Struktur Level
                        </Typography>
                        <Button variant="ghost" className="text-primary-base !p-2" onClick={handleAddLevel}>
                            <Plus size={16} /> Tambah Level
                        </Button>
                    </div>

                    <div className="relative pl-8 space-y-2">
                        {/* Garis Vertikal Latar */}
                        <div className="absolute left-[54px] top-4 bottom-4 w-0.5 bg-border-main/10 -z-10" />

                        <Reorder.Group
                            axis="y"
                            values={editorLevels}
                            onReorder={handleReorder}
                            // PERBAIKAN 1: Ganti space-y-4 dengan flex-col & gap-4
                            // Ini memastikan margin tidak berubah-ubah saat urutan item ditukar
                            className="flex flex-col gap-4"
                        >
                            {editorLevels.map((lvl, index) => (
                                <Reorder.Item
                                    key={lvl.id}
                                    value={lvl}
                                    // PERBAIKAN 2: Wajib tambahkan prop 'layout' agar saudara-saudaranya minggir dengan mulus
                                    layout

                                    className="relative flex items-center gap-4 group cursor-grab active:cursor-grabbing"

                                    // PERBAIKAN 3: Gunakan 'initial' hanya untuk mount. Hapus 'animate' yang memaksa y:0.
                                    // Biarkan 'layout' yang mengurus posisi vertikal.
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}

                                    // Konfigurasi Drag agar 'lengket' di cursor dan stabil
                                    dragMomentum={false}
                                    whileDrag={{
                                        scale: 1.02,
                                        zIndex: 50,
                                        cursor: "grabbing",
                                    }}
                                    // Tweak transisi agar posisi baru tidak 'memantul' berlebihan
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30
                                    }}
                                >
                                    {/* DRAG HANDLE (Visual) */}
                                    <div className="absolute -left-8 text-text-muted opacity-20 hover:opacity-100 transition-opacity p-2 cursor-grab active:cursor-grabbing">
                                        <GripVertical size={16} />
                                    </div>

                                    {/* NOMOR URUT */}
                                    {/* Pointer-events-none penting agar saat drag cepat, kursor tidak 'tersangkut' event hover di nomor */}
                                    <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center font-black text-xs shadow-neumorph z-10 transition-colors pointer-events-none ${lvl.isFinal ? 'bg-success-base text-white ring-4 ring-success-base/20' : 'bg-surface text-text-muted border border-border-main/20'}`}>
                                        {index + 1}
                                    </div>

                                    {/* KARTU KONTEN */}
                                    {/* Tambahkan select-none agar teks tidak ter-blok biru saat dragging */}
                                    <Card variant="standard" padding="sm" className="flex-1 flex items-center justify-between group-hover:border-primary-base/30 transition-colors select-none">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2.5 rounded-xl shadow-inner ${lvl.type === 'tte' ? 'bg-success-base/10 text-success-base' :
                                                lvl.type === 'paraf' ? 'bg-primary-base/10 text-primary-base' : 'bg-surface-secondary text-text-muted'
                                                }`}>
                                                {getTypeIcon(lvl.type)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-xs md:text-sm text-text-primary uppercase tracking-tight">{lvl.roleName}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="soft" color={getTypeColor(lvl.type) as any} size="sm">
                                                        {lvl.type === 'tte' ? "Penandatangan Utama" : lvl.type.toUpperCase()}
                                                    </Badge>
                                                    <span className="text-[9px] text-text-muted italic flex items-center gap-1">
                                                        <User size={10} /> {lvl.userId}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onPointerDownCapture={(e) => e.stopPropagation()}
                                        >
                                            <Button variant="ghost" className="!p-2 hover:text-warning-base" onClick={() => handleEditLevel(lvl)}>
                                                <Edit3 size={14} />
                                            </Button>
                                            <Button variant="ghost" className="!p-2 hover:text-danger-base" onClick={() => handleDeleteLevel(lvl.id)}>
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    </Card>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>
                    </div>
                </div>

                {/* KANAN: INFO */}
                <div className="space-y-6">
                    <Card variant="inset" padding="md" className="bg-info-base/5 !border-none space-y-4">
                        <div className="flex items-start gap-3">
                            <ShieldCheck size={24} className="text-info-base shrink-0" />
                            <div>
                                <Typography variant="caption" color="info" className="!font-black uppercase">Prinsip Hirarki</Typography>
                                <Typography variant="body" className="text-[10px] opacity-70 mt-1 leading-relaxed">
                                    Geser (Drag) kartu untuk mengubah urutan persetujuan. Pastikan level paling akhir (TTE) berada di posisi paling bawah.
                                </Typography>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* MODAL EDIT LEVEL */}
            <Modal isOpen={isLevelModalOpen}
                onClose={() => setIsLevelModalOpen(false)}
                title={selectedLevel ? "Edit Level" : "Tambah Level"}>
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-text-muted ml-1">Nama Jabatan</label>
                            <input type="text" value={formRole} onChange={(e) => setFormRole(e.target.value)} className="w-full pl-4 pr-4 py-3 bg-surface-secondary/20 rounded-xl text-xs font-bold shadow-neumorph-inset focus:outline-none focus:ring-2 focus:ring-primary-base/20" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-text-muted ml-1">Kode User (Opsional)</label>
                            <input type="text" value={formUser} onChange={(e) => setFormUser(e.target.value)} className="w-full pl-4 pr-4 py-3 bg-surface-secondary/20 rounded-xl text-xs font-bold shadow-neumorph-inset focus:outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-text-muted ml-1">Jenis Aksi</label>
                            <Select
                                options={[{ label: "Draf & Penyusunan", value: "draft" }, { label: "Review & Koreksi", value: "review" }, { label: "Paraf Koordinasi", value: "paraf" }, { label: "TTE Final", value: "tte" }]}
                                value={formType} onChange={(val) => setFormType(val as string)}
                            />
                        </div>
                    </div>
                    <div className="pt-2 flex gap-3">
                        <Button variant="ghost" className="flex-1" onClick={() => setIsLevelModalOpen(false)}>Batal</Button>
                        <Button variant="primary" className="flex-1 !bg-primary-base text-white shadow-neumorph" onClick={handleSaveLevelForm}>Simpan</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}