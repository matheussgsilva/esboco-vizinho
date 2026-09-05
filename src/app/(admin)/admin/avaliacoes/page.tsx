import { prisma } from "@/lib/prisma";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { ReviewStatusBadge } from "@/components/ui/ReviewStatusBadge";
import { ReviewRowActions } from "./ReviewRowActions";
import type { ReviewStatus } from "../../../../../generated/enums";

const PAGE_SIZE = 20;
const VALID_STATUSES: ReviewStatus[] = ["PUBLISHED", "FLAGGED", "REMOVED"];

interface AvaliacoesSearchParams {
  status?: string;
  page?: string;
}

export default async function AvaliacoesPage({
  searchParams,
}: {
  searchParams: Promise<AvaliacoesSearchParams>;
}) {
  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;
  const status = VALID_STATUSES.includes(sp.status as ReviewStatus)
    ? (sp.status as ReviewStatus)
    : "FLAGGED";

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { status },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        business: { select: { name: true, slug: true } },
        user: { select: { name: true, email: true } },
      },
    }),
    prisma.review.count({ where: { status } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="mx-auto max-w-5xl flex-1 space-y-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Moderação de avaliações</h1>
        <p className="mt-1 text-sm text-ink-muted">{total} avaliações com este status.</p>
      </div>

      <form method="GET" className="flex flex-wrap gap-2">
        <select
          name="status"
          defaultValue={status}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink"
        >
          <option value="FLAGGED">Denunciadas</option>
          <option value="PUBLISHED">Publicadas</option>
          <option value="REMOVED">Removidas</option>
        </select>
        <Button type="submit" variant="secondary">
          Filtrar
        </Button>
      </form>

      {reviews.length === 0 ? (
        <p className="rounded-lg border border-border bg-surface px-4 py-8 text-center text-sm text-ink-muted">
          Nenhuma avaliação encontrada com este status.
        </p>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-ink-muted">
                  <StarRating rating={review.rating} />
                  <ReviewStatusBadge status={review.status} />
                </div>
                <p className="text-sm text-ink">{review.comment ?? "(sem comentário)"}</p>
                <p className="text-xs text-ink-muted">
                  {review.user.name ?? review.user.email} sobre{" "}
                  <span className="font-medium">{review.business.name}</span> ·{" "}
                  {new Intl.DateTimeFormat("pt-BR").format(review.createdAt)}
                </p>
              </div>
              {review.status === "FLAGGED" && <ReviewRowActions reviewId={review.id} />}
            </div>
          ))}
        </div>
      )}

      <Pagination
        basePath="/admin/avaliacoes"
        searchParams={{ status: sp.status }}
        page={page}
        totalPages={totalPages}
      />
    </main>
  );
}
