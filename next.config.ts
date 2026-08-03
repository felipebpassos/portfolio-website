import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // A raiz cai no idioma padrão. Trocar para /pt-br é mudar esta linha.
      { source: "/", destination: "/en", permanent: false },
    ];
  },
};

export default nextConfig;
