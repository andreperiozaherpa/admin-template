"use client";

import React, { useState, useEffect } from "react";
import { Box, Layers, Zap, Cpu, Palette, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/Index";

export default function DokumentasiLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Menutup menu otomatis saat berpindah halaman
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const isActive = (path: string) => pathname.includes(path);

    return (
        <main className="flex-1">
            {children}
        </main>
    );
}