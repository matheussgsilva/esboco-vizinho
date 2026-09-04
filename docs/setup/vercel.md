# Skill: vercel-react-best-practices

Referenciada em https://www.skills.sh/vercel-labs/agent-skills/vercel-react-best-practices (guia de performance para React/Next.js, 70 regras em 8 categorias: eliminar request waterfalls, redução de bundle, memoização, hidratação/CSS, batching de DOM, estruturas de dados eficientes). **Consultar sempre antes de escrever componentes novos, data fetching, ou qualquer revisão de performance/bundle** — não só para operações de infraestrutura na Vercel.

## O que já foi feito na Vercel (via `vercel` CLI)

1. Projeto criado: **`esboco-paginas-amarelas`** (`vercel project add`).
2. Diretório local linkado ao projeto (`vercel link`) — gera `.vercel/` (gitignored).
3. Integração de marketplace **Prisma Postgres** instalada e conectada ao projeto (`vercel integration add prisma/prisma-postgres`) — provisionou o banco e já baixou `DATABASE_URL`/`POSTGRES_URL`/`PRISMA_DATABASE_URL` para `.env.local`.
4. `AUTH_SECRET` cadastrado nos ambientes Production/Preview/Development do projeto na Vercel (`vercel env add`).

## Pendências para o primeiro deploy real

Ainda faltam variáveis que dependem de contas externas ainda não criadas neste bootstrap — cadastrar com `vercel env add <NOME> <ambiente>` quando existirem:

- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_BASIC`, `STRIPE_PRICE_PRO` (conta Stripe + produtos criados — ver [assinaturas-stripe.md](../arquitetura/assinaturas-stripe.md)).
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL` com domínio verificado.
- `NEXT_PUBLIC_APP_URL` apontando para o domínio real de produção assim que o primeiro deploy definir a URL (`https://esboco-paginas-amarelas.vercel.app` ou domínio próprio).
- `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`, se o login social for habilitado.

Use `vercel env pull` para sincronizar `.env.local` sempre que uma variável for adicionada/alterada no dashboard.
