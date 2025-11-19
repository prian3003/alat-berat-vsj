-- Add deduction columns to Gaji table
-- This adds support for Bon (advances) and Uang Makan (meal allowance) deductions

ALTER TABLE "gaji" ADD COLUMN "bon_amount" NUMERIC(15, 2) NOT NULL DEFAULT 0;
ALTER TABLE "gaji" ADD COLUMN "uang_makan_amount" NUMERIC(15, 2) NOT NULL DEFAULT 0;
ALTER TABLE "gaji" ADD COLUMN "total_potongan" NUMERIC(15, 2) NOT NULL DEFAULT 0;
ALTER TABLE "gaji" ADD COLUMN "gaji_netto" NUMERIC(15, 2) NOT NULL DEFAULT 0;

-- Update existing records to calculate gaji_netto (net salary)
UPDATE "gaji" SET "total_potongan" = COALESCE("bon_amount", 0) + COALESCE("uang_makan_amount", 0);
UPDATE "gaji" SET "gaji_netto" = COALESCE("total_gaji", 0) - COALESCE("total_potongan", 0);

-- Create indexes for new columns
CREATE INDEX "gaji_bon_amount_idx" ON "gaji"("bon_amount");
CREATE INDEX "gaji_uang_makan_amount_idx" ON "gaji"("uang_makan_amount");
CREATE INDEX "gaji_total_potongan_idx" ON "gaji"("total_potongan");
CREATE INDEX "gaji_gaji_netto_idx" ON "gaji"("gaji_netto");
