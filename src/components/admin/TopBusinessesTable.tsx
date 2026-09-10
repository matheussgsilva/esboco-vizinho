import Image from "next/image";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { StarRating } from "@/components/ui/StarRating";
import { PlanBadge } from "@/components/ui/PlanBadge";
import type { PlanType } from "../../../generated/enums";

export type TopBusinessRow = {
  id: string;
  slug: string;
  name: string;
  city: string | null;
  logoUrl: string | null;
  averageRating: number;
  reviewCount: number;
  planType: PlanType;
};

export function TopBusinessesTable({ businesses }: { businesses: TopBusinessRow[] }) {
  if (businesses.length === 0) {
    return <p className="text-sm text-ink-muted">Nenhuma empresa avaliada ainda.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-ink-muted">
            <th className="pb-2 font-medium">Empresa</th>
            <th className="pb-2 font-medium">Avaliações</th>
            <th className="pb-2 font-medium">Nota</th>
            <th className="pb-2 font-medium">Plano</th>
          </tr>
        </thead>
        <tbody>
          {businesses.map((business) => (
            <tr key={business.id} className="border-b border-border/60 last:border-0">
              <td className="py-3">
                <Link href={`/admin/empresas/${business.id}`} className="flex items-center gap-3">
                  <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-blush">
                    {business.logoUrl ? (
                      <Image src={business.logoUrl} alt="" fill sizes="36px" className="object-cover" />
                    ) : (
                      <Building2 className="h-4 w-4 text-brand-coral-dark" strokeWidth={1.75} />
                    )}
                  </span>
                  <span>
                    <span className="block font-medium text-ink">{business.name}</span>
                    {business.city && <span className="block text-xs text-ink-muted">{business.city}</span>}
                  </span>
                </Link>
              </td>
              <td className="py-3 text-ink-muted">{business.reviewCount}</td>
              <td className="py-3">
                <StarRating rating={business.averageRating} />
              </td>
              <td className="py-3">
                <PlanBadge plan={business.planType} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
