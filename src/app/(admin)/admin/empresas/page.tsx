import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { BusinessStatusBadge } from "@/components/ui/BusinessStatusBadge";
import { PlanBadge } from "@/components/ui/PlanBadge";
import type { BusinessStatus } from "../../../../../generated/enums";

const PAGE_SIZE = 20;
const VALID_STATUSES: BusinessStatus[] = ["PENDING", "APPROVED", "SUSPENDED", "REJECTED"];

interface EmpresasSearchParams {
  status?: string;
  q?: string;
  page?: string;
}

export default async function EmpresasPage({
  searchParams,
}: {
  searchParams: Promise<EmpresasSearchParams>;
}) {
  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;
  const status = VALID_STATUSES.includes(sp.status as BusinessStatus)
    ? (sp.status as BusinessStatus)
    : undefined;
  const q = sp.q?.trim();

  const where = {
    ...(status ? { status } : {}),
    ...(q ? { name: { contains: q, mode: "insensitive" as const } } : {}),
  };

  const [businesses, total] = await Promise.all([
    prisma.business.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        name: true,
        city: true,
        state: true,
        status: true,
        planType: true,
        createdAt: true,
      },
    }),
    prisma.business.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="mx-auto max-w-5xl flex-1 space-y-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Moderação de empresas</h1>
        <p className="mt-1 text-sm text-ink-muted">{total} empresas encontradas.</p>
      </div>

      <form method="GET" className="flex flex-wrap gap-2">
        <select
          name="status"
          defaultValue={status ?? ""}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink"
        >
          <option value="">Todos os status</option>
          <option value="PENDING">Pendente</option>
          <option value="APPROVED">Aprovada</option>
          <option value="SUSPENDED">Suspensa</option>
          <option value="REJECTED">Rejeitada</option>
        </select>
        <input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Buscar por nome"
          className="min-w-50 flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted"
        />
        <Button type="submit" variant="secondary">
          Filtrar
        </Button>
      </form>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-lilac/40 text-ink-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Cidade</th>
              <th className="px-4 py-3 font-medium">Plano</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Cadastro</th>
            </tr>
          </thead>
          <tbody>
            {businesses.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-muted">
                  Nenhuma empresa encontrada.
                </td>
              </tr>
            ) : (
              businesses.map((business) => (
                <tr key={business.id} className="border-t border-border">
                  <td className="px-4 py-3 text-ink">
                    <Link
                      href={`/admin/empresas/${business.id}`}
                      className="font-medium hover:text-brand-coral"
                    >
                      {business.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">
                    {[business.city, business.state].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <PlanBadge plan={business.planType} />
                  </td>
                  <td className="px-4 py-3">
                    <BusinessStatusBadge status={business.status} />
                  </td>
                  <td className="px-4 py-3 text-ink-muted">
                    {new Intl.DateTimeFormat("pt-BR").format(business.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        basePath="/admin/empresas"
        searchParams={{ status: sp.status, q: sp.q }}
        page={page}
        totalPages={totalPages}
      />
    </main>
  );
}
