import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default async function EmpresaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <PlaceholderPage
      title={`Perfil da empresa: ${slug}`}
      description="Perfil público com horários, produtos/serviços e avaliações será implementado em uma próxima iteração."
    />
  );
}
