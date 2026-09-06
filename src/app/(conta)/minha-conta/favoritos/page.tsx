import { requireSession } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { isOpenNow } from "@/lib/search";
import { BusinessCard } from "@/components/business/BusinessCard";
import { RemoveFavoriteButton } from "@/components/account/RemoveFavoriteButton";

export default async function MinhaContaFavoritosPage() {
  const session = await requireSession();

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      business: {
        include: {
          categories: { include: { category: { select: { name: true } } }, take: 1 },
          hours: true,
        },
      },
    },
  });

  return (
    <main className="mx-auto max-w-5xl flex-1 space-y-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Meus favoritos</h1>
        <p className="mt-1 text-sm text-ink-muted">Empresas que você salvou para acessar depois.</p>
      </div>

      {favorites.length === 0 ? (
        <p className="rounded-lg border border-border bg-surface px-4 py-8 text-center text-sm text-ink-muted">
          Você ainda não favoritou nenhuma empresa.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map(({ business }) => (
            <div key={business.id} className="space-y-2">
              <BusinessCard
                business={{
                  slug: business.slug,
                  name: business.name,
                  categoryName: business.categories[0]?.category.name ?? "Sem categoria",
                  city: business.city ?? "",
                  coverImageUrl: business.coverImageUrl,
                  averageRating: Number(business.averageRating),
                  reviewCount: business.reviewCount,
                  isOpenNow: isOpenNow(business.hours),
                }}
              />
              <RemoveFavoriteButton businessId={business.id} slug={business.slug} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
