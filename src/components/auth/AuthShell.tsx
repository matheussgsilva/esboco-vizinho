import Link from "next/link";
import { ReactNode } from "react";
import { getPlatformStats } from "@/lib/stats";

const numberFormatter = new Intl.NumberFormat("pt-BR");

export async function AuthShell({
  title,
  description,
  panelHeading,
  panelSubtext,
  children,
}: {
  title: string;
  description: string;
  panelHeading: string;
  panelSubtext: string;
  children: ReactNode;
}) {
  const stats = await getPlatformStats();

  return (
    <main className="flex min-h-dvh flex-1 flex-col lg:grid lg:grid-cols-2">
      <div className="flex flex-1 flex-col justify-center gap-8 px-4 py-10 sm:px-8 lg:px-16 lg:py-16">
        <Link href="/" className="text-lg font-bold text-ink">
          Esboço
        </Link>

        <div className="mx-auto w-full max-w-sm space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-ink">{title}</h1>
            <p className="mt-1 text-sm text-ink-muted">{description}</p>
          </div>
          {children}
        </div>
      </div>

      <div className="hidden flex-col justify-center gap-10 bg-surface-blush px-16 py-16 lg:flex">
        <div className="max-w-sm space-y-2">
          <h2 className="text-2xl font-semibold text-ink">{panelHeading}</h2>
          <p className="text-sm text-ink-muted">{panelSubtext}</p>
        </div>

        <dl className="max-w-sm space-y-5">
          <div>
            <dt className="text-sm text-ink-muted">Negócios cadastrados</dt>
            <dd className="text-3xl font-semibold text-ink">
              {numberFormatter.format(stats.businessCount)}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-ink-muted">Cidades atendidas</dt>
            <dd className="text-3xl font-semibold text-ink">
              {numberFormatter.format(stats.cityCount)}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-ink-muted">Avaliações de clientes</dt>
            <dd className="text-3xl font-semibold text-ink">
              {numberFormatter.format(stats.reviewCount)}
            </dd>
          </div>
        </dl>
      </div>
    </main>
  );
}
