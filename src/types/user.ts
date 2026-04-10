export interface User {
    id: string;
    username: string;
    name: string;
    nip: string;
    email: string;
    role: "admin" | "user" | "pimpinan" | "operator";
    pangkat: string;
    golongan: string;
    jabatan: string;
    opdId: string;
    status: "active" | "inactive";
    createdAt: string;
}

export type UserRole = User["role"];
