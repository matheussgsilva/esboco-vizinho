import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BusinessStatusBadge } from "@/components/ui/BusinessStatusBadge";
import { PlanBadge } from "@/components/ui/PlanBadge";
import { getValidTransitions } from "@/lib/business-status";
import { ModerationForm } from "./ModerationForm";

export default async function EmpresaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const business = await prisma.business.findUnique({
    where: { id },
    include: {
      owner: { select: { name: true, email: true } },
      categories: { include: { category: { select: { name: true } } } },
      subscription: true,
    },
  });

  if (!business) notFound();

  const transitions = getValidTransitions(business.status);

  return (
    <main className="mx-auto max-w-3xl flex-1 space-y-6 px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink">{business.name}</h1>
          <p className="mt-1 text-sm text-ink-muted">/{business.slug}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <PlanBadge plan={business.planType} />
          <BusinessStatusBadge status={business.status} />
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 rounded-lg border border-border bg-surface p-4 sm:grid-cols-2">
        <div>
          <p className="text-xs text-ink-muted">Dono</p>
          <p className="text-sm text-ink">{business.owner.name ?? "—"}</p>
          <p className="text-sm text-ink-muted">{business.owner.email}</p>
        </div>
        <div>
          <p className="text-xs text-ink-muted">Localização</p>
          <p className="text-sm text-ink">
            {[business.city, business.state].filter(Boolean).join(", ") || "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-ink-muted">Categorias</p>
          <p className="text-sm text-ink">
            {business.categories.map((c) => c.category.name).join(", ") || "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-ink-muted">Avaliação</p>
          <p className="text-sm text-ink">
            {Number(business.averageRating).toFixed(1)} ({business.reviewCount} avaliações)
          </p>
        </div>
        <div>
          <p className="text-xs text-ink-muted">Assinatura</p>
          <p className="text-sm text-ink">
            {business.subscription
              ? `${business.subscription.status} (${business.subscription.planType})`
              : "Nenhuma assinatura Stripe"}
          </p>
        </div>
        <div>
          <p className="text-xs text-ink-muted">Cadastrada em</p>
          <p className="text-sm text-ink">
            {new Intl.DateTimeFormat("pt-BR").format(business.createdAt)}
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-4">
        <h2 className="mb-3 text-sm font-semibold text-ink">Ações de moderação</h2>
        <ModerationForm businessId={business.id} transitions={transitions} />
      </section>
    </main>
  );
}
