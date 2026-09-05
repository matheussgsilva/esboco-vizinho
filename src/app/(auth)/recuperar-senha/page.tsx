import { RecuperarSenhaForm } from "./RecuperarSenhaForm";

export default function RecuperarSenhaPage() {
  return (
    <main className="mx-auto flex max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-24">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Recuperar senha</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Informe seu email e enviaremos um link para redefinir sua senha.
        </p>
      </div>
      <RecuperarSenhaForm />
    </main>
  );
}
