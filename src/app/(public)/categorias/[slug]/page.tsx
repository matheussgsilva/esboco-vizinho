import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <PlaceholderPage
      title={`Categoria: ${slug}`}
      description="Listagem de empresas por categoria será implementada em uma próxima iteração."
    />
  );
}
