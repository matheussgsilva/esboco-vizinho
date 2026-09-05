import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Habilita unauthorized()/forbidden() (next/navigation) usados em
    // lib/auth-utils.ts para proteção de rotas por papel.
    authInterrupts: true,
  },
  images: {
    // Sem provedor de upload/CDN definido ainda (painel/fotos é placeholder),
    // então logoUrl/coverImageUrl/BusinessPhoto.url podem apontar para
    // qualquer host https. Apertar para hosts específicos quando um
    // provedor de imagem for escolhido.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
