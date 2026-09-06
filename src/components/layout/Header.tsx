import Link from "next/link";
import type { Session } from "next-auth";
import { signOut } from "@/auth";
import type { Role } from "../../../generated/enums";

const ACCOUNT_HREF: Record<Role, string> = {
  ADMIN: "/admin",
  BUSINESS: "/painel",
  USER: "/minha-conta",
};

const ACCOUNT_LABEL: Record<Role, string> = {
  ADMIN: "Painel admin",
  BUSINESS: "Meu painel",
  USER: "Minha conta",
};

async function signOutAction() {
  "use server";
  await signOut({ redirectTo: "/" });
}

export function Header({ session }: { session: Session | null }) {
  const user = session?.user;

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-bold text-ink">
          Esboço
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/buscar"
            className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            Buscar
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <Link
                href={ACCOUNT_HREF[user.role]}
                className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
              >
                {ACCOUNT_LABEL[user.role]}
              </Link>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
                >
                  Sair
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="inline-flex items-center justify-center rounded-md bg-brand-coral px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-coral-dark"
              >
                Cadastrar
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
