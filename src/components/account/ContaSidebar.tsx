"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CONTA_NAV_ITEMS } from "./nav-items";

export function ContaSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-4 bg-ink px-4 py-6 text-white/80 lg:flex">
      <p className="px-3 text-sm font-medium text-white/60">Minha conta</p>

      <nav className="flex flex-col gap-1">
        {CONTA_NAV_ITEMS.map((item) => {
          const active =
            item.href === "/minha-conta" ? pathname === item.href : pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md border-l-2 px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "border-brand-coral bg-white/10 text-white"
                  : "border-transparent text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? "text-brand-coral" : ""}`} strokeWidth={1.75} aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
