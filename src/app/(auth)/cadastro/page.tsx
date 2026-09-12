import { prisma } from "@/lib/prisma";
import { AuthShell } from "@/components/auth/AuthShell";
import { CadastroForm } from "./CadastroForm";

export default async function CadastroPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; role?: string }>;
}) {
  const { callbackUrl, role } = await searchParams;
  const initialRole = role === "BUSINESS" ? "BUSINESS" : "USER";

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <AuthShell
      title="Criar conta"
      description="Cadastre-se como consumidor ou anuncie seu negócio."
      panelHeading="Para quem busca e para quem oferece"
      panelSubtext="Consumidores encontram negócios de confiança. Donos de negócio ganham visibilidade local."
    >
      <CadastroForm callbackUrl={callbackUrl} initialRole={initialRole} categories={categories} />
    </AuthShell>
  );
}
