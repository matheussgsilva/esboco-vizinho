const MONTH_LABELS_PT = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

export function monthsAgo(months: number) {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
}

export function monthlyBuckets(dates: Date[], months = 12) {
  const now = new Date();
  const start = monthsAgo(months);

  const buckets = Array.from({ length: months }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1);
    return { label: MONTH_LABELS_PT[d.getMonth()], value: 0 };
  });

  for (const date of dates) {
    if (date < start) continue;
    const diffMonths =
      (date.getFullYear() - start.getFullYear()) * 12 + (date.getMonth() - start.getMonth());
    if (diffMonths >= 0 && diffMonths < months) {
      buckets[diffMonths].value += 1;
    }
  }

  return buckets;
}
