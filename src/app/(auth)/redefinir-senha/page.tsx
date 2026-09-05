import Link from "next/link";
import { RedefinirSenhaForm } from "./RedefinirSenhaForm";

export default async function RedefinirSenhaPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; email?: string }>;
}) {
  const { token, email } = await searchParams;

  return (
    <main className="mx-auto flex max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-24">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Redefinir senha</h1>
        <p className="mt-1 text-sm text-ink-muted">Escolha uma nova senha para sua conta.</p>
      </div>

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
    </main>
  );
}
