import { requireRole } from "@/lib/auth-utils";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["ADMIN"]);
  return (
    <>
      <AdminNav />
      {children}
    </>
  );
}
