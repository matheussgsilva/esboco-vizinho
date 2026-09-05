import { prisma } from "@/lib/prisma";

const DIACRITICS_REGEX = new RegExp("[̀-ͯ]", "g");

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(DIACRITICS_REGEX, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function generateUniqueBusinessSlug(name: string): Promise<string> {
  const base = slugify(name) || "empresa";
  let candidate = base;
  let suffix = 2;

  while (await prisma.business.findUnique({ where: { slug: candidate }, select: { id: true } })) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}
