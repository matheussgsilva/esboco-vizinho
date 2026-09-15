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

Fase de bootstrap concluída e desenvolvimento incremental em andamento — cada feature/fix numa branch (`feature/*`/`fix/*`/`chore/*`) mergeada em `main` via PR (histórico completo: `git log --merges main`). Áreas com dados reais hoje:

- **Busca/ranking** (`docs/arquitetura/busca-e-ranking.md`): `src/lib/search.ts` com full-text search Postgres (coluna `tsvector` gerada + índice GIN) e ranking ponderado por plano (`PRO > BASIC > gratuito`). A busca faz *prefix matching* por palavra (`websearch_to_tsquery` reprocessado com `regexp_replace` + `to_tsquery` para virar `'termo':*`) — termo parcial já retorna resultado, não precisa digitar a palavra inteira. Usado em `/`, `/buscar` e `/categorias/[slug]`.
- **Autenticação real** (`/login`, `/cadastro`, `/recuperar-senha`, `/redefinir-senha`): Server Actions com `useActionState` + Zod, cadastro de consumidor ou dono de negócio (cria `Business` em `PENDING`), fluxo de reset de senha via `VerificationToken`, primeiro uso real do `src/lib/email.ts` (Resend + `EmailLog`).
- **Dashboard admin** (`/admin/*`): moderação de empresas (transições de `Business.status` com `src/lib/business-status.ts` como fonte única de verdade, email `BUSINESS_APPROVED` só na primeira aprovação) e de avaliações (`Review.status`), listagens read-only de usuários e assinaturas, `AuditLog` via `src/lib/audit.ts`. Gestão de categorias (`/admin/categorias`, CRUD com slug único e subcategorias via auto-relação em `Category`, `src/app/(admin)/admin/categorias/actions.ts`). Visão geral com gráficos reais (`recharts` via `src/components/admin/charts/`: `TrendAreaChart` de crescimento de negócios, `PlanBarChart` de distribuição por plano, `EmphasisBarChart` de atividade por dia da semana — dados agregados em `src/lib/growth-stats.ts`).
- **Painel da empresa** (`/painel/*`): visão geral, perfil (`BusinessProfileForm` + `SocialLinksManager`), horários (`BusinessHoursForm`), produtos/serviços (CRUD via `ProductForm`/`ProductRow`), promoções (`/painel/promocoes`, CRUD de `Promotion` — `discountLabel` livre + janela `startsAt`/`endsAt` opcional, sem fechamento automático por cron; perfil público só mostra as ativas dentro da janela), assinatura (planos, Stripe Checkout/Billing Portal via `SubscriptionActions`), avaliações recebidas com resposta pública do dono (`Review.ownerResponse`/`ownerRespondedAt`, upsert/delete em `.../painel/avaliacoes/actions.ts`, uma resposta por review, só enquanto `status === PUBLISHED`) e estatísticas (`/painel/estatisticas`: visualizações e cliques em telefone/WhatsApp/redes sociais dos últimos 30 dias, a partir de `BusinessEvent` alimentado por `POST /api/track` disparado no perfil público — aceita eventos anônimos sem dedupe por IP, ver `docs/seguranca.md`). Navegação do painel e do admin usa o mesmo componente de sidebar padronizado. `PlaceholderPage` só aparece no caso de borda "conta sem negócio vinculado" e em `/painel/fotos` (ver pendências abaixo).
- **Perfil público da empresa** (`/empresas/[slug]`): página completa com horário de funcionamento (`BusinessHoursTable`), dados de contato/redes sociais, produtos, promoções ativas e resposta do dono às avaliações.
- **CTAs de cadastro na home**: chamadas para cadastro de consumidor e de dono de negócio na página inicial, com `/cadastro` aceitando o tipo de conta via parâmetro.
- **Reviews e favoritos**: criação/edição (upsert)/exclusão de `Review` e toggle de `Favorite` a partir de `/empresas/[slug]` (`src/app/(public)/empresas/[slug]/actions.ts`), com `src/lib/reviews.ts#recalculateBusinessRating` recalculando `Business.averageRating`/`reviewCount` a partir dos reviews `PUBLISHED` — chamado tanto nessas actions quanto na moderação admin existente (`moderateReviewAction`, que antes não recalculava). Dono de negócio não pode avaliar a própria empresa. `/minha-conta`, `/minha-conta/favoritos` e `/minha-conta/minhas-avaliacoes` têm conteúdo real (a listagem de favoritos reaproveita `BusinessCard`).
- **Redesign da home + chrome global**: `src/app/(public)/layout.tsx` adiciona `Header`/`Footer` (`src/components/layout/`) a todo o site público — antes não existia nenhum header/footer/nav, nem botão de logout em lugar nenhum do app. Header é ciente de sessão (`auth()`), com link para a área certa por role e ação de sign-out inline. Home reescrita com categorias vindas do banco (`prisma.category.findMany`, ícones via `lucide-react`/`src/lib/category-icons.ts`) e uma faixa de estatísticas reais (negócios/cidades/avaliações, via contagens Prisma) — cores/tipografia continuam as de `docs/design.md`, nenhum token novo.
- **Vagas de emprego** (`/vagas`, `/vagas/[id]`, `/painel/vagas`): CRUD de `Job` a partir do painel da empresa (Server Actions em `src/app/(business)/painel/vagas/actions.ts`, validação em `src/lib/validations/job.ts` — exige `contactEmail` ou `applicationUrl`, faixa salarial opcional com `showSalary`, UI de tabela + modais no painel), listagem pública filtrável por cidade/tipo/modalidade e página de detalhe. Fechamento automático de vagas com `closesAt` vencido via cron diário (`vercel.json` → `GET /api/cron/close-expired-jobs`, protegido por `CRON_SECRET`, `03:00`). Ainda sem doc de arquitetura dedicada em `docs/` — nem `Job` nem `BusinessEvent` (tracking) estão documentados em `docs/arquitetura/modelo-de-dados.md` hoje.

Ainda não implementado (placeholders reais, prontos para receber conteúdo):
- **Fotos da empresa** (`/painel/fotos`): só `PlaceholderPage`; upload de logo/capa/galeria via URL assinada (abordagem documentada em `docs/seguranca.md`) ainda não existe.
- **Email de nova review**: `docs/arquitetura/emails.md` documenta um email ao dono da empresa quando recebe uma review nova, mas o template e o envio ainda não foram implementados (decisão deliberada ao implementar reviews/favoritos, para manter o escopo focado em CRUD + recálculo de rating).
- Rate limiting: nenhuma implementação ainda (`docs/seguranca.md` lista as rotas prioritárias: `/api/auth/*`, `/api/reviews`, `/api/checkout`, `/api/billing-portal`, `/api/track`).
- Cabeçalhos de segurança (CSP, `X-Frame-Options`, `Referrer-Policy`): ainda não configurados em `next.config.ts` — ver `docs/seguranca.md`.
- Webhook Stripe: TODO em `src/app/api/webhooks/stripe/route.ts` — status/`currentPeriodEnd` da assinatura ainda não são atualizados a partir dos eventos de invoice.
- SEO: sem `sitemap.ts`/`robots.ts` em `src/app`, e `/buscar`/`/categorias/[slug]` ainda sem `generateMetadata` dinâmico (só `/empresas/[slug]` e `/vagas*` têm hoje).
- Promoção de papel de usuário (admin): deliberadamente fora de escopo do dashboard admin — ver `docs/seguranca.md`.

Três correções de produção já aplicadas após o deploy na Vercel (ver `docs/setup/prisma.md`): `postinstall: prisma generate` (client não vem commitado, `generated/` está no `.gitignore`); `prisma.config.ts` usando `process.env.DATABASE_URL` com fallback em vez de `env()` (que lança erro se a variável não existir na fase de `npm install`, antes das env vars da Vercel estarem disponíveis); e separação de `DATABASE_URL` (pooled, runtime da aplicação) de `DIRECT_URL` (direta, só para `prisma migrate deploy`/CLI) — a app e as migrations competindo pela mesma cota de conexões diretas derrubava o build (`FATAL: too many connections for role "prisma_migration"`).
