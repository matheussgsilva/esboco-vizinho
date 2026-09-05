import { getSaoPauloNow } from "@/lib/search";
import { DAYS, DAY_LABELS } from "@/lib/validations/business";

interface BusinessHoursTableProps {
  hours: { dayOfWeek: string; openTime: string | null; closeTime: string | null; isClosed: boolean }[];
}

export function BusinessHoursTable({ hours }: BusinessHoursTableProps) {
  const today = getSaoPauloNow().dayOfWeek;
  const byDay = new Map(hours.map((h) => [h.dayOfWeek, h]));

  return (
    <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border">
      {DAYS.map((day) => {
        const row = byDay.get(day);
        const isToday = day === today;
        return (
          <li
            key={day}
            className={`flex items-center justify-between px-4 py-2.5 text-sm ${
              isToday ? "bg-surface-lilac/40 font-medium text-ink" : "text-ink-muted"
            }`}
          >
            <span>{DAY_LABELS[day]}</span>
            <span>
              {!row || row.isClosed || !row.openTime || !row.closeTime
                ? "Fechado"
                : `${row.openTime} às ${row.closeTime}`}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
