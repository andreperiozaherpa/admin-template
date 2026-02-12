"use client";

import React, { useState, useEffect } from "react";
import {
    ListFilter, Search, Send, CheckSquare, Square,
    ChevronRight, ChevronDown, X, Building, User
} from "lucide-react";
import {
    Button, Card, Badge, Modal,
    Table, TableRow, TableCell
} from "@/components/ui/Index";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// --- IMPORT SERVICE ---
import {
    distribusiService,
    IncomingLetter,
    OrgNode
} from "@/services/surat/distribusiService";

export default function DisposisiPage() {
    // --- STATE DATA (Dari Service) ---
    const [letters, setLetters] = useState<IncomingLetter[]>([]);
    const [orgTree, setOrgTree] = useState<OrgNode[]>([]);

    // --- STATE UI ---
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLetter, setSelectedLetter] = useState<IncomingLetter | null>(null);

    // Form Disposisi State
    const [formDisp, setFormDisp] = useState({
        kepada: [] as string[],
        catatan: "",
        instruksi: [] as string[]
    });

    // Tree View State
    const [expandedNodes, setExpandedNodes] = useState<string[]>(["OPD-01"]);
    const [searchTarget, setSearchTarget] = useState("");

    // --- 1. LOAD DATA ON MOUNT ---
    useEffect(() => {
        // Ambil Data Surat Masuk (Inbox)
        setLetters(distribusiService.getIncomingLetters());
        // Ambil Data Struktur Organisasi (SOTK)
        setOrgTree(distribusiService.getOrgTree());
    }, []);

    // --- HANDLERS ---
    const handleOpenDisposisi = (surat: IncomingLetter) => {
        setSelectedLetter(surat);
        setFormDisp({ kepada: [], catatan: "", instruksi: [] });
        setIsModalOpen(true);
    };

    const handleSubmitDisposisi = () => {
        if (!selectedLetter) return;

        // 1. Panggil Service Update
        distribusiService.processDisposition(selectedLetter.id, {
            kepada: formDisp.kepada,
            instruksi: formDisp.instruksi,
            catatan: formDisp.catatan
        });

        // 2. Refresh Data Lokal
        setLetters(distribusiService.getIncomingLetters());

        toast.success(`Disposisi dikirim ke ${formDisp.kepada.length} penerima`);
        setIsModalOpen(false);
    };

    // --- TREE LOGIC ---
    const toggleExpand = (id: string) => setExpandedNodes(prev => prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]);

    // Helper untuk mengambil semua anak (jika parent dipilih)
    const getAllDescendants = (node: OrgNode): string[] => {
        let results = [node.label];
        if (node.children) node.children.forEach(child => results = [...results, ...getAllDescendants(child)]);
        return results;
    };

    const toggleSelection = (node: OrgNode) => {
        setFormDisp(prev => {
            const familyLabels = getAllDescendants(node);
            const isParentSelected = prev.kepada.includes(node.label);
            const newKepada = isParentSelected
                ? prev.kepada.filter(item => !familyLabels.includes(item))
                : Array.from(new Set([...prev.kepada, ...familyLabels]));
            return { ...prev, kepada: newKepada };
        });
    };

    const removeSingleSelection = (label: string) => {
        setFormDisp(prev => ({ ...prev, kepada: prev.kepada.filter(k => k !== label) }));
    };

    const toggleInstruksi = (item: string) => {
        setFormDisp(prev => {
            const exists = prev.instruksi.includes(item);
            return { ...prev, instruksi: exists ? prev.instruksi.filter(i => i !== item) : [...prev.instruksi, item] };
        });
    };

    // --- RENDERERS ---
    const renderTree = (nodes: OrgNode[], depth = 0) => {
        return nodes.map(node => {
            const matchesSearch = node.label.toLowerCase().includes(searchTarget.toLowerCase());
            if (searchTarget && !matchesSearch && !node.children) return null;
            const isExpanded = expandedNodes.includes(node.id) || searchTarget.length > 0;
            const isSelected = formDisp.kepada.includes(node.label);
            const hasChildren = node.children && node.children.length > 0;

            return (
                <div key={node.id} className="select-none animate-in fade-in duration-300">
                    <div
                        className={`flex items-center gap-3 p-2.5 rounded-xl transition-all cursor-pointer border border-transparent
                            ${isSelected ? 'bg-primary-base/10 border-primary-base/20 shadow-sm' : 'hover:bg-surface-secondary hover:shadow-neumorph-inset'}
                        `}
                        style={{ marginLeft: `${depth * 12}px` }}
                        onClick={() => toggleSelection(node)}
                    >
                        <div onClick={(e) => { e.stopPropagation(); toggleExpand(node.id); }}
                            className={`p-1 rounded-lg text-text-muted transition-colors hover:text-primary-base ${!hasChildren && 'opacity-0 pointer-events-none'}`}>
                            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </div>
                        <div className={`transition-transform duration-200 ${isSelected ? "text-primary-base scale-110" : "text-text-muted opacity-30"}`}>
                            {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                        </div>
                        <span className={`text-[11px] uppercase tracking-wide flex-1 ${isSelected ? 'font-black text-primary-base' : 'font-bold text-text-primary'}`}>{node.label}</span>
                    </div>
                    {hasChildren && isExpanded && <div className="border-l-2 border-border-main/10 ml-5 my-1 pl-1">{renderTree(node.children!, depth + 1)}</div>}
                </div>
            );
        });
    };

    const renderSelectedHierarchy = (nodes: OrgNode[]) => {
        return nodes.map((node) => {
            const isSelected = formDisp.kepada.includes(node.label);
            const hasChildren = node.children && node.children.length > 0;

            // Cek apakah anak-anaknya perlu dirender
            const shouldRenderChildren = hasChildren && (
                isSelected ||
                node.children?.some(child => getAllDescendants(child).some(label => formDisp.kepada.includes(label)))
            );

            if (isSelected) {
                return (
                    <motion.div
                        key={node.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col gap-2 p-2 rounded-xl bg-primary-base/5 border border-primary-base/20 shadow-sm"
                    >
                        <div className="flex justify-between items-center gap-3">
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-primary-base text-white text-[10px] font-black uppercase tracking-wide">
                                {node.label}
                                <X size={12} className="cursor-pointer hover:text-danger-active" onClick={() => removeSingleSelection(node.label)} />
                            </span>

                            {/* --- BAGIAN INI YANG DITAMBAHKAN --- */}
                            {shouldRenderChildren && (
                                <span className="text-[9px] text-primary-base font-bold opacity-50 italic">
                                    Membawahi:
                                </span>
                            )}
                            {/* ----------------------------------- */}
                        </div>

                        {shouldRenderChildren && (
                            <div className="pl-3 ml-2 border-l-2 border-primary-base/10 flex flex-wrap gap-2">
                                {renderSelectedHierarchy(node.children!)}
                            </div>
                        )}
                    </motion.div>
                );
            } else if (shouldRenderChildren) {
                // Jika induk tidak dipilih tapi anaknya ada yang dipilih, render anaknya saja (tanpa wrapper)
                return <React.Fragment key={node.id}>{renderSelectedHierarchy(node.children!)}</React.Fragment>;
            }
            return null;
        });
    };

    return (
        <div className="space-y-8 pb-10">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-text-primary">
                        Manajemen <span className="text-primary-base">Disposisi Pimpinan</span>
                    </h1>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Delegasi Tugas & Arahan Struktural</p>
                </div>
            </header>

            <Card variant="standard" padding="lg" className="border-none shadow-neumorph bg-surface">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-border-main/20 pb-6 gap-4">
                    <div className="w-full md:w-1/3 space-y-2">
                        <label className="text-[10px] font-black uppercase text-text-muted ml-1 flex items-center gap-1"><Search size={10} /> Cari Surat Masuk</label>
                        <input className="w-full pl-4 pr-4 py-3 bg-surface-secondary/50 rounded-xl text-xs font-bold shadow-neumorph-inset focus:outline-none"
                            placeholder="Ketik pengirim atau perihal..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                </div>

                <Table headers={["Tanggal & Tujuan", "Perihal Surat", "Sifat", "Status Disposisi", "Aksi"]}>
                    {letters.filter(l => l.perihal.toLowerCase().includes(searchQuery.toLowerCase())).map((surat, i) => (
                        <TableRow key={surat.id} index={i}>
                            <TableCell>
                                <div className="space-y-1.5">
                                    <span className="font-bold text-[10px] text-text-muted uppercase block">{surat.tglTerima}</span>
                                    {/* Menampilkan Tujuan Surat agar Pimpinan Tahu */}
                                    <Badge variant="outline" size="sm" className="text-[9px] gap-1 px-1.5 py-0.5">
                                        <User size={10} /> Yth. {surat.tujuanSurat}
                                    </Badge>
                                </div>
                            </TableCell>
                            <TableCell className="max-w-md">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-primary-base"><Building size={12} /> {surat.pengirim}</div>
                                    <p className="font-bold text-text-primary text-xs leading-snug line-clamp-2 italic">"{surat.perihal}"</p>
                                </div>
                            </TableCell>
                            <TableCell>
                                {surat.sifat === 'Penting' ? <Badge variant="soft" color="danger">Penting</Badge> : <Badge variant="soft" color="info">Biasa</Badge>}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${surat.status === 'dispositioned' ? 'bg-success-base' : 'bg-warning-base animate-pulse'}`} />
                                    <span className="text-[9px] font-bold uppercase text-text-muted">{surat.status === 'dispositioned' ? 'Selesai' : 'Belum'}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Button variant="primary" className={`!py-2 !px-4 text-[10px] shadow-neumorph gap-2 font-black tracking-wide ${surat.status === 'dispositioned' ? 'bg-success-base text-white' : 'bg-primary-base text-white'}`} onClick={() => handleOpenDisposisi(surat)}>
                                    <Send size={12} /> {surat.status === 'dispositioned' ? 'Lihat Disposisi' : 'Buat Disposisi'}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </Table>
            </Card>

            {/* MODAL DISPOSISI (Fixed Scroll & Sticky Footer) */}
            <Modal size="lg" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Lembar Disposisi Digital">
                <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto max-h-[65vh] pr-2 space-y-5 custom-scrollbar">
                        {/* Selected Count Header */}
                        <div className="p-4 bg-primary-base/5 rounded-2xl border border-primary-base/10 flex justify-between items-center shadow-sm sticky top-0 z-10 backdrop-blur-sm">
                            <span className="text-[10px] font-black text-primary-base uppercase flex items-center gap-2"><ListFilter size={14} /> Pilih Target</span>
                            <Badge variant="soft" color="primary">{formDisp.kepada.length} Dipilih</Badge>
                        </div>
                        {/* Search & Tree (Using state orgTree) */}
                        <div className="relative group">
                            <Search size={14} className="absolute left-4 top-3.5 text-text-muted opacity-50" />
                            <input className="w-full pl-10 pr-4 py-3 bg-surface rounded-xl text-xs font-bold border-none shadow-neumorph-inset focus:outline-none"
                                placeholder="Cari jabatan..." value={searchTarget} onChange={(e) => setSearchTarget(e.target.value)} />
                        </div>
                        <div className="h-64 overflow-y-auto custom-scrollbar border border-border-main/10 rounded-2xl bg-surface-secondary/20 p-3 shadow-neumorph-inset">
                            {renderTree(orgTree)}
                        </div>

                        {/* Selected Tags Preview */}
                        <AnimatePresence>
                            {formDisp.kepada.length > 0 && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="p-3 bg-surface rounded-xl border border-border-main/10 shadow-neumorph-inset overflow-hidden">
                                    <div className="flex flex-col gap-2">
                                        {renderSelectedHierarchy(orgTree)}
                                        <div className="flex flex-wrap gap-2">
                                            {/* Filter untuk item yang tidak ada di tree (jika ada) */}
                                            {formDisp.kepada.filter(label => !orgTree.some(node => getAllDescendants(node).includes(label))).map(item => (
                                                <span key={item} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-secondary text-text-primary border border-border-main text-[10px] font-bold uppercase">
                                                    {item} <X size={12} className="cursor-pointer hover:text-danger-active" onClick={() => removeSingleSelection(item)} />
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Instruksi & Catatan */}
                        <div className="space-y-4 pt-4 border-t border-border-main/10">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-text-muted ml-1">Instruksi</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {["Tindak Lanjuti", "Telaah Staff", "Koordinasikan", "Untuk Diketahui", "Arsipkan", "Wakili"].map(opt => (
                                        <button key={opt} onClick={() => toggleInstruksi(opt)} className={`p-2.5 rounded-xl text-[10px] font-bold text-left flex items-center gap-2 transition-all border ${formDisp.instruksi.includes(opt) ? 'bg-primary-base text-white shadow-md border-transparent' : 'bg-surface hover:bg-surface-secondary border-transparent text-text-secondary shadow-sm'}`}>
                                            <div className={`w-3 h-3 rounded-sm border flex items-center justify-center ${formDisp.instruksi.includes(opt) ? 'border-white bg-white/20' : 'border-text-muted'}`}>{formDisp.instruksi.includes(opt) && <CheckSquare size={10} className="text-white" />}</div>
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-text-muted ml-1">Catatan Khusus</label>
                                <textarea rows={2} className="w-full p-3 bg-surface-secondary/50 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary-base/20 resize-none shadow-neumorph-inset"
                                    placeholder="Tulis arahan detail..." value={formDisp.catatan} onChange={e => setFormDisp({ ...formDisp, catatan: e.target.value })} />
                            </div>
                        </div>
                    </div>
                    {/* Sticky Footer */}
                    <div className="pt-4 mt-2 border-t border-border-main/10 flex gap-3 bg-surface z-20">
                        <Button variant="ghost" className="flex-1 text-text-muted hover:text-danger-base" onClick={() => setIsModalOpen(false)}>Batal</Button>
                        <Button variant="primary" className="flex-1 bg-primary-base text-white shadow-neumorph gap-2 hover:brightness-110" onClick={handleSubmitDisposisi}>
                            <Send size={14} /> Kirim ({formDisp.kepada.length})
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}