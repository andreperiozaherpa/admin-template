// src/services/surat/pembuatanService.ts

// ==========================================
// 1. DEFINISI TIPE DATA (INTERFACES)
// ==========================================

export type DraftStatus =
  | "draft"
  | "revision"
  | "current"
  | "waiting"
  | "verified";

export type KategoriSurat = "nota" | "undangan" | "edaran" | "sk" | "laporan";

// Tipe Data Utama Dokumen
export interface DraftSurat {
  id: string;
  // Metadata Dasar
  nomorSurat: string;
  perihal: string;
  kategori: KategoriSurat;
  tanggal: string; // YYYY-MM-DD
  penandatangan: string; // value: "bupati", "sekda", dll

  // Konfigurasi
  visualisasi: string; // "true" | "false"
  fileUrl: string | null;

  // Status & Progress
  status: DraftStatus;
  progress: number; // 0 - 100
  posisiSaatIni: string; // Nama Jabatan/Role saat ini

  // Data Workflow (Untuk Halaman Koordinasi)
  workflow: WorkflowStep[];

  // Data Audit
  lastUpdate: string;
}

// Tipe Data Workflow (Alur Koordinasi)
export interface WorkflowStep {
  id: number;
  id_user: string;
  name: string;
  role: string;
  status: "pending" | "current" | "revision" | "completed" | "verified";
  metadata: string | null; // Nomor registrasi/hash TTE
  isTTE: boolean; // Apakah ini tahap TTE final?

  // Jika ada revisi/catatan
  noteTitle?: string;
  instructionPoints?: string[];
  timestamp?: string;
}

// ==========================================
// 2. MOCK DATA (DATABASE SEMENTARA)
// ==========================================

let STORE_DRAFTS: DraftSurat[] = [
  {
    id: "DFT-2026-001",
    nomorSurat: "005/12/KOMINFO/2026",
    perihal: "Nota Dinas Pengadaan Server Hub Tubaba",
    kategori: "nota",
    tanggal: "2026-02-01",
    penandatangan: "sekda",
    visualisasi: "true",
    fileUrl: "/uploads/dokumen/formulir.pdf",
    status: "draft",
    progress: 25,
    posisiSaatIni: "Staf Teknis",
    lastUpdate: "2026-02-01 10:00",
    workflow: [
      {
        id: 1,
        id_user: "USR-001",
        name: "Zaidir Alami",
        role: "Staf Teknis",
        status: "current",
        metadata: null,
        isTTE: false,
      },
      {
        id: 2,
        id_user: "USR-042",
        name: "Irsyad, M.Kom",
        role: "Kepala Dinas",
        status: "pending",
        metadata: null,
        isTTE: false,
      },
      {
        id: 3,
        id_user: "USR-003",
        name: "Sekda",
        role: "Sekretaris Daerah",
        status: "pending",
        metadata: null,
        isTTE: true,
      },
    ],
  },
  {
    id: "DFT-2026-002",
    nomorSurat: "005/99/UND/2026",
    perihal: "Undangan Rapat Evaluasi Kinerja Triwulan",
    kategori: "undangan",
    tanggal: "2026-01-31",
    penandatangan: "bupati",
    visualisasi: "false",
    fileUrl: "/uploads/dokumen/laporan.pdf",
    status: "revision",
    progress: 60,
    posisiSaatIni: "Kepala Dinas",
    lastUpdate: "2026-01-31 14:30",
    workflow: [
      {
        id: 1,
        id_user: "USR-001",
        name: "Zaidir Alami",
        role: "Staf Teknis",
        status: "completed",
        metadata: "DRAFT-OK",
        isTTE: false,
      },
      {
        id: 2,
        id_user: "USR-042",
        name: "Irsyad, M.Kom",
        role: "Kepala Dinas",
        status: "revision",
        metadata: null,
        isTTE: false,
        noteTitle: "Koreksi Kepala Dinas",
        instructionPoints: [
          "Perbaiki tanggal rapat",
          "Tambahkan lampiran peserta",
        ],
      },
      {
        id: 3,
        id_user: "USR-000",
        name: "Bupati",
        role: "Bupati",
        status: "pending",
        metadata: null,
        isTTE: true,
      },
    ],
  },
  {
    id: "DFT-2026-003",
    nomorSurat: "005/99/UND/2026",
    perihal: "Undangan Kinerja Triwulan Bupati",
    kategori: "undangan",
    tanggal: "2026-01-31",
    penandatangan: "bupati",
    visualisasi: "false",
    fileUrl: "/uploads/dokumen/attendance.pdf",
    status: "current",
    progress: 90,
    posisiSaatIni: "Kepala Dinas",
    lastUpdate: "2026-01-31 14:30",
    workflow: [
      {
        id: 1,
        id_user: "USR-001",
        name: "Zaidir Alami",
        role: "Staf Teknis",
        status: "completed",
        metadata: "DRAFT-OK",
        isTTE: false,
      },
      {
        id: 2,
        id_user: "USR-042",
        name: "Irsyad, M.Kom",
        role: "Kepala Dinas",
        status: "completed",
        metadata: null,
        isTTE: false,
        noteTitle: "Koreksi Kepala Dinas",
        instructionPoints: [
          "Perbaiki tanggal rapat",
          "Tambahkan lampiran peserta",
        ],
      },
      {
        id: 3,
        id_user: "USR-000",
        name: "Bupati",
        role: "Bupati",
        status: "current",
        metadata: null,
        isTTE: true,
      },
    ],
  },
];

// ==========================================
// 3. SERVICE LOGIC
// ==========================================

export const pembuatanService = {
  // --- READ OPERATIONS ---

  // 1. Ambil Semua Draft (Untuk Halaman Daftar)
  getAllDrafts: () => {
    // Return copy array agar aman dari mutasi langsung
    return JSON.parse(JSON.stringify(STORE_DRAFTS));
  },

  // 2. Ambil Single Draft by ID (Untuk Halaman Editor & Koordinasi)
  getDraftById: (id: string) => {
    const draft = STORE_DRAFTS.find((d) => d.id === id);
    return draft ? JSON.parse(JSON.stringify(draft)) : null;
  },

  // --- WRITE OPERATIONS (EDITOR) ---

  // 3. Simpan Draft Baru / Update (Untuk Halaman Editor)
  saveDraft: (data: Partial<DraftSurat>) => {
    const existingIndex = STORE_DRAFTS.findIndex((d) => d.id === data.id);

    if (existingIndex > -1) {
      // UPDATE EXISTING
      STORE_DRAFTS[existingIndex] = {
        ...STORE_DRAFTS[existingIndex],
        ...data,
        lastUpdate: new Date().toISOString(),
      };
      return STORE_DRAFTS[existingIndex].id;
    } else {
      // CREATE NEW
      const newId = `DFT-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`;
      const newDraft: DraftSurat = {
        id: newId,
        nomorSurat: data.nomorSurat || "",
        perihal: data.perihal || "Tanpa Judul",
        kategori: data.kategori || "nota",
        tanggal: data.tanggal || new Date().toISOString().split("T")[0],
        penandatangan: data.penandatangan || "",
        visualisasi: data.visualisasi || "true",
        fileUrl: data.fileUrl || null,
        status: "draft",
        progress: 10,
        posisiSaatIni: "Staf Teknis", // Default pembuat
        lastUpdate: new Date().toISOString(),
        workflow: generateDefaultWorkflow(data.penandatangan || "bupati"), // Helper function di bawah
      };
      STORE_DRAFTS.push(newDraft);
      return newId;
    }
  },

  // 4. Hapus Draft (Untuk Halaman Daftar)
  deleteDraft: (id: string) => {
    STORE_DRAFTS = STORE_DRAFTS.filter((d) => d.id !== id);
  },

  // --- WORKFLOW OPERATIONS (KOORDINASI) ---

  // 5. Ajukan Verifikasi (Staf -> Atasan)
  submitVerification: (id: string) => {
    const index = STORE_DRAFTS.findIndex((d) => d.id === id);
    if (index === -1) return;

    const draft = STORE_DRAFTS[index];
    // Logika sederhana: Maju ke step berikutnya
    const currentStepIdx = draft.workflow.findIndex(
      (w) => w.status === "current" || w.status === "revision",
    );

    if (currentStepIdx > -1 && currentStepIdx < draft.workflow.length - 1) {
      // Update step saat ini jadi completed
      draft.workflow[currentStepIdx].status = "completed";
      draft.workflow[currentStepIdx].metadata = `SUBMIT-${Date.now()}`;

      // Aktifkan step berikutnya
      draft.workflow[currentStepIdx + 1].status = "current";

      // Update status global draft
      draft.status = "current";
      draft.posisiSaatIni = draft.workflow[currentStepIdx + 1].role;
      draft.progress = Math.round(
        ((currentStepIdx + 2) / draft.workflow.length) * 100,
      );

      STORE_DRAFTS[index] = draft;
    }
  },

  // 6. Review Draft (Atasan memberi Revisi / Setuju)
  reviewDraft: (
    id: string,
    action: "approve" | "revise",
    note?: { title: string; points: string[] },
  ) => {
    const index = STORE_DRAFTS.findIndex((d) => d.id === id);
    if (index === -1) return;

    const draft = STORE_DRAFTS[index];
    const currentStepIdx = draft.workflow.findIndex(
      (w) => w.status === "current",
    );

    if (currentStepIdx === -1) return;

    if (action === "approve") {
      // Jika ini step terakhir (TTE), maka selesai
      if (draft.workflow[currentStepIdx].isTTE) {
        draft.workflow[currentStepIdx].status = "verified";
        draft.status = "verified";
        draft.progress = 100;
      } else {
        // Maju ke step berikutnya
        draft.workflow[currentStepIdx].status = "completed";
        draft.workflow[currentStepIdx + 1].status = "current";
        draft.posisiSaatIni = draft.workflow[currentStepIdx + 1].role;
        draft.status = "current";
        draft.progress += 20; // Simulasi nambah progress
      }
    } else {
      // REVISI
      // Step saat ini jadi Revision
      draft.workflow[currentStepIdx].status = "revision";
      draft.workflow[currentStepIdx].noteTitle = note?.title;
      draft.workflow[currentStepIdx].instructionPoints = note?.points;

      draft.status = "revision";
    }
    STORE_DRAFTS[index] = draft;
  },

  // 7. TTE Final (Signing)
  signDocument: (id: string, signedFileUrl: string) => {
    const index = STORE_DRAFTS.findIndex((d) => d.id === id);
    if (index === -1) return;

    // Update URL file dengan yang sudah ditandatangani
    STORE_DRAFTS[index].fileUrl = signedFileUrl;

    // Panggil fungsi review dengan action approve untuk menyelesaikan step TTE
    pembuatanService.reviewDraft(id, "approve");
  },
};

// --- HELPER: Generate Workflow Otomatis ---
function generateDefaultWorkflow(penandatangan: string): WorkflowStep[] {
  const base: WorkflowStep[] = [
    {
      id: 1,
      id_user: "USR-001",
      name: "Zaidir Alami",
      role: "Staf Penyusun",
      status: "current",
      metadata: null,
      isTTE: false,
    },
    {
      id: 2,
      id_user: "USR-042",
      name: "Irsyad, M.Kom",
      role: "Kepala Dinas",
      status: "pending",
      metadata: null,
      isTTE: false,
    },
  ];

  if (penandatangan === "sekda") {
    base.push({
      id: 3,
      id_user: "USR-003",
      name: "Sekretaris Daerah",
      role: "Sekda",
      status: "pending",
      metadata: null,
      isTTE: true,
    });
  } else {
    base.push({
      id: 3,
      id_user: "USR-049",
      name: "Nadir, M.Kom",
      role: "Wakil Bupati",
      status: "pending",
      metadata: null,
      isTTE: false,
    });
    base.push({
      id: 4,
      id_user: "USR-000",
      name: "Bupati Tubaba",
      role: "Bupati",
      status: "pending",
      metadata: null,
      isTTE: true,
    });
  }
  return base;
}
