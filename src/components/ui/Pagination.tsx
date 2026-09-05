import Link from "next/link";

interface PaginationProps {
  basePath: string;
  searchParams: Record<string, string | undefined>;
  page: number;
  totalPages: number;
}

function buildPageUrl(
  basePath: string,
  searchParams: Record<string, string | undefined>,
  page: number
) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (key !== "page" && value) params.set(key, value);
  }
  params.set("page", String(page));
  return `${basePath}?${params.toString()}`;
}

export function Pagination({ basePath, searchParams, page, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Paginação de resultados"
      className="flex items-center justify-center gap-4 pt-4 text-sm"
    >
      {page > 1 ? (
        <Link
          href={buildPageUrl(basePath, searchParams, page - 1)}
          className="font-medium text-brand-coral hover:text-brand-coral-dark"
        >
          Anterior
        </Link>
      ) : (
        <span className="text-ink-muted">Anterior</span>
      )}
      <span className="text-ink-muted">
        Página {page} de {totalPages}
      </span>
      {page < totalPages ? (
        <Link
          href={buildPageUrl(basePath, searchParams, page + 1)}
          className="font-medium text-brand-coral hover:text-brand-coral-dark"
        >
          Próxima
        </Link>
      ) : (
        <span className="text-ink-muted">Próxima</span>
      )}
    </nav>
  );
}
