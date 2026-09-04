import { requireRole } from "@/lib/auth-utils";

export default async function ContaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["USER", "ADMIN"]);
  return <>{children}</>;
}
