import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default async function AdminEmpresaDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PlaceholderPage
      title={`Empresa ${id}`}
      description="Detalhe e ações de moderação serão implementados em uma próxima iteração."
    />
  );
}
