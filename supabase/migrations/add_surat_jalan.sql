-- CreateTable surat_jalan
CREATE TABLE IF NOT EXISTS "surat_jalan" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "noSurat" VARCHAR(50) NOT NULL,
  "tanggal" DATE NOT NULL,
  "jenis_kendaraan" VARCHAR(100) NOT NULL,
  "no_pol" VARCHAR(20) NOT NULL,
  "sopir" VARCHAR(255) NOT NULL,
  "tujuan" TEXT,
  "keterangan" TEXT,
  "status" VARCHAR(50) NOT NULL DEFAULT 'draft',
  "created_by" VARCHAR(255),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "surat_jalan_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "surat_jalan_noSurat_key" UNIQUE ("noSurat")
);

-- CreateTable surat_jalan_items
CREATE TABLE IF NOT EXISTS "surat_jalan_items" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "surat_id" UUID NOT NULL,
  "urutan" INTEGER NOT NULL,
  "jenis_unit" VARCHAR(255) NOT NULL,
  "seri" VARCHAR(255) NOT NULL,
  "lokasi" VARCHAR(255) NOT NULL,
  "keterangan" TEXT,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "surat_jalan_items_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "surat_jalan_items_surat_id_fkey" FOREIGN KEY ("surat_id") REFERENCES "surat_jalan" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "surat_jalan_items_surat_id_urutan_key" UNIQUE ("surat_id", "urutan")
);

-- CreateIndex surat_jalan_tanggal_idx
CREATE INDEX "surat_jalan_tanggal_idx" ON "surat_jalan"("tanggal");

-- CreateIndex surat_jalan_no_pol_idx
CREATE INDEX "surat_jalan_no_pol_idx" ON "surat_jalan"("no_pol");

-- CreateIndex surat_jalan_status_idx
CREATE INDEX "surat_jalan_status_idx" ON "surat_jalan"("status");

-- CreateIndex surat_jalan_items_surat_id_idx
CREATE INDEX "surat_jalan_items_surat_id_idx" ON "surat_jalan_items"("surat_id");
