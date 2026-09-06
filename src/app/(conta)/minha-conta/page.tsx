import Link from "next/link";
import { requireSession } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export default async function MinhaContaPage() {
  const session = await requireSession();

  const [favoriteCount, reviewCount] = await Promise.all([
    prisma.favorite.count({ where: { userId: session.user.id } }),
    prisma.review.count({ where: { userId: session.user.id } }),
  ]);

  const QUICK_LINKS = [
    { href: "/minha-conta/favoritos", label: "Meus favoritos", count: favoriteCount },
    { href: "/minha-conta/minhas-avaliacoes", label: "Minhas avaliações", count: reviewCount },
  ];

  return (
    <main className="mx-auto max-w-3xl flex-1 space-y-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Minha conta</h1>
        <p className="mt-1 text-sm text-ink-muted">{session.user.name ?? session.user.email}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-lg border border-border bg-surface p-4 hover:border-brand-coral/40"
          >
            <p className="text-2xl font-semibold text-ink">{link.count}</p>
            <p className="text-sm text-ink-muted">{link.label}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
