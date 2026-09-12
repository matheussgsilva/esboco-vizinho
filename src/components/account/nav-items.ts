import { Heart, LayoutDashboard, Star, type LucideIcon } from "lucide-react";

export interface ContaNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const CONTA_NAV_ITEMS: ContaNavItem[] = [
  { href: "/minha-conta", label: "Visão geral", icon: LayoutDashboard },
  { href: "/minha-conta/favoritos", label: "Favoritos", icon: Heart },
  { href: "/minha-conta/minhas-avaliacoes", label: "Minhas avaliações", icon: Star },
];
