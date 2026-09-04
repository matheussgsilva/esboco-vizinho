# Modelo de dados

Schema completo em [`prisma/schema.prisma`](../../prisma/schema.prisma). Resumo das entidades e decisões:

## Auth.js (NextAuth)

`Account`, `Session`, `VerificationToken` seguem exatamente o formato exigido por `@auth/prisma-adapter` — não alterar nomes de campos aqui sem checar a versão instalada do adapter.

## Domínio principal

- **User** — `role` (`ADMIN`/`BUSINESS`/`USER`, default `USER`). `passwordHash` só é usado pelo provider Credentials; usuários que entram via Google OAuth não têm senha local.
- **Business** — 1:1 com `User` (`ownerId` único — um dono, uma empresa nesta v1). Campos públicos (endereço, contato, redes sociais) + `status` (`PENDING/APPROVED/SUSPENDED/REJECTED`, moderado pelo admin) + `planType` (desnormalizado a partir de `Subscription`, usado para leitura rápida no ranking) + `averageRating`/`reviewCount` (desnormalizados, recalculados a cada review — evita `AVG()` em toda busca).
- **Category** / **BusinessCategory** — N:N entre empresa e categoria, com suporte a subcategoria via auto-relação em `Category`.
- **BusinessHours** — um registro por dia da semana (`@@unique([businessId, dayOfWeek])`).
- **Product** — produtos/serviços oferecidos pela empresa; `price` opcional (nem todo serviço tem preço fixo).
- **BusinessPhoto** / **SocialLink** — galeria e redes sociais, cada uma N:1 com `Business`.
- **Review** — `rating` (1–5) + `comment` opcional, um por par `(businessId, userId)` (`@@unique`) — usuário edita em vez de duplicar. `status` permite moderação (`PUBLISHED/FLAGGED/REMOVED`).
- **Favorite** — par único `(userId, businessId)`.
- **Subscription** — espelho local da assinatura Stripe (ver [assinaturas-stripe.md](./assinaturas-stripe.md)).
- **ProcessedWebhookEvent** — idempotência de webhooks do Stripe (Stripe pode reenviar o mesmo evento).
- **EmailLog** / **AuditLog** — auditoria de emails enviados e ações administrativas.

## Relação com o Stripe

`Business.planType` é a fonte de leitura rápida (ranking/busca). `Subscription` é a fonte de verdade de cobrança, atualizada **exclusivamente pelo webhook** (`src/app/api/webhooks/stripe/route.ts`) — nunca a partir de uma resposta do client após o Checkout. Ver [assinaturas-stripe.md](./assinaturas-stripe.md).

## Workflow do Prisma 7 usado aqui

Este projeto usa o fluxo padrão do Prisma 7 (driver adapters), conforme a skill `prisma-database-setup`:

- `generator client { provider = "prisma-client", output = "../generated" }` — cliente gerado fora de `node_modules`, em `generated/` na raiz (gitignored).
- `prisma.config.ts` na raiz define a URL do datasource via `env("DATABASE_URL")`.
- `src/lib/prisma.ts` instancia o client com o adapter `@prisma/adapter-pg` (`pg` como driver), não a conexão embutida antiga.
- Após qualquer mudança em `schema.prisma`: `npx prisma generate` (client) e `npx prisma migrate dev` (schema no banco).
