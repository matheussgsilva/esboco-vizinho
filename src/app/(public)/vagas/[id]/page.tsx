import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { JOB_TYPE_LABELS, WORK_MODE_LABELS, type JobTypeCode, type WorkModeCode } from "@/lib/validations/job";

const currencyFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const dateFormatter = new Intl.DateTimeFormat("pt-BR");

async function getPublicJob(id: string) {
  const job = await prisma.job.findUnique({
    where: { id },
    include: { business: { select: { name: true, slug: true, status: true } } },
  });

  if (
    !job ||
    job.status !== "OPEN" ||
    job.closesAt.getTime() <= Date.now() ||
    job.business.status !== "APPROVED"
  ) {
    return null;
  }

  return job;
}

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const job = await getPublicJob(id);

  if (!job) {
    return { title: "Vaga não encontrada" };
  }

  return {
    title: `${job.title} — ${job.business.name}`,
    description: job.description.slice(0, 160),
  };
}

function formatSalary(job: { salaryMin: unknown; salaryMax: unknown }) {
  const min = job.salaryMin !== null ? Number(job.salaryMin) : null;
  const max = job.salaryMax !== null ? Number(job.salaryMax) : null;
  if (min != null && max != null) {
    return `${currencyFormatter.format(min)} - ${currencyFormatter.format(max)}`;
  }
  if (min != null) return `A partir de ${currencyFormatter.format(min)}`;
  if (max != null) return `Até ${currencyFormatter.format(max)}`;
  return null;
}

export default async function VagaPage({ params }: PageProps) {
  const { id } = await params;
  const job = await getPublicJob(id);

  if (!job) {
    notFound();
  }

  const location = [job.city, job.state].filter(Boolean).join(", ");
  const salary = job.showSalary ? formatSalary(job) : null;
  const applyHref = job.applicationUrl || (job.contactEmail ? `mailto:${job.contactEmail}` : null);

  return (
    <main className="mx-auto flex-1 max-w-3xl space-y-6 px-4 py-10">
      <div className="space-y-2">
        <Link
          href={`/empresas/${job.business.slug}`}
          className="text-sm font-medium text-brand-coral hover:text-brand-coral-dark hover:underline"
        >
          {job.business.name}
        </Link>
        <h1 className="text-2xl font-semibold text-ink">{job.title}</h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
          <span>{JOB_TYPE_LABELS[job.type as JobTypeCode]}</span>
          <span aria-hidden>·</span>
          <span>{WORK_MODE_LABELS[job.workMode as WorkModeCode]}</span>
          {location && (
            <>
              <span aria-hidden>·</span>
              <span>{location}</span>
            </>
          )}
        </div>
        {salary && <p className="text-base font-medium text-ink">{salary}</p>}
        <p className="text-sm text-ink-muted">
          Candidaturas até {dateFormatter.format(job.closesAt)}
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-ink">Descrição</h2>
        <p className="whitespace-pre-line text-sm text-ink">{job.description}</p>
      </section>

      {applyHref && (
        <a
          href={applyHref}
          target={job.applicationUrl ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center justify-center gap-2 rounded-md bg-brand-coral px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-coral-dark"
        >
          Candidatar-se
        </a>
      )}
    </main>
  );
}
