-- AlterTable
ALTER TABLE "Business" ADD COLUMN "searchVector" tsvector
  GENERATED ALWAYS AS (
    to_tsvector('portuguese', coalesce("name", '') || ' ' || coalesce("description", ''))
  ) STORED;

-- CreateIndex
CREATE INDEX "Business_searchVector_idx" ON "Business" USING GIN ("searchVector");

-- CreateIndex (partial index for the ranking sort — status is always filtered to APPROVED on public search)
CREATE INDEX "Business_ranking_idx" ON "Business" ("status", "planType", "averageRating" DESC, "reviewCount" DESC)
  WHERE "status" = 'APPROVED'::"BusinessStatus";
