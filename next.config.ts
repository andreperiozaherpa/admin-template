import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Konfigurasi Rewrite (Proxy) untuk mengatasi CORS
  async rewrites() {
    return [
      {
        source: "/api/:path*", // Saat frontend memanggil /api/login
        destination: "https://app-saldo.tubaba.go.id/api/:path*", // Teruskan ke server asli
      },
    ];
  },
};

export default nextConfig;
