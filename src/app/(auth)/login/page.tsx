import { LoginForm } from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; reset?: string }>;
}) {
  const { callbackUrl, reset } = await searchParams;

  return (
    <main className="mx-auto flex max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-24">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Entrar</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Acesse sua conta para gerenciar seu negócio ou suas avaliações.
        </p>
      </div>
      {reset === "sucesso" && (
        <p className="rounded-md bg-success/10 px-4 py-2.5 text-sm text-success">
          Senha redefinida com sucesso. Faça login com sua nova senha.
        </p>
      )}
      <LoginForm callbackUrl={callbackUrl} />
    </main>
  );
}
