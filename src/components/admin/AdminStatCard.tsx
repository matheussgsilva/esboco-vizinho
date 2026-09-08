import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export type AdminStatTone = {
  badge: string;
  icon: string;
};

export const ADMIN_STAT_TONES = {
  amber: { badge: "bg-rating/15", icon: "text-rating" },
  success: { badge: "bg-success/15", icon: "text-success" },
  coral: { badge: "bg-brand-coral/10", icon: "text-brand-coral-dark" },
  muted: { badge: "bg-border/60", icon: "text-ink-muted" },
  blush: { badge: "bg-surface-blush", icon: "text-brand-coral-dark" },
  sand: { badge: "bg-surface-sand", icon: "text-ink" },
  teal: { badge: "bg-brand-teal/10", icon: "text-brand-teal" },
} as const satisfies Record<string, AdminStatTone>;

function AdminStatCardContent({
  label,
  value,
  share,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  share?: number;
  icon: LucideIcon;
  tone: AdminStatTone;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tone.badge}`}
        aria-hidden
      >
        <Icon className={`h-5 w-5 ${tone.icon}`} strokeWidth={1.75} />
      </span>
      <div>
        <p className="text-2xl font-semibold text-ink">{value}</p>
        <p className="text-sm text-ink-muted">{label}</p>
        {share !== undefined && (
          <p className="mt-0.5 text-xs text-ink-muted">{share}% do total</p>
        )}
      </div>
    </div>
  );
}

export function AdminStatCard({
  label,
  value,
  href,
  icon,
  tone,
  share,
}: {
  label: string;
  value: number;
  href?: string;
  icon: LucideIcon;
  tone: AdminStatTone;
  share?: number;
}) {
  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-lg border border-border bg-surface p-4 transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <AdminStatCardContent label={label} value={value} share={share} icon={icon} tone={tone} />
      </Link>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <AdminStatCardContent label={label} value={value} share={share} icon={icon} tone={tone} />
    </div>
  );
}
