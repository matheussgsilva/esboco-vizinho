import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import type { MonthDelta } from "@/lib/growth-stats";

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

function DeltaBadge({ delta }: { delta: MonthDelta }) {
  if (delta.direction === "flat") {
    return (
      <span className="inline-flex items-center rounded-full bg-border/60 px-1.5 py-0.5 text-xs font-medium text-ink-muted">
        estável
      </span>
    );
  }
  if (delta.direction === "new") {
    return (
      <span className="inline-flex items-center rounded-full bg-success/15 px-1.5 py-0.5 text-xs font-medium text-success">
        novo
      </span>
    );
  }
  const isUp = delta.direction === "up";
  const Icon = isUp ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium ${
        isUp ? "bg-success/15 text-success" : "bg-brand-coral/10 text-brand-coral-dark"
      }`}
    >
      <Icon className="h-3 w-3" strokeWidth={2} />
      {delta.percent}%
    </span>
  );
}

function AdminStatCardContent({
  label,
  value,
  share,
  icon: Icon,
  tone,
  delta,
}: {
  label: string;
  value: number;
  share?: number;
  icon: LucideIcon;
  tone: AdminStatTone;
  delta?: MonthDelta;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
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
      {delta && <DeltaBadge delta={delta} />}
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
  delta,
}: {
  label: string;
  value: number;
  href?: string;
  icon: LucideIcon;
  tone: AdminStatTone;
  share?: number;
  delta?: MonthDelta;
}) {
  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-xl border border-border/60 bg-surface p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <AdminStatCardContent label={label} value={value} share={share} icon={icon} tone={tone} delta={delta} />
      </Link>
    );
  }

  return (
    <div className="rounded-xl border border-border/60 bg-surface p-4 shadow-sm">
      <AdminStatCardContent label={label} value={value} share={share} icon={icon} tone={tone} delta={delta} />
    </div>
  );
}
