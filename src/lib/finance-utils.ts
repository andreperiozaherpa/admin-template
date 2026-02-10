import { FinancialSnapshot, FinancialSummary } from "@/types/finance";

// Fungsi untuk menjumlahkan saldo dalam satu array kategori
const sumSaldo = (records: any[]) => {
  if (!Array.isArray(records)) return 0;
  return records.reduce((acc, curr) => acc + (curr.saldo || 0), 0);
};

export function processFinancialData(
  data: FinancialSnapshot[],
): FinancialSummary {
  // Ambil snapshot data paling baru (data terakhir di array)
  const latestData = data[data.length - 1];

  if (!latestData) {
    return {
      totalAssets: 0,
      categoryTotals: { kasda: 0, escrow: 0, skpd: 0, blud: 0, sekolah: 0 },
      lastUpdated: "-",
    };
  }

  const totals = {
    kasda: sumSaldo(latestData.kasda),
    escrow: sumSaldo(latestData.escrow),
    skpd:
      sumSaldo(latestData.skpd_pengeluaran) +
      sumSaldo(latestData.skpd_penerimaan),
    blud: sumSaldo(latestData.blud_pasar_puskes),
    sekolah: sumSaldo(latestData.sekolah),
  };

  return {
    totalAssets: Object.values(totals).reduce((a, b) => a + b, 0),
    categoryTotals: totals,
    lastUpdated: latestData.date,
  };
}

// Format mata uang IDR
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};
