export interface FinancialRecord {
  no: number;
  nama_rekening: string;
  nomor_rekening: string;
  saldo: number;
}

export interface FinancialSnapshot {
  date: string; // Format: "MM/DD/YYYY"
  kasda: FinancialRecord[];
  escrow: FinancialRecord[];
  skpd_pengeluaran: FinancialRecord[];
  blud_pasar_puskes: FinancialRecord[];
  skpd_penerimaan: FinancialRecord[];
  sekolah: FinancialRecord[];
}

// Tipe helper untuk merekap total
export interface FinancialSummary {
  totalAssets: number;
  categoryTotals: {
    kasda: number;
    escrow: number;
    skpd: number; // Gabungan pengeluaran + penerimaan
    blud: number;
    sekolah: number;
  };
  lastUpdated: string;
}
