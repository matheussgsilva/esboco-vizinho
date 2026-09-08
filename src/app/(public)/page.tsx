import Link from "next/link";
import { Building2, MapPin, Star, UserPlus, type LucideIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { SearchBar } from "@/components/search/SearchBar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BusinessCard } from "@/components/business/BusinessCard";
import { getFeaturedBusinesses } from "@/lib/search";
import { getCategoryIcon } from "@/lib/category-icons";
import { getPlatformStats } from "@/lib/stats";

export const revalidate = 300;

const CATEGORY_BADGE_COLORS = ["bg-surface-blush", "bg-surface-sand", "bg-surface-lilac"];

const numberFormatter = new Intl.NumberFormat("pt-BR");

interface TrustStat {
  icon: LucideIcon;
  value: number;
  label: string;
}

export default async function HomePage() {
  const [categories, featuredBusinesses, stats] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    getFeaturedBusinesses(),
    getPlatformStats(),
  ]);

  const trustStats: TrustStat[] = [
    { icon: Building2, value: stats.businessCount, label: "Negócios cadastrados" },
    { icon: MapPin, value: stats.cityCount, label: "Cidades atendidas" },
    { icon: Star, value: stats.reviewCount, label: "Avaliações de clientes" },
  ];

  return (
    <main className="flex-1">
      <section className="relative overflow-hidden bg-brand-teal pb-16 pt-20">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-coral/20 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 text-center">
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">
            Encontre negócios locais de confiança
          </h1>
          <p className="max-w-xl text-white/70">
            Compare avaliações, horários e contatos de empresas perto de você
            em segundos.
          </p>
        </div>
      </section>

      <div className="relative mx-auto -mt-10 max-w-3xl px-4">
        <SearchBar />
      </div>

      <section className="mx-auto max-w-5xl px-4 pb-6 pt-12">
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {trustStats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center justify-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-blush text-brand-coral">
                <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </span>
              <div className="text-left">
                <dd className="text-xl font-semibold text-ink">{numberFormatter.format(value)}</dd>
                <dt className="text-sm text-ink-muted">{label}</dt>
              </div>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-5xl space-y-6 px-4 py-14">
        <SectionHeader title="O que você está procurando?" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category, index) => {
            const Icon = getCategoryIcon(category.slug);
            const badgeColor = CATEGORY_BADGE_COLORS[index % CATEGORY_BADGE_COLORS.length];
            return (
              <Link
                key={category.slug}
                href={`/categorias/${category.slug}`}
                className="group flex flex-col items-center gap-3 rounded-2xl bg-surface p-5 text-center text-sm font-medium text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className={`flex h-12 w-12 items-center justify-center rounded-full ${badgeColor} text-ink transition-colors group-hover:text-brand-coral`}>
                  <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                </span>
                {category.name}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-surface-blush/20">
        <div className="mx-auto max-w-5xl space-y-6 px-4 py-14">
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
        </div>
      </section>

      <section className="mx-auto max-w-5xl grid grid-cols-1 gap-4 px-4 py-14 sm:grid-cols-2">
        <div className="flex flex-col items-start gap-3 rounded-2xl bg-brand-coral/10 p-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-coral text-white">
            <UserPlus className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          </span>
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
        <div className="flex flex-col items-start gap-3 rounded-2xl bg-brand-teal/10 p-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-teal text-white">
            <Building2 className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          </span>
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
      </section>
    </main>
  );
}
