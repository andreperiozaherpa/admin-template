export interface AccountData {
  no: number;
  nama_rekening: string;
  nomor_rekening: string;
  saldo: number;
}

export interface FinancialReport {
  date: string;
  [key: string]: any;
}
