import { requireRole } from "@/lib/auth-utils";

export default async function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["BUSINESS", "ADMIN"]);
  return <>{children}</>;
}
