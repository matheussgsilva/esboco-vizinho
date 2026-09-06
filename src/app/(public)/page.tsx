import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SearchBar } from "@/components/search/SearchBar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BusinessCard } from "@/components/business/BusinessCard";
import { getFeaturedBusinesses } from "@/lib/search";
import { getCategoryIcon } from "@/lib/category-icons";

export const revalidate = 300;

async function getHomeStats() {
  const [businessCount, cities, reviewCount] = await Promise.all([
    prisma.business.count({ where: { status: "APPROVED" } }),
    prisma.business.groupBy({
      by: ["city"],
      where: { status: "APPROVED", city: { not: null } },
    }),
    prisma.review.count({ where: { status: "PUBLISHED" } }),
  ]);

  return {
    businessCount,
    cityCount: cities.length,
    reviewCount,
  };
}

export default async function HomePage() {
  const [categories, featuredBusinesses, stats] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    getFeaturedBusinesses(),
    getHomeStats(),
  ]);

  return (
    <main className="flex-1">
      <section className="bg-surface-blush">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-20 text-center">
          <h1 className="text-4xl font-semibold text-ink sm:text-5xl">
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
          {categories.map((category) => {
            const Icon = getCategoryIcon(category.slug);
            return (
              <Link
                key={category.slug}
                href={`/categorias/${category.slug}`}
                className="flex flex-col items-center gap-2 rounded-lg border border-border bg-surface p-4 text-center text-sm font-medium text-ink transition-colors hover:border-brand-coral hover:text-brand-coral"
              >
                <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                {category.name}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-brand-teal">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 py-10 text-center text-white sm:grid-cols-3">
          <div>
            <p className="text-3xl font-semibold">{stats.businessCount}</p>
            <p className="mt-1 text-sm text-white/70">Negócios cadastrados</p>
          </div>
          <div>
            <p className="text-3xl font-semibold">{stats.cityCount}</p>
            <p className="mt-1 text-sm text-white/70">Cidades atendidas</p>
          </div>
          <div>
            <p className="text-3xl font-semibold">{stats.reviewCount}</p>
            <p className="mt-1 text-sm text-white/70">Avaliações de clientes</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl space-y-6 px-4 py-14">
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

      <section className="bg-surface-sand/30">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 px-4 py-14 sm:grid-cols-2">
          <div className="flex flex-col items-start gap-3 rounded-lg border-l-4 border-brand-coral bg-surface p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-ink">Sou consumidor</h3>
            <p className="text-sm text-ink-muted">
              Crie sua conta grátis para favoritar negócios e deixar avaliações.
            </p>
            <Link
              href="/cadastro"
              className="mt-1 inline-flex items-center justify-center rounded-md bg-brand-coral px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-coral-dark"
            >
              Criar conta
            </Link>
          </div>
          <div className="flex flex-col items-start gap-3 rounded-lg border-l-4 border-brand-teal bg-surface p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-ink">Tenho um negócio</h3>
            <p className="text-sm text-ink-muted">
              Anuncie sua empresa gratuitamente e apareça para clientes perto de você.
            </p>
            <Link
              href="/cadastro?role=BUSINESS"
              className="mt-1 inline-flex items-center justify-center rounded-md bg-brand-teal px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-teal/90"
            >
              Cadastrar minha empresa
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
