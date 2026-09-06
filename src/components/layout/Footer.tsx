import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-teal text-white/80">
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="space-y-2">
            <p className="text-lg font-bold text-white">Esboço</p>
            <p className="text-sm">
              Encontre negócios locais de confiança perto de você.
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <p className="font-medium text-white">Para você</p>
            <ul className="space-y-1.5">
              <li>
                <Link href="/buscar" className="hover:text-white">
                  Buscar negócios
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white">
                  Entrar
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2 text-sm">
            <p className="font-medium text-white">Para empresas</p>
            <ul className="space-y-1.5">
              <li>
                <Link href="/cadastro?role=BUSINESS" className="hover:text-white">
                  Cadastrar meu negócio
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="border-t border-white/10 pt-6 text-xs">
          © {year} Esboço Páginas Amarelas.
        </p>
      </div>
    </footer>
  );
}
