import { requireRole } from "@/lib/auth-utils";
import { getOwnedBusiness } from "@/lib/business";
import { PainelNav } from "@/components/business/PainelNav";
import { PainelSidebar } from "@/components/business/PainelSidebar";
import { DashboardTopBar } from "@/components/layout/DashboardTopBar";

export default async function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole(["BUSINESS", "ADMIN"]);
  const business = await getOwnedBusiness(session.user.id);
  const sidebarBusiness = business
    ? { name: business.name, status: business.status, planType: business.planType }
    : null;

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardTopBar session={session} />
      <div className="flex flex-1">
        <PainelSidebar business={sidebarBusiness} />
        <div className="flex flex-1 flex-col">
          <div className="lg:hidden">
            <PainelNav />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
