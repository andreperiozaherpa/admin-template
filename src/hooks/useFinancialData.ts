"use client";

import { useState, useMemo, useEffect } from "react";

interface AccountData {
  no: number;
  nama_rekening: string;
  nomor_rekening: string;
  saldo: number;
}

interface FinancialReport {
  date: string;
  [key: string]: any;
}

export const useFinancialData = (
  data: FinancialReport[],
  pageSize: number = 10,
) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // 1. MENCARI DATA TERAKHIR BERDASARKAN TANGGAL TERBESAR
  const latestReport = useMemo(() => {
    if (data.length === 0) return null;

    // Mengurutkan berdasarkan waktu (timestamp) secara ascending (kecil ke besar)
    const sortedData = [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    // Mengambil elemen paling akhir (tanggal paling baru)
    return sortedData[sortedData.length - 1];
  }, [data]);

  // 2. HITUNG RINGKASAN PER KATEGORI BERDASARKAN LATEST REPORT
  const categorySummaries = useMemo(() => {
    if (!latestReport) return [];

    return Object.keys(latestReport)
      .filter((key) => key !== "date")
      .map((key) => ({
        key,
        name: key.replace(/_/g, " ").toUpperCase(),
        total: (latestReport[key] as any[]).reduce(
          (sum, item) => sum + (item.saldo || 0),
          0,
        ),
        count: latestReport[key].length,
      }));
  }, [latestReport]);

  // 3. HITUNG TOTAL KESELURUHAN DARI DATA TERAKHIR
  const grandTotals = useMemo(() => {
    return {
      balance: categorySummaries.reduce((sum, cat) => sum + cat.total, 0),
      records: categorySummaries.reduce((sum, cat) => sum + cat.count, 0),
      lastUpdate: latestReport?.date || "",
    };
  }, [categorySummaries, latestReport]);

  // 4. MENDAPATKAN OPSI KATEGORI UNTUK SELECT
  const categoryOptions = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0])
      .filter((key) => key !== "date")
      .map((cat) => ({
        label: cat.replace(/_/g, " ").toUpperCase(),
        value: cat,
      }));
  }, [data]);

  // 5. LIST LENGKAP DATA KATEGORI TERPILIH (LATEST REPORT)
  const currentFullList = useMemo((): AccountData[] => {
    if (!latestReport || !selectedCategory) return [];
    return (latestReport[selectedCategory] || []) as AccountData[];
  }, [latestReport, selectedCategory]);

  // 6. DATA UNTUK GRAFIK (AWAL VS AKHIR)
  const comparisonData = useMemo(() => {
    if (data.length < 2 || !latestReport || !selectedCategory) return null;

    const sorted = [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    const startReport = sorted[0];

    // Slicing data berdasarkan startIndex
    const visibleData = currentFullList.slice(
      startIndex,
      startIndex + pageSize,
    );

    return {
      labels: visibleData.map((acc) =>
        acc.nama_rekening.length > 15
          ? acc.nama_rekening.substring(0, 15) + ".."
          : acc.nama_rekening,
      ),
      datasets: [
        {
          label: "Awal",
          data: visibleData.map((acc) => {
            const startCategoryData = (startReport[selectedCategory] ||
              []) as AccountData[];
            const match = startCategoryData.find(
              (a) => a.nomor_rekening === acc.nomor_rekening,
            );
            return match ? match.saldo : 0;
          }),
          color: "#94a3b8",
        },
        {
          label: "Akhir",
          data: visibleData.map((acc) => acc.saldo),
          color: "#a855f7",
        },
      ],
    };
  }, [
    data,
    latestReport,
    selectedCategory,
    startIndex,
    pageSize,
    currentFullList,
  ]);

  // HANDLERS
  const handleCategoryChange = (val: string) => {
    setDirection(0);
    setStartIndex(0);
    setSelectedCategory(val);
  };

  const handleSliderChange = (newVal: number) => {
    if (newVal !== startIndex) {
      setDirection(newVal > startIndex ? 1 : -1);
      setStartIndex(newVal);
    }
  };

  // Inisialisasi kategori pertama kali
  useEffect(() => {
    if (data.length > 0 && !selectedCategory) {
      const firstCat = Object.keys(data[0]).filter((k) => k !== "date")[0];
      setSelectedCategory(firstCat);
    }
  }, [data, selectedCategory]);

  const maxScrollIndex = Math.max(0, currentFullList.length - pageSize);

  return {
    selectedCategory,
    startIndex,
    direction,
    categoryOptions,
    comparisonData,
    currentFullList,
    maxScrollIndex,
    categorySummaries,
    grandTotals,
    handleCategoryChange,
    handleSliderChange,
    pageSize,
  };
};
