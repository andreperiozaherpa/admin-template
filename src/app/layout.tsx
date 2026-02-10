import React from "react";
import localFont from "next/font/local";
import "./globals.css";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { Toaster } from "sonner";

// Font Configuration (Tetap di sini agar global)
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

export default function RootLayout({
  children,
  activeColor = "peach", // Default value
  isDark = false         // Default value
}: {
  children: React.ReactNode;
  activeColor?: string;
  isDark?: boolean;
}) {
  // Logic Theme Style (Tetap di sini agar global)
  const themeStyles = {
    "--theme-base": `var(--${activeColor}-base)`,
    "--theme-active": `var(--${activeColor}-active)`,
    "--theme-hover": `var(--${activeColor}-hover)`,
    "--theme-glow": `var(--${activeColor}-glow)`,
  } as React.CSSProperties;

  return (
    <html lang="en" className={isDark ? "dark" : ""} style={themeStyles}>
      <body className={`${tubabaFont.variable} font-sans bg-main-bg text-text-primary antialiased transition-colors duration-500`}>
        <ToastProvider>
          {/* HANYA RENDER CHILDREN, TIDAK ADA SIDEBAR DI SINI */}
          {children}
        </ToastProvider>

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