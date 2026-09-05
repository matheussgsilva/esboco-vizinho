import Link from "next/link";
import { requireSession } from "@/lib/auth-utils";
import { getOwnedBusiness } from "@/lib/business";
import { prisma } from "@/lib/prisma";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { PlanBadge } from "@/components/ui/PlanBadge";
import { BusinessStatusBadge } from "@/components/ui/BusinessStatusBadge";
import { StarRating } from "@/components/ui/StarRating";
import { PLANS } from "@/lib/plans";
import type { BusinessStatus } from "../../../../generated/enums";

const STATUS_BANNERS: Partial<Record<BusinessStatus, { className: string; message: string }>> = {
  PENDING: {
    className: "bg-amber-100 text-amber-800",
    message: "Seu cadastro está aguardando aprovação da equipe. Assim que for aprovado, seu negócio aparecerá nas buscas.",
  },
  REJECTED: {
    className: "bg-red-100 text-red-700",
    message: "Seu cadastro foi rejeitado. Entre em contato com o suporte para mais informações.",
  },
  SUSPENDED: {
    className: "bg-red-100 text-red-700",
    message: "Sua empresa está suspensa e não aparece nas buscas no momento.",
  },
};

const QUICK_LINKS = [
  { href: "/painel/perfil", label: "Editar perfil" },
  { href: "/painel/horarios", label: "Horário de funcionamento" },
  { href: "/painel/produtos", label: "Produtos e serviços" },
  { href: "/painel/assinatura", label: "Assinatura" },
];

export default async function PainelPage() {
  const session = await requireSession();
  const business = await getOwnedBusiness(session.user.id);

  if (!business) {
    return (
      <PlaceholderPage
        title="Painel da empresa"
        description="Esta conta não possui um negócio vinculado."
      />
    );
  }

  const productCount = await prisma.product.count({ where: { businessId: business.id } });
  const banner = STATUS_BANNERS[business.status];

  return (
    <main className="mx-auto max-w-5xl flex-1 space-y-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Painel da empresa</h1>
        <p className="mt-1 text-sm text-ink-muted">{business.name}</p>
      </div>

      {banner && (
        <p className={`rounded-md px-4 py-2.5 text-sm ${banner.className}`}>{banner.message}</p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-sm text-ink-muted">Status</p>
          <div className="mt-2">
            <BusinessStatusBadge status={business.status} />
          </div>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-sm text-ink-muted">Plano</p>
          <div className="mt-2 flex items-center gap-2">
            <PlanBadge plan={business.planType} />
            <span className="text-sm text-ink-muted">{PLANS[business.planType].name}</span>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-sm text-ink-muted">Avaliação</p>
          <div className="mt-2">
            <StarRating rating={Number(business.averageRating)} reviewCount={business.reviewCount} />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface p-4">
        <p className="text-sm text-ink-muted">Produtos e serviços cadastrados</p>
        <p className="mt-1 text-2xl font-semibold text-ink">{productCount}</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-ink">Acesso rápido</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg border border-border bg-surface p-4 text-sm font-medium text-ink hover:border-brand-coral/40"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
