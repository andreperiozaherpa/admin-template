// src/services/auth.service.ts

// Laravel backend API
const API_BASE_URL = "http://localhost:8001/api";

export interface LoginPayload {
  email: string;
  password: string;
}

// Interface untuk hasil yang dikembalikan ke UI (Login Page)
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

export type UserRole = 'admin' | 'bank' | 'viewer';

export const authService = {
  /**
   * Login ke Laravel backend
   */
  async login(payload: LoginPayload): Promise<LoginResult> {
    try {
      const apiUrl = `${API_BASE_URL}/login`;
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let data;
      try {
        data = await response.json();
      } catch (err) {
        return {
          success: false,
          message: "Terjadi kesalahan server.",
        };
      }

      if (!response.ok) {
        const errorMessage = data?.message || "Gagal masuk.";
        return {
          success: false,
          message: errorMessage,
        };
      }

      if (!data.metadata?.token) {
        return {
          success: false,
          message: "Token tidak ditemukan.",
        };
      }

      return {
        success: true,
        message: "Login berhasil.",
        data: data.data,
        token: data.metadata.token,
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Terjadi kesalahan jaringan.",
      };
    }
  },

  /**
   * Logout dari Laravel
   */
  async logout() {
    const token = this.getToken();
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/logout`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
          },
        });
      } catch (e) {
        // Ignore
      }
    }
    
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userData");
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  },

  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  },

  saveToken(token: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Strict; Secure`;
    }
  },

  getRole(): UserRole | null {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("userRole");
      if (role === 'admin' || role === 'bank' || role === 'viewer') {
        return role;
      }
      
      // Fallback: cek apakah ada token tapi role belum diset
      const token = localStorage.getItem("token");
      if (token) {
        // Coba parsing userData
        const userData = localStorage.getItem("userData");
        if (userData) {
          try {
            const parsed = JSON.parse(userData);
            if (parsed.role === 'admin' || parsed.role === 'bank' || parsed.role === 'viewer') {
              // Simpan role untuk caching
              localStorage.setItem("userRole", parsed.role);
              return parsed.role;
            }
          } catch (e) {
            // Ignore parse error
          }
        }
      }
    }
    return null;
  },

  setRole(role: UserRole) {
    if (typeof window !== "undefined") {
      localStorage.setItem("userRole", role);
    }
  },

  setUserData(data: { id: string; name: string; email: string; role: string }) {
    if (typeof window !== "undefined") {
      localStorage.setItem("userData", JSON.stringify(data));
      localStorage.setItem("userRole", data.role);
    }
  },

  getUserData(): { id: string; name: string; email: string; role: string } | null {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("userData");
      if (data) {
        return JSON.parse(data);
      }
    }
    return null;
  },

  hasRole(...roles: UserRole[]): boolean {
    const currentRole = this.getRole();
    if (!currentRole) return false;
    return roles.includes(currentRole as UserRole);
  },

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  },

  isBank(): boolean {
    return this.getRole() === 'bank';
  },

  isViewer(): boolean {
    return this.getRole() === 'viewer';
  },
};
