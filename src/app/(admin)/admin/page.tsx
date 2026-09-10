import {
  Ban,
  Building2,
  CheckCircle2,
  Clock,
  CreditCard,
  Flag,
  ShieldCheck,
  Users,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminStatCard, ADMIN_STAT_TONES, type AdminStatTone } from "@/components/admin/AdminStatCard";
import { TrendAreaChart } from "@/components/admin/charts/TrendAreaChart";
import { PlanBarChart } from "@/components/admin/charts/PlanBarChart";
import { monthlyBuckets, monthsAgo } from "@/lib/growth-stats";

function DistributionBar({ segments }: { segments: { value: number; className: string }[] }) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  if (total === 0) return null;

  return (
    <div className="flex h-2 gap-0.5 overflow-hidden rounded-full border border-border p-0.5">
      {segments
        .filter((segment) => segment.value > 0)
        .map((segment, index) => (
          <div
            key={index}
            className={`h-full rounded-full ${segment.className}`}
            style={{ width: `${(segment.value / total) * 100}%` }}
          />
        ))}
    </div>
  );
}

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
  ] = await Promise.all([
    prisma.business.groupBy({ by: ["status"], _count: true }),
    prisma.business.groupBy({ by: ["planType"], _count: true }),
    prisma.user.groupBy({ by: ["role"], _count: true }),
    prisma.review.count({ where: { status: "FLAGGED" } }),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.business.findMany({ where: { createdAt: { gte: growthStart } }, select: { createdAt: true } }),
    prisma.user.findMany({ where: { createdAt: { gte: growthStart } }, select: { createdAt: true } }),
    prisma.review.findMany({ where: { createdAt: { gte: growthStart } }, select: { createdAt: true } }),
  ]);

  const businessGrowth = monthlyBuckets(newBusinesses.map((b) => b.createdAt), GROWTH_MONTHS);
  const userGrowth = monthlyBuckets(newUsers.map((u) => u.createdAt), GROWTH_MONTHS);
  const reviewGrowth = monthlyBuckets(newReviews.map((r) => r.createdAt), GROWTH_MONTHS);

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

  const users = {
    user: userCount("USER"),
    business: userCount("BUSINESS"),
    admin: userCount("ADMIN"),
  };
  const userTotal = users.user + users.business + users.admin;

  const businessStats: {
    label: string;
    value: number;
    href: string;
    icon: LucideIcon;
    tone: AdminStatTone;
    barClassName: string;
  }[] = [
    {
      label: "Pendentes",
      value: businesses.pending,
      href: "/admin/empresas?status=PENDING",
      icon: Clock,
      tone: ADMIN_STAT_TONES.amber,
      barClassName: "bg-rating",
    },
    {
      label: "Aprovadas",
      value: businesses.approved,
      href: "/admin/empresas?status=APPROVED",
      icon: CheckCircle2,
      tone: ADMIN_STAT_TONES.success,
      barClassName: "bg-success",
    },
    {
      label: "Suspensas",
      value: businesses.suspended,
      href: "/admin/empresas?status=SUSPENDED",
      icon: Ban,
      tone: ADMIN_STAT_TONES.coral,
      barClassName: "bg-brand-coral",
    },
    {
      label: "Rejeitadas",
      value: businesses.rejected,
      href: "/admin/empresas?status=REJECTED",
      icon: XCircle,
      tone: ADMIN_STAT_TONES.muted,
      barClassName: "bg-border",
    },
  ];

  const userStats: {
    label: string;
    value: number;
    href: string;
    icon: LucideIcon;
    tone: AdminStatTone;
    barClassName: string;
  }[] = [
    {
      label: "Consumidores",
      value: users.user,
      href: "/admin/usuarios?role=USER",
      icon: Users,
      tone: ADMIN_STAT_TONES.blush,
      barClassName: "bg-surface-blush",
    },
    {
      label: "Donos de negócio",
      value: users.business,
      href: "/admin/usuarios?role=BUSINESS",
      icon: Building2,
      tone: ADMIN_STAT_TONES.sand,
      barClassName: "bg-surface-sand",
    },
    {
      label: "Administradores",
      value: users.admin,
      href: "/admin/usuarios?role=ADMIN",
      icon: ShieldCheck,
      tone: ADMIN_STAT_TONES.teal,
      barClassName: "bg-brand-teal",
    },
  ];

  return (
    <main className="mx-auto max-w-5xl flex-1 space-y-8 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Dashboard administrativo</h1>
        <p className="mt-1 text-sm text-ink-muted">Visão geral de usuários, empresas e assinaturas.</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-ink">Crescimento (últimos 12 meses)</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="text-sm font-medium text-ink">Negócios cadastrados</p>
            <TrendAreaChart data={businessGrowth} color="#EA5455" />
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="text-sm font-medium text-ink">Usuários cadastrados</p>
            <TrendAreaChart data={userGrowth} color="#1B4D4D" />
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="text-sm font-medium text-ink">Avaliações recebidas</p>
            <TrendAreaChart data={reviewGrowth} color="#FFC107" />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-ink">Empresas</h2>
        <DistributionBar
          segments={businessStats.map((stat) => ({ value: stat.value, className: stat.barClassName }))}
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {businessStats.map((stat) => (
            <AdminStatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              href={stat.href}
              icon={stat.icon}
              tone={stat.tone}
              share={percentOf(stat.value, businessTotal)}
            />
          ))}
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-sm font-medium text-ink">Empresas por plano</p>
          <PlanBarChart data={planStats} />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-ink">Usuários</h2>
        <DistributionBar
          segments={userStats.map((stat) => ({ value: stat.value, className: stat.barClassName }))}
        />
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
        <h2 className="text-lg font-semibold text-ink">Moderação e assinaturas</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <AdminStatCard
            label="Avaliações denunciadas"
            value={flaggedReviews}
            href="/admin/avaliacoes?status=FLAGGED"
            icon={Flag}
            tone={ADMIN_STAT_TONES.coral}
          />
          <AdminStatCard
            label="Assinaturas ativas"
            value={activeSubscriptions}
            href="/admin/assinaturas?status=ACTIVE"
            icon={CreditCard}
            tone={ADMIN_STAT_TONES.success}
          />
        </div>
      </section>
    </main>
  );
}
