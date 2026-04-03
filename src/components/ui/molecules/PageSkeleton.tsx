import React from "react";
import { Skeleton } from "@/components/ui/atom/Skeleton";

export const ListDataSkeleton = () => {
    return (
        <div className="p-6 md:p-8 space-y-6">
            {/* Header */}
            <div>
                <Skeleton className="h-10 w-64 rounded-2xl" />
                <Skeleton className="h-5 w-80 rounded-xl mt-2 opacity-70" />
            </div>

            {/* List Tanggal Cards */}
            <div className="grid gap-4">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Skeleton variant="circle" className="w-12 h-12" />
                                <div>
                                    <Skeleton className="h-6 w-40 rounded-lg" />
                                    <Skeleton className="h-4 w-24 rounded-lg mt-1 opacity-60" />
                                </div>
                            </div>
                            <div className="text-right">
                                <Skeleton className="h-4 w-20 rounded-lg" />
                                <Skeleton className="h-6 w-32 rounded-lg mt-1" />
                            </div>
                            <Skeleton variant="circle" className="w-5 h-5" />
                        </div>

                        {/* Summary Grid */}
                        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-6 gap-4">
                            {[...Array(6)].map((_, j) => (
                                <div key={j} className="text-center">
                                    <Skeleton className="h-3 w-12 mx-auto rounded-lg" />
                                    <Skeleton className="h-4 w-20 mx-auto rounded-lg mt-1" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const PageSkeleton = () => {
    return (
        <div className="p-6 md:p-8 space-y-8 min-h-screen font-sans">

            {/* 1. Header Area */}
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-3">
                    {/* Title */}
                    <Skeleton className="h-10 w-64 md:w-80 rounded-2xl" />
                    {/* Subtitle / Date Info */}
                    <Skeleton className="h-5 w-48 rounded-xl opacity-70" />
                </div>
            </div>

            {/* 2. Stats Cards Grid (4 Kartu) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-white rounded-3xl border border-gray-100 p-6 flex flex-col justify-between shadow-sm">
                        <div className="flex justify-between items-start">
                            {/* Label */}
                            <Skeleton className="h-4 w-24 rounded-lg" />
                            {/* Icon Circle */}
                            <Skeleton variant="circle" className="h-10 w-10" />
                        </div>
                        {/* Value (Angka Besar) */}
                        <Skeleton className="h-8 w-40 rounded-xl mt-2" />
                    </div>
                ))}
            </div>

            {/* 3. Main Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* KIRI: Chart Besar (Comparison) */}
                <div className="lg:col-span-3 h-[500px] bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col">
                    {/* Chart Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-48 rounded-lg" />
                            <Skeleton className="h-4 w-32 rounded-lg opacity-60" />
                        </div>
                        {/* Filter Controls Skeleton */}
                        <div className="flex gap-3">
                            <Skeleton className="h-10 w-32 rounded-xl" />
                            <Skeleton className="h-10 w-40 rounded-xl" />
                        </div>
                    </div>
                    {/* Chart Area Placeholder */}
                    <Skeleton className="flex-1 w-full rounded-2xl opacity-40" />
                </div>

                {/* KANAN: Donat Kecil (Global Composition) */}
                <div className="lg:col-span-1 h-[500px] bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col items-center justify-center">
                    <Skeleton className="h-6 w-32 rounded-lg mb-8" />
                    {/* Lingkaran Donat */}
                    <Skeleton variant="circle" className="h-48 w-48 rounded-full mb-8" />
                    {/* Legend Items */}
                    <div className="flex flex-wrap gap-2 justify-center w-full">
                        <Skeleton className="h-3 w-16 rounded-full" />
                        <Skeleton className="h-3 w-16 rounded-full" />
                        <Skeleton className="h-3 w-16 rounded-full" />
                    </div>
                </div>
            </div>

            {/* 4. Bottom Section (2 Donat + 1 List) */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Donat Top 5 */}
                <div className="lg:col-span-1 h-[400px] bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col items-center justify-center">
                    <Skeleton className="h-5 w-32 rounded-lg mb-6" />
                    <Skeleton variant="circle" className="h-40 w-40 rounded-full" />
                </div>

                {/* Donat Bottom 5 */}
                <div className="lg:col-span-1 h-[400px] bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col items-center justify-center">
                    <Skeleton className="h-5 w-32 rounded-lg mb-6" />
                    <Skeleton variant="circle" className="h-40 w-40 rounded-full" />
                </div>

                {/* List Detail Area */}
                <div className="lg:col-span-2 h-[400px] bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col">
                    <div className="flex justify-between mb-6">
                        <Skeleton className="h-6 w-40 rounded-lg" />
                        <Skeleton className="h-8 w-20 rounded-lg" />
                    </div>
                    <div className="space-y-4 flex-1 overflow-hidden">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-8 w-8 rounded-xl" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-48 rounded-lg" />
                                        <Skeleton className="h-3 w-24 rounded-lg opacity-60" />
                                    </div>
                                </div>
                                <Skeleton className="h-5 w-24 rounded-lg" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
