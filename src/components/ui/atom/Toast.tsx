"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Alert, AlertVariant } from "./Alert";

export type ToastPosition =
    | "top-left" | "top-right" | "top-center"
    | "bottom-left" | "bottom-right" | "bottom-center";

export interface ToastProps {
    id: string;
    title?: string;
    description?: string;
    variant?: AlertVariant;
    duration?: number;
    onClose: (id: string) => void;
    position?: ToastPosition; // Tambahkan prop posisi
}

export const Toast = ({
    id,
    title,
    description,
    variant = "default",
    duration = 5000,
    onClose,
    position = "top-right"
}: ToastProps) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const timer = setTimeout(() => onClose(id), duration);
        return () => clearTimeout(timer);
    }, [id, duration, onClose]);

    if (!mounted) return null;

    // Konfigurasi arah animasi berdasarkan posisi
    const variants = {
        initial: {
            opacity: 0,
            x: position.includes("right") ? 80 : position.includes("left") ? -80 : 0,
            y: position.includes("top") ? -40 : 40,
            scale: 0.9
        },
        animate: {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            filter: "blur(4px)",
            transition: { duration: 0.2 }
        }
    };

    return (
        <motion.div
            layout // Mengaktifkan perpindahan posisi otomatis yang halus
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            // Menggunakan spring yang lebih 'bouncy' agar terasa taktil
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
                mass: 0.8
            }}
            className="pointer-events-auto w-full max-w-sm"
        >
            <Alert
                variant={variant}
                title={title}
                description={description}
                onClose={() => onClose(id)}
                className="shadow-2xl !rounded-[24px] border-white/40 dark:border-white/5"
            />
        </motion.div>
    );
};