"use client";

import React, { useState, useMemo } from "react";
import {
    Plus, Building2, MapPin, Phone, Globe,
    Edit, Trash2, CheckCircle2,
    Layers, Info, Save, Mail, Search
} from "lucide-react";
import {
    Button, Card, Typography, Badge,
    Table, TableRow, TableCell, TablePagination,
    Modal, SearchInput, Loading
} from "@/components/ui/Index";
import { useOPDs } from "@/hooks/useOPDs";
import { OPD } from "@/types/opd";
import { toast } from "sonner";

export default function OrganizationManagementPage() {
    const { opds, loading, error } = useOPDs();
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOPD, setSelectedOPD] = useState<OPD | null>(null);

    const filteredOPDs = useMemo(() => {
        return opds.filter(opd =>
            opd.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
            opd.kode.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [opds, searchQuery]);

    const totalPages = Math.ceil(filteredOPDs.length / itemsPerPage);
    const paginatedOPDs = filteredOPDs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleOpenModal = (opd?: OPD) => {
        setSelectedOPD(opd || null);
        setIsModalOpen(true);
    };

    if (loading) return <div className="flex justify-center p-20"><Loading /></div>;

    return (
        <div className="space-y-8 pb-10">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-text-primary">
                        Manajemen <span className="text-primary-base">Organisasi</span>
                    </h1>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Pengelolaan OPD & Unit Kerja Daerah</p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => handleOpenModal()}
                    className="text-[10px] font-black uppercase tracking-widest px-6 !bg-primary-base text-white gap-2 shadow-neumorph"
                >
                    <Plus size={16} /> Tambah OPD
                </Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card padding="sm" className="flex items-center gap-4 border-none shadow-neumorph">
                    <div className="w-12 h-12 rounded-xl bg-primary-base/10 text-primary-base flex items-center justify-center shadow-inner">
                        <Building2 size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black italic text-text-primary">{opds.length}</h3>
                        <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Total Unit Kerja</p>
                    </div>
                </Card>
                <Card padding="sm" className="flex items-center gap-4 border-none shadow-neumorph">
                    <div className="w-12 h-12 rounded-xl bg-success-base/10 text-success-base flex items-center justify-center shadow-inner">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black italic text-text-primary">{opds.filter(o => o.status === 'active').length}</h3>
                        <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Status Aktif</p>
                    </div>
                </Card>
                <Card padding="sm" className="flex items-center gap-4 border-none shadow-neumorph">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shadow-inner">
                        <Layers size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black italic text-text-primary">1</h3>
                        <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">UPTD / Cabang</p>
                    </div>
                </Card>
            </div>

            <Card variant="standard" padding="lg" className="border-none shadow-neumorph">
                <div className="flex flex-col md:flex-row justify-between items-end mb-6 pb-6 border-b border-border-main/10 gap-4">
                    <div className="w-full md:w-1/3 space-y-2">
                        <span className="text-[10px] font-black uppercase text-text-muted ml-1">Cari Organisasi</span>
                        <SearchInput
                            value={searchQuery}
                            onChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
                            placeholder="Cari nama atau kode instansi..."
                        />
                    </div>
                </div>

                <Table
                    headers={["Kode", "Nama Organisasi", "Kontak & Lokasi", "Status", "Aksi"]}
                    isEmpty={paginatedOPDs.length === 0}
                    footer={
                        totalPages > 0 && (
                            <TablePagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        )
                    }
                >
                    {paginatedOPDs.map((opd, idx) => (
                        <TableRow key={opd.id} index={idx}>
                            <TableCell className="font-bold">
                                <Badge variant="soft" className="uppercase font-black text-[10px] tracking-wider">
                                    {opd.kode}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <p className="font-black italic text-text-primary text-xs uppercase">{opd.nama}</p>
                                <p className="text-[9px] text-text-muted font-bold lowercase">{opd.email}</p>
                            </TableCell>
                            <TableCell>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 text-[9px] text-text-muted font-bold">
                                        <MapPin size={10} className="text-primary-base" />
                                        <span className="truncate max-w-[150px]">{opd.alamat}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[9px] text-text-muted font-bold">
                                        <Phone size={10} className="text-primary-base" />
                                        <span>{opd.telepon}</span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant="soft"
                                    color={opd.status === 'active' ? 'success' : 'muted'}
                                    className="uppercase font-black text-[9px]"
                                >
                                    {opd.status === 'active' ? "Aktif" : "Non-Aktif"}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="expel"
                                        className="!p-2.5 rounded-xl hover:text-primary-base transition-colors"
                                        onClick={() => handleOpenModal(opd)}
                                    >
                                        <Edit size={14} />
                                    </Button>
                                    <Button
                                        variant="expel"
                                        className="!p-2.5 rounded-xl hover:text-danger-base transition-colors"
                                        onClick={() => toast.success("OPD dihapus (Simulasi)")}
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </Table>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedOPD ? "Edit Organisasi" : "Tambah Organisasi Baru"}
            >
                <div className="space-y-6">
                    <div className="p-4 bg-surface-secondary/30 rounded-xl border border-border-main/10 flex gap-3 items-start">
                        <Info size={18} className="text-primary-base mt-0.5 shrink-0" />
                        <div>
                            <Typography variant="caption" className="font-bold text-primary-base uppercase">Struktur Organisasi</Typography>
                            <Typography variant="body" className="text-[10px] opacity-70 italic leading-relaxed">
                                Data OPD akan menjadi dasar distribusi surat elektronik. Pastikan alamat email resmi OPD aktif untuk menerima notifikasi.
                            </Typography>
                        </div>
                    </div>
                    <div className="text-center py-10">
                        <Typography className="text-xs font-black italic text-text-muted uppercase tracking-widest">
                            Formulir Manajemen OPD (Simulasi)
                        </Typography>
                    </div>
                    <div className="pt-2 flex gap-3">
                        <Button variant="ghost" className="flex-1" onClick={() => setIsModalOpen(false)}>Batal</Button>
                        <Button 
                            variant="primary" 
                            className="flex-1 !bg-primary-base text-white shadow-neumorph gap-2"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <Save size={16} /> Simpan Data
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
