# Segurança — Esboço Páginas Amarelas

Recomendações e decisões de segurança para o projeto. Revisar este arquivo antes de qualquer mudança em autenticação, pagamentos, upload de arquivos ou exposição de dados de outros usuários/empresas.

## Autorização em profundidade

- **Duas camadas obrigatórias** para toda rota sensível: `src/proxy.ts` (checagem otimista, edge) + `requireRole()`/`requireSession()` em cada `layout.tsx` de grupo protegido e em cada Route Handler de mutação (`lib/auth-utils.ts`). Nunca confiar só no `proxy.ts` — ele só lê o JWT do cookie, não revalida contra o banco.
- **Nunca** aceitar `role` vindo do client em nenhum formulário ou endpoint de cadastro/edição de perfil. Promoção a `ADMIN` só via `prisma/seed.ts` ou uma ação administrativa própria e restrita.
- **IDOR**: toda operação sobre `Business`, `Review`, `Favorite`, `Subscription` deve validar que o recurso pertence à sessão atual (ou que é `ADMIN`) **consultando o banco**, nunca confiando em um `businessId`/`userId` recebido no payload/query isoladamente. Usar `requireBusinessOwner(business.ownerId)` para toda mutação de empresa.

## Autenticação (NextAuth / Auth.js)

- Estratégia de sessão **JWT** (exigida pelo provider Credentials). O `role` é embutido no token no login e revalidado contra o banco em `callbacks.jwt` quando ausente ou em `trigger === "update"` — mas para ações críticas (ex: suspender uma empresa), sempre revalidar no banco em vez de confiar cegamente no token, já que um JWT antigo permanece válido até expirar mesmo após uma mudança de papel.
- Senhas hasheadas com `bcryptjs` (`passwordHash` em `User`) — nunca texto plano, nunca reversível.
- `AUTH_SECRET` gerado com `openssl rand -base64 32` (ou `npx auth secret`), armazenado só em variável de ambiente — nunca commitado. Já cadastrado como variável na Vercel (ver [setup/vercel.md](./setup/vercel.md)).

## Stripe

- Chave da API: usar uma **chave restrita (`rk_`)** em produção com o menor conjunto de permissões necessário (Checkout Sessions, Customers, Subscriptions, Billing Portal), não a secret key completa (`sk_`). Rotacionar a chave se alguém com acesso a ela sair do time.
- Webhook (`/api/webhooks/stripe`): validação de assinatura obrigatória via `STRIPE_WEBHOOK_SECRET` (`stripe.webhooks.constructEvent` com o corpo raw da requisição) — requisição sem assinatura válida é rejeitada com 400 antes de qualquer processamento. Idempotência por `event.id` (`ProcessedWebhookEvent`).
- **Nunca** atualizar `Business.planType`/`Subscription.status` a partir de uma resposta do client (ex: página de sucesso do Checkout) — a única fonte de verdade é o webhook validado.
- `STRIPE_SECRET_KEY`/`STRIPE_WEBHOOK_SECRET` só em variável de ambiente (idealmente marcados como "sensitive environment variable" na Vercel, já que a plataforma não tem um vault de segredos dedicado — ver [setup/vercel.md](./setup/vercel.md)).
- Nunca logar chaves ou incluí-las em mensagens de erro.

## Validação de input

- Toda rota de mutação (Route Handler ou Server Action) deve validar `body`/`query` com **Zod** antes de tocar no Prisma — não confiar em tipos do TypeScript em runtime, já que o payload vem de fora do processo.
- `comment` de `Review` e `description` de `Business`/`Product` são tratados como **texto puro** (sem renderização de HTML) — elimina a maior parte do risco de XSS armazenado em conteúdo gerado por usuário. Se um editor rich-text for adicionado no futuro, sanitizar no servidor (`sanitize-html`/DOMPurify) antes de persistir e novamente antes de renderizar.

## Upload de imagens (logo, capa, galeria, produtos)

Ainda não implementado — ao implementar:

- Gerar a URL de upload assinada no servidor (nunca aceitar o arquivo bruto direto num Route Handler sem essa etapa).
- Validar `content-type`, extensão e tamanho máximo (ex: 5MB) antes de aceitar.
- Gerar nome de arquivo aleatório no armazenamento (evita path traversal e sobrescrita de arquivo de outro usuário).
- Reprocessar a imagem (resize/strip EXIF) para remover metadados sensíveis (geolocalização, dispositivo).

## Rate limiting

Ainda não implementado — recomendado antes do lançamento em produção, especialmente em:

- `/api/auth/*` (login/cadastro — evitar brute force e credential stuffing).
- `/api/reviews` (evitar spam de avaliações).
- `/api/checkout` e `/api/billing-portal` (evitar abuso/geração excessiva de sessões Stripe).

Sugestão: Upstash Ratelimit (Redis serverless, integra bem com a Vercel) atrás de um `lib/rate-limit.ts`.

## Segredos e configuração

- Nenhum segredo (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `AUTH_SECRET`, `RESEND_API_KEY`, `DATABASE_URL`) é commitado — `.env` está no `.gitignore`, só `.env.example` (com valores vazios) fica no repositório.
- Variáveis sensíveis cadastradas na Vercel devem usar a opção "sensitive" quando disponível, para ficarem write-only (não aparecem no dashboard nem em logs).

## Cabeçalhos de segurança

Ainda não configurado — adicionar em `next.config.ts` (função `headers()`) antes do lançamento: `Content-Security-Policy` (incluindo `https://*.stripe.com` nos diretivos relevantes, já que o projeto usa Stripe.js/Checkout hospedado), `X-Frame-Options`, `Referrer-Policy`.

## Dependências

- `prisma` (CLI) fica em `devDependencies` — não é código de runtime em produção.
- Vulnerabilidades conhecidas e aceitas por ora: `mysql2`/`deepmerge-ts` (transitivas do `@prisma/config`, usadas só pelo suporte a MySQL da CLI do Prisma — não alcançável neste projeto, que usa exclusivamente Postgres). Reavaliar com `npm audit` quando o Prisma publicar uma versão estável que atualize essa dependência.
- Scripts de instalação (`postinstall`/`preinstall`) de pacotes novos passam por revisão manual antes de aprovar (`npm install-scripts approve`) — só aprovados: `@prisma/engines`, `prisma`, `unrs-resolver`, `esbuild`, todos pacotes conhecidos que baixam binários nativos necessários para funcionar.
