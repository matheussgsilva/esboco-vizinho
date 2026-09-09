import {
  Briefcase,
  Building2,
  Clock,
  CreditCard,
  Image as ImageIcon,
  LayoutDashboard,
  Package,
  Star,
  type LucideIcon,
} from "lucide-react";

export interface PainelNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const PAINEL_NAV_ITEMS: PainelNavItem[] = [
  { href: "/painel", label: "Visão geral", icon: LayoutDashboard },
  { href: "/painel/perfil", label: "Perfil", icon: Building2 },
  { href: "/painel/horarios", label: "Horários", icon: Clock },
  { href: "/painel/produtos", label: "Produtos", icon: Package },
  { href: "/painel/vagas", label: "Vagas", icon: Briefcase },
  { href: "/painel/fotos", label: "Fotos", icon: ImageIcon },
  { href: "/painel/avaliacoes", label: "Avaliações", icon: Star },
  { href: "/painel/assinatura", label: "Assinatura", icon: CreditCard },
];
