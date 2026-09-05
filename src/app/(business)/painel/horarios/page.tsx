import { requireSession } from "@/lib/auth-utils";
import { getOwnedBusiness } from "@/lib/business";
import { prisma } from "@/lib/prisma";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { BusinessHoursForm } from "@/components/business/BusinessHoursForm";

export default async function PainelHorariosPage() {
  const session = await requireSession();
  const business = await getOwnedBusiness(session.user.id);

  if (!business) {
    return (
      <PlaceholderPage
        title="Horário de funcionamento"
        description="Esta conta não possui um negócio vinculado."
      />
    );
  }

  const hours = await prisma.businessHours.findMany({ where: { businessId: business.id } });

  return (
    <main className="mx-auto max-w-3xl flex-1 space-y-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Horário de funcionamento</h1>
        <p className="mt-1 text-sm text-ink-muted">Exibido na página pública do seu negócio.</p>
      </div>

      <BusinessHoursForm hours={hours} />
    </main>
  );
}
