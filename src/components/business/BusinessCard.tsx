import Image from "next/image";
import Link from "next/link";
import { StarRating } from "@/components/ui/StarRating";

export interface BusinessCardData {
  slug: string;
  name: string;
  categoryName: string;
  city: string;
  coverImageUrl: string | null;
  averageRating: number;
  reviewCount: number;
  isOpenNow: boolean;
}

export function BusinessCard({ business }: { business: BusinessCardData }) {
  return (
    <Link
      href={`/empresas/${business.slug}`}
      className="group block overflow-hidden rounded-t-2xl rounded-b-md border border-border bg-surface transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl bg-surface-lilac">
        {business.coverImageUrl && (
          <Image
            src={business.coverImageUrl}
            alt={business.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        )}
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium text-white ${
            business.isOpenNow ? "bg-success" : "bg-ink-muted"
          }`}
        >
          {business.isOpenNow ? "Aberto" : "Fechado"}
        </span>
      </div>

      <div className="space-y-1.5 p-4">
        <div className="flex items-center gap-2 text-sm text-ink-muted">
          <StarRating rating={business.averageRating} reviewCount={business.reviewCount} />
          <span aria-hidden>·</span>
          <span>{business.categoryName}</span>
        </div>
        <h3 className="text-base font-semibold text-ink">{business.name}</h3>
        <p className="text-sm text-ink-muted">{business.city}</p>
      </div>
    </Link>
  );
}
