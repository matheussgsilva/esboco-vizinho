# Design System — Esboço Páginas Amarelas

Referência visual: [Directory Listing Web Design](https://dribbble.com/shots/14080208-Directory-Listing-Web-Design) (Dribbble). A paleta abaixo foi extraída por inspeção visual do print enviado (hero "hugt", cards de listagem, banner "Como funciona", depoimentos) — valores aproximados, não pixel-picked. Ajustar com um eyedropper se for necessário bater 100% com a referência.

Complementado com as diretrizes da skill `frontend-design` (anthropics/skills): fazer escolhas deliberadas de tipografia/espaçamento em vez de defaults genéricos, e evitar "tells" de design de IA — cards idênticos com sombra uniforme, badges ALL-CAPS decorativos, animações fade-slide repetitivas em toda seção, numeração 01/02/03 sem sequência real.

## Paleta de cores

| Token (Tailwind) | Hex (aprox.) | Uso |
|---|---|---|
| `brand-coral` | `#EA5455` | CTAs primários (Buscar, Adicionar negócio), tab/link ativo |
| `brand-coral-dark` | `#D33D3E` | Hover/active do coral |
| `brand-teal` | `#1B4D4D` | Seções de destaque escuras (ex. "Como funciona"), rodapé |
| `ink` | `#16213E` | Texto principal, headings |
| `ink-muted` | `#6B7280` | Texto secundário, metadados (categoria, localização) |
| `surface` | `#FFFFFF` | Fundo padrão, cards |
| `surface-blush` | `#F6DCDC` | Fundo alternado (hero, blocos de categoria) |
| `surface-sand` | `#E4CBAA` | Fundo alternado (seções de conteúdo editorial) |
| `surface-lilac` | `#E6E3F5` | Fundo alternado (seção "populares na cidade") |
| `success` | `#27AE60` | Badge "Aberto" |
| `rating` | `#FFC107` | Estrelas de avaliação |
| `border` | `#E5E7EB` | Divisores, bordas de card |

Os tokens vivem em [`src/app/globals.css`](../src/app/globals.css) via `@theme inline` (Tailwind v4, CSS-first) e ficam disponíveis como classes utilitárias (`bg-brand-coral`, `text-ink-muted`, etc).

O projeto assume tema claro (`color-scheme: light`) — a referência de design é editorial/clara, e inverter automaticamente em dark mode quebraria a identidade visual pastel. Se um dark mode for pedido no futuro, ele deve ser desenhado deliberadamente (não um simples invert), com sua própria revisão de contraste.

## Tipografia

Uma única família variável, self-hosted via `next/font/google`: **Plus Jakarta Sans** (moderna, amigável, boa legibilidade tanto em títulos quanto em corpo de texto). Um único arquivo de fonte variável = menos bytes carregados e zero layout shift (font já otimizada pelo Next em build time, sem requisição externa ao Google Fonts em runtime).

Pesos usados: 400 (corpo), 500 (labels/metadados), 600 (subtítulos), 700 (headings).

Escala tipográfica (classes Tailwind):

| Uso | Classe | Peso |
|---|---|---|
| H1 (hero) | `text-3xl sm:text-4xl` | 600 |
| H2 (seção) | `text-2xl` | 600 |
| H3 (card/título de item) | `text-base` | 600 |
| Corpo | `text-sm` / `text-base` | 400 |
| Metadado/legenda | `text-xs` / `text-sm` | 500, `text-ink-muted` |

Linha de texto de parágrafos limitada a ~65-75 caracteres (`max-w-xl`/`max-w-2xl` nos blocos de texto), seguindo a diretriz de legibilidade da skill `frontend-design`.

## Espaçamento

Escala padrão do Tailwind (4/8/12/16/24/32/48/64/96px), usada com intenção semântica e não valores arbitrários:

| Contexto | Valor |
|---|---|
| Padding interno de card | `p-4` (16px) |
| Gap entre cards em grid | `gap-4` a `gap-6` (16–24px) |
| Padding vertical de seção | `py-14` a `py-16` (56–64px) |
| Padding horizontal de página | `px-4`, com `max-w-5xl mx-auto` centralizando o conteúdo |
| Gap entre elementos de um bloco de texto (título+subtítulo+ação) | `gap-1` a `gap-2` |

## Componentes

Implementados em `src/components/ui/` e `src/components/business/` `src/components/search/`:

- **Button** (`ui/Button.tsx`) — variantes `primary` (coral), `secondary` (teal), `ghost` (contorno). Sem gradientes ou sombras decorativas — cor sólida + estado de hover.
- **Input** (`ui/Input.tsx`) — borda simples, focus ring coral translúcido.
- **SearchBar** (`search/SearchBar.tsx`) — dois campos (termo + cidade) e botão, agrupados num único container com sombra leve, replicando a barra de busca da referência.
- **BusinessCard** (`business/BusinessCard.tsx`) — imagem 4:3 com radius só no topo (evita o "tell" de cantos uniformemente arredondados em todo o card), badge "Aberto/Fechado" sobreposto, rating + categoria na mesma linha separados por `·` (como na referência: "4.5(250) · Co-Working"), nome e cidade abaixo.
- **PlanBadge** (`ui/PlanBadge.tsx`) — pílula pequena com cor por plano (cinza=Gratuito, teal=Básico, coral=Pro), usada no painel da empresa e nas listagens do admin.
- **StarRating** (`ui/StarRating.tsx`) — estrelas + nota numérica + contagem de reviews entre parênteses.
- **SectionHeader** (`ui/SectionHeader.tsx`) — título + subtítulo opcional + link "Ver mais" à direita (sem eyebrow ALL-CAPS decorativo acima do título).

## Performance / carregamento rápido

- Fonte única, variável, self-hosted via `next/font` — sem requisição externa, sem FOUC.
- Tailwind v4 (motor Oxide) — CSS final minificado e sem runtime JS de estilos.
- Imagens de negócio via `next/image` com `sizes` definido (`BusinessCard`) para servir o tamanho certo por breakpoint e evitar CLS.
- Nenhuma biblioteca de animação pesada — transições feitas com utilitários CSS nativos do Tailwind (`transition-colors`, `duration-300`) em vez de bibliotecas JS de animação.
- Seções cacheáveis (ex. "empresas em destaque" na home) devem usar `revalidate` do Next em vez de client-side fetching, quando a lógica de busca real for implementada (ver [busca-e-ranking.md](./arquitetura/busca-e-ranking.md)).
