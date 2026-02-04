"use client";

import React from 'react';
import { Chart, Select, Slider } from "@/components/ui/Index";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useFinancialData } from "@/hooks/useFinancialData"; // Import hook baru

interface FinancialComparisonCardProps {
    data: any[];
}

const chartVariants: Variants = {
    enter: (dir: number) => ({
        x: dir > 0 ? 50 : dir < 0 ? -50 : 0,
        opacity: 0,
        filter: "blur(4px)"
    }),
    center: {
        x: 0, opacity: 1, filter: "blur(0px)",
        transition: { x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }
    },
    exit: (dir: number) => ({
        x: dir > 0 ? -50 : dir < 0 ? 50 : 0,
        opacity: 0, filter: "blur(4px)",
        transition: { duration: 0.2 }
    })
};

export const FinancialComparisonCard = ({ data }: FinancialComparisonCardProps) => {
    // Gunakan hook yang sudah kita buat
    const {
        selectedCategory,
        startIndex,
        direction,
        categoryOptions,
        comparisonData,
        currentFullList,
        maxScrollIndex,
        handleCategoryChange,
        handleSliderChange,
        pageSize
    } = useFinancialData(data, 10);

    if (data.length === 0) return null;

    return (
        <div className="glass-effect p-8 md:p-10 rounded-[2.5rem] shadow-neumorph relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div className="flex-1">
                    <h2 className="text-xl font-black text-text-primary uppercase italic tracking-tight">
                        {selectedCategory.replace(/_/g, ' ')} <span className="text-[var(--theme-base)]">Comparison</span>
                    </h2>
                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1">
                        Viewing Index: {startIndex + 1} - {Math.min(startIndex + pageSize, currentFullList.length)}
                    </p>
                </div>

                <div className="w-full md:w-72">
                    <Select
                        label="Kategori Monitoring"
                        options={categoryOptions}
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        variant="glass"
                    />
                </div>
            </div>

            <div className="w-full relative overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={`${selectedCategory}-${startIndex}`}
                        custom={direction}
                        variants={chartVariants}
                        initial="enter" animate="center" exit="exit"
                        className="w-full"
                    >
                        {comparisonData && (
                            <Chart
                                type="bar"
                                title=""
                                height={300}
                                labels={comparisonData.labels}
                                datasets={comparisonData.datasets}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {maxScrollIndex > 0 && (
                <div className="mt-12 px-4 md:px-10">
                    <Slider
                        label={`Slide to navigate data`}
                        value={startIndex}
                        min={0}
                        max={maxScrollIndex}
                        step={1}
                        onChange={handleSliderChange}
                        color="primary"
                    />
                </div>
            )}
        </div>
    );
};