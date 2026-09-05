import { requireRole } from "@/lib/auth-utils";
import { PainelNav } from "@/components/business/PainelNav";

export default async function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["BUSINESS", "ADMIN"]);
  return (
    <>
      <PainelNav />
      {children}
    </>
  );
}
