import { prisma } from "@/lib/prisma";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="text-sm text-ink-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-ink">{value}</p>
    </div>
  );
}

export default async function AdminPage() {
  const [businessByStatus, userByRole, flaggedReviews, activeSubscriptions] = await Promise.all([
    prisma.business.groupBy({ by: ["status"], _count: true }),
    prisma.user.groupBy({ by: ["role"], _count: true }),
    prisma.review.count({ where: { status: "FLAGGED" } }),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
  ]);

  const businessCount = (status: string) =>
    businessByStatus.find((row) => row.status === status)?._count ?? 0;
  const userCount = (role: string) => userByRole.find((row) => row.role === role)?._count ?? 0;

  return (
    <main className="mx-auto max-w-5xl flex-1 space-y-8 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Dashboard administrativo</h1>
        <p className="mt-1 text-sm text-ink-muted">Visão geral de usuários, empresas e assinaturas.</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-ink">Empresas</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Pendentes" value={businessCount("PENDING")} />
          <StatCard label="Aprovadas" value={businessCount("APPROVED")} />
          <StatCard label="Suspensas" value={businessCount("SUSPENDED")} />
          <StatCard label="Rejeitadas" value={businessCount("REJECTED")} />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-ink">Usuários</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard label="Consumidores" value={userCount("USER")} />
          <StatCard label="Donos de negócio" value={userCount("BUSINESS")} />
          <StatCard label="Administradores" value={userCount("ADMIN")} />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-ink">Moderação e assinaturas</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard label="Avaliações denunciadas" value={flaggedReviews} />
          <StatCard label="Assinaturas ativas" value={activeSubscriptions} />
        </div>
      </section>
    </main>
  );
}
