import { requireSession } from "@/lib/auth-utils";
import { getOwnedBusiness } from "@/lib/business";
import { prisma } from "@/lib/prisma";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { dailyBuckets, daysAgo } from "@/lib/growth-stats";
import { TrendAreaChart } from "@/components/admin/charts/TrendAreaChart";

const WINDOW_DAYS = 30;

export default async function PainelEstatisticasPage() {
  const session = await requireSession();
  const business = await getOwnedBusiness(session.user.id);

  if (!business) {
    return (
      <PlaceholderPage
        title="Estatísticas"
        description="Esta conta não possui um negócio vinculado."
      />
    );
  }

  const events = await prisma.businessEvent.findMany({
    where: { businessId: business.id, createdAt: { gte: daysAgo(WINDOW_DAYS) } },
    select: { type: true, createdAt: true },
  });

  const views = events.filter((e) => e.type === "PROFILE_VIEW");
  const phoneClicks = events.filter((e) => e.type === "CLICK_PHONE").length;
  const whatsappClicks = events.filter((e) => e.type === "CLICK_WHATSAPP").length;
  const socialClicks = events.filter((e) => e.type === "CLICK_SOCIAL").length;
  const viewsTrend = dailyBuckets(
    views.map((e) => e.createdAt),
    WINDOW_DAYS
  );

  const kpis = [
    { label: `Visualizações (${WINDOW_DAYS} dias)`, value: views.length },
    { label: "Cliques em telefone", value: phoneClicks },
    { label: "Cliques em WhatsApp", value: whatsappClicks },
    { label: "Cliques em redes sociais", value: socialClicks },
  ];

  return (
    <main className="mx-auto max-w-5xl flex-1 space-y-8 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Estatísticas</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Visualizações e cliques de contato dos últimos {WINDOW_DAYS} dias.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-lg border border-border bg-surface p-4">
            <p className="text-sm text-ink-muted">{kpi.label}</p>
            <p className="mt-1 text-2xl font-semibold text-ink">{kpi.value}</p>
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-ink">Visualizações ao longo do tempo</h2>
        <div className="rounded-lg border border-border bg-surface p-4">
          <TrendAreaChart data={viewsTrend} color="#EA5455" />
        </div>
      </section>
    </main>
  );
}
