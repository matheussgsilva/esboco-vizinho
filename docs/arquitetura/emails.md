# Emails transacionais (Resend)

> Fora de escopo do bootstrap inicial — `src/lib/resend.ts` já existe (singleton do client), mas nenhum template/disparo real está implementado ainda.

## Eventos → templates planejados

Templates em `src/emails/*.tsx`, renderizados com `@react-email/components` (já instalado):

| Evento | Destinatário | Template |
|---|---|---|
| Cadastro de novo `User` (consumidor) | Usuário | `welcome-user.tsx` |
| Cadastro de nova `Business` | Dono da empresa | `welcome-business.tsx` (menciona status `PENDING`) |
| Aprovação da empresa pelo admin | Dono da empresa | `business-approved.tsx` |
| Assinatura confirmada (`checkout.session.completed`) | Dono da empresa | `subscription-confirmed.tsx` |
| Assinatura cancelada (`customer.subscription.deleted`) | Dono da empresa | `subscription-canceled.tsx` |
| Falha de pagamento (`invoice.payment_failed`) | Dono da empresa | `payment-failed.tsx` |
| Nova review recebida | Dono da empresa | `new-review-received.tsx` |
| Recuperação de senha | Usuário que solicitou | `reset-password.tsx` |

## Boas práticas a seguir na implementação

- Todo envio passa por `lib/resend.ts` e registra em `EmailLog` (auditoria/idempotência — evita reenviar o mesmo email se um webhook do Stripe for reprocessado).
- Envio dentro do handler de webhook do Stripe não pode bloquear o retorno 200 (Stripe espera resposta rápida) — usar `waitUntil` (Vercel Functions) para disparo fire-and-forget.
- Domínio remetente verificado no Resend (SPF/DKIM) antes de produção, para não cair em spam. `RESEND_FROM_EMAIL` em `.env` usa o domínio de teste `resend.dev` até isso ser configurado.
