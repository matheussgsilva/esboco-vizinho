import { AuthShell } from "@/components/auth/AuthShell";
import { RecuperarSenhaForm } from "./RecuperarSenhaForm";

export default function RecuperarSenhaPage() {
  return (
    <AuthShell
      title="Recuperar senha"
      description="Informe seu email e enviaremos um link para redefinir sua senha."
      panelHeading="Sua conta, sempre por perto"
      panelSubtext="Enviamos um link seguro para o seu email em poucos segundos."
    >
      <RecuperarSenhaForm />
    </AuthShell>
  );
}
