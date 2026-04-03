import { NextRequest, NextResponse } from "next/server";

interface User {
    email: string;
    password: string;
    name: string;
    role: string;
    nip: string;
   instansi: string;
}

const users: User[] = [
    {
        email: "admin@tubaba.go.id",
        password: "admin123",
        name: "Administrator",
        role: "admin",
        nip: "1234567890",
        instansi: "Pemerintah Kabupaten Tulang Bawang Barat"
    },
    {
        email: "bank@tubaba.go.id",
        password: "bank123",
        name: "Operator Bank",
        role: "bank",
        nip: "0987654321",
        instansi: "Bank Lampung"
    },
];

function generateToken(user: User): string {
    const payload = {
        id: user.nip,
        email: user.email,
        name: user.name,
        role: user.role,
        exp: Date.now() + 24 * 60 * 60 * 1000,
    };
    return Buffer.from(JSON.stringify(payload)).toString("base64");
}

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email dan password wajib diisi" },
                { status: 400 }
            );
        }

        const user = users.find(
            (u) => u.email === email && u.password === password
        );

        if (!user) {
            return NextResponse.json(
                { message: "Email atau password salah" },
                { status: 401 }
            );
        }

        const token = generateToken(user);

        return NextResponse.json({
            data: {
                id: user.nip,
                name: user.name,
                email: user.email,
                role: user.role,
                instansi: user.instansi,
            },
            metadata: {
                token,
            },
        });
    } catch (error) {
        return NextResponse.json(
            { message: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}