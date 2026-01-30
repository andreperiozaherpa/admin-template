"use client";

import { Card } from "@/components/ui/molecules/Card";
import { Layers, Code2 } from "lucide-react";
import { motion } from "framer-motion";

export default function MoleculesDocs() {
    return (
        <>
            <motion.header
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16"
            >
                <h1 className="text-4xl font-black tracking-tight mb-3 leading-tight uppercase">
                    Atoms <span className="text-[var(--theme-base)] italic font-light">Level</span>
                </h1>
                <p className="text-base text-text-secondary font-light leading-relaxed max-w-2xl">
                    Unit terkecil dan murni dari sistem desain Tubaba. Komponen ini tidak dapat dipecah lagi menjadi bagian yang lebih kecil.
                </p>
            </motion.header>

            <div className="space-y-5 md:space-y-10">
                {/* <section id="card" className="p-3"><DokumentationCard /></section> */}
            </div>
        </>
    )
}