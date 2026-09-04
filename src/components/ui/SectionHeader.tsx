import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
}

export function SectionHeader({
  title,
  subtitle,
  href,
  linkLabel = "Ver mais",
}: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-semibold text-ink">{title}</h2>
        {subtitle && <p className="mt-1 text-ink-muted">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="shrink-0 text-sm font-medium text-brand-coral hover:text-brand-coral-dark"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
