# Busca e ranking

> Fora de escopo do bootstrap inicial — este documento registra o desenho para a próxima iteração (`src/lib/search.ts` ainda não existe).

## Busca (nome, categoria, produto/serviço)

Usar **Postgres Full-Text Search** nativo em vez de `LIKE`/`ILIKE` cru:

- Coluna `tsvector` combinando `name`, `description` e nomes de categorias/produtos agregados, com índice **GIN**. O Prisma não modela `tsvector` nativamente — essa parte entra via migration SQL manual (`prisma migrate dev --create-only` + editar o SQL) e a query via `prisma.$queryRaw` com `to_tsquery`/`ts_rank`.
- Matching por **prefixo**, não por lexema exato: `websearch_to_tsquery` (que faz o parsing de aspas/`OR`/`-termo`) sozinho só casa lexema completo (após stemming), então termo parcial (ex. `"pizz"`) não retornaria `"pizzaria"`. `src/lib/search.ts` converte o resultado do `websearch_to_tsquery` para prefixo via `regexp_replace` (`'lexema'` → `'lexema':*`) antes de re-parsear com `to_tsquery`, mantendo o parsing de frases/operadores do `websearch_to_tsquery` e ainda usando o índice GIN existente.
- Busca por categoria: join direto na tabela pivô `BusinessCategory` (já indexada por `categoryId`).
- Busca por produto/serviço: incluir nomes de `Product` no `tsvector` ou usar `EXISTS` com FTS próprio.

## Ordenação

- **Alfabética**: `ORDER BY name ASC` — índice B-tree padrão (ou funcional em `lower(name)` para case-insensitive).
- **Relevância**: o plano determina o **grupo de prioridade/posição** (não um boost matemático somado à nota) — dentro de cada grupo, ordena por nota média e depois número de reviews:

  ```sql
  ORDER BY
    CASE plan_type WHEN 'PRO' THEN 2 WHEN 'BASIC' THEN 1 ELSE 0 END DESC,
    average_rating DESC,
    review_count DESC,
    id ASC -- paginação estável
  ```

- Índice parcial recomendado (já filtrando o `WHERE status = 'APPROVED'` sempre presente na busca pública):

  ```sql
  CREATE INDEX business_ranking_idx ON "Business" (status, plan_type, average_rating DESC, review_count DESC)
  WHERE status = 'APPROVED';
  ```

- Paginação: `OFFSET/LIMIT` é aceitável no volume inicial; migrar para cursor-based se a base crescer (ranking muda de posição a cada novo review).

## Seção "empresas em destaque" (home)

Query separada e cacheada: `WHERE plan_type = 'PRO' AND status = 'APPROVED' ORDER BY average_rating DESC LIMIT 8`, com `export const revalidate = 300` (5 min) — não precisa ser real-time.

Toda a lógica de composição de query deve ficar concentrada em `lib/search.ts` (`searchBusinesses({ query, categorySlug, sort, page })`) — não espalhar SQL raw pelos route handlers/pages.
