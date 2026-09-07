"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BusinessStatusBadge } from "@/components/ui/BusinessStatusBadge";
import { PlanBadge } from "@/components/ui/PlanBadge";
import type { BusinessStatus, PlanType } from "../../../generated/enums";
import { PAINEL_NAV_ITEMS } from "./nav-items";

interface PainelSidebarBusiness {
  name: string;
  status: BusinessStatus;
  planType: PlanType;
}

export function PainelSidebar({ business }: { business: PainelSidebarBusiness | null }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-4 border-r border-border bg-surface px-4 py-6 lg:flex">
      {business ? (
        <div className="space-y-2 border-b border-border px-1 pb-4">
          <p className="truncate text-sm font-semibold text-ink">{business.name}</p>
          <div className="flex flex-wrap items-center gap-1.5">
            <BusinessStatusBadge status={business.status} />
            <PlanBadge plan={business.planType} />
          </div>
        </div>
      ) : (
        <p className="border-b border-border px-1 pb-4 text-sm font-medium text-ink">
          Painel da empresa
        </p>
      )}

      <nav className="flex flex-col gap-1">
        {PAINEL_NAV_ITEMS.map((item) => {
          const active =
            item.href === "/painel" ? pathname === item.href : pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md border-l-2 px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "border-brand-coral bg-surface-blush/40 text-brand-coral"
                  : "border-transparent text-ink-muted hover:bg-surface-blush/20 hover:text-ink"
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
