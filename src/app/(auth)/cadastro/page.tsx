import { CadastroForm } from "./CadastroForm";

export default async function CadastroPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <main className="mx-auto flex max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-24">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Criar conta</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Cadastre-se como consumidor ou anuncie seu negócio.
        </p>
      </div>
      <CadastroForm callbackUrl={callbackUrl} />
    </main>
  );
}
