# Assinaturas (Stripe)

Baseado na skill `stripe-best-practices` (stripe/ai) — **não** na skill `stripe-projects`, que é para provisionar infraestrutura (bancos, auth, hosting) via CLI da Stripe e não se aplica a este fluxo. Ver [setup/stripe.md](../setup/stripe.md) para o porquê dessa troca.

## Planos

Três planos, cada um um **Product Stripe separado** (nunca prices de tiers diferentes no mesmo Product — o nome do Product aparece no Checkout/fatura, e tiers diferentes com o mesmo nome confundem o cliente):

| Plano | `PlanType` | Stripe Product/Price | Efeito |
|---|---|---|---|
| Gratuito | `FREE` | nenhum — estado padrão, sem Checkout | sem prioridade na busca |
| Básico | `BASIC` | 1 Product + 1 Price mensal (`STRIPE_PRICE_BASIC`) | prioridade na busca |
| Pro | `PRO` | 1 Product + 1 Price mensal (`STRIPE_PRICE_PRO`) | prioridade máxima + destaque na home |

Mapeamento em `src/lib/plans.ts` via variáveis de ambiente — evita hardcode de price IDs e permite trocar preço sem redeploy de lógica.

## Checkout vs Billing Portal

- **Checkout Session** (`POST /api/checkout`) — só para a primeira contratação de um plano pago ou upgrade a partir do Gratuito. `mode: "subscription"`, cria/reaproveita o `stripeCustomerId` salvo em `Subscription`.
- **Billing Portal** (`POST /api/billing-portal`) — para tudo que é gerenciamento de uma assinatura existente: trocar de plano, atualizar cartão, cancelar. Evita reimplementar essa UI.

Regra prática: se a empresa já tem `stripeSubscriptionId` ativo, o botão no painel leva ao Billing Portal; só mostra Checkout quando está em `FREE` sem assinatura.

## Regras da API seguidas na implementação

- **Nunca** passar `payment_method_types` no Checkout Session — Stripe determina os métodos elegíveis dinamicamente a partir da configuração do Dashboard. Hardcodar `['card']` reduz conversão.
- Sempre instanciar um `Stripe` client (`src/lib/stripe.ts`) e chamar métodos na instância — nunca o padrão global depreciado (`stripe.api_key = ...`).
- `integration_identifier` (com sufixo aleatório de 8 letras) é enviado em toda Checkout Session criada, para rastrear a origem no Dashboard.
- Chave da API: usar uma **chave restrita (`rk_`)** em produção, com permissão mínima necessária (Checkout Sessions, Customers, Subscriptions, Billing Portal Sessions), não a secret key completa (`sk_`). Ver [seguranca.md](../seguranca.md).

## Webhook (`/api/webhooks/stripe`)

Webhook **não é opcional** — mudanças de assinatura (renovação, falha de pagamento, cancelamento) acontecem de forma assíncrona e são invisíveis para uma integração que só lê a página de sucesso do Checkout.

- `runtime = "nodejs"` explícito (necessário para `stripe.webhooks.constructEvent`, que exige o corpo raw da requisição).
- Validação obrigatória de assinatura via `STRIPE_WEBHOOK_SECRET` — retorna 400 imediatamente se falhar.
- Idempotência por `event.id`, guardado em `ProcessedWebhookEvent` (Stripe pode reenviar o mesmo evento).
- Eventos tratados:
  - `checkout.session.completed` e `checkout.session.async_payment_succeeded` (gated em `payment_status === "paid"`) — cria/atualiza `Subscription` e `Business.planType` em uma transação.
  - `customer.subscription.updated` — cobre troca de plano e mudanças de status (`past_due`, `trialing`, `paused`, etc).
  - `customer.subscription.deleted` — cancelamento efetivo: `Subscription.status = CANCELED`, `Business.planType = FREE`.
  - `invoice.paid` / `invoice.payment_failed` — handlers presentes como TODO explícito: a próxima iteração deve atualizar `currentPeriodEnd`/status e disparar os emails de confirmação/falha via Resend (ver [emails.md](./emails.md)).
- **Nunca** atualizar `planType`/status a partir do redirect de sucesso do Checkout no client — o redirect é só UX, a fonte de verdade é sempre o webhook validado.

## Nota sobre impostos

Ainda não implementado. Se o projeto for cobrar de empresas em diferentes estados/países, avaliar o Stripe Tax (`automatic_tax`) antes do lançamento — habilitar sem ter uma registration ativa faz o Stripe não calcular nem coletar imposto nenhum, sem erro visível. Ver a referência de tax da skill `stripe-best-practices` quando esse trabalho entrar em escopo.
