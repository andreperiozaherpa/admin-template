export interface OPD {
    id: string;
    nama: string;
    kode: string;
    alamat: string;
    telepon: string;
    email: string;
    website?: string;
    status: "active" | "inactive";
    parent_id?: string; // Untuk struktur UPTD
}

export interface OPDStats {
    total: number;
    active: number;
    inactive: number;
}
