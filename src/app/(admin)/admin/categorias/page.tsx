import { prisma } from "@/lib/prisma";
import { CategoryCreateForm } from "./CategoryCreateForm";
import { CategoryRowActions } from "./CategoryRowActions";

export default async function CategoriasPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { businesses: true } } },
  });

  return (
    <main className="mx-auto max-w-5xl flex-1 space-y-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Categorias</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {categories.length} categorias cadastradas.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-surface p-4">
        <CategoryCreateForm />
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-lilac/40 text-ink-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Negócios</th>
              <th className="px-4 py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-ink-muted">
                  Nenhuma categoria cadastrada.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="border-t border-border">
                  <td className="px-4 py-3 text-ink">{category.name}</td>
                  <td className="px-4 py-3 text-ink-muted">{category.slug}</td>
                  <td className="px-4 py-3 text-ink-muted">{category._count.businesses}</td>
                  <td className="px-4 py-3">
                    <CategoryRowActions
                      category={{
                        id: category.id,
                        name: category.name,
                        businessCount: category._count.businesses,
                      }}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
