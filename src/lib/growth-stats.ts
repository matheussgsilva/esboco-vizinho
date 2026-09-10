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

export type MonthDelta = { percent: number; direction: "up" | "down" | "flat" | "new" };

export function monthOverMonthDelta(buckets: { value: number }[]): MonthDelta {
  const current = buckets[buckets.length - 1]?.value ?? 0;
  const previous = buckets[buckets.length - 2]?.value ?? 0;

  if (previous === 0) {
    return current > 0 ? { percent: 100, direction: "new" } : { percent: 0, direction: "flat" };
  }

  const percent = Math.round(((current - previous) / previous) * 100);
  if (percent === 0) return { percent: 0, direction: "flat" };
  return { percent: Math.abs(percent), direction: percent > 0 ? "up" : "down" };
}

const WEEKDAY_LABELS_PT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function weekdayBuckets(...dateLists: Date[][]) {
  const buckets = WEEKDAY_LABELS_PT.map((label) => ({ label, value: 0 }));
  for (const dates of dateLists) {
    for (const date of dates) {
      buckets[date.getDay()].value += 1;
    }
  }
  return buckets;
}
