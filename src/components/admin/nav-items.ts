import { Building2, CreditCard, LayoutDashboard, Star, Tags, Users, type LucideIcon } from "lucide-react";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard },
  { href: "/admin/empresas", label: "Empresas", icon: Building2 },
  { href: "/admin/categorias", label: "Categorias", icon: Tags },
  { href: "/admin/usuarios", label: "Usuários", icon: Users },
  { href: "/admin/avaliacoes", label: "Avaliações", icon: Star },
  { href: "/admin/assinaturas", label: "Assinaturas", icon: CreditCard },
];
