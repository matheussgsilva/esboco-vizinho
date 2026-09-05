import { Prisma } from "../../generated/client";
import type { DayOfWeek } from "../../generated/enums";
import { prisma } from "@/lib/prisma";
import type { BusinessCardData } from "@/components/business/BusinessCard";

const PAGE_SIZE = 20;
const FEATURED_LIMIT = 8;

export type SearchSort = "relevancia" | "nome";

export interface SearchBusinessesParams {
  query?: string;
  categorySlug?: string;
  city?: string;
  sort?: SearchSort;
  page?: number;
}

export interface SearchBusinessesResult {
  results: BusinessCardData[];
  total: number;
  page: number;
  totalPages: number;
}

interface BusinessRow {
  id: string;
  slug: string;
  name: string;
  city: string | null;
  state: string | null;
  coverImageUrl: string | null;
  averageRating: number;
  reviewCount: number;
  categoryName: string | null;
}

const CATEGORY_NAME_SUBQUERY = Prisma.sql`(
  SELECT c.name FROM "BusinessCategory" bc
  JOIN "Category" c ON c.id = bc."categoryId"
  WHERE bc."businessId" = b.id
  ORDER BY c.name ASC
  LIMIT 1
)`;

export async function searchBusinesses(
  params: SearchBusinessesParams
): Promise<SearchBusinessesResult> {
  const page = Math.max(1, Math.floor(params.page ?? 1));
  const offset = (page - 1) * PAGE_SIZE;

  const conditions: Prisma.Sql[] = [
    Prisma.sql`b."status" = 'APPROVED'::"BusinessStatus"`,
  ];

  const query = params.query?.trim();
  if (query) {
    conditions.push(Prisma.sql`(
      b."searchVector" @@ websearch_to_tsquery('portuguese', ${query})
      OR EXISTS (
        SELECT 1 FROM "Product" p
        WHERE p."businessId" = b.id AND p."isActive" = true AND p.name ILIKE ${"%" + query + "%"}
      )
    )`);
  }

  if (params.categorySlug) {
    conditions.push(Prisma.sql`EXISTS (
      SELECT 1 FROM "BusinessCategory" bc
      JOIN "Category" c ON c.id = bc."categoryId"
      WHERE bc."businessId" = b.id AND c.slug = ${params.categorySlug}
    )`);
  }

  const city = params.city?.trim();
  if (city) {
    conditions.push(Prisma.sql`b."city" ILIKE ${"%" + city + "%"}`);
  }

  const whereClause = Prisma.join(conditions, " AND ");

  const orderClause =
    params.sort === "nome"
      ? Prisma.sql`lower(b."name") ASC`
      : Prisma.sql`
          CASE b."planType" WHEN 'PRO' THEN 2 WHEN 'BASIC' THEN 1 ELSE 0 END DESC,
          b."averageRating" DESC,
          b."reviewCount" DESC,
          b."id" ASC
        `;

  const rows = await prisma.$queryRaw<(BusinessRow & { totalCount: bigint })[]>(Prisma.sql`
    SELECT
      b."id",
      b."slug",
      b."name",
      b."city",
      b."state",
      b."coverImageUrl",
      b."averageRating"::float AS "averageRating",
      b."reviewCount",
      ${CATEGORY_NAME_SUBQUERY} AS "categoryName",
      COUNT(*) OVER() AS "totalCount"
    FROM "Business" b
    WHERE ${whereClause}
    ORDER BY ${orderClause}
    LIMIT ${PAGE_SIZE} OFFSET ${offset}
  `);

  const total = rows.length > 0 ? Number(rows[0].totalCount) : 0;
  const openMap = await getOpenNowMap(rows.map((row) => row.id));

  return {
    results: rows.map((row) => mapRowToCard(row, openMap)),
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function getFeaturedBusinesses(): Promise<BusinessCardData[]> {
  const rows = await prisma.$queryRaw<BusinessRow[]>(Prisma.sql`
    SELECT
      b."id",
      b."slug",
      b."name",
      b."city",
      b."state",
      b."coverImageUrl",
      b."averageRating"::float AS "averageRating",
      b."reviewCount",
      ${CATEGORY_NAME_SUBQUERY} AS "categoryName"
    FROM "Business" b
    WHERE b."status" = 'APPROVED'::"BusinessStatus" AND b."planType" = 'PRO'::"PlanType"
    ORDER BY b."averageRating" DESC, b."reviewCount" DESC
    LIMIT ${FEATURED_LIMIT}
  `);

  const openMap = await getOpenNowMap(rows.map((row) => row.id));
  return rows.map((row) => mapRowToCard(row, openMap));
}

function mapRowToCard(
  row: BusinessRow,
  openMap: Map<string, boolean>
): BusinessCardData {
  return {
    slug: row.slug,
    name: row.name,
    categoryName: row.categoryName ?? "Sem categoria",
    city: [row.city, row.state].filter(Boolean).join(", "),
    coverImageUrl: row.coverImageUrl,
    averageRating: row.averageRating,
    reviewCount: row.reviewCount,
    isOpenNow: openMap.get(row.id) ?? false,
  };
}

const WEEKDAY_TO_DAY_OF_WEEK: Record<string, DayOfWeek> = {
  Mon: "MON",
  Tue: "TUE",
  Wed: "WED",
  Thu: "THU",
  Fri: "FRI",
  Sat: "SAT",
  Sun: "SUN",
};

export function getSaoPauloNow(): { dayOfWeek: DayOfWeek; time: string } {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(new Date());
  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "Mon";
  const hour = parts.find((part) => part.type === "hour")?.value ?? "00";
  const minute = parts.find((part) => part.type === "minute")?.value ?? "00";

  return {
    dayOfWeek: WEEKDAY_TO_DAY_OF_WEEK[weekday] ?? "MON",
    time: `${hour}:${minute}`,
  };
}

export function isOpenNow(
  hours: { dayOfWeek: string; openTime: string | null; closeTime: string | null; isClosed: boolean }[]
): boolean {
  const { dayOfWeek, time } = getSaoPauloNow();
  const today = hours.find((h) => h.dayOfWeek === dayOfWeek);
  if (!today) return false;
  return (
    !today.isClosed &&
    !!today.openTime &&
    !!today.closeTime &&
    time >= today.openTime &&
    time <= today.closeTime
  );
}

async function getOpenNowMap(businessIds: string[]): Promise<Map<string, boolean>> {
  if (businessIds.length === 0) return new Map();

  const { dayOfWeek, time } = getSaoPauloNow();

  const hours = await prisma.businessHours.findMany({
    where: { businessId: { in: businessIds }, dayOfWeek },
  });

  const map = new Map<string, boolean>();
  for (const hour of hours) {
    const isOpen =
      !hour.isClosed &&
      !!hour.openTime &&
      !!hour.closeTime &&
      time >= hour.openTime &&
      time <= hour.closeTime;
    map.set(hour.businessId, isOpen);
  }
  return map;
}
