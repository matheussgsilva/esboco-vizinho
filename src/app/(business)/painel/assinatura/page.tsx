import { requireSession } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { PlanBadge } from "@/components/ui/PlanBadge";
import { SubscriptionActions } from "@/components/business/SubscriptionActions";
import { PLANS } from "@/lib/plans";
import { SUBSCRIPTION_STATUS_LABELS } from "@/lib/subscription-labels";

export default async function PainelAssinaturaPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await requireSession();
  const { status } = await searchParams;

  const business = await prisma.business.findUnique({
    where: { ownerId: session.user.id },
    include: { subscription: true },
  });

  if (!business) {
    return (
      <PlaceholderPage
        title="Assinatura"
        description="Esta conta não possui um negócio vinculado."
      />
    );
  }

  const hasActiveSubscription = Boolean(business.subscription?.stripeSubscriptionId);

  return (
    <main className="mx-auto max-w-3xl flex-1 space-y-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Assinatura</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Planos pagos dão mais prioridade na busca e destaque na página inicial.
        </p>
      </div>

      {status === "sucesso" && (
        <p className="rounded-md bg-success/10 px-4 py-2.5 text-sm text-success">
          Pagamento confirmado! Pode levar alguns instantes até o plano atualizar aqui.
        </p>
      )}
      {status === "cancelado" && (
        <p className="rounded-md bg-amber-100 px-4 py-2.5 text-sm text-amber-800">
          Checkout cancelado. Nenhuma cobrança foi feita.
        </p>
      )}

      {business.subscription && (
        <section className="rounded-lg border border-border bg-surface p-4">
          <h2 className="mb-3 text-sm font-semibold text-ink">Assinatura atual</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <p className="text-xs text-ink-muted">Status</p>
              <p className="text-sm text-ink">
                {SUBSCRIPTION_STATUS_LABELS[business.subscription.status]}
              </p>
            </div>
            <div>
              <p className="text-xs text-ink-muted">Renova em</p>
              <p className="text-sm text-ink">
                {business.subscription.currentPeriodEnd
                  ? new Intl.DateTimeFormat("pt-BR").format(business.subscription.currentPeriodEnd)
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-ink-muted">Cancela no fim do período?</p>
              <p className="text-sm text-ink">
                {business.subscription.cancelAtPeriodEnd ? "Sim" : "Não"}
              </p>
            </div>
          </div>
        </section>
      )}

      {hasActiveSubscription && (
        <div className="max-w-xs">
          <SubscriptionActions mode="portal" label="Gerenciar assinatura" variant="secondary" />
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {(["FREE", "BASIC", "PRO"] as const).map((planType) => {
          const plan = PLANS[planType];
          const isCurrent = business.planType === planType;
          return (
            <div
              key={planType}
              className={`space-y-3 rounded-lg border p-4 ${
                isCurrent ? "border-brand-coral" : "border-border"
              } bg-surface`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-ink">{plan.name}</h3>
                {isCurrent && <PlanBadge plan={planType} />}
              </div>
              <ul className="space-y-1 text-sm text-ink-muted">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              {!hasActiveSubscription && planType !== "FREE" && (
                <SubscriptionActions mode="checkout" planType={planType} label={`Assinar ${plan.name}`} />
              )}
            </div>
          );
        })}
      </section>
    </main>
  );
}
