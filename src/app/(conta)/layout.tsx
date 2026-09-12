import { requireRole } from "@/lib/auth-utils";
import { ContaNav } from "@/components/account/ContaNav";
import { ContaSidebar } from "@/components/account/ContaSidebar";
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
      <div className="flex flex-1">
        <ContaSidebar />
        <div className="flex flex-1 flex-col">
          <div className="lg:hidden">
            <ContaNav />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
