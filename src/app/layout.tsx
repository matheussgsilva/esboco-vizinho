import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Esboço Páginas Amarelas",
    template: "%s | Esboço Páginas Amarelas",
  },
  description:
    "Encontre negócios locais de confiança perto de você: horários, contato, avaliações e muito mais.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-surface text-ink font-sans">
        {children}
      </body>
    </html>
  );
}
