import { requireSession } from "@/lib/auth-utils";
import { getOwnedBusiness } from "@/lib/business";
import { prisma } from "@/lib/prisma";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { BusinessProfileForm } from "@/components/business/BusinessProfileForm";
import { SocialLinksManager } from "@/components/business/SocialLinksManager";

export default async function PainelPerfilPage() {
  const session = await requireSession();
  const business = await getOwnedBusiness(session.user.id);

  if (!business) {
    return (
      <PlaceholderPage
        title="Editar perfil da empresa"
        description="Esta conta não possui um negócio vinculado."
      />
    );
  }

  const socialLinks = await prisma.socialLink.findMany({
    where: { businessId: business.id },
    orderBy: { id: "asc" },
  });

  return (
    <main className="mx-auto max-w-3xl flex-1 space-y-8 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Editar perfil da empresa</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Dados públicos exibidos na página do seu negócio.
        </p>
      </div>

      <section className="rounded-lg border border-border bg-surface p-4">
        <BusinessProfileForm
          business={{
            name: business.name,
            description: business.description,
            phone: business.phone,
            whatsapp: business.whatsapp,
            website: business.website,
            email: business.email,
            addressLine: business.addressLine,
            city: business.city,
            state: business.state,
            zipCode: business.zipCode,
          }}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-ink">Redes sociais</h2>
        <SocialLinksManager links={socialLinks} />
      </section>
    </main>
  );
}
