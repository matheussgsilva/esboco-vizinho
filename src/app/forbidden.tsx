import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold text-ink">Acesso não permitido</h1>
      <p className="text-ink-muted">
        Sua conta não tem permissão para acessar esta página.
      </p>
      <Link
        href="/"
        className="rounded-md bg-brand-coral px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-coral-dark"
      >
        Voltar para a página inicial
      </Link>
    </main>
  );
}
