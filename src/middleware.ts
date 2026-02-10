import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Ambil token dari Cookies
  const token = request.cookies.get("token")?.value;

  // 2. Ambil path URL saat ini
  const { pathname } = request.nextUrl;

  // Daftar halaman yang BISA diakses tanpa login (Public)
  const publicPaths = ["/login"];
  const isPublicPath = publicPaths.includes(pathname);

  // --- LOGIKA PROTEKSI ---

  // KASUS A: User SUDAH login, tapi mencoba akses halaman Login
  // Tindakan: Redirect paksa ke Dashboard
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // KASUS B: User BELUM login, tapi mencoba akses halaman Private (Dashboard, dll)
  // Tindakan: Redirect paksa ke Login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Jika tidak masuk kondisi di atas, lanjutkan request seperti biasa
  return NextResponse.next();
}

// Konfigurasi Matcher: Menentukan di mana middleware ini aktif
export const config = {
  matcher: [
    /*
     * Match semua request paths KECUALI yang berawalan:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - file berekstensi (misal .svg, .png, .jpg)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
