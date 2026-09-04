# Estrutura de pastas

```
esboco-paginas-amarelas/
├─ docs/                       # esta documentação
├─ prisma/
│  ├─ schema.prisma
│  └─ seed.ts
├─ prisma.config.ts            # Prisma 7: config do datasource (fora do schema)
├─ generated/                  # Prisma Client gerado (gitignored)
├─ src/
│  ├─ proxy.ts                 # Next 16: renomeado de middleware.ts — checagem otimista de rota por papel
│  ├─ auth.ts                  # config central do NextAuth (Auth.js v5)
│  ├─ app/
│  │  ├─ layout.tsx            # layout raiz (fonte, providers globais)
│  │  ├─ globals.css           # tokens de design (Tailwind v4 @theme)
│  │  ├─ unauthorized.tsx      # boundary global do next/navigation unauthorized()
│  │  ├─ forbidden.tsx         # boundary global do next/navigation forbidden()
│  │  ├─ nao-autorizado/       # página normal para onde o proxy.ts redireciona (camada otimista)
│  │  ├─ api/
│  │  │  ├─ auth/[...nextauth]/route.ts
│  │  │  ├─ webhooks/stripe/route.ts   # único endpoint de webhook do Stripe
│  │  │  ├─ checkout/route.ts          # cria Stripe Checkout Session
│  │  │  └─ billing-portal/route.ts    # cria Stripe Billing Portal Session
│  │  │
│  │  ├─ (public)/             # rotas públicas — página inicial em (public)/page.tsx
│  │  │  ├─ page.tsx
│  │  │  ├─ buscar/page.tsx
│  │  │  ├─ categorias/[slug]/page.tsx
│  │  │  └─ empresas/[slug]/page.tsx
│  │  │
│  │  ├─ (auth)/
│  │  │  ├─ login/page.tsx
│  │  │  ├─ cadastro/page.tsx
│  │  │  └─ recuperar-senha/page.tsx
│  │  │
│  │  ├─ (business)/
│  │  │  ├─ layout.tsx         # requireRole(["BUSINESS", "ADMIN"])
│  │  │  └─ painel/{page,perfil,horarios,produtos,fotos,assinatura,avaliacoes}/...
│  │  │
│  │  ├─ (admin)/
│  │  │  ├─ layout.tsx         # requireRole(["ADMIN"])
│  │  │  └─ admin/{page,empresas,empresas/[id],usuarios,assinaturas,avaliacoes}/...
│  │  │
│  │  └─ (conta)/
│  │     ├─ layout.tsx         # requireRole(["USER", "ADMIN"])
│  │     └─ minha-conta/{favoritos,minhas-avaliacoes}/...
│  │
│  ├─ components/
│  │  ├─ ui/                   # Button, Input, PlanBadge, StarRating, SectionHeader, PlaceholderPage
│  │  ├─ business/              # BusinessCard
│  │  └─ search/                 # SearchBar
│  │
│  ├─ lib/
│  │  ├─ prisma.ts             # singleton do PrismaClient com driver adapter
│  │  ├─ auth-utils.ts         # requireSession/requireRole/requireBusinessOwner
│  │  ├─ stripe.ts             # singleton do Stripe client
│  │  ├─ plans.ts              # mapa PlanType -> Stripe priceId
│  │  └─ resend.ts             # singleton do Resend client
│  │
│  ├─ emails/                  # templates React Email (a implementar)
│  └─ types/
│     └─ next-auth.d.ts        # extensão de tipos da Session/JWT (id, role)
│
├─ .env.example
├─ next.config.ts              # experimental.authInterrupts habilitado
└─ package.json
```

Observações:

- Route groups `(public)`, `(auth)`, `(business)`, `(admin)`, `(conta)` não afetam a URL — servem só para agrupar layouts e permitir checagem de papel no `layout.tsx` de cada grupo, além do `proxy.ts` global.
- `app/api/webhooks/stripe/route.ts` roda com `export const runtime = "nodejs"` explícito — necessário porque `stripe.webhooks.constructEvent` precisa do corpo raw da requisição.
- `src/proxy.ts` (não `middleware.ts`): no Next.js 16 o arquivo `middleware.ts` foi renomeado para `proxy.ts` (mesma funcionalidade, só o nome do arquivo/export mudou). Ver nota em [autenticacao.md](./autenticacao.md).
