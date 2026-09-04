# Skill: prisma-database-setup

Instalada localmente em `.claude/skills/prisma-database-setup/` (via `npx skills add https://github.com/prisma/skills --skill prisma-database-setup`).

**Sempre reler esta skill antes de qualquer operação no Prisma** (mudança de provider, troubleshooting de conexão, configuração de client) — não confiar em memória de versões anteriores do Prisma, a skill reflete o fluxo atual (Prisma 7).

## O que já foi aplicado neste projeto

- Provider: PostgreSQL, via **Prisma Postgres** (gerenciado, integração nativa com a Vercel).
- `generator client { provider = "prisma-client", output = "../generated" }` — cliente fora de `node_modules`.
- `prisma.config.ts` na raiz define a URL via `env("DATABASE_URL")` (Prisma 7 move a URL do datasource para fora do `schema.prisma`).
- Driver adapter `@prisma/adapter-pg` + `pg` — não usar a conexão embutida antiga do Prisma 6 e anteriores.
- `prisma` (CLI) fica em `devDependencies`; só `@prisma/client` é dependência de runtime.

## Quando reconsultar

- Antes de trocar de provider de banco.
- Antes de configurar a connection string real do Prisma Postgres (produção) — a skill tem a seção `prisma-postgres` com o passo a passo via `prisma init --db` ou pelo Console.
- Ao investigar qualquer erro de conexão.
