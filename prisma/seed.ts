import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/client";
import type { DayOfWeek } from "../generated/enums";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const CATEGORIES = [
  { slug: "restaurantes", name: "Restaurantes" },
  { slug: "saude-e-beleza", name: "Saúde & Beleza" },
  { slug: "servicos-domesticos", name: "Serviços Domésticos" },
  { slug: "educacao", name: "Educação" },
  { slug: "pet-shops", name: "Pet Shops" },
  { slug: "automotivo", name: "Automotivo" },
] as const;

const FULL_WEEK_HOURS = [
  { dayOfWeek: "MON", openTime: "08:00", closeTime: "18:00" },
  { dayOfWeek: "TUE", openTime: "08:00", closeTime: "18:00" },
  { dayOfWeek: "WED", openTime: "08:00", closeTime: "18:00" },
  { dayOfWeek: "THU", openTime: "08:00", closeTime: "18:00" },
  { dayOfWeek: "FRI", openTime: "08:00", closeTime: "18:00" },
  { dayOfWeek: "SAT", openTime: "09:00", closeTime: "13:00" },
  { dayOfWeek: "SUN", openTime: null, closeTime: null, isClosed: true },
] as const;

const ALWAYS_OPEN_HOURS = (
  ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const
).map((dayOfWeek) => ({ dayOfWeek, openTime: "00:00", closeTime: "23:59" }));

const NEVER_OPEN_HOURS = (
  ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const
).map((dayOfWeek) => ({ dayOfWeek, openTime: null, closeTime: null, isClosed: true }));

interface SeedBusiness {
  slug: string;
  name: string;
  description: string;
  city: string;
  state: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
  planType: "FREE" | "BASIC" | "PRO";
  averageRating: number;
  reviewCount: number;
  categorySlugs: string[];
  hours: readonly { dayOfWeek: DayOfWeek; openTime: string | null; closeTime: string | null; isClosed?: boolean }[];
  products?: { name: string; description?: string }[];
}

const BUSINESSES: SeedBusiness[] = [
  {
    slug: "cafe-do-bairro",
    name: "Café do Bairro",
    description: "Cafeteria de bairro com bolos caseiros e café coado na hora",
    city: "Porto Alegre",
    state: "RS",
    status: "APPROVED",
    planType: "PRO",
    averageRating: 4.8,
    reviewCount: 132,
    categorySlugs: ["restaurantes"],
    hours: FULL_WEEK_HOURS,
    products: [{ name: "Café coado" }, { name: "Bolo de fubá" }],
  },
  {
    slug: "oficina-do-ze",
    name: "Oficina do Zé",
    description: "Mecânica geral, troca de óleo e revisão preventiva para carros e motos",
    city: "Porto Alegre",
    state: "RS",
    status: "APPROVED",
    planType: "PRO",
    averageRating: 4.6,
    reviewCount: 87,
    categorySlugs: ["automotivo"],
    hours: FULL_WEEK_HOURS,
    products: [{ name: "Troca de óleo" }, { name: "Alinhamento e balanceamento" }],
  },
  {
    slug: "clinica-sorriso",
    name: "Clínica Sorriso",
    description: "Odontologia geral, clareamento dental e ortodontia",
    city: "Canoas",
    state: "RS",
    status: "APPROVED",
    planType: "BASIC",
    averageRating: 4.9,
    reviewCount: 204,
    categorySlugs: ["saude-e-beleza"],
    hours: FULL_WEEK_HOURS,
    products: [{ name: "Clareamento dental" }],
  },
  {
    slug: "petshop-amigo-fiel",
    name: "Petshop Amigo Fiel",
    description: "Banho e tosa, ração e acessórios para cães e gatos",
    city: "Canoas",
    state: "RS",
    status: "APPROVED",
    planType: "FREE",
    averageRating: 4.3,
    reviewCount: 41,
    categorySlugs: ["pet-shops"],
    hours: ALWAYS_OPEN_HOURS,
    products: [{ name: "Banho e tosa" }],
  },
  {
    slug: "escola-de-idiomas-fluencia",
    name: "Escola de Idiomas Fluência",
    description: "Aulas de inglês e espanhol para todas as idades",
    city: "Porto Alegre",
    state: "RS",
    status: "APPROVED",
    planType: "FREE",
    averageRating: 4.5,
    reviewCount: 19,
    categorySlugs: ["educacao"],
    hours: FULL_WEEK_HOURS,
  },
  {
    slug: "faxina-express",
    name: "Faxina Express",
    description: "Serviços domésticos de limpeza residencial e comercial",
    city: "Novo Hamburgo",
    state: "RS",
    status: "APPROVED",
    planType: "BASIC",
    averageRating: 4.1,
    reviewCount: 12,
    categorySlugs: ["servicos-domesticos"],
    hours: NEVER_OPEN_HOURS,
  },
  {
    slug: "pizzaria-nonna-lucia",
    name: "Pizzaria Nonna Lucia",
    description: "Pizzas artesanais no forno a lenha, massa de fermentação natural",
    city: "Porto Alegre",
    state: "RS",
    status: "APPROVED",
    planType: "FREE",
    averageRating: 4.7,
    reviewCount: 65,
    categorySlugs: ["restaurantes"],
    hours: FULL_WEEK_HOURS,
    products: [{ name: "Pizza margherita" }, { name: "Pizza calabresa" }],
  },
  {
    slug: "salao-bela-vista",
    name: "Salão Bela Vista",
    description: "Corte, coloração e tratamentos capilares",
    city: "Canoas",
    state: "RS",
    status: "APPROVED",
    planType: "FREE",
    averageRating: 4.4,
    reviewCount: 28,
    categorySlugs: ["saude-e-beleza"],
    hours: FULL_WEEK_HOURS,
  },
  {
    slug: "restaurante-em-analise",
    name: "Restaurante Em Análise",
    description: "Cadastro recém-enviado, ainda aguardando aprovação do time de moderação",
    city: "Porto Alegre",
    state: "RS",
    status: "PENDING",
    planType: "FREE",
    averageRating: 0,
    reviewCount: 0,
    categorySlugs: ["restaurantes"],
    hours: FULL_WEEK_HOURS,
  },
  {
    slug: "empresa-reprovada",
    name: "Empresa Reprovada",
    description: "Cadastro rejeitado pela moderação por dados inconsistentes",
    city: "Porto Alegre",
    state: "RS",
    status: "REJECTED",
    planType: "FREE",
    averageRating: 0,
    reviewCount: 0,
    categorySlugs: ["automotivo"],
    hours: FULL_WEEK_HOURS,
  },
];

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@paginasamarelas.local" },
    update: {},
    create: {
      email: "admin@paginasamarelas.local",
      name: "Administrador",
      passwordHash,
      role: "ADMIN",
    },
  });

  const categoriesBySlug = new Map<string, { id: string }>();
  for (const category of CATEGORIES) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: { slug: category.slug, name: category.name },
    });
    categoriesBySlug.set(category.slug, created);
  }

  const ownerPasswordHash = await bcrypt.hash("empresa123", 10);

  for (const business of BUSINESSES) {
    const ownerEmail = `${business.slug}@paginasamarelas.local`;
    const owner = await prisma.user.upsert({
      where: { email: ownerEmail },
      update: {},
      create: {
        email: ownerEmail,
        name: business.name,
        passwordHash: ownerPasswordHash,
        role: "BUSINESS",
      },
    });

    const createdBusiness = await prisma.business.upsert({
      where: { slug: business.slug },
      update: {
        status: business.status,
        planType: business.planType,
        averageRating: business.averageRating,
        reviewCount: business.reviewCount,
      },
      create: {
        ownerId: owner.id,
        name: business.name,
        slug: business.slug,
        description: business.description,
        city: business.city,
        state: business.state,
        status: business.status,
        planType: business.planType,
        averageRating: business.averageRating,
        reviewCount: business.reviewCount,
      },
    });

    for (const categorySlug of business.categorySlugs) {
      const category = categoriesBySlug.get(categorySlug);
      if (!category) continue;
      await prisma.businessCategory.upsert({
        where: {
          businessId_categoryId: {
            businessId: createdBusiness.id,
            categoryId: category.id,
          },
        },
        update: {},
        create: { businessId: createdBusiness.id, categoryId: category.id },
      });
    }

    for (const hour of business.hours) {
      await prisma.businessHours.upsert({
        where: {
          businessId_dayOfWeek: {
            businessId: createdBusiness.id,
            dayOfWeek: hour.dayOfWeek,
          },
        },
        update: {
          openTime: hour.openTime,
          closeTime: hour.closeTime,
          isClosed: hour.isClosed ?? false,
        },
        create: {
          businessId: createdBusiness.id,
          dayOfWeek: hour.dayOfWeek,
          openTime: hour.openTime,
          closeTime: hour.closeTime,
          isClosed: hour.isClosed ?? false,
        },
      });
    }

    if (business.products?.length) {
      const existingProducts = await prisma.product.findMany({
        where: { businessId: createdBusiness.id },
        select: { name: true },
      });
      const existingNames = new Set(existingProducts.map((p) => p.name));
      const newProducts = business.products.filter((p) => !existingNames.has(p.name));
      if (newProducts.length > 0) {
        await prisma.product.createMany({
          data: newProducts.map((product) => ({
            businessId: createdBusiness.id,
            name: product.name,
            description: product.description,
          })),
        });
      }
    }
  }

  console.log("Seed concluído: admin@paginasamarelas.local / admin123");
  console.log(`Categorias: ${CATEGORIES.length}, empresas: ${BUSINESSES.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
