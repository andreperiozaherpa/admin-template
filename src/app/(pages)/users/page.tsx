"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/services/api.service";
import { Card } from "@/components/ui/molecules/Card";
import { Button } from "@/components/ui/atom/Button";
import { Input } from "@/components/ui/atom/Input";
import { Select, SelectOption } from "@/components/ui/atom/Select";
import { PageSkeleton, ListDataSkeleton } from "@/components/ui/molecules/PageSkeleton";
import { Search, X, Plus, Pencil, Trash2, Users as UsersIcon } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: number;
  name: string;
  email: string;
  nip?: string;
  role: string;
  bank_id?: number;
  created_at: string;
}

const ROLE_OPTIONS: SelectOption[] = [
  { label: "Semua Role", value: "" },
  { label: "Administrator", value: "admin" },
  { label: "Bank", value: "bank" },
  { label: "Viewer", value: "viewer" },
];

const ROLE_SELECT_OPTIONS: SelectOption[] = [
  { label: "Pilih Role", value: "" },
  { label: "Administrator", value: "admin" },
  { label: "Bank", value: "bank" },
  { label: "Viewer", value: "viewer" },
];

export default function UsersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    nip: "",
    role: "viewer",
    bank_id: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const params: Record<string, string> = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedRole) params.role = selectedRole;

      const response = await api.getUsers(params) as { data: User[] };
      setUsers(response.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Gagal memuat data user");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedRole]);

  const openModal = (user?: User) => {
    if (user) {
      setIsEditMode(true);
      setSelectedUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        nip: user.nip || "",
        role: user.role,
        bank_id: user.bank_id?.toString() || "",
      });
    } else {
      setIsEditMode(false);
      setSelectedUser(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        nip: "",
        role: "viewer",
        bank_id: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setIsEditMode(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data: any = {
        name: formData.name,
        email: formData.email,
        nip: formData.nip || undefined,
        role: formData.role,
        bank_id: formData.bank_id ? parseInt(formData.bank_id) : undefined,
      };

      if (formData.password) {
        data.password = formData.password;
      }

      if (isEditMode && selectedUser) {
        await api.updateUser(selectedUser.id, data);
        toast.success("User berhasil diperbarui");
      } else {
        await api.createUser(data as any);
        toast.success("User berhasil dibuat");
      }

      closeModal();
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus user "${user.name}"?`)) {
      return;
    }

    try {
      await api.deleteUser(user.id);
      toast.success("User berhasil dihapus");
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus user");
    }
  };

  if (isLoading) {
    return <ListDataSkeleton />;
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Kelola User</h1>
        <p className="text-gray-500 mt-1 flex items-center gap-2">
          <UsersIcon size={14} /> Tambah, edit, atau hapus user sistem
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Cari nama, email, atau NIP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Role Filter */}
        <Select
          label=""
          options={ROLE_OPTIONS}
          value={selectedRole}
          onChange={setSelectedRole}
          variant="neumorph"
          className="w-full md:w-48"
        />

        {/* Add Button */}
        <Button
          onClick={() => openModal()}
          className="flex items-center gap-2"
        >
          <Plus size={18} />
          Tambah User
        </Button>
      </div>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">NIP</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    Tidak ada data user
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{user.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 font-mono">{user.nip || "-"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'bank' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : user.role === 'bank' ? 'Bank' : 'Viewer'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          onClick={() => openModal(user)}
                          className="p-2"
                        >
                          <Pencil size={16} className="text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => handleDelete(user)}
                          className="p-2"
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[120] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {isEditMode ? "Edit User" : "Tambah User"}
              </h2>
              <Button variant="ghost" onClick={closeModal}>
                <X size={20} />
              </Button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {isEditMode && <span className="text-gray-400">(Kosongkan jika tidak diubah)</span>}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={!isEditMode}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIP (Opsional)</label>
                <input
                  type="text"
                  value={formData.nip}
                  onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {ROLE_SELECT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={closeModal}
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Menyimpan..." : isEditMode ? "Simpan Perubahan" : "Buat User"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
