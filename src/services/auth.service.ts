// src/services/auth.service.ts

// Ini mencegah error CORS saat development.
const API_BASE_URL = "/api";

export interface LoginPayload {
  email: string;
  password: string;
}

// Interface untuk hasil yang dikembalikan ke UI (Login Page)
// Kita menggunakan format ini agar tidak perlu melakukan throw Error
export interface LoginResult {
  success: boolean;
  message: string;
  data?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token?: string;
}

export const authService = {
  /**
   * Mengirim permintaan login ke API
   * Mengembalikan objek status (success: true/false) tanpa melempar Error exception
   */
  async login(payload: LoginPayload): Promise<LoginResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Coba parsing JSON response
      let data;
      try {
        data = await response.json();
      } catch (err) {
        // Jika server error fatal (500) dan mengembalikan HTML/Teks biasa
        return {
          success: false,
          message: "Terjadi kesalahan server (Invalid JSON response).",
        };
      }

      // 1. JIKA STATUS TIDAK OK (Misal 400, 401, 404, 500)
      if (!response.ok) {
        // Ambil pesan error dari backend
        // Prioritas: data.message -> data.error -> Default text
        const errorMessage =
          data.message || data.error || "Gagal masuk. Periksa kredensial Anda.";

        return {
          success: false,
          message: errorMessage, // Pesan ini nanti ditampilkan di Toast
        };
      }

      // 2. JIKA STATUS OK TAPI TOKEN TIDAK ADA
      if (!data.metadata?.token) {
        return {
          success: false,
          message: "Token tidak ditemukan dalam respons server.",
        };
      }

      // 3. JIKA SUKSES
      return {
        success: true,
        message: "Login berhasil.",
        data: data.data,
        token: data.metadata.token,
      };
    } catch (error: any) {
      // Menangani error jaringan (offline / DNS failed)
      return {
        success: false,
        message: "Terjadi kesalahan jaringan. Periksa koneksi internet Anda.",
      };
    }
  },

  /**
   * Menyimpan token ke LocalStorage & Cookies
   */
  saveToken(token: string) {
    if (typeof window !== "undefined") {
      // Simpan di LocalStorage untuk akses cepat di client
      localStorage.setItem("token", token);

      // Simpan di Cookie untuk keamanan tambahan & middleware
      document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Strict; Secure`;
    }
  },

  /**
   * Menghapus sesi (Logout)
   */
  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  },
};
