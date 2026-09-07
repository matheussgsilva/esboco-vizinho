import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Session } from "next-auth";
import { signOutAction } from "@/lib/auth-actions";

export function DashboardTopBar({ session }: { session: Session }) {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-1.5 text-lg font-bold text-ink">
          <MapPin className="h-5 w-5 text-brand-coral" strokeWidth={2} aria-hidden />
          Esboço
        </Link>

        <div className="flex items-center gap-4">
          <span className="hidden text-sm font-medium text-ink-muted sm:inline">
            {session.user.name ?? session.user.email}
          </span>
          <form action={signOutAction}>
            <button
              type="submit"
              className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
            >
              Sair
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
