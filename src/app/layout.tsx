import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { Toaster } from "sonner";

// Konfigurasi Font
const tubabaFont = localFont({
  src: [
    { path: "../components/fonts/Tubaba-Light.ttf", weight: "300" },
    { path: "../components/fonts/Tubaba-Regular.ttf", weight: "400" },
    { path: "../components/fonts/Tubaba-Medium.ttf", weight: "500" },
    { path: "../components/fonts/Tubaba-Bold.ttf", weight: "700" },
    { path: "../components/fonts/Tubaba-Heavy.ttf", weight: "900" },
  ],
  variable: "--font-tubaba",
});

export const metadata: Metadata = {
  title: "Tubaba Digital Service",
  description: "Sistem Pemerintahan Berbasis Elektronik Tulang Bawang Barat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${tubabaFont.variable} font-sans bg-main-bg text-text-primary antialiased`}>
        <ToastProvider>
          {children}
        </ToastProvider>

        {/* Global Toaster Configuration */}
        <Toaster
          position="top-right"
          expand={false}
          richColors
          closeButton
          toastOptions={{
            style: {
              background: 'var(--surface)',
              color: 'var(--text-primary)',
              borderRadius: 'var(--border-radius)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--main-shadow)',
              fontFamily: 'inherit',
            },
          }}
        />
      </body>
    </html>
  );
}