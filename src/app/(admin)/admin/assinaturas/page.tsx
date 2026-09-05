import { prisma } from "@/lib/prisma";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { PlanBadge } from "@/components/ui/PlanBadge";
import { SUBSCRIPTION_STATUS_LABELS as STATUS_LABELS } from "@/lib/subscription-labels";
import type { SubscriptionStatus } from "../../../../../generated/enums";

const PAGE_SIZE = 20;
const VALID_STATUSES: SubscriptionStatus[] = [
  "TRIALING",
  "ACTIVE",
  "PAST_DUE",
  "CANCELED",
  "UNPAID",
  "INCOMPLETE",
  "INCOMPLETE_EXPIRED",
  "PAUSED",
];

interface AssinaturasSearchParams {
  status?: string;
  page?: string;
}

export default async function AssinaturasPage({
  searchParams,
}: {
  searchParams: Promise<AssinaturasSearchParams>;
}) {
  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;
  const status = VALID_STATUSES.includes(sp.status as SubscriptionStatus)
    ? (sp.status as SubscriptionStatus)
    : undefined;

  const where = status ? { status } : {};

  const [subscriptions, total] = await Promise.all([
    prisma.subscription.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { business: { select: { name: true, slug: true } } },
    }),
    prisma.subscription.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="mx-auto max-w-5xl flex-1 space-y-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Assinaturas</h1>
        <p className="mt-1 text-sm text-ink-muted">{total} assinaturas encontradas.</p>
      </div>

      <form method="GET" className="flex flex-wrap gap-2">
        <select
          name="status"
          defaultValue={status ?? ""}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink"
        >
          <option value="">Todos os status</option>
          {VALID_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <Button type="submit" variant="secondary">
          Filtrar
        </Button>
      </form>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-lilac/40 text-ink-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Empresa</th>
              <th className="px-4 py-3 font-medium">Plano</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Renova em</th>
              <th className="px-4 py-3 font-medium">Cancela no fim do período?</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-muted">
                  Nenhuma assinatura encontrada.
                </td>
              </tr>
            ) : (
              subscriptions.map((subscription) => (
                <tr key={subscription.id} className="border-t border-border">
                  <td className="px-4 py-3 text-ink">{subscription.business.name}</td>
                  <td className="px-4 py-3">
                    <PlanBadge plan={subscription.planType} />
                  </td>
                  <td className="px-4 py-3 text-ink-muted">
                    {STATUS_LABELS[subscription.status]}
                  </td>
                  <td className="px-4 py-3 text-ink-muted">
                    {subscription.currentPeriodEnd
                      ? new Intl.DateTimeFormat("pt-BR").format(subscription.currentPeriodEnd)
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-ink-muted">
                    {subscription.cancelAtPeriodEnd ? "Sim" : "Não"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        basePath="/admin/assinaturas"
        searchParams={{ status: sp.status }}
        page={page}
        totalPages={totalPages}
      />
    </main>
  );
}
