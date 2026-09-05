import { SearchBar } from "@/components/search/SearchBar";
import { BusinessCard } from "@/components/business/BusinessCard";
import { Pagination } from "@/components/ui/Pagination";
import { searchBusinesses, type SearchSort } from "@/lib/search";

interface BuscarSearchParams {
  q?: string;
  cidade?: string;
  categoria?: string;
  ordenar?: string;
  page?: string;
}

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<BuscarSearchParams>;
}) {
  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;
  const sort: SearchSort = sp.ordenar === "nome" ? "nome" : "relevancia";

  const { results, total, totalPages } = await searchBusinesses({
    query: sp.q,
    city: sp.cidade,
    categorySlug: sp.categoria,
    sort,
    page,
  });

  return (
    <main className="mx-auto flex-1 max-w-5xl space-y-8 px-4 py-10">
      <div className="max-w-2xl">
        <SearchBar />
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink">Resultados da busca</h1>
        <p className="text-sm text-ink-muted">
          {total} {total === 1 ? "empresa encontrada" : "empresas encontradas"}
        </p>
      </div>

      {results.length === 0 ? (
        <p className="py-16 text-center text-ink-muted">
          Nenhuma empresa encontrada. Tente outros termos ou outra cidade.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((business) => (
            <BusinessCard key={business.slug} business={business} />
          ))}
        </div>
      )}

      <Pagination
        basePath="/buscar"
        searchParams={{ q: sp.q, cidade: sp.cidade, categoria: sp.categoria, ordenar: sp.ordenar }}
        page={page}
        totalPages={totalPages}
      />
    </main>
  );
}
