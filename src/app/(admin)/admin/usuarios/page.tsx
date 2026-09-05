import { prisma } from "@/lib/prisma";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import type { Role } from "../../../../../generated/enums";

const PAGE_SIZE = 20;
const VALID_ROLES: Role[] = ["ADMIN", "BUSINESS", "USER"];

const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Administrador",
  BUSINESS: "Dono de negócio",
  USER: "Consumidor",
};

interface UsuariosSearchParams {
  role?: string;
  q?: string;
  page?: string;
}

export default async function UsuariosPage({
  searchParams,
}: {
  searchParams: Promise<UsuariosSearchParams>;
}) {
  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;
  const role = VALID_ROLES.includes(sp.role as Role) ? (sp.role as Role) : undefined;
  const q = sp.q?.trim();

  const where = {
    ...(role ? { role } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="mx-auto max-w-5xl flex-1 space-y-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Usuários</h1>
        <p className="mt-1 text-sm text-ink-muted">{total} usuários cadastrados.</p>
      </div>

      <form method="GET" className="flex flex-wrap gap-2">
        <select
          name="role"
          defaultValue={role ?? ""}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink"
        >
          <option value="">Todos os papéis</option>
          <option value="USER">Consumidor</option>
          <option value="BUSINESS">Dono de negócio</option>
          <option value="ADMIN">Administrador</option>
        </select>
        <input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Buscar por nome ou email"
          className="flex-1 min-w-50 rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted"
        />
        <Button type="submit" variant="secondary">
          Filtrar
        </Button>
      </form>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-lilac/40 text-ink-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Papel</th>
              <th className="px-4 py-3 font-medium">Cadastro</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-ink-muted">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-t border-border">
                  <td className="px-4 py-3 text-ink">{user.name ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-muted">{user.email}</td>
                  <td className="px-4 py-3 text-ink-muted">{ROLE_LABELS[user.role]}</td>
                  <td className="px-4 py-3 text-ink-muted">
                    {new Intl.DateTimeFormat("pt-BR").format(user.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        basePath="/admin/usuarios"
        searchParams={{ role: sp.role, q: sp.q }}
        page={page}
        totalPages={totalPages}
      />
    </main>
  );
}
