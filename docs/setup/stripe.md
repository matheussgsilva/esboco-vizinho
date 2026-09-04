# Skills do Stripe: qual usar para quê

Duas skills do repositório `stripe/ai` foram consideradas — são coisas diferentes:

## `stripe-projects` (instalada, mas não é a skill certa para assinaturas)

Serve para **provisionar infraestrutura própria do desenvolvedor** (banco de dados, auth, hosting, cache, observabilidade) através do catálogo/CLI "Stripe Projects" (`stripe projects ...`). Foi a skill originalmente indicada nas instruções do projeto, mas ela não cobre implementação de cobrança/assinatura — é sobre obter credenciais/serviços de terceiros via Stripe, não sobre a lógica de Checkout/Billing/webhooks. Mantida instalada (`.claude/skills/stripe-projects/`) caso o projeto precise provisionar algum serviço de infraestrutura no futuro, mas **não é usada** para o código de assinatura deste app.

## `stripe-best-practices` (usada para todo o código de assinatura)

Instalada em `.claude/skills/stripe-best-practices/` (via `npx skills add https://github.com/stripe/ai --skill stripe-best-practices`). Cobre exatamente o que o projeto precisa: seleção de API (Checkout vs PaymentIntents), Billing/assinaturas, segurança de chaves e webhooks.

**Sempre reler esta skill (e seus `references/billing.md` e `references/security.md`) antes de qualquer operação relacionada ao Stripe.**

### Decisões já aplicadas a partir dela

- Um Stripe Product por plano pago (Básico, Pro) — nunca dois tiers no mesmo Product.
- `payment_method_types` nunca é passado nas Checkout Sessions — Stripe decide dinamicamente.
- Checkout Session só para a primeira contratação; Billing Portal para tudo que é autogerenciamento.
- Webhook é obrigatório, não opcional — ver [../arquitetura/assinaturas-stripe.md](../arquitetura/assinaturas-stripe.md) para os eventos tratados.
- `integration_identifier` com sufixo aleatório em toda Checkout Session.
- Recomendação de usar uma chave restrita (`rk_`) em produção em vez da secret key completa — ver [../seguranca.md](../seguranca.md).

### Quando reconsultar

- Antes de adicionar qualquer novo fluxo de pagamento (ex: cobrança avulsa, split de pagamento com Connect).
- Antes de habilitar Stripe Tax.
- Ao fazer upgrade de versão da API/SDK do Stripe.
