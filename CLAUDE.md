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

Fase de bootstrap concluída, e três features já implementadas com dados reais (cada uma numa branch `feature/*` mergeada em `main` via PR):

- **Busca/ranking** (`docs/arquitetura/busca-e-ranking.md`): `src/lib/search.ts` com full-text search Postgres (coluna `tsvector` gerada + índice GIN, `websearch_to_tsquery`) e ranking ponderado por plano (`PRO > BASIC > gratuito`). Usado em `/`, `/buscar` e `/categorias/[slug]`.
- **Autenticação real** (`/login`, `/cadastro`, `/recuperar-senha`, `/redefinir-senha`): Server Actions com `useActionState` + Zod, cadastro de consumidor ou dono de negócio (cria `Business` em `PENDING`), fluxo de reset de senha via `VerificationToken`, primeiro uso real do `src/lib/email.ts` (Resend + `EmailLog`).
- **Dashboard admin** (`/admin/*`): moderação de empresas (transições de `Business.status` com `src/lib/business-status.ts` como fonte única de verdade, email `BUSINESS_APPROVED` só na primeira aprovação) e de avaliações (`Review.status`), listagens read-only de usuários e assinaturas, primeiro uso real do `AuditLog` via `src/lib/audit.ts`.

Ainda não implementado (placeholders reais, prontos para receber conteúdo):
- **Painel da empresa** (`/painel/*` — visão geral, perfil, produtos, horários, fotos, assinatura): rotas e guard de papel existem, conteúdo é só `PlaceholderPage`. `/painel/assinatura` já aponta que `/api/checkout` e `/api/billing-portal` estão prontos para uso.
- **Reviews e favoritos**: nenhum código cria `Review` ou favorito ainda; `/admin/avaliacoes` e `/minha-conta/{favoritos,minhas-avaliacoes}` existem mas ficam vazios/placeholder até essa feature existir. Recalcular `Business.averageRating`/`reviewCount` também pertence a essa feature (decisão registrada no plano do dashboard admin).
- Upload de imagem, rate limiting.
- Promoção de papel de usuário (admin): deliberadamente fora de escopo do dashboard admin — ver `docs/seguranca.md`.

Duas correções de produção já aplicadas após o primeiro deploy na Vercel (ver `docs/setup/prisma.md`): `postinstall: prisma generate` (client não vem commitado, `generated/` está no `.gitignore`) e `prisma.config.ts` usando `process.env.DATABASE_URL` com fallback em vez de `env()` (que lança erro se a variável não existir na fase de `npm install`, antes das env vars da Vercel estarem disponíveis).
