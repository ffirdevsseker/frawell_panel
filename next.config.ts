import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    appIsrStatus: false, // Sağ alt köşedeki "N" (Static Route) ikonunu kaldırır
    buildActivity: false, // Derleme sırasında çıkan diğer ikonu da kaldırır
  },
};

export default nextConfig;
