import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Habilita unauthorized()/forbidden() (next/navigation) usados em
    // lib/auth-utils.ts para proteção de rotas por papel.
    authInterrupts: true,
  },
};

export default nextConfig;
