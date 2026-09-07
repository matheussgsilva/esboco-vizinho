import { requireRole } from "@/lib/auth-utils";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardTopBar } from "@/components/layout/DashboardTopBar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole(["ADMIN"]);
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardTopBar session={session} />
      <div className="flex flex-1">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <div className="lg:hidden">
            <AdminNav />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
