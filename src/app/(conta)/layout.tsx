import { requireRole } from "@/lib/auth-utils";
import { ContaNav } from "@/components/account/ContaNav";
import { DashboardTopBar } from "@/components/layout/DashboardTopBar";

export default async function ContaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole(["USER", "ADMIN"]);
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardTopBar session={session} />
      <ContaNav />
      {children}
    </div>
  );
}
