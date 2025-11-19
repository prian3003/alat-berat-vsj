-- Create Gaji (Salary) table
CREATE TABLE IF NOT EXISTS "gaji" (
    "id" UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "nomor_gaji" VARCHAR(50) NOT NULL UNIQUE,
    "tipe" VARCHAR(20) NOT NULL, -- 'weekly' or 'monthly'
    "bulan" INTEGER,
    "tahun" INTEGER,
    "tanggal_mulai" DATE NOT NULL,
    "tanggal_selesai" DATE NOT NULL,
    "total_gaji" NUMERIC(15,2) NOT NULL,
    "keterangan" TEXT,
    "status" VARCHAR(50) NOT NULL DEFAULT 'draft', -- 'draft' or 'completed'
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT now()
);

-- Create indexes for Gaji table
CREATE INDEX "gaji_tanggal_mulai_idx" ON "gaji"("tanggal_mulai");
CREATE INDEX "gaji_tipe_idx" ON "gaji"("tipe");
CREATE INDEX "gaji_status_idx" ON "gaji"("status");

-- Create GajiItem (Salary Items) table
CREATE TABLE IF NOT EXISTS "gaji_items" (
    "id" UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "gaji_id" UUID NOT NULL,
    "urutan" INTEGER NOT NULL,
    "tanggal" DATE NOT NULL,
    "keterangan" VARCHAR(255) NOT NULL,
    "jam" NUMERIC,
    "jumlah" NUMERIC(15,2) NOT NULL,
    "tipe" VARCHAR(50) NOT NULL, -- 'regular', 'overtime', 'break', 'allowance', 'libur'
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
    CONSTRAINT "gaji_items_gaji_id_fkey" FOREIGN KEY ("gaji_id") REFERENCES "gaji"("id") ON DELETE CASCADE,
    UNIQUE("gaji_id", "urutan")
);

-- Create index for GajiItem table
CREATE INDEX "gaji_items_gaji_id_idx" ON "gaji_items"("gaji_id");
