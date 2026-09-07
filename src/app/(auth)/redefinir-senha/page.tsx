import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { RedefinirSenhaForm } from "./RedefinirSenhaForm";

export default async function RedefinirSenhaPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; email?: string }>;
}) {
  const { token, email } = await searchParams;

  return (
    <AuthShell
      title="Redefinir senha"
      description="Escolha uma nova senha para sua conta."
      panelHeading="Sua conta, sempre por perto"
      panelSubtext="Enviamos um link seguro para o seu email em poucos segundos."
    >
      {token && email ? (
        <RedefinirSenhaForm token={token} email={email} />
      ) : (
        <p className="text-sm text-ink-muted">
          Link inválido.{" "}
          <Link href="/recuperar-senha" className="font-medium text-brand-coral hover:text-brand-coral-dark">
            Solicite um novo link de recuperação
          </Link>
          .
        </p>
      )}
    </AuthShell>
  );
}
