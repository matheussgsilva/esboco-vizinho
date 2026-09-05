# Skill: prisma-database-setup

Instalada localmente em `.claude/skills/prisma-database-setup/` (via `npx skills add https://github.com/prisma/skills --skill prisma-database-setup`).

**Sempre reler esta skill antes de qualquer operação no Prisma** (mudança de provider, troubleshooting de conexão, configuração de client) — não confiar em memória de versões anteriores do Prisma, a skill reflete o fluxo atual (Prisma 7).

## O que já foi aplicado neste projeto

- Provider: PostgreSQL, via **Prisma Postgres** (gerenciado, integração nativa com a Vercel).
- `generator client { provider = "prisma-client", output = "../generated" }` — cliente fora de `node_modules`.
- `prisma.config.ts` na raiz define a URL via `env("DATABASE_URL")` (Prisma 7 move a URL do datasource para fora do `schema.prisma`).
- Driver adapter `@prisma/adapter-pg` + `pg` — não usar a conexão embutida antiga do Prisma 6 e anteriores.
- `prisma` (CLI) fica em `devDependencies`; só `@prisma/client` é dependência de runtime.
- `package.json` tem `"postinstall": "prisma generate"` — `generated/` está no `.gitignore` (é output, não código-fonte), então sem esse hook o build da Vercel falha com `Module not found: Can't resolve '../../generated/client'` num checkout limpo (não existe localmente porque a pasta já estava gerada em disco). Rodar `npm install` sempre regenera o client antes do `next build`.
- `package.json` tem `"build": "prisma migrate deploy && next build"` — o banco de produção precisa ter as migrations aplicadas *antes* do `next build` rodar, porque `/(public)/page.tsx` (home) chama `getFeaturedBusinesses()` em tempo de build (prerender estático). Sem isso, um banco de produção sem as tabelas ainda criadas quebra o build com `DriverAdapterError: TableDoesNotExist` (código Prisma `P2010`). `migrate deploy` roda na fase de `next build` (não no `postinstall`/`npm install`), que é quando `DATABASE_URL` já está disponível na Vercel.
- Ambiente local vs produção: `prisma.config.ts` e `prisma/seed.ts` carregam `.env.local` antes de `.env` (mesma precedência do Next.js), então basta configurar `DATABASE_URL` no `.env.local` para apontar para um Postgres local (ex: `docker compose up -d`, ver `docker-compose.yml` na raiz) sem afetar a URL de produção guardada em `.env`.

## Quando reconsultar

- Antes de trocar de provider de banco.
- Antes de configurar a connection string real do Prisma Postgres (produção) — a skill tem a seção `prisma-postgres` com o passo a passo via `prisma init --db` ou pelo Console.
- Ao investigar qualquer erro de conexão.
