"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
    Send, CheckCircle2, Users, Search,
    FileText, Globe, Building2, CheckSquare, Square
} from "lucide-react";
import {
    Button, Card, Badge, Modal,
    Table, TableRow, TableCell, SearchInput
} from "@/components/ui/Index";
import { toast } from "sonner";

// --- IMPORT SERVICE ---
import {
    distribusiService,
    OutgoingLetter,
    OpdTarget
} from "@/services/surat/distribusiService";

export default function DistribusiPage() {
    // --- STATE DATA (Dari Service) ---
    const [letters, setLetters] = useState<OutgoingLetter[]>([]);
    const [opdList, setOpdList] = useState<OpdTarget[]>([]);

    // --- STATE UI ---
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State Modal Distribusi
    const [selectedLetter, setSelectedLetter] = useState<OutgoingLetter | null>(null);
    const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
    const [searchTarget, setSearchTarget] = useState("");

    // --- 1. LOAD DATA ON MOUNT ---
    useEffect(() => {
        // Ambil data surat keluar (Ini akan otomatis sync dengan verified draft)
        setLetters(distribusiService.getOutgoingLetters());
        // Ambil master data OPD
        setOpdList(distribusiService.getOpdList());
    }, []);

    // --- LOGIC: FILTER SURAT ---
    const filteredLetters = useMemo(() => {
        return letters.filter(l =>
            l.perihal.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.noSurat.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [letters, searchQuery]);

    // --- LOGIC: FILTER TARGET (DI DALAM MODAL) ---
    const filteredTargets = useMemo(() => {
        return opdList.filter(opd =>
            opd.nama.toLowerCase().includes(searchTarget.toLowerCase())
        );
    }, [opdList, searchTarget]);

    // --- HANDLERS ---

    const handleOpenDistribusi = (surat: OutgoingLetter) => {
        setSelectedLetter(surat);
        // Pre-select OPD yang sudah menerima surat ini
        setSelectedTargets(surat.penerima);
        setIsModalOpen(true);
    };

    const toggleTarget = (id: string) => {
        setSelectedTargets(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedTargets.length === filteredTargets.length) {
            setSelectedTargets([]); // Deselect jika sudah semua
        } else {
            const allVisibleIds = filteredTargets.map(t => t.id);
            const newSelection = Array.from(new Set([...selectedTargets, ...allVisibleIds]));
            setSelectedTargets(newSelection);
        }
    };

    const handleSubmitDistribusi = () => {
        if (!selectedLetter) return;

        // 1. Panggil Service untuk update data
        distribusiService.distributeLetter(selectedLetter.id, selectedTargets);

        // 2. Refresh State Lokal untuk update tampilan tabel
        setLetters(distribusiService.getOutgoingLetters());

        toast.success(`Surat berhasil didistribusikan ke ${selectedTargets.length} OPD`);
        setIsModalOpen(false);
    };

    // --- RENDER HELPERS ---
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed': return <Badge variant="soft" color="success" icon={CheckCircle2}>Selesai</Badge>;
            case 'partial': return <Badge variant="soft" color="warning" icon={Users}>Sebagian</Badge>;
            default: return <Badge variant="soft" color="muted" icon={Send}>Belum</Badge>;
        }
    };

    return (
        <div className="space-y-8 pb-10">
            {/* HEADER */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-text-primary">
                        Distribusi <span className="text-primary-base">Surat Keluar</span>
                    </h1>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Penyebaran Dokumen TTE ke OPD</p>
                </div>

                {/* Stats Simple */}
                <div className="flex gap-3">
                    <Card padding="sm" className="flex items-center gap-3 !py-2 px-4 border-none bg-primary-base/5">
                        <FileText size={18} className="text-primary-base" />
                        <div>
                            <span className="block text-[10px] uppercase font-black opacity-60">Siap Kirim</span>
                            <span className="text-lg font-black text-primary-base leading-none">{letters.filter(l => l.statusDistribusi === 'pending').length}</span>
                        </div>
                    </Card>
                    <Card padding="sm" className="flex items-center gap-3 !py-2 px-4 border-none bg-success-base/5">
                        <Globe size={18} className="text-success-base" />
                        <div>
                            <span className="block text-[10px] uppercase font-black opacity-60">Terdistribusi</span>
                            <span className="text-lg font-black text-success-base leading-none">{letters.filter(l => l.statusDistribusi === 'completed').length}</span>
                        </div>
                    </Card>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <Card variant="standard" padding="lg" className="border-none shadow-neumorph bg-surface">
                <div className="flex justify-between items-end mb-6 pb-6 border-b border-border-main/10">
                    <div className="w-full md:w-1/3">
                        <SearchInput
                            placeholder="Cari No Surat atau Perihal..."
                            value={searchQuery}
                            onChange={setSearchQuery}
                        />
                    </div>
                </div>

                <Table headers={["No. Surat / Tanggal", "Perihal", "Penandatangan", "Status Distribusi", "Aksi"]}>
                    {filteredLetters.map((surat, i) => (
                        <TableRow key={surat.id} index={i}>
                            <TableCell>
                                <div className="space-y-1">
                                    <p className="font-black text-[11px] text-text-primary uppercase tracking-wide">{surat.noSurat}</p>
                                    <p className="text-[9px] text-text-muted italic">{surat.tglTTE}</p>
                                </div>
                            </TableCell>
                            <TableCell className="max-w-xs truncate font-bold text-text-primary">
                                {surat.perihal}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-surface-secondary flex items-center justify-center text-[10px] font-black">
                                        {surat.penandatangan.charAt(0)}
                                    </div>
                                    <span className="text-[10px] font-bold uppercase text-text-muted">{surat.penandatangan}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col items-start gap-1">
                                    {getStatusBadge(surat.statusDistribusi)}
                                    <span className="text-[8px] font-bold text-text-muted">
                                        {surat.penerima.length} / {opdList.length} Penerima
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="primary"
                                    className="!py-2 !px-4 text-[10px] uppercase font-black tracking-wider shadow-neumorph gap-2 !bg-primary-base text-white hover:brightness-110"
                                    onClick={() => handleOpenDistribusi(surat)}
                                >
                                    <Send size={12} /> Distribusi
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </Table>
            </Card>

            {/* MODAL DISTRIBUSI */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Distribusikan Surat"
            >
                <div className="flex flex-col h-full">

                    {/* AREA KONTEN SCROLLABLE */}
                    <div className="flex-1 overflow-y-auto max-h-[65vh] pr-2 custom-scrollbar space-y-6">

                        {/* 1. Info Surat Context */}
                        {selectedLetter && (
                            <div className="p-4 bg-primary-base/5 rounded-2xl border border-primary-base/10 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Send size={40} className="text-primary-base" />
                                </div>
                                <div className="relative z-10 space-y-1">
                                    <div className="flex justify-between items-start">
                                        <span className="text-[9px] font-black uppercase text-primary-base tracking-widest">
                                            Surat Terpilih
                                        </span>
                                        <Badge variant="outline" size="sm" className="bg-surface/50 backdrop-blur-sm">
                                            {selectedLetter.noSurat}
                                        </Badge>
                                    </div>
                                    <p className="text-sm font-black text-text-primary italic leading-relaxed pr-8">
                                        "{selectedLetter.perihal}"
                                    </p>
                                    <div className="flex items-center gap-2 pt-1">
                                        <Badge variant="soft" size="sm" color="info" className="text-[9px]">
                                            {selectedLetter.penandatangan}
                                        </Badge>
                                        <span className="text-[9px] font-mono text-text-muted">
                                            {selectedLetter.tglTTE}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. Selector Controls */}
                        <div className="space-y-3">
                            {/* Header Control */}
                            <div className="flex items-center justify-between px-1">
                                <h4 className="text-[10px] font-black uppercase text-text-muted flex items-center gap-2">
                                    <Building2 size={12} /> Target Penerima
                                    <span className="bg-primary-base text-white px-1.5 py-0.5 rounded text-[9px]">
                                        {selectedTargets.length}
                                    </span>
                                </h4>
                                <Button
                                    variant="ghost"
                                    className="!p-1.5 h-auto text-[10px] text-primary-base hover:bg-primary-base/10 gap-1"
                                    onClick={toggleSelectAll}
                                >
                                    {selectedTargets.length === filteredTargets.length ? (
                                        <><Square size={12} /> Batalkan Semua</>
                                    ) : (
                                        <><CheckSquare size={12} /> Pilih Semua ({filteredTargets.length})</>
                                    )}
                                </Button>
                            </div>

                            {/* Search Input */}
                            <div className="relative group">
                                <Search size={14} className="absolute left-4 top-3.5 text-text-muted opacity-50" />
                                <input
                                    type="text"
                                    placeholder="Cari nama dinas / badan / bagian..."
                                    value={searchTarget}
                                    onChange={(e) => setSearchTarget(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-surface rounded-xl text-xs font-bold border-none shadow-neumorph-inset focus:outline-none focus:ring-2 focus:ring-primary-base/20 placeholder:text-text-muted/50 transition-all"
                                />
                            </div>

                            {/* List OPD Container */}
                            <div className="border border-border-main/10 rounded-2xl bg-surface-secondary/20 p-2 min-h-[200px] shadow-neumorph-inset">
                                {filteredTargets.length > 0 ? (
                                    <div className="space-y-1">
                                        {filteredTargets.map((opd) => {
                                            const isSelected = selectedTargets.includes(opd.id);
                                            return (
                                                <div
                                                    key={opd.id}
                                                    onClick={() => toggleTarget(opd.id)}
                                                    className={`
                                                        flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 border 
                                                        ${isSelected
                                                            ? 'bg-primary-base text-white border-primary-base/50 shadow-md transform scale-[1.01]'
                                                            : 'bg-surface hover:bg-surface-secondary border-transparent hover:shadow-sm text-text-primary'
                                                        }
                                                    `}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-colors 
                                                            ${isSelected ? 'bg-white/20 text-white' : 'bg-surface-secondary text-text-muted'}`}>
                                                            {opd.nama.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold leading-none mb-1">{opd.nama}</p>
                                                            <p className={`text-[9px] uppercase font-bold tracking-wider 
                                                                ${isSelected ? 'text-white/70' : 'text-text-muted'}`}>
                                                                {opd.kategori}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className={`transition-transform duration-200 ${isSelected ? 'text-white scale-110' : 'text-text-muted opacity-20'}`}>
                                                        {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="h-40 flex flex-col items-center justify-center text-text-muted opacity-50">
                                        <Building2 size={32} className="mb-2" />
                                        <p className="text-[10px] font-bold uppercase">Tidak ditemukan</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* FIXED FOOTER (Actions) */}
                    <div className="pt-4 mt-2 border-t border-border-main/10 bg-surface z-20 flex gap-3">
                        <Button variant="ghost" className="flex-1 text-text-muted hover:text-danger-base" onClick={() => setIsModalOpen(false)}>
                            Batal
                        </Button>
                        <Button
                            variant="primary"
                            className="flex-1 !bg-primary-base text-white shadow-neumorph gap-2 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleSubmitDistribusi}
                            disabled={selectedTargets.length === 0}
                        >
                            <Send size={16} />
                            Kirim ({selectedTargets.length})
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}