import "dotenv/config";
import { defineConfig } from "prisma/config";

// `env()` do prisma/config lança (PrismaConfigEnvError) se a variável não existir,
// e este arquivo é carregado por TODO comando prisma, inclusive `generate` — que
// não precisa de conexão real, só do schema. Isso quebrava `prisma generate`
// (rodado no postinstall) no build da Vercel, onde DATABASE_URL não está
// disponível na fase de `npm install`. Só `migrate`/`db push`/`studio` (que nunca
// rodam no build da Vercel deste projeto) realmente dependem do valor real aqui.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://placeholder:placeholder@localhost:5432/placeholder",
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
