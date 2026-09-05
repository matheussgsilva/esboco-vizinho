import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

// Mirrors Next.js's own env precedence (.env.local overrides .env) so that
// `prisma migrate/generate/studio` see the same DATABASE_URL as `next dev`.
// dotenv does not overwrite a key already set in process.env, so loading
// .env.local first makes it win over .env for any variable defined in both.
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

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
