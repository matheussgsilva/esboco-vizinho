"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/painel", label: "Visão geral" },
  { href: "/painel/perfil", label: "Perfil" },
  { href: "/painel/horarios", label: "Horários" },
  { href: "/painel/produtos", label: "Produtos" },
  { href: "/painel/fotos", label: "Fotos" },
  { href: "/painel/avaliacoes", label: "Avaliações" },
  { href: "/painel/assinatura", label: "Assinatura" },
];

export function PainelNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-5xl gap-4 overflow-x-auto px-4 text-sm">
        {TABS.map((tab) => {
          const active = tab.href === "/painel" ? pathname === tab.href : pathname?.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`whitespace-nowrap border-b-2 py-3 font-medium transition-colors ${
                active
                  ? "border-brand-coral text-brand-coral"
                  : "border-transparent text-ink-muted hover:text-ink"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
