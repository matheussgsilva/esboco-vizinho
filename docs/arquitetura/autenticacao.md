# Autenticação e autorização

## Stack

NextAuth / Auth.js v5 (`next-auth@beta`) com `@auth/prisma-adapter`, estratégia de sessão **JWT** (necessária para o provider Credentials — sessão de banco não é compatível com Credentials no Auth.js v5).

Providers configurados em `src/auth.ts`:

- **Credentials** — email + senha (`bcryptjs`), usado pelo fluxo de cadastro próprio (consumidor ou empresa).
- **Google** — OAuth opcional, reduz fricção no cadastro do consumidor final.

O `role` (`ADMIN`/`BUSINESS`/`USER`) é embutido no JWT no callback `jwt` e repassado para `session.user.role` no callback `session`. Os tipos são estendidos em `src/types/next-auth.d.ts`.

## ⚠️ Next.js 16: `middleware.ts` → `proxy.ts`

O Next.js 16 depreciou o arquivo `middleware.ts` e renomeou a convenção para `proxy.ts` (mesmo comportamento, roda no runtime Node.js por padrão agora). Este projeto já usa `src/proxy.ts`. Documentos, tutoriais e o próprio treinamento de modelos de IA mais antigos ainda vão mencionar `middleware.ts` — **não recriar esse arquivo**, editar `src/proxy.ts`. Ver `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md` para a referência completa desta versão instalada.

## Proteção de rotas — duas camadas (defense in depth)

1. **`src/proxy.ts`** (checagem otimista, roda no edge/antes da renderização):
   - Lê a sessão via `auth()` (wrapper do NextAuth).
   - Mapeia prefixos de rota para o papel exigido (`/admin` → `ADMIN`, `/painel` → `BUSINESS`, `/minha-conta` → `USER`; `ADMIN` sempre passa).
   - Redireciona não autenticado para `/login`, autenticado com papel incompatível para `/nao-autorizado`.
   - **Não é a única barreira** — só lê o cookie/JWT, não consulta o banco.

2. **`layout.tsx` de cada route group + `lib/auth-utils.ts`** (checagem definitiva, roda no servidor a cada request):
   - `requireSession()` — chama `unauthorized()` (de `next/navigation`) se não houver sessão. Renderiza `src/app/unauthorized.tsx` com status HTTP 401 real.
   - `requireRole(["ADMIN"])` — chama `forbidden()` se o papel não bater. Renderiza `src/app/forbidden.tsx` com status HTTP 403 real.
   - `requireBusinessOwner(business.ownerId)` — para qualquer mutação sobre uma `Business` específica: `ADMIN` sempre passa, senão exige que `session.user.id === business.ownerId` (evita IDOR — nunca confiar em um `businessId` do payload sem checar o dono no banco).

`unauthorized()`/`forbidden()` exigem `experimental.authInterrupts: true` em `next.config.ts` (já habilitado) — são a forma correta de interromper a renderização em Server Components/layouts nesta versão do Next, **não** lançar um `Response` manualmente (isso só é válido dentro de Route Handlers).

Essas mesmas funções também funcionam dentro de Route Handlers (`app/api/*/route.ts`), então `requireSession()`/`requireRole()` são reutilizados em `api/checkout` e `api/billing-portal` sem precisar de uma variante separada.

## Cadastro com escolha de papel

`/cadastro` (a implementar) deve permitir escolher "sou consumidor" (`User.role = USER`) ou "sou dono de negócio" (`User.role = BUSINESS` + criação de `Business` com `status = PENDING`, aguardando aprovação do admin). **Nunca** aceitar `role` vindo do client em nenhum formulário/endpoint que não seja esse fluxo de cadastro controlado — promoção a `ADMIN` só via seed (`prisma/seed.ts`) ou ação administrativa restrita.
