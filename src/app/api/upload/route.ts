import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) {
      return NextResponse.json({ error: "No file received" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name.replace(/\s+/g, "-");

    // Pastikan folder public/uploads sudah ada
    const uploadDir = path.join(process.cwd(), "public", folder);

    // Buat folder secara rekursif (misal: "public/dokumen/surat")
    await fs.mkdir(uploadDir, { recursive: true });

    // Simpan file secara fisik
    await fs.writeFile(path.join(uploadDir, filename), buffer);

    return NextResponse.json({
      message: "Protocol Success",
      url: `/${folder}/${filename}`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
