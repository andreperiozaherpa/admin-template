"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { Toast, ToastProps, ToastPosition } from "../ui/atom/Toast";

interface ToastContextType {
    toast: (props: Omit<ToastProps, "id" | "onClose" | "position">) => void;
    setPosition: (pos: ToastPosition) => void; // Fungsi baru untuk mengubah posisi
    success: (title: string, desc?: string) => void;
    error: (title: string, desc?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({
    children,
    initialPosition = "bottom-right"
}: {
    children: React.ReactNode;
    initialPosition?: ToastPosition;
}) => {
    const [toasts, setToasts] = useState<Omit<ToastProps, "onClose">[]>([]);
    // Ubah position menjadi state
    const [currentPosition, setCurrentPosition] = useState<ToastPosition>(initialPosition);

    const addToast = useCallback((props: Omit<ToastProps, "id" | "onClose" | "position">) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => currentPosition.includes("top")
            ? [{ ...props, id, position: currentPosition }, ...prev]
            : [...prev, { ...props, id, position: currentPosition }]
        );
    }, [currentPosition]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const positionClasses: Record<ToastPosition, string> = {
        "top-left": "top-6 left-6 items-start",
        "top-right": "top-6 right-6 items-end",
        "top-center": "top-6 left-1/2 -translate-x-1/2 items-center",
        "bottom-left": "bottom-6 left-6 items-start",
        "bottom-right": "bottom-6 right-6 items-end",
        "bottom-center": "bottom-6 left-1/2 -translate-x-1/2 items-center",
    };

    const success = (title: string, desc?: string) => addToast({ title, description: desc, variant: "success" });
    const error = (title: string, desc?: string) => addToast({ title, description: desc, variant: "danger" });

    return (
        <ToastContext.Provider value={{ toast: addToast, setPosition: setCurrentPosition, success, error }}>
            {children}
            {/* Kontainer ini sekarang otomatis pindah posisi saat state berubah */}
            <div className={`fixed z-[200] flex flex-col gap-3 pointer-events-none w-full max-w-sm transition-all duration-500 ${positionClasses[currentPosition]}`}>
                <AnimatePresence mode="popLayout">
                    {toasts.map((t) => (
                        <Toast key={t.id} {...t} onClose={removeToast} position={currentPosition} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within ToastProvider");
    return context;
};