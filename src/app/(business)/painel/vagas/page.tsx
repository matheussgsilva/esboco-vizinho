import { requireSession } from "@/lib/auth-utils";
import { getOwnedBusiness } from "@/lib/business";
import { prisma } from "@/lib/prisma";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { Pagination } from "@/components/ui/Pagination";
import { JobForm } from "@/components/business/JobForm";
import { JobRow } from "@/components/business/JobRow";

const PAGE_SIZE = 20;

function isJobExpired(job: { status: string; closesAt: Date }) {
  return job.status === "OPEN" && job.closesAt.getTime() <= Date.now();
}

export default async function PainelVagasPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await requireSession();
  const business = await getOwnedBusiness(session.user.id);

  if (!business) {
    return (
      <PlaceholderPage
        title="Vagas"
        description="Esta conta não possui um negócio vinculado."
      />
    );
  }

  await prisma.job.updateMany({
    where: { businessId: business.id, status: "OPEN", closesAt: { lte: new Date() } },
    data: { status: "CLOSED" },
  });

  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.job.count({ where: { businessId: business.id } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="mx-auto max-w-3xl flex-1 space-y-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Vagas</h1>
        <p className="mt-1 text-sm text-ink-muted">{total} cadastradas no histórico.</p>
      </div>

      <JobForm defaultCity={business.city} defaultState={business.state} />

      {jobs.length === 0 ? (
        <p className="rounded-lg border border-border bg-surface px-4 py-8 text-center text-sm text-ink-muted">
          Nenhuma vaga cadastrada ainda.
        </p>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <JobRow
              key={job.id}
              job={{
                id: job.id,
                title: job.title,
                description: job.description,
                type: job.type,
                workMode: job.workMode,
                city: job.city,
                state: job.state,
                salaryMin: job.salaryMin !== null ? Number(job.salaryMin) : null,
                salaryMax: job.salaryMax !== null ? Number(job.salaryMax) : null,
                showSalary: job.showSalary,
                contactEmail: job.contactEmail,
                applicationUrl: job.applicationUrl,
                status: job.status,
                closesAt: job.closesAt,
                expired: isJobExpired(job),
              }}
            />
          ))}
        </div>
      )}

      <Pagination basePath="/painel/vagas" searchParams={{}} page={page} totalPages={totalPages} />
    </main>
  );
}
