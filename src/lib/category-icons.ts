import {
  Car,
  GraduationCap,
  HeartPulse,
  PawPrint,
  Store,
  UtensilsCrossed,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  restaurantes: UtensilsCrossed,
  "saude-e-beleza": HeartPulse,
  "servicos-domesticos": Wrench,
  educacao: GraduationCap,
  "pet-shops": PawPrint,
  automotivo: Car,
};

export function getCategoryIcon(slug: string): LucideIcon {
  return CATEGORY_ICONS[slug] ?? Store;
}
