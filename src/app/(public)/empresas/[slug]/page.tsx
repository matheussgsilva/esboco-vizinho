import { cache } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isOpenNow } from "@/lib/search";
import { StarRating } from "@/components/ui/StarRating";
import { BusinessHoursTable } from "@/components/business/BusinessHoursTable";

const getPublicBusinessBySlug = cache(async (slug: string) => {
  return prisma.business.findUnique({
    where: { slug },
    include: {
      categories: { include: { category: { select: { name: true, slug: true } } } },
      hours: true,
      products: { where: { isActive: true }, orderBy: { createdAt: "asc" } },
      photos: { orderBy: { order: "asc" } },
      socialLinks: true,
      reviews: {
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { user: { select: { name: true } } },
      },
    },
  });
});

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const business = await getPublicBusinessBySlug(slug);

  if (!business || business.status !== "APPROVED") {
    return { title: "Empresa não encontrada" };
  }

  const location = [business.city, business.state].filter(Boolean).join(", ");

  return {
    title: business.name,
    description:
      business.description?.trim() ||
      `${business.name}${location ? ` em ${location}` : ""} — confira horários, produtos e avaliações.`,
  };
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const dateFormatter = new Intl.DateTimeFormat("pt-BR");

export default async function EmpresaPage({ params }: PageProps) {
  const { slug } = await params;
  const business = await getPublicBusinessBySlug(slug);

  if (!business || business.status !== "APPROVED") {
    notFound();
  }

  const location = [business.city, business.state].filter(Boolean).join(", ");
  const open = isOpenNow(business.hours);

  return (
    <main className="mx-auto flex-1 max-w-5xl space-y-8 px-4 py-10">
      <section className="space-y-4">
        <div className="relative aspect-3/1 w-full overflow-hidden rounded-lg bg-surface-lilac">
          {business.coverImageUrl && (
            <Image
              src={business.coverImageUrl}
              alt={business.name}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          )}
        </div>

        <div className="flex flex-wrap items-start gap-4">
          {business.logoUrl && (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-border bg-surface">
              <Image src={business.logoUrl} alt="" fill sizes="64px" className="object-cover" />
            </div>
          )}
          <div className="min-w-0 flex-1 space-y-1.5">
            <h1 className="text-2xl font-semibold text-ink">{business.name}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
              <StarRating rating={Number(business.averageRating)} reviewCount={business.reviewCount} />
              {business.categories.length > 0 && (
                <>
                  <span aria-hidden>·</span>
                  <span>{business.categories.map((c) => c.category.name).join(", ")}</span>
                </>
              )}
              {location && (
                <>
                  <span aria-hidden>·</span>
                  <span>{location}</span>
                </>
              )}
            </div>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium text-white ${
              open ? "bg-success" : "bg-ink-muted"
            }`}
          >
            {open ? "Aberto" : "Fechado"}
          </span>
        </div>

        {business.description && <p className="text-sm text-ink">{business.description}</p>}
      </section>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">Contato</h2>
          <ul className="space-y-1.5 text-sm text-ink">
            {business.phone && (
              <li>
                <a href={`tel:${business.phone}`} className="hover:underline">
                  {business.phone}
                </a>
              </li>
            )}
            {business.whatsapp && <li>WhatsApp: {business.whatsapp}</li>}
            {business.email && (
              <li>
                <a href={`mailto:${business.email}`} className="hover:underline">
                  {business.email}
                </a>
              </li>
            )}
            {business.website && (
              <li>
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-coral hover:text-brand-coral-dark hover:underline"
                >
                  {business.website}
                </a>
              </li>
            )}
            {business.addressLine && (
              <li className="text-ink-muted">
                {business.addressLine}
                {business.zipCode ? ` · ${business.zipCode}` : ""}
              </li>
            )}
          </ul>

          {business.socialLinks.length > 0 && (
            <ul className="flex flex-wrap gap-3 pt-1 text-sm">
              {business.socialLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-coral hover:text-brand-coral-dark hover:underline"
                  >
                    {link.platform}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">Horário de funcionamento</h2>
          <BusinessHoursTable hours={business.hours} />
        </section>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-ink">Produtos e serviços</h2>
        {business.products.length === 0 ? (
          <p className="text-sm text-ink-muted">Nenhum produto ou serviço cadastrado.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {business.products.map((product) => (
              <div key={product.id} className="rounded-lg border border-border bg-surface p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-ink">{product.name}</h3>
                  {product.price !== null && (
                    <span className="shrink-0 text-sm font-medium text-ink">
                      {currencyFormatter.format(Number(product.price))}
                    </span>
                  )}
                </div>
                {product.description && (
                  <p className="mt-1 text-sm text-ink-muted">{product.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {business.photos.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">Fotos</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {business.photos.map((photo) => (
              <div
                key={photo.id}
                className="relative aspect-square overflow-hidden rounded-lg bg-surface-lilac"
              >
                <Image
                  src={photo.url}
                  alt={photo.altText ?? business.name}
                  fill
                  sizes="(min-width: 640px) 25vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-ink">Avaliações</h2>
        {business.reviews.length === 0 ? (
          <p className="text-sm text-ink-muted">Esta empresa ainda não recebeu avaliações.</p>
        ) : (
          <div className="space-y-3">
            {business.reviews.map((review) => (
              <div key={review.id} className="space-y-1.5 rounded-lg border border-border bg-surface p-4">
                <StarRating rating={review.rating} />
                <p className="text-sm text-ink">{review.comment ?? "(sem comentário)"}</p>
                <p className="text-xs text-ink-muted">
                  {review.user.name ?? "Consumidor"} · {dateFormatter.format(review.createdAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
