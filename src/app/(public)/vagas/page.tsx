import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { JobCard } from "@/components/business/JobCard";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import {
  JOB_TYPES,
  JOB_TYPE_LABELS,
  WORK_MODES,
  WORK_MODE_LABELS,
  type JobTypeCode,
  type WorkModeCode,
} from "@/lib/validations/job";

export const metadata: Metadata = {
  title: "Vagas de emprego",
  description: "Vagas abertas nas empresas cadastradas no Esboço Páginas Amarelas.",
};

const PAGE_SIZE = 20;

interface VagasSearchParams {
  cidade?: string;
  tipo?: string;
  modalidade?: string;
  page?: string;
}

const selectClassName = "rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink";

export default async function VagasPage({
  searchParams,
}: {
  searchParams: Promise<VagasSearchParams>;
}) {
  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;
  const cidade = sp.cidade?.trim() || undefined;
  const tipo = JOB_TYPES.includes(sp.tipo as JobTypeCode) ? (sp.tipo as JobTypeCode) : undefined;
  const modalidade = WORK_MODES.includes(sp.modalidade as WorkModeCode)
    ? (sp.modalidade as WorkModeCode)
    : undefined;

  const where = {
    status: "OPEN" as const,
    closesAt: { gt: new Date() },
    business: { status: "APPROVED" as const },
    ...(cidade ? { city: { contains: cidade, mode: "insensitive" as const } } : {}),
    ...(tipo ? { type: tipo } : {}),
    ...(modalidade ? { workMode: modalidade } : {}),
  };

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { business: { select: { name: true } } },
    }),
    prisma.job.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="mx-auto flex-1 max-w-5xl space-y-8 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Vagas de emprego</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {total} {total === 1 ? "vaga aberta" : "vagas abertas"} nas empresas cadastradas.
        </p>
      </div>

      <form method="GET" className="flex flex-wrap gap-2">
        <input
          type="text"
          name="cidade"
          defaultValue={sp.cidade ?? ""}
          placeholder="Cidade"
          className="rounded-md border border-border bg-surface px-4 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-coral/40"
        />
        <select name="tipo" defaultValue={sp.tipo ?? ""} className={selectClassName}>
          <option value="">Todos os tipos</option>
          {JOB_TYPES.map((type) => (
            <option key={type} value={type}>
              {JOB_TYPE_LABELS[type]}
            </option>
          ))}
        </select>
        <select name="modalidade" defaultValue={sp.modalidade ?? ""} className={selectClassName}>
          <option value="">Todas as modalidades</option>
          {WORK_MODES.map((mode) => (
            <option key={mode} value={mode}>
              {WORK_MODE_LABELS[mode]}
            </option>
          ))}
        </select>
        <Button type="submit" variant="secondary">
          Filtrar
        </Button>
      </form>

      {jobs.length === 0 ? (
        <p className="py-16 text-center text-ink-muted">Nenhuma vaga encontrada com esses filtros.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={{
                id: job.id,
                title: job.title,
                businessName: job.business.name,
                city: job.city,
                state: job.state,
                type: job.type,
                workMode: job.workMode,
                salaryMin: job.salaryMin !== null ? Number(job.salaryMin) : null,
                salaryMax: job.salaryMax !== null ? Number(job.salaryMax) : null,
                showSalary: job.showSalary,
              }}
            />
          ))}
        </div>
      )}

      <Pagination
        basePath="/vagas"
        searchParams={{ cidade: sp.cidade, tipo: sp.tipo, modalidade: sp.modalidade }}
        page={page}
        totalPages={totalPages}
      />
    </main>
  );
}
