import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; reset?: string }>;
}) {
  const { callbackUrl, reset } = await searchParams;

  return (
    <AuthShell
      title="Entrar"
      description="Acesse sua conta para gerenciar seu negócio ou suas avaliações."
      panelHeading="Bem-vindo de volta"
      panelSubtext="Continue de onde parou: gerencie seu negócio ou suas avaliações."
    >
      <div className="space-y-6">
        {reset === "sucesso" && (
          <p className="rounded-md bg-success/10 px-4 py-2.5 text-sm text-success">
            Senha redefinida com sucesso. Faça login com sua nova senha.
          </p>
        )}
        <LoginForm callbackUrl={callbackUrl} />
      </div>
    </AuthShell>
  );
}
