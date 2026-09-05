import { requireSession } from "@/lib/auth-utils";
import { getOwnedBusiness } from "@/lib/business";
import { prisma } from "@/lib/prisma";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { Pagination } from "@/components/ui/Pagination";
import { StarRating } from "@/components/ui/StarRating";

const PAGE_SIZE = 20;

export default async function PainelAvaliacoesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await requireSession();
  const business = await getOwnedBusiness(session.user.id);

  if (!business) {
    return (
      <PlaceholderPage
        title="Avaliações recebidas"
        description="Esta conta não possui um negócio vinculado."
      />
    );
  }

  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { businessId: business.id, status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { user: { select: { name: true } } },
    }),
    prisma.review.count({ where: { businessId: business.id, status: "PUBLISHED" } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="mx-auto max-w-3xl flex-1 space-y-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Avaliações recebidas</h1>
        <div className="mt-2">
          <StarRating rating={Number(business.averageRating)} reviewCount={business.reviewCount} />
        </div>
      </div>

      {reviews.length === 0 ? (
        <p className="rounded-lg border border-border bg-surface px-4 py-8 text-center text-sm text-ink-muted">
          Nenhuma avaliação publicada ainda.
        </p>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="space-y-1.5 rounded-lg border border-border bg-surface p-4">
              <StarRating rating={review.rating} />
              <p className="text-sm text-ink">{review.comment ?? "(sem comentário)"}</p>
              <p className="text-xs text-ink-muted">
                {review.user.name ?? "Consumidor"} ·{" "}
                {new Intl.DateTimeFormat("pt-BR").format(review.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}

      <Pagination basePath="/painel/avaliacoes" searchParams={{}} page={page} totalPages={totalPages} />
    </main>
  );
}
