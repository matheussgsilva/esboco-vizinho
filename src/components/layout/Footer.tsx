import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Session } from "next-auth";
import { prisma } from "@/lib/prisma";
import { getPlatformStats } from "@/lib/stats";
import type { Role } from "../../../generated/enums";

const ACCOUNT_HREF: Record<Role, string> = {
  ADMIN: "/admin",
  BUSINESS: "/painel",
  USER: "/minha-conta",
};

const ACCOUNT_LABEL: Record<Role, string> = {
  ADMIN: "Painel admin",
  BUSINESS: "Meu painel",
  USER: "Minha conta",
};

const numberFormatter = new Intl.NumberFormat("pt-BR");

export async function Footer({ session }: { session: Session | null }) {
  const year = new Date().getFullYear();
  const user = session?.user;

  const [categories, stats] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    getPlatformStats(),
  ]);

  return (
    <footer className="bg-brand-teal text-white/80">
      <div className="mx-auto max-w-5xl space-y-10 px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <p className="flex items-center gap-1.5 text-lg font-bold text-white">
              <MapPin className="h-5 w-5" strokeWidth={2} aria-hidden />
              Esboço
            </p>
            <p className="text-sm">
              Encontre negócios locais de confiança perto de você.
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <p className="font-medium text-white">Categorias</p>
            <ul className="space-y-1.5">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link href={`/categorias/${category.slug}`} className="hover:text-white">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 text-sm">
            <p className="font-medium text-white">Para você</p>
            <ul className="space-y-1.5">
              <li>
                <Link href="/buscar" className="hover:text-white">
                  Buscar negócios
                </Link>
              </li>
              {user ? (
                <li>
                  <Link href={ACCOUNT_HREF[user.role]} className="hover:text-white">
                    {ACCOUNT_LABEL[user.role]}
                  </Link>
                </li>
              ) : (
                <li>
                  <Link href="/login" className="hover:text-white">
                    Entrar
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div className="space-y-2 text-sm">
            <p className="font-medium text-white">Para empresas</p>
            <ul className="space-y-1.5">
              <li>
                <Link href="/cadastro?role=BUSINESS" className="hover:text-white">
                  Cadastrar meu negócio
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-4 border-t border-white/10 pt-6 text-sm sm:grid-cols-3">
          <div className="flex items-baseline gap-2">
            <dd className="text-lg font-semibold text-white">{numberFormatter.format(stats.businessCount)}</dd>
            <dt>negócios cadastrados</dt>
          </div>
          <div className="flex items-baseline gap-2">
            <dd className="text-lg font-semibold text-white">{numberFormatter.format(stats.cityCount)}</dd>
            <dt>cidades atendidas</dt>
          </div>
          <div className="flex items-baseline gap-2">
            <dd className="text-lg font-semibold text-white">{numberFormatter.format(stats.reviewCount)}</dd>
            <dt>avaliações de clientes</dt>
          </div>
        </dl>

        <p className="border-t border-white/10 pt-6 text-xs">
          © {year} Esboço Páginas Amarelas.
        </p>
      </div>
    </footer>
  );
}
