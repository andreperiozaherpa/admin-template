"use client";

import React, { useState, useMemo } from "react";
import {
    Plus, Search, User as UserIcon, Shield, Briefcase, 
    Edit, Trash2, CheckCircle2, XCircle,
    Users as UsersIcon, AlertCircle, Save, Info, Mail, Fingerprint
} from "lucide-react";
import {
    Button, Card, Typography, Badge,
    Table, TableRow, TableCell, TablePagination,
    Modal, SearchInput, Loading
} from "@/components/ui/Index";
import { useUsers } from "@/hooks/useUsers";
import { User } from "@/types/user";
import { toast } from "sonner";

export default function UserManagementPage() {
    const { users, loading, error, refresh } = useUsers();
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    // State Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Filter Logic
    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.nip.includes(searchQuery) ||
            user.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [users, searchQuery]);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleOpenModal = (user?: User) => {
        if (user) {
            setIsEditing(true);
            setSelectedUser(user);
        } else {
            setIsEditing(false);
            setSelectedUser(null);
        }
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
            toast.success("Pengguna berhasil dihapus (Simulasi)");
            // In a real app, we would call a service and refresh
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loading /></div>;
    if (error) return <div className="p-10 text-danger-base uppercase font-black italic">Error: {error}</div>;

    return (
        <div className="space-y-8 pb-10">
            {/* 1. HEADER SECTION */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-text-primary">
                        Manajemen <span className="text-primary-base">User</span>
                    </h1>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Pengelolaan Akun & Hak Akses Pegawai</p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => handleOpenModal()}
                    className="text-[10px] font-black uppercase tracking-widest px-6 !bg-primary-base text-white gap-2 shadow-neumorph"
                >
                    <Plus size={16} /> Tambah User
                </Button>
            </header>

            {/* 2. STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card padding="sm" className="flex items-center gap-4 border-none shadow-neumorph">
                    <div className="w-12 h-12 rounded-xl bg-primary-base/10 text-primary-base flex items-center justify-center shadow-inner">
                        <UsersIcon size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black italic text-text-primary">{users.length}</h3>
                        <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Total User</p>
                    </div>
                </Card>
                <Card padding="sm" className="flex items-center gap-4 border-none shadow-neumorph">
                    <div className="w-12 h-12 rounded-xl bg-success-base/10 text-success-base flex items-center justify-center shadow-inner">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black italic text-text-primary">{users.filter(u => u.status === 'active').length}</h3>
                        <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Aktif</p>
                    </div>
                </Card>
                <Card padding="sm" className="flex items-center gap-4 border-none shadow-neumorph">
                    <div className="w-12 h-12 rounded-xl bg-warning-base/10 text-warning-base flex items-center justify-center shadow-inner">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black italic text-text-primary">{users.filter(u => u.role === 'admin').length}</h3>
                        <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Admin</p>
                    </div>
                </Card>
                <Card padding="sm" className="flex items-center gap-4 border-none shadow-neumorph">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shadow-inner">
                        <Briefcase size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black italic text-text-primary">3</h3>
                        <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Jabatan Berbeda</p>
                    </div>
                </Card>
            </div>

            {/* 3. MAIN TABLE CONTENT */}
            <Card variant="standard" padding="lg" className="border-none shadow-neumorph">
                <div className="flex flex-col md:flex-row justify-between items-end mb-6 pb-6 border-b border-border-main/10 gap-4">
                    <div className="w-full md:w-1/3 space-y-2">
                        <span className="text-[10px] font-black uppercase text-text-muted ml-1">Cari Pegawai</span>
                        <SearchInput
                            value={searchQuery}
                            onChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
                            placeholder="Cari nama, NIP, atau username..."
                        />
                    </div>
                </div>

                <Table
                    headers={["Nama / NIP", "Username", "Jabatan", "Role", "Status", "Aksi"]}
                    isEmpty={paginatedUsers.length === 0}
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
                    {paginatedUsers.map((user, idx) => (
                        <TableRow key={user.id} index={idx}>
                            <TableCell>
                                <div className="space-y-0.5">
                                    <p className="font-black italic text-text-primary text-xs uppercase">{user.name}</p>
                                    <div className="flex items-center gap-1.5 text-[9px] text-text-muted font-bold">
                                        <Fingerprint size={10} />
                                        <span>NIP. {user.nip}</span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-xs font-bold text-text-muted">
                                @{user.username}
                            </TableCell>
                            <TableCell>
                                <div className="space-y-0.5">
                                    <p className="text-xs font-black text-text-primary uppercase">{user.jabatan}</p>
                                    <p className="text-[9px] text-primary-base font-bold uppercase">{user.pangkat} ({user.golongan})</p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="neumorph" className="uppercase font-black text-[9px] px-3">
                                    {user.role}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant="soft"
                                    color={user.status === 'active' ? 'success' : 'muted'}
                                    className="uppercase font-black text-[9px]"
                                >
                                    {user.status === 'active' ? "Aktif" : "Non-Aktif"}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="expel"
                                        className="!p-2.5 rounded-xl hover:text-primary-base transition-colors"
                                        onClick={() => handleOpenModal(user)}
                                    >
                                        <Edit size={14} />
                                    </Button>
                                    <Button
                                        variant="expel"
                                        className="!p-2.5 rounded-xl hover:text-danger-base transition-colors"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </Table>
            </Card>

            {/* 4. MODAL SIMULATION */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={isEditing ? "Edit Pengguna" : "Tambah Pengguna Baru"}
            >
                <div className="space-y-6">
                    <div className="p-4 bg-surface-secondary/30 rounded-xl border border-border-main/10 flex gap-3 items-start">
                        <Info size={18} className="text-primary-base mt-0.5 shrink-0" />
                        <div>
                            <Typography variant="caption" className="font-bold text-primary-base uppercase">Informasi Pegawai</Typography>
                            <Typography variant="body" className="text-[10px] opacity-70 italic leading-relaxed">
                                Pastikan NIP dan Jabatan sesuai dengan data kepegawaian resmi untuk integrasi tanda tangan elektronik.
                            </Typography>
                        </div>
                    </div>
                    <div className="text-center py-10">
                        <Typography className="text-xs font-black italic text-text-muted uppercase tracking-widest">
                            Formulir Manajemen User (Simulasi)
                        </Typography>
                        <p className="text-[10px] text-text-muted/60 mt-2 italic px-10">Antarmuka input data akan muncul di sini sesuai dengan kebutuhan field E-Office.</p>
                    </div>
                    <div className="pt-2 flex gap-3">
                        <Button variant="ghost" className="flex-1" onClick={() => setIsModalOpen(false)}>Batal</Button>
                        <Button 
                            variant="primary" 
                            className="flex-1 !bg-primary-base text-white shadow-neumorph gap-2"
                            onClick={() => {
                                toast.success("Data berhasil disimpan (Simulasi)");
                                setIsModalOpen(false);
                            }}
                        >
                            <Save size={16} /> Simpan Data
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
