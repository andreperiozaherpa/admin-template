"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(false);

    // 1. Inisialisasi tema saat komponen dimuat
    useEffect(() => {
        const isDarkMode = document.documentElement.classList.contains("dark");
        setIsDark(isDarkMode);
    }, []);

    // 2. Fungsi Toggle dengan sinkronisasi DOM dan State
    const toggleTheme = () => {
        const newMode = !isDark;
        setIsDark(newMode);

        if (newMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="group relative p-2.5 rounded-xl bg-surface shadow-neumorph active:shadow-neumorph-inset transition-all duration-gentle text-text-secondary overflow-hidden"
            aria-label="Toggle Theme"
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={isDark ? "dark" : "light"}
                    initial={{ y: 20, opacity: 0, rotate: -45 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: -20, opacity: 0, rotate: 45 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="flex items-center justify-center"
                >
                    {isDark ? (
                        <Moon size={18} className="text-primary-base" />
                    ) : (
                        <Sun size={18} className="text-warning-base" />
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Efek Glow Tipis saat Hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-primary-base/5 transition-opacity pointer-events-none" />
        </button>
    );
};