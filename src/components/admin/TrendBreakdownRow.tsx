export type BreakdownItem = {
  label: string;
  value: number;
  share: number;
  barClassName: string;
};

export function TrendBreakdownRow({ items }: { items: BreakdownItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="space-y-1.5">
          <p className="text-lg font-semibold text-ink">{item.value}</p>
          <p className="text-xs text-ink-muted">{item.label}</p>
          <div className="h-1.5 overflow-hidden rounded-full bg-border/60">
            <div
              className={`h-full rounded-full ${item.barClassName}`}
              style={{ width: `${item.share}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
