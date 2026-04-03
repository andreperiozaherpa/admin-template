"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DokumentasiLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const isActive = (path: string) => pathname.includes(path);

    return (
        <main className="flex-1">
            {children}
        </main>
    );
}