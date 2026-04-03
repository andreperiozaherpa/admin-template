// src/services/api.service.ts
import { authService } from "./auth.service";
import { useRouter } from "next/navigation";

const API_BASE_URL = "http://localhost:8001/api";

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = authService.getToken();

  const headers: HeadersInit = {
    Accept: "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 - Unauthorized
  if (response.status === 401) {
    await authService.logout();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Sesi berakhir. Silakan login kembali.");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Error" }));
    throw new Error(error.message || "Request failed");
  }

  return response.json();
}

export const api = {
  // Dashboard
  getDashboard: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return fetchWithAuth(`/dashboard${query}`);
  },

  getDashboardSummary: () => fetchWithAuth("/dashboard/summary"),

  getDashboardComparison: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return fetchWithAuth(`/dashboard/comparison${query}`);
  },

  getTopRekening: (jenis?: string) => {
    const query = jenis ? `?jenis=${jenis}` : "";
    return fetchWithAuth(`/dashboard/top-rekening${query}`);
  },

  getBanks: () => fetchWithAuth("/dashboard/banks"),

  // Saldo
  uploadSaldo: async (file: File, tanggal: string) => {
    const token = authService.getToken();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("tanggal", tanggal);

    const response = await fetch(`${API_BASE_URL}/saldo/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Upload failed");
    }

    return response.json();
  },

  getSaldo: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return fetchWithAuth(`/saldo${query}`);
  },

  deleteSaldoByDate: async (tanggal: string) => {
    return fetchWithAuth(`/saldo?tanggal=${encodeURIComponent(tanggal)}`, {
      method: "DELETE",
    });
  },

  getLatestSaldo: () => fetchWithAuth("/saldo/latest"),

  getSaldoSummary: () => fetchWithAuth("/saldo/summary"),

  getSaldoHistory: (rekeningId: string) =>
    fetchWithAuth(`/saldo/history?rekening_id=${rekeningId}`),

  // Users
  getUsers: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return fetchWithAuth(`/users${query}`);
  },

  createUser: async (data: {
    name: string;
    email: string;
    password: string;
    nip?: string;
    role: string;
    bank_id?: number;
  }) => {
    return fetchWithAuth("/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  updateUser: async (id: number, data: {
    name: string;
    email: string;
    password?: string;
    nip?: string;
    role: string;
    bank_id?: number;
  }) => {
    return fetchWithAuth(`/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  deleteUser: async (id: number) => {
    return fetchWithAuth(`/users/${id}`, {
      method: "DELETE",
    });
  },
};