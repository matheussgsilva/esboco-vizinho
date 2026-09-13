import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

// Mirrors Next.js's own env precedence (.env.local overrides .env) so that
// `prisma migrate/generate/studio` see the same DIRECT_URL as `next dev` sees
// for DATABASE_URL. dotenv does not overwrite a key already set in process.env,
// so loading .env.local first makes it win over .env for any variable defined
// in both.
loadEnv({ path: ".env.local", quiet: true });
loadEnv({ path: ".env", quiet: true });

// `env()` do prisma/config lança (PrismaConfigEnvError) se a variável não existir,
// e este arquivo é carregado por TODO comando prisma, inclusive `generate` — que
// não precisa de conexão real, só do schema. Isso quebrava `prisma generate`
// (rodado no postinstall) no build da Vercel, onde DIRECT_URL não está
// disponível na fase de `npm install`. Só `migrate`/`db push`/`studio` (que nunca
// rodam no build da Vercel deste projeto) realmente dependem do valor real aqui.
//
// Usa DIRECT_URL (conexão direta do Prisma Postgres), não DATABASE_URL (pooled,
// usada pela aplicação em runtime — ver src/lib/prisma.ts): rodar migrations sobre
// a conexão pooled falha/trava, e misturar as duas na mesma URL fez o tráfego da
// aplicação esgotar a cota de conexões diretas, causando
// "FATAL: too many connections for role prisma_migration" no build da Vercel.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url:
      process.env.DIRECT_URL ??
      "postgresql://placeholder:placeholder@localhost:5432/placeholder",
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
