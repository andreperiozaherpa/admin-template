"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export const Breadcrumbs = () => {
    const pathname = usePathname();
    const pathSegments = pathname?.split("/").filter((item) => item !== "") || [];

    return (
        <nav className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted select-none">
            <span className="hover:text-text-primary transition-colors cursor-pointer opacity-70">System</span>
            {pathSegments.map((segment, index) => (
                <React.Fragment key={index}>
                    <ChevronRight size={10} className="opacity-30" />
                    <span className={index === pathSegments.length - 1 ? "text-[var(--theme-base)]" : "opacity-70"}>
                        {segment.replace(/-/g, " ")}
                    </span>
                </React.Fragment>
            ))}
        </nav>
    );
};