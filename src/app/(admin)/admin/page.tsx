import { Building2, CreditCard, Flag, ShieldCheck, Star, Users, type LucideIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminStatCard, ADMIN_STAT_TONES, type AdminStatTone } from "@/components/admin/AdminStatCard";
import { TrendAreaChart } from "@/components/admin/charts/TrendAreaChart";
import { PlanBarChart } from "@/components/admin/charts/PlanBarChart";
import { EmphasisBarChart } from "@/components/admin/charts/EmphasisBarChart";
import { ApprovalGauge } from "@/components/admin/charts/ApprovalGauge";
import { TrendBreakdownRow, type BreakdownItem } from "@/components/admin/TrendBreakdownRow";
import { TopBusinessesTable } from "@/components/admin/TopBusinessesTable";
import { monthlyBuckets, monthsAgo, monthOverMonthDelta, weekdayBuckets } from "@/lib/growth-stats";

function percentOf(value: number, total: number) {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

const GROWTH_MONTHS = 12;

export default async function AdminPage() {
  const growthStart = monthsAgo(GROWTH_MONTHS);

  const [
    businessByStatus,
    businessByPlan,
    userByRole,
    flaggedReviews,
    activeSubscriptions,
    newBusinesses,
    newUsers,
    newReviews,
    newSubscriptions,
    topBusinesses,
  ] = await Promise.all([
    prisma.business.groupBy({ by: ["status"], _count: true }),
    prisma.business.groupBy({ by: ["planType"], _count: true }),
    prisma.user.groupBy({ by: ["role"], _count: true }),
    prisma.review.count({ where: { status: "FLAGGED" } }),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.business.findMany({ where: { createdAt: { gte: growthStart } }, select: { createdAt: true } }),
    prisma.user.findMany({ where: { createdAt: { gte: growthStart } }, select: { createdAt: true } }),
    prisma.review.findMany({ where: { createdAt: { gte: growthStart } }, select: { createdAt: true } }),
    prisma.subscription.findMany({ where: { createdAt: { gte: growthStart } }, select: { createdAt: true } }),
    prisma.business.findMany({
      where: { status: "APPROVED", reviewCount: { gt: 0 } },
      orderBy: [{ averageRating: "desc" }, { reviewCount: "desc" }],
      take: 6,
      select: { id: true, slug: true, name: true, city: true, logoUrl: true, averageRating: true, reviewCount: true, planType: true },
    }),
  ]);

  const businessGrowth = monthlyBuckets(newBusinesses.map((b) => b.createdAt), GROWTH_MONTHS);
  const userGrowth = monthlyBuckets(newUsers.map((u) => u.createdAt), GROWTH_MONTHS);
  const reviewGrowth = monthlyBuckets(newReviews.map((r) => r.createdAt), GROWTH_MONTHS);
  const subscriptionGrowth = monthlyBuckets(newSubscriptions.map((s) => s.createdAt), GROWTH_MONTHS);

  const weekdayActivity = weekdayBuckets(
    newBusinesses.map((b) => b.createdAt),
    newUsers.map((u) => u.createdAt),
    newReviews.map((r) => r.createdAt),
  );

  const planCount = (plan: string) => businessByPlan.find((row) => row.planType === plan)?._count ?? 0;
  const planStats = [
    { label: "Gratuito", value: planCount("FREE"), color: "#FAD4D5" },
    { label: "Básico", value: planCount("BASIC"), color: "#F29899" },
    { label: "Pro", value: planCount("PRO"), color: "#EA5455" },
  ];

  const businessCount = (status: string) =>
    businessByStatus.find((row) => row.status === status)?._count ?? 0;
  const userCount = (role: string) => userByRole.find((row) => row.role === role)?._count ?? 0;

  const businesses = {
    pending: businessCount("PENDING"),
    approved: businessCount("APPROVED"),
    suspended: businessCount("SUSPENDED"),
    rejected: businessCount("REJECTED"),
  };
  const businessTotal = businesses.pending + businesses.approved + businesses.suspended + businesses.rejected;
  const decidedTotal = businesses.approved + businesses.suspended + businesses.rejected;
  const approvalRate = decidedTotal === 0 ? 0 : Math.round((businesses.approved / decidedTotal) * 100);

  const users = {
    user: userCount("USER"),
    business: userCount("BUSINESS"),
    admin: userCount("ADMIN"),
  };
  const userTotal = users.user + users.business + users.admin;

  const breakdownItems: BreakdownItem[] = [
    { label: "Pendentes", value: businesses.pending, share: percentOf(businesses.pending, businessTotal), barClassName: "bg-rating" },
    { label: "Aprovadas", value: businesses.approved, share: percentOf(businesses.approved, businessTotal), barClassName: "bg-success" },
    { label: "Suspensas", value: businesses.suspended, share: percentOf(businesses.suspended, businessTotal), barClassName: "bg-brand-coral" },
    { label: "Rejeitadas", value: businesses.rejected, share: percentOf(businesses.rejected, businessTotal), barClassName: "bg-border" },
  ];

  const userStats: {
    label: string;
    value: number;
    href: string;
    icon: LucideIcon;
    tone: AdminStatTone;
  }[] = [
    { label: "Consumidores", value: users.user, href: "/admin/usuarios?role=USER", icon: Users, tone: ADMIN_STAT_TONES.blush },
    { label: "Donos de negócio", value: users.business, href: "/admin/usuarios?role=BUSINESS", icon: Building2, tone: ADMIN_STAT_TONES.sand },
    { label: "Administradores", value: users.admin, href: "/admin/usuarios?role=ADMIN", icon: ShieldCheck, tone: ADMIN_STAT_TONES.teal },
  ];

  return (
    <main className="mx-auto max-w-6xl flex-1 space-y-8 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Dashboard administrativo</h1>
        <p className="mt-1 text-sm text-ink-muted">Visão geral de usuários, empresas e assinaturas.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <AdminStatCard
          label="Empresas cadastradas"
          value={businessTotal}
          href="/admin/empresas"
          icon={Building2}
          tone={ADMIN_STAT_TONES.coral}
          delta={monthOverMonthDelta(businessGrowth)}
        />
        <AdminStatCard
          label="Usuários cadastrados"
          value={userTotal}
          href="/admin/usuarios"
          icon={Users}
          tone={ADMIN_STAT_TONES.teal}
          delta={monthOverMonthDelta(userGrowth)}
        />
        <AdminStatCard
          label="Avaliações recebidas"
          value={reviewGrowth.reduce((sum, b) => sum + b.value, 0)}
          href="/admin/avaliacoes"
          icon={Star}
          tone={ADMIN_STAT_TONES.amber}
          delta={monthOverMonthDelta(reviewGrowth)}
        />
        <AdminStatCard
          label="Assinaturas ativas"
          value={activeSubscriptions}
          href="/admin/assinaturas?status=ACTIVE"
          icon={CreditCard}
          tone={ADMIN_STAT_TONES.success}
          delta={monthOverMonthDelta(subscriptionGrowth)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 rounded-xl border border-border/60 bg-surface p-5 shadow-sm lg:col-span-2">
          <div>
            <h2 className="text-sm font-medium text-ink">Negócios cadastrados</h2>
            <p className="text-xs text-ink-muted">Últimos 12 meses</p>
          </div>
          <TrendAreaChart data={businessGrowth} color="#EA5455" height={220} />
          <TrendBreakdownRow items={breakdownItems} />
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border/60 bg-surface p-5 shadow-sm">
            <h2 className="text-sm font-medium text-ink">Atividade por dia da semana</h2>
            <p className="text-xs text-ink-muted">Negócios + usuários + avaliações, 12 meses</p>
            <EmphasisBarChart data={weekdayActivity} />
          </div>
          <div className="rounded-xl border border-border/60 bg-surface p-5 shadow-sm">
            <h2 className="text-sm font-medium text-ink">Taxa de aprovação</h2>
            <p className="text-xs text-ink-muted">Empresas aprovadas / decididas</p>
            <ApprovalGauge percent={approvalRate} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-3 rounded-xl border border-border/60 bg-surface p-5 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-medium text-ink">Empresas mais bem avaliadas</h2>
          <TopBusinessesTable
            businesses={topBusinesses.map((b) => ({ ...b, averageRating: Number(b.averageRating) }))}
          />
        </div>
        <div className="space-y-3 rounded-xl border border-border/60 bg-surface p-5 shadow-sm">
          <h2 className="text-sm font-medium text-ink">Empresas por plano</h2>
          <PlanBarChart data={planStats} />
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-ink">Usuários</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {userStats.map((stat) => (
            <AdminStatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              href={stat.href}
              icon={stat.icon}
              tone={stat.tone}
              share={percentOf(stat.value, userTotal)}
            />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-ink">Moderação</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <AdminStatCard
            label="Avaliações denunciadas"
            value={flaggedReviews}
            href="/admin/avaliacoes?status=FLAGGED"
            icon={Flag}
            tone={ADMIN_STAT_TONES.coral}
          />
        </div>
      </section>
    </main>
  );
}
