// src/services/surat/distribusiService.ts

import {
  pembuatanService,
  DraftSurat,
} from "@/services/surat/pembuatanService";

// ==========================================
// 1. DEFINISI TIPE DATA (INTERFACES)
// ==========================================

// Tipe untuk SOTK (Pohon Jabatan) - Dipakai di Disposisi
export interface OrgNode {
  id: string;
  label: string;
  type: "opd" | "bidang" | "seksi" | "jabatan";
  children?: OrgNode[];
}

// Tipe untuk OPD Flat - Dipakai di Distribusi (Daftar)
export interface OpdTarget {
  id: string;
  nama: string;
  kategori: "Dinas" | "Badan" | "Kecamatan" | "Bagian";
}

// Tipe A: SURAT MASUK (Eksternal) -> Untuk Page Masuk & Disposisi
export interface IncomingLetter {
  id: string;
  noSuratAsli: string;
  pengirim: string; // Instansi Luar
  perihal: string;
  tglTerima: string;
  tglSurat: string;
  sifat: "Biasa" | "Penting" | "Rahasia";
  fileUrl: string | null;
  status: "registered" | "dispositioned" | "archived";
  tujuanSurat: string; // Contoh: "Bupati", "Sekda", "Kepala Dinas"
  // Data Disposisi (Opsional, terisi setelah diproses di page disposisi)
  historyDisposisi?: {
    kepada: string[];
    instruksi: string[];
    catatan: string;
    tanggal: string;
    oleh: string; // Misal: "Bupati"
  }[];
}

// Tipe B: SURAT KELUAR/INTERNAL (TTE) -> Untuk Page Daftar Distribusi
export interface OutgoingLetter {
  id: string;
  noSurat: string;
  perihal: string;
  tglTTE: string;
  penandatangan: string;
  statusDistribusi: "pending" | "partial" | "completed";
  penerima: string[]; // List ID OPD yang sudah menerima
  fileUrl: string;
}

// ==========================================
// 2. MOCK DATA (DATABASE SEMENTARA)
// ==========================================

// A. Data Master SOTK
const MASTER_ORG_TREE: OrgNode[] = [
  {
    id: "OPD-01",
    label: "Dinas Kominfo",
    type: "opd",
    children: [
      { id: "JAB-01", label: "Kepala Dinas", type: "jabatan" },
      { id: "JAB-02", label: "Sekretaris Dinas", type: "jabatan" },
      {
        id: "BID-01",
        label: "Bidang E-Government",
        type: "bidang",
        children: [
          { id: "JAB-03", label: "Kabid E-Gov", type: "jabatan" },
          { id: "JAB-04", label: "JF Analis Sistem", type: "jabatan" },
        ],
      },
    ],
  },
  {
    id: "OPD-02",
    label: "Bappeda",
    type: "opd",
    children: [{ id: "JAB-08", label: "Kepala Badan", type: "jabatan" }],
  },
];

// B. Data Master OPD
const MASTER_OPD_LIST: OpdTarget[] = [
  { id: "OPD-01", nama: "Dinas Kominfo", kategori: "Dinas" },
  { id: "OPD-02", nama: "Bappeda", kategori: "Badan" },
  {
    id: "OPD-03",
    nama: "Kecamatan Tulang Bawang Tengah",
    kategori: "Kecamatan",
  },
  { id: "OPD-04", nama: "Bagian Umum", kategori: "Bagian" },
  { id: "OPD-05", nama: "Bagian Organisasi", kategori: "Bagian" },
];

// C. Store Surat Masuk (Inbox)
let STORE_INCOMING: IncomingLetter[] = [
  {
    id: "AGD-001",
    noSuratAsli: "005/123/KEMENDAGRI/2026",
    pengirim: "Kementerian Dalam Negeri",
    perihal: "Undangan Rakornas Kepala Daerah 2026",
    tglTerima: "2026-02-12",
    tglSurat: "2026-02-10",
    sifat: "Penting",
    fileUrl: "dummy.pdf",
    status: "registered",
    tujuanSurat: "Kepala Dinas", // Default dummy
  },
];

// D. Store Surat Keluar (Outbox/TTE)
let STORE_OUTGOING: OutgoingLetter[] = [
  {
    id: "SRT-2026-001",
    noSurat: "005/12/KOMINFO/2026",
    perihal: "Edaran Implementasi Tanda Tangan Elektronik",
    tglTTE: "2026-02-12",
    penandatangan: "Sekretaris Daerah",
    statusDistribusi: "pending",
    penerima: [],
    fileUrl: "sk_tte.pdf",
  },
];

// ==========================================
// 3. SERVICE LOGIC
// ==========================================

export const distribusiService = {
  // --- LAYANAN MASTER DATA ---
  getOrgTree: () => MASTER_ORG_TREE,
  getOpdList: () => MASTER_OPD_LIST,

  // --- LAYANAN SURAT MASUK (INCOMING) ---

  // 1. Get All (Bisa difilter statusnya nanti)
  getIncomingLetters: () => {
    return [...STORE_INCOMING].sort((a, b) => b.id.localeCompare(a.id));
  },

  // 2. Registrasi Surat Baru (Create)
  registerLetter: (
    data: Omit<IncomingLetter, "id" | "status" | "historyDisposisi">,
  ) => {
    const newLetter: IncomingLetter = {
      ...data, // Ini otomatis akan membawa field tujuanSurat dari parameter
      id: `AGD-${Date.now().toString().slice(-4)}`,
      status: "registered",
    };
    STORE_INCOMING = [newLetter, ...STORE_INCOMING];
    return newLetter;
  },

  // 3. Hapus Surat
  deleteIncomingLetter: (id: string) => {
    STORE_INCOMING = STORE_INCOMING.filter((l) => l.id !== id);
  },

  // 4. Proses Disposisi (Update)
  processDisposition: (
    id: string,
    payload: { kepada: string[]; instruksi: string[]; catatan: string },
  ) => {
    STORE_INCOMING = STORE_INCOMING.map((surat) => {
      if (surat.id === id) {
        return {
          ...surat,
          status: "dispositioned",
          historyDisposisi: [
            ...(surat.historyDisposisi || []),
            {
              kepada: payload.kepada,
              instruksi: payload.instruksi,
              catatan: payload.catatan,
              tanggal: new Date().toISOString().split("T")[0],
              oleh: "Administrator", // Nanti diganti user login
            },
          ],
        };
      }
      return surat;
    });
    return STORE_INCOMING.find((l) => l.id === id);
  },

  // --- LAYANAN DISTRIBUSI SURAT TTE (OUTGOING) ---

  // 1. Get All Outgoing
  getOutgoingLetters: () => {
    // Ambil data draft, dan definisikan tipenya sebagai DraftSurat[]
    const allDrafts = pembuatanService.getAllDrafts() as DraftSurat[];

    // Filter yang statusnya verified
    const verifiedDrafts = allDrafts.filter((d) => d.status === "verified");

    // B. Lakukan Sinkronisasi
    verifiedDrafts.forEach((draft) => {
      const exists = STORE_OUTGOING.find((out) => out.id === draft.id);

      if (!exists) {
        const newOutgoing: OutgoingLetter = {
          id: draft.id,
          noSurat: draft.nomorSurat || "Belum Bernomor",
          perihal: draft.perihal,
          tglTTE:
            draft.lastUpdate.split("T")[0] ||
            new Date().toISOString().split("T")[0],
          penandatangan: formatJabatan(draft.penandatangan),
          statusDistribusi: "pending",
          penerima: [],
          fileUrl: draft.fileUrl || "",
        };

        STORE_OUTGOING.unshift(newOutgoing);
      }
    });

    return [...STORE_OUTGOING];
  },

  // 2. Distribusikan Surat ke OPD (Update Penerima)
  distributeLetter: (id: string, targetOpdIds: string[]) => {
    STORE_OUTGOING = STORE_OUTGOING.map((surat) => {
      if (surat.id === id) {
        // Gabungkan penerima lama dengan baru (unik)
        const newRecipients = Array.from(
          new Set([...surat.penerima, ...targetOpdIds]),
        );

        // Cek apakah sudah terkirim ke semua OPD (Total 4 OPD di dummy)
        // Di real app, bandingkan dengan total master data OPD
        const isFull = newRecipients.length >= MASTER_OPD_LIST.length;

        return {
          ...surat,
          penerima: newRecipients,
          statusDistribusi: isFull ? "completed" : "partial",
        };
      }
      return surat;
    });
  },
};
