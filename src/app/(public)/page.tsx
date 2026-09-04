import { SearchBar } from "@/components/search/SearchBar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BusinessCard, type BusinessCardData } from "@/components/business/BusinessCard";

const CATEGORIES = [
  { slug: "restaurantes", name: "Restaurantes" },
  { slug: "saude-e-beleza", name: "Saúde & Beleza" },
  { slug: "servicos-domesticos", name: "Serviços Domésticos" },
  { slug: "educacao", name: "Educação" },
  { slug: "pet-shops", name: "Pet Shops" },
  { slug: "automotivo", name: "Automotivo" },
];

// Dados de exemplo — substituídos pela consulta real em lib/search.ts numa próxima iteração.
const FEATURED_BUSINESSES: BusinessCardData[] = [
  {
    slug: "cafe-do-bairro",
    name: "Café do Bairro",
    categoryName: "Cafeteria",
    city: "Porto Alegre, RS",
    coverImageUrl: null,
    averageRating: 4.8,
    reviewCount: 132,
    isOpenNow: true,
  },
  {
    slug: "oficina-do-ze",
    name: "Oficina do Zé",
    categoryName: "Automotivo",
    city: "Porto Alegre, RS",
    coverImageUrl: null,
    averageRating: 4.6,
    reviewCount: 87,
    isOpenNow: true,
  },
  {
    slug: "clinica-sorriso",
    name: "Clínica Sorriso",
    categoryName: "Saúde & Beleza",
    city: "Canoas, RS",
    coverImageUrl: null,
    averageRating: 4.9,
    reviewCount: 204,
    isOpenNow: false,
  },
];

export default function HomePage() {
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_BUSINESSES.map((business) => (
            <BusinessCard key={business.slug} business={business} />
          ))}
        </div>
      </section>
    </main>
  );
}
