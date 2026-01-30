"use client";

import React, { useState } from "react";
import { User } from "lucide-react";
import { motion } from "framer-motion";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string;
    alt?: string;
    initials?: string;
    size?: "sm" | "md" | "lg" | "xl";
    status?: "online" | "offline" | "busy" | null;
}

export const Avatar = ({
    src,
    alt = "User profile",
    initials,
    size = "lg",
    status = null,
    className = "",
    id,
    ...props
}: AvatarProps) => {
    const [imageError, setImageError] = useState(false);

    const sizeMap = {
        sm: { container: "w-12 h-12", rim: "p-[3px]", indicator: "w-3 h-3" },
        md: { container: "w-16 h-16", rim: "p-[4px]", indicator: "w-4 h-4" },
        lg: { container: "w-32 h-32", rim: "p-[6px]", indicator: "w-6 h-6" },
        xl: { container: "w-48 h-48", rim: "p-[8px]", indicator: "w-9 h-9" },
    };

    const s = sizeMap[size];

    const statusColor = status === "online" ? "var(--success-base)"
        : status === "busy" ? "var(--danger-base)"
            : "var(--text-muted)";

    return (
        <div
            id={id}
            className={`
                relative flex items-center justify-center rounded-full shrink-0 transition-all duration-smooth
                /* Menggunakan variabel --surface dan --main-shadow dari globals.css */
                bg-surface shadow-neumorph
                ${s.container} ${className}
            `}
            {...props}
        >
            {/* 1. The Soft Rim - Menggunakan transparansi agar menyatu dengan background tema apa pun */}
            <div className={`
                w-full h-full rounded-full flex items-center justify-center
                /* Menggunakan gradient transparan agar adaptif di Dark Mode */
                bg-gradient-to-br from-white/20 via-transparent to-black/10
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2),_1px_1px_3px_rgba(0,0,0,0.1)]
                ${s.rim}
            `}>

                {/* 2. The Inset Area - Menggunakan variabel --surface-secondary dan --inner-shadow */}
                <div className={`
                    relative w-full h-full rounded-full overflow-hidden
                    flex items-center justify-center bg-surface-secondary shadow-neumorph-inset
                `}>
                    {src && !imageError ? (
                        <img
                            src={src}
                            alt={alt}
                            onError={() => setImageError(true)}
                            className="w-full h-full object-cover rounded-full grayscale-[10%] hover:grayscale-0 transition-all duration-700"
                        />
                    ) : initials ? (
                        <span className="font-black tracking-tighter text-text-secondary/50 uppercase">
                            {initials.slice(0, 2)}
                        </span>
                    ) : (
                        <User className="text-text-muted/30 w-1/2 h-1/2" />
                    )}

                    {/* 3. Global Inner Depth - Menyesuaikan dengan mode gelap secara otomatis melalui rgba lembut */}
                    <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] pointer-events-none" />
                </div>
            </div>

            {/* 4. Status Indicator */}
            {status && (
                <div className="absolute bottom-[6%] right-[6%] z-30">
                    <motion.div
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="absolute inset-0 rounded-full blur-[8px]"
                        style={{ backgroundColor: statusColor }}
                    />
                    <div
                        className={`relative rounded-full border-[3px] border-surface shadow-sm ${s.indicator}`}
                        style={{ backgroundColor: statusColor }}
                    />
                </div>
            )}
        </div>
    );
};