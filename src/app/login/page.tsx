"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Mail, Lock, Eye, EyeOff, ArrowRight, Loader2,
    ShieldCheck, Check, AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { authService } from "@/services/auth.service"; // Import Service Baru

// --- Komponen Ikon Google (Dipisah agar file tidak panjang) ---
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4" />
        <path d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3275 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z" fill="#34A853" />
        <path d="M5.50253 14.3003C5.00236 12.8099 5.00236 11.1961 5.50253 9.70575V6.61481H1.51649C-0.18551 10.0056 -0.18551 14.0004 1.51649 17.3912L5.50253 14.3003Z" fill="#FBBC05" />
        <path d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.2401 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50264 9.70575C6.45064 6.86173 9.10947 4.74966 12.2401 4.74966Z" fill="#EA4335" />
    </svg>
);

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    // State Validasi
    const [errors, setErrors] = useState({ email: "", password: "" });

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name as keyof typeof errors]) {
            setErrors({ ...errors, [e.target.name]: "" });
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { email: "", password: "" };

        if (!formData.email) {
            newErrors.email = "Email wajib diisi";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Format email tidak valid";
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = "Password wajib diisi";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // --- LOGIKA UTAMA (Clean Code) ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        // PANGGIL SERVICE (Tidak perlu try-catch lagi untuk logic error)
        const result = await authService.login({
            email: formData.email,
            password: formData.password
        });

        setIsLoading(false); // Matikan loading segera setelah request selesai

        // 1. JIKA GAGAL (success === false)
        if (!result.success) {
            // Tampilkan Toast Error (Pesan diambil dari service)
            toast.error("Gagal Masuk", {
                description: result.message
            });

            // Reset password field (Opsional)
            setFormData(prev => ({ ...prev, password: "" }));
            return; // Stop eksekusi
        }

        // 2. JIKA SUKSES (success === true)
        if (result.success && result.token) {
            // Simpan Token
            authService.saveToken(result.token);

            // Notifikasi Sukses
            toast.success("Login Berhasil!", {
                description: `Selamat datang kembali, ${result.data?.name || 'User'}`
            });

            // Redirect ke Dashboard
            setTimeout(() => {
                router.push("/dashboard");
            }, 800);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">

            {/* Background Animation */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/50 p-8 md:p-10 relative z-10"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-2xl shadow-lg shadow-blue-500/30 mb-5 text-white transform rotate-3 hover:rotate-6 transition-transform duration-300">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">Selamat Datang</h1>
                    <p className="text-sm text-gray-500 mt-2 font-medium">Silakan masuk ke akun Anda</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Input Email */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Email Instansi</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300">
                                <Mail size={20} />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="contoh@instansi.go.id"
                                className={`w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'} rounded-2xl text-sm font-semibold text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-4 transition-all duration-300`}
                            />
                            {errors.email && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500">
                                    <AlertCircle size={18} />
                                </div>
                            )}
                        </div>
                        {errors.email && <p className="text-xs text-red-500 font-medium ml-1 animate-in slide-in-from-top-1">{errors.email}</p>}
                    </div>

                    {/* Input Password */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Password</label>
                        </div>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300">
                                <Lock size={20} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className={`w-full pl-12 pr-12 py-3.5 bg-gray-50/50 border ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'} rounded-2xl text-sm font-semibold text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-4 transition-all duration-300`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none p-1 rounded-md hover:bg-gray-100"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && <p className="text-xs text-red-500 font-medium ml-1 animate-in slide-in-from-top-1">{errors.password}</p>}
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 ${rememberMe ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300 group-hover:border-blue-400'}`}>
                                <input type="checkbox" className="hidden" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                                {rememberMe && <Check size={14} className="text-white" />}
                            </div>
                            <span className="text-xs font-semibold text-gray-500 group-hover:text-gray-700 select-none">Ingat Saya</span>
                        </label>
                        <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all">Lupa Password?</a>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                <span>Memproses...</span>
                            </>
                        ) : (
                            <>
                                <span>Masuk Dashboard</span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                {/* Social Login */}
                <div className="mt-8">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-3 text-gray-400 font-semibold tracking-wider">Atau masuk dengan</span></div>
                    </div>
                    <div className="mt-6 grid grid-cols-1">
                        <button className="flex items-center justify-center gap-3 w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]">
                            <GoogleIcon />
                            <span className="text-sm">Google Workspace</span>
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-[10px] text-gray-400 font-medium">&copy; 2026 Sistem Informasi Keuangan Daerah v2.0</p>
                </div>
            </motion.div>
        </div>
    );
}