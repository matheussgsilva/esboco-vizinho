import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BusinessCard } from "@/components/business/BusinessCard";
import { Pagination } from "@/components/ui/Pagination";
import { searchBusinesses, type SearchSort } from "@/lib/search";

interface CategoriaSearchParams {
  ordenar?: string;
  page?: string;
}

export default async function CategoriaPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<CategoriaSearchParams>;
}) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;
  const sort: SearchSort = sp.ordenar === "nome" ? "nome" : "relevancia";

  const { results, total, totalPages } = await searchBusinesses({
    categorySlug: slug,
    sort,
    page,
  });

  return (
    <main className="mx-auto flex-1 max-w-5xl space-y-8 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-ink">{category.name}</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {total} {total === 1 ? "empresa encontrada" : "empresas encontradas"}
        </p>
      </div>

      {results.length === 0 ? (
        <p className="py-16 text-center text-ink-muted">
          Nenhuma empresa encontrada nessa categoria ainda.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((business) => (
            <BusinessCard key={business.slug} business={business} />
          ))}
        </div>
      )}

      <Pagination
        basePath={`/categorias/${slug}`}
        searchParams={{ ordenar: sp.ordenar }}
        page={page}
        totalPages={totalPages}
      />
    </main>
  );
}
