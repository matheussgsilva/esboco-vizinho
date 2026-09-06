"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin", label: "Visão geral" },
  { href: "/admin/empresas", label: "Empresas" },
  { href: "/admin/usuarios", label: "Usuários" },
  { href: "/admin/avaliacoes", label: "Avaliações" },
  { href: "/admin/assinaturas", label: "Assinaturas" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-5xl gap-4 overflow-x-auto px-4 text-sm">
        {TABS.map((tab) => {
          const active = tab.href === "/admin" ? pathname === tab.href : pathname?.startsWith(tab.href);
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
