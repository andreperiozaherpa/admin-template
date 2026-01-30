// src/app/(pages)/dokumentation/page.tsx
"use client";

import { motion } from "framer-motion";
import { BookOpen, Zap, Target } from "lucide-react";
import Link from "next/link";

export default function DocumentasiLandingPage() {
    return (
        <div className="space-y-16">
            {/* Hero Section - Pengenalan */}
            <motion.header
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl"
            >
                <h1 className="text-4xl font-black tracking-tight mb-4 leading-tight">
                    Tubaba <span className="text-[var(--theme-base)] italic font-light">Design System</span>
                </h1>
                <p className="text-base text-text-secondary font-light leading-relaxed">
                    Panduan komprehensif untuk membangun antarmuka yang taktil, konsisten, dan elegan.
                    Sistem ini dirancang dengan prinsip atomik untuk memastikan skalabilitas dan harmoni visual.
                </p>
            </motion.header>

            {/* Grid Navigasi Cepat - Menggunakan Neumorphism */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/documentation/atom">
                    <div className="group p-6 bg-surface shadow-neumorph rounded-main hover-tactile border border-border-main/20 cursor-pointer">
                        <div className="w-10 h-10 rounded-xl bg-surface-secondary shadow-neumorph-inset flex items-center justify-center mb-4 text-[var(--theme-base)]">
                            <Zap size={20} />
                        </div>
                        <h2 className="text-lg font-bold mb-2 group-hover:text-[var(--theme-base)] transition-colors">Atoms</h2>
                        <p className="text-sm text-text-muted font-light leading-relaxed">
                            Eksplorasi komponen murni seperti tombol, input, dan tipografi yang menjadi pondasi utama.
                        </p>
                    </div>
                </Link>

                <Link href="/documentation/molecules">
                    <div className="group p-6 bg-surface shadow-neumorph rounded-main hover-tactile border border-border-main/20 cursor-pointer">
                        <div className="w-10 h-10 rounded-xl bg-surface-secondary shadow-neumorph-inset flex items-center justify-center mb-4 text-[var(--theme-base)]">
                            <Target size={20} />
                        </div>
                        <h2 className="text-lg font-bold mb-2 group-hover:text-[var(--theme-base)] transition-colors">Molecules</h2>
                        <p className="text-sm text-text-muted font-light leading-relaxed">
                            Lihat bagaimana Atoms bergabung membentuk struktur yang lebih kompleks seperti search bars dan card.
                        </p>
                    </div>
                </Link>
            </div>

            {/* Pedoman Singkat - Apple Style Typography */}
            <section className="p-8 bg-surface-secondary/30 rounded-[32px] border border-dashed border-border-main">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-main-bg rounded-lg shadow-neumorph text-text-muted">
                        <BookOpen size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Filosofi Desain</h3>
                        <p className="text-sm text-text-secondary font-light leading-relaxed">
                            Gunakan bayangan lembut untuk menciptakan kedalaman visual. Hindari penggunaan warna yang terlalu kontras
                            untuk menjaga kenyamanan mata dan kesan premium yang taktil.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}