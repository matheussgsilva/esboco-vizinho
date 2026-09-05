import { requireSession } from "@/lib/auth-utils";
import { getOwnedBusiness } from "@/lib/business";
import { prisma } from "@/lib/prisma";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { Pagination } from "@/components/ui/Pagination";
import { ProductForm } from "@/components/business/ProductForm";
import { ProductRow } from "@/components/business/ProductRow";

const PAGE_SIZE = 20;

export default async function PainelProdutosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await requireSession();
  const business = await getOwnedBusiness(session.user.id);

  if (!business) {
    return (
      <PlaceholderPage
        title="Produtos e serviços"
        description="Esta conta não possui um negócio vinculado."
      />
    );
  }

  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where: { businessId: business.id } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="mx-auto max-w-3xl flex-1 space-y-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Produtos e serviços</h1>
        <p className="mt-1 text-sm text-ink-muted">{total} cadastrados.</p>
      </div>

      <ProductForm />

      {products.length === 0 ? (
        <p className="rounded-lg border border-border bg-surface px-4 py-8 text-center text-sm text-ink-muted">
          Nenhum produto cadastrado ainda.
        </p>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price !== null ? Number(product.price) : null,
                isActive: product.isActive,
              }}
            />
          ))}
        </div>
      )}

      <Pagination basePath="/painel/produtos" searchParams={{}} page={page} totalPages={totalPages} />
    </main>
  );
}
