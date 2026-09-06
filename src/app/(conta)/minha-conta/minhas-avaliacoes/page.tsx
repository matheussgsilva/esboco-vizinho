import { requireSession } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { Pagination } from "@/components/ui/Pagination";
import { MyReviewRow } from "@/components/account/MyReviewRow";

const PAGE_SIZE = 20;

export default async function MinhaContaAvaliacoesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await requireSession();
  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { business: { select: { name: true, slug: true } } },
    }),
    prisma.review.count({ where: { userId: session.user.id } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="mx-auto max-w-3xl flex-1 space-y-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Minhas avaliações</h1>
        <p className="mt-1 text-sm text-ink-muted">Avaliações que você deixou em outras empresas.</p>
      </div>

      {reviews.length === 0 ? (
        <p className="rounded-lg border border-border bg-surface px-4 py-8 text-center text-sm text-ink-muted">
          Você ainda não avaliou nenhuma empresa.
        </p>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <MyReviewRow
              key={review.id}
              review={{
                businessId: review.businessId,
                businessName: review.business.name,
                businessSlug: review.business.slug,
                rating: review.rating,
                comment: review.comment,
                createdAt: review.createdAt,
              }}
            />
          ))}
        </div>
      )}

      <Pagination basePath="/minha-conta/minhas-avaliacoes" searchParams={{}} page={page} totalPages={totalPages} />
    </main>
  );
}
