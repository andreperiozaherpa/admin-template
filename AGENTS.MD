# Admin Template Project Context (AGENTS.MD)

## Tentang Aplikasi Ini
Aplikasi ini adalah **Admin Template Dashboard** berbasis web yang dibangun menggunakan **Next.js (App Router)**. Melihat struktur file yang ada, aplikasi ini merupakan sistem E-Office atau Sistem Manajemen Persuratan/Administrasi (terindikasi dari *service* `surat` dan konstanta `jabatan.ts`).

Teknologi utama yang direpresentasikan di dalam `package.json`:
- **Framework Utama**: Next.js 16 (React 19)
- **Styling & Animasi**: Tailwind CSS, Framer Motion
- **Visualisasi & Ikon**: Chart.js (`react-chartjs-2`), Lucide React
- **Komponen & Interaksi**: `sonner` (untuk notifikasi toast), `react-rnd` (untuk antarmuka *draggable/resizable*)
- **Dokumen (PDF)**: `pdf-lib` dan `react-pdf` untuk memproses atau menampilkan dokumen surat/PDF secara bawaan (*native*).

## Struktur File dan Direktori

Berikut adalah panduan direktori proyek agar mudah dipahami:

### 📄 Root Direktori (Konfigurasi)
- **`package.json` / `package-lock.json`** : Daftar dependensi, script perintah (*run dev*, *build*), dan versi library target.
- **`next.config.mjs`** : Aturan dan konfigurasi *engine* Next.js.
- **`tsconfig.json` / `next-env.d.ts`** : Konfigurasi kompiler TypeScript.
- **`eslint.config.mjs`** : Aturan linting ESLint agar standar penulisan kode tetap rapi.
- **`postcss.config.mjs`** : Konfigurasi pemrosesan *style* untuk *engine* TailwindCSS.

### 🗄️ Direktori Publik (`public/`)
- **`mock/`** : Berisi file JSON statis (contoh: `users.json`, `opd.json`) yang digunakan untuk mensimulasikan pemanggilan API (Data Fetching) lingkungan lokal sebelum disambungkan ke *backend* sungguhan.

### 📁 Direktori Kode Sumber (`src/`)

Berkas kode terpusat pada direktori `src` dengan pengelompokan berdasarkan peran fungsional:

#### 1. `app/` *(Next.js App Router)*
Pusat dari aplikasi (struktur url / *routing*):
- **`(pages)/`** : *Route Group*, teknik mengelompokkan area rute (misalnya: `/(pages)/dashboard`, `/(pages)/management`) agar struktur *folder* menjadi rapi tanpa mengubah URL asli dan dapat berbagi layout khusus.
- **`(pages)/management/`** : Fitur **Master Data** yang menggunakan teknik *file-based routing*. Terdiri dari:
  - **`organization/`** : Pengelolaan entitas organisasi (Daftar OPD, UPTD, Kategori).
  - **`user/`** : Pengelolaan entitas pengguna (Daftar User, Role, Pangkat, Jabatan, Jenis Jabatan).
- **`api/`** : Berisi *API Route* yang berfungsi sebagai peladen (*backend*) di dalam arsitektur Next.js.
- **`layout.tsx`** & **`page.tsx`** : Struktur dasar aplikasi; memuat pembungkus antar-halaman (*layout global*) dan antarmuka *landing/home page*.
- **`globals.css`** : Kode untuk mendefinisikan *base CSS* dan sistem *Tailwind directives*.

#### 2. `components/` *(UI & Layouts)*
Tempat komponen visual yang dapat digunakan kembali (*reusable*):
- **`ui/`** : Tempat komponen presentasional sederhana (tombol, formulir, alert). *Catatan Penting: Komponen `<Button>` menggunakan konvensi UI Neumorphism yaitu `variant="expel"` secara bawaan (default).*
- **`providers/`** : *Context providers* untuk mengelola status global pada sisi klien (*Client Components*) seperti otentikasi, tema (terang/gelap), dsb.
- **`fonts/`** : Penanganan tipografi kustom atau *Google Fonts*.

#### 3. `constants/` *(Static Data)*
Penampung untuk tipe nilai bersifat mutlak atau referensi statis:
- **`jabatan.ts`** : Tempat menampung referensi data *jabatan* perusahaan/instansi secara statis dan struktural (*enums* atau kumpulan *object*).

#### 4. `services/` *(API & Business Logic Integration)*
Bertanggung jawab dalam logika manipulasi data peladen (pengambilan *fetch*, pengiriman data, dll):
- **`surat/`** : Abstraksi fungsi untuk berinteraksi dengan API persuratan.
- **`userService.ts`** & **`opdService.ts`** : Menangani pemanggilan fetch HTTP secara terpisah per entitas (*file-based structure*).

#### 5. `hooks/` *(Custom React Hooks)*
Direktori untuk merangkum state management (*useState*) dan side-effects (*useEffect*) ke dalam *hook*. Memisahkan UI Components agar fokus sebagai Presentational Components:
- **`useUsers.ts`** & **`useOPDs.ts`** : Hook yang memanggil *service* yang ekuivalen secara terpisah per file. Hook ini menyediakan state seperti `loading`, `error`, dan `data`.

#### 6. `types/` *(TypeScript Definitions)*
Tempat sentral penyimpanan deklarasi interface dan tipe data secara eksklusif agar terpisah dari data *mock* maupun logika UI:
- Contohnya: `user.ts` untuk definisi data *User*, dan `opd.ts` untuk definisi dari sebuah *OPD*.

---
*Dokumen ini dibuat secara otomatis untuk memberikan konteks dasar tentang arsitektur proyek bagi pengembang yang bekerja dengan repositori ini.*
