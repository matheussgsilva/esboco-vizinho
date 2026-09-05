import { SearchBar } from "@/components/search/SearchBar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BusinessCard } from "@/components/business/BusinessCard";
import { getFeaturedBusinesses } from "@/lib/search";

export const revalidate = 300;

const CATEGORIES = [
  { slug: "restaurantes", name: "Restaurantes" },
  { slug: "saude-e-beleza", name: "Saúde & Beleza" },
  { slug: "servicos-domesticos", name: "Serviços Domésticos" },
  { slug: "educacao", name: "Educação" },
  { slug: "pet-shops", name: "Pet Shops" },
  { slug: "automotivo", name: "Automotivo" },
];

export default async function HomePage() {
  const featuredBusinesses = await getFeaturedBusinesses();

  return (
    <main className="flex-1">
      <section className="bg-surface-lilac/60">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-16 text-center">
          <h1 className="text-3xl font-semibold text-ink sm:text-4xl">
            Encontre negócios locais de confiança
          </h1>
          <p className="max-w-xl text-ink-muted">
            Compare avaliações, horários e contatos de empresas perto de você
            em segundos.
          </p>
          <div className="w-full max-w-2xl">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl space-y-6 px-4 py-14">
        <SectionHeader title="O que você está procurando?" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((category) => (
            <a
              key={category.slug}
              href={`/categorias/${category.slug}`}
              className="rounded-lg border border-border bg-surface p-4 text-center text-sm font-medium text-ink transition-colors hover:border-brand-coral hover:text-brand-coral"
            >
              {category.name}
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl space-y-6 px-4 pb-16">
        <SectionHeader
          title="Empresas em destaque"
          subtitle="Negócios com plano Pro, prioridade máxima na busca"
          href="/buscar?ordenar=relevancia"
        />
        {featuredBusinesses.length === 0 ? (
          <p className="py-8 text-center text-ink-muted">
            Nenhuma empresa em destaque no momento.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredBusinesses.map((business) => (
              <BusinessCard key={business.slug} business={business} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
