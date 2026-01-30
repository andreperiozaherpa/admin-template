// src/app/page.tsx
"use client";

import { Button } from "@/components/ui/Index"
import { LayoutDashboard, Users, ShoppingBag, Settings } from "lucide-react";

export default function Dashboard() {
    return (
        <div className="p-8 space-y-8">
            {/* Header Section */}
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-text-secondary">Selamat datang kembali, Admin.</p>
                </div>
                <Button variant="expel">
                    <Settings size={18} />
                    Edit Layout
                </Button>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            </div>

            {/* Placeholder content untuk Glassmorphism */}
            <div className="glass-effect rounded-main p-10 mt-10 min-h-[300px]">
                <h2 className="text-xl font-bold mb-4 text-primary-base">Recent Activity</h2>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-4 shadow-neumorph-inset rounded-2xl bg-surface/30">
                            <div className="w-10 h-10 rounded-full bg-primary-base/20" />
                            <div className="flex-1 h-4 bg-skeleton rounded-full" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}