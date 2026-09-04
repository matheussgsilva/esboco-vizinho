@AGENTS.md

# CLAUDE.md

Este arquivo fornece orientações ao Claude Code (claude.ai/code) ao trabalhar com o código deste repositório.

## O que é isto

**Esboço Páginas Amarelas** — um hub que conecta negócios locais a consumidores (páginas amarelas moderno). Next.js (App Router) + Tailwind + Prisma/Postgres + NextAuth + Resend + Stripe, com deploy na Vercel (projeto: `esboco-paginas-amarelas`). Três papéis: `ADMIN`, `BUSINESS`, `USER`. A arquitetura completa, o modelo de dados e o design system estão documentados em [`docs/`](./docs/README.md) — leia o documento correspondente antes de mexer em auth, Stripe, busca/ranking ou no design system.

## Comandos

```bash
npm run dev                        # servidor de dev (Turbopack)
npm run build && npm run start     # build/serve de produção
npm run lint                       # eslint

npx prisma migrate dev --name X    # mudança de schema: cria migration + regenera o client
npx prisma generate                # só regenera o client (após edição manual do schema)
npx prisma studio                  # navegador visual do banco
npx tsx prisma/seed.ts             # seed (cria admin@paginasamarelas.local / admin123)

vercel env pull                    # sincroniza .env.local com o projeto Vercel linkado
```

Nenhum test runner configurado ainda.

## Armadilhas de versão (ler antes de escrever código Next.js/Prisma/Stripe)

Este repositório roda versões majores mais novas do que a maior parte do conhecimento de treinamento reflete. Não reproduza padrões de memória — verifique contra o que está realmente instalado:

- **Next.js 16**: `middleware.ts` foi renomeado para `proxy.ts` (`src/proxy.ts`, export default, mesmo comportamento). Não recriar `middleware.ts`. Documentação completa embutida em `node_modules/next/dist/docs/`.
- **Checagens de auth em Server Components/layouts**: usar `unauthorized()`/`forbidden()` de `next/navigation` (ver `src/lib/auth-utils.ts`), não lançar um `Response` — esse padrão só funciona dentro de Route Handlers. Exige `experimental.authInterrupts` em `next.config.ts` (já habilitado).
- **Prisma 7**: a URL de conexão fica em `prisma.config.ts`, não no bloco `datasource` do `schema.prisma`. O client é gerado em `generated/` (não em `node_modules`) via `generator client { provider = "prisma-client", output = "../generated" }`, e instanciado com um driver adapter (`@prisma/adapter-pg` + `pg`), não uma connection string simples. Ver `docs/setup/prisma.md`.
- **Stripe**: `Subscription.current_period_end` foi movido para `SubscriptionItem` (por item, não mais no nível superior). Nunca passar `payment_method_types` nas Checkout Sessions. Um Stripe Product por plano. Ver `docs/arquitetura/assinaturas-stripe.md`.
- A tag `latest` do pacote npm `prisma` pode apontar para uma pre-release (ex: uma versão `-rc.`) à frente da versão estável do `@prisma/client` — fixar os dois explicitamente na mesma versão estável em vez de confiar em `latest`.

## Skills instaladas para este projeto (`.claude/skills/`)

Instaladas via `npx skills add` conforme as instruções de setup do projeto — **ler a skill relevante antes de trabalhar na sua área**, não confiar em memória:

- `frontend-design` — critério de tipografia/espaçamento/componentes; usada para `docs/design.md`.
- `prisma-database-setup` / `prisma-postgres-setup` — configuração do Prisma com Postgres.
- `stripe-best-practices` — Checkout/Billing/webhooks/segurança de chaves. **É esta que vale para o código de assinatura.**
- `stripe-projects` — instalada conforme as instruções originais, mas serve para provisionar infraestrutura (bancos, auth, hosting) via a CLI do Stripe Projects, *não* para lógica de cobrança/assinatura. Ver `docs/setup/stripe.md` para o porquê das duas estarem instaladas e qual é realmente usada.
- `vercel-react-best-practices` (referenciada, não instalada localmente como arquivo de skill) — consultar antes de operações na Vercel e antes de escrever código React sensível a performance/data-fetching.

## Estado atual

Fase de bootstrap concluída: documentação, schema completo do Prisma, esqueleto do NextAuth (Credentials + Google, `proxy.ts` baseado em papel + guards nos layouts), esqueleto do Stripe (checkout, billing-portal, webhook com idempotência), design system (tokens do Tailwind, componentes de UI base), esqueleto de rotas com páginas placeholder, projeto Vercel criado e linkado, Prisma Postgres provisionado e migrado. Ainda não implementado (ver "Fora de escopo" no plano referenciado em `docs/README.md` e em cada `docs/arquitetura/*.md`): query real de busca/ranking, dashboards admin/empresa, fluxos de review/favorito, templates de email, rate limiting, upload de imagem.
