import { requireSession } from "@/lib/auth-utils";
import { getOwnedBusiness } from "@/lib/business";
import { prisma } from "@/lib/prisma";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { Pagination } from "@/components/ui/Pagination";
import { PromotionForm } from "@/components/business/PromotionForm";
import { PromotionRow } from "@/components/business/PromotionRow";

const PAGE_SIZE = 20;

export default async function PainelPromocoesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await requireSession();
  const business = await getOwnedBusiness(session.user.id);

  if (!business) {
    return (
      <PlaceholderPage
        title="Promoções"
        description="Esta conta não possui um negócio vinculado."
      />
    );
  }

  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;

  const [promotions, total] = await Promise.all([
    prisma.promotion.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.promotion.count({ where: { businessId: business.id } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="mx-auto max-w-3xl flex-1 space-y-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Promoções</h1>
        <p className="mt-1 text-sm text-ink-muted">{total} cadastradas.</p>
      </div>

      <PromotionForm />

      {promotions.length === 0 ? (
        <p className="rounded-lg border border-border bg-surface px-4 py-8 text-center text-sm text-ink-muted">
          Nenhuma promoção cadastrada ainda.
        </p>
      ) : (
        <div className="space-y-3">
          {promotions.map((promotion) => (
            <PromotionRow
              key={promotion.id}
              promotion={{
                id: promotion.id,
                title: promotion.title,
                discountLabel: promotion.discountLabel,
                description: promotion.description,
                startsAt: promotion.startsAt,
                endsAt: promotion.endsAt,
                isActive: promotion.isActive,
              }}
            />
          ))}
        </div>
      )}

      <Pagination basePath="/painel/promocoes" searchParams={{}} page={page} totalPages={totalPages} />
    </main>
  );
}
