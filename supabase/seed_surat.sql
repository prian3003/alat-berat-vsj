-- Create surat_jalan table
CREATE TABLE IF NOT EXISTS "surat_jalan" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "noSurat" varchar(50) NOT NULL UNIQUE,
  "tanggal" date NOT NULL,
  "jenis_kendaraan" varchar(100) NOT NULL,
  "no_pol" varchar(20) NOT NULL,
  "sopir" varchar(255) NOT NULL,
  "tujuan" text,
  "keterangan" text,
  "status" varchar(50) NOT NULL DEFAULT 'draft',
  "created_by" varchar(255),
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for surat_jalan
CREATE INDEX IF NOT EXISTS "surat_jalan_tanggal_idx" ON "surat_jalan"("tanggal");
CREATE INDEX IF NOT EXISTS "surat_jalan_no_pol_idx" ON "surat_jalan"("no_pol");
CREATE INDEX IF NOT EXISTS "surat_jalan_status_idx" ON "surat_jalan"("status");

-- Create surat_jalan_items table
CREATE TABLE IF NOT EXISTS "surat_jalan_items" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "surat_id" uuid NOT NULL,
  "urutan" integer NOT NULL,
  "jenis_unit" varchar(255) NOT NULL,
  "seri" varchar(255) NOT NULL,
  "lokasi" varchar(255) NOT NULL,
  "keterangan" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY ("surat_id") REFERENCES "surat_jalan"("id") ON DELETE CASCADE,
  UNIQUE("surat_id", "urutan")
);

-- Create indexes for surat_jalan_items
CREATE INDEX IF NOT EXISTS "surat_jalan_items_surat_id_idx" ON "surat_jalan_items"("surat_id");

-- Create surat_perjanjian table
CREATE TABLE IF NOT EXISTS "surat_perjanjian" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "noPerjanjian" varchar(100) NOT NULL UNIQUE,
  "tanggal" date NOT NULL,
  "tanggal_pernyataan" text,
  "pihak_pertama_nama" varchar(255) NOT NULL,
  "pihak_pertama_jabatan" varchar(255) NOT NULL,
  "pihak_pertama_perusahaan" varchar(255) NOT NULL,
  "pihak_pertama_alamat" text NOT NULL,
  "pihak_kedua_nama" varchar(255) NOT NULL,
  "pihak_kedua_jabatan" varchar(255) NOT NULL,
  "pihak_kedua_perusahaan" varchar(255) NOT NULL,
  "pihak_kedua_alamat" text NOT NULL,
  "lokasi_pekerjaan" text NOT NULL,
  "tanggal_mulai" date NOT NULL,
  "tanggal_selesai" date NOT NULL,
  "keterangan" text,
  "status" varchar(50) NOT NULL DEFAULT 'draft',
  "created_by" varchar(255),
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for surat_perjanjian
CREATE INDEX IF NOT EXISTS "surat_perjanjian_tanggal_idx" ON "surat_perjanjian"("tanggal");
CREATE INDEX IF NOT EXISTS "surat_perjanjian_status_idx" ON "surat_perjanjian"("status");

-- Create surat_perjanjian_items table
CREATE TABLE IF NOT EXISTS "surat_perjanjian_items" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "surat_perjanjian_id" uuid NOT NULL,
  "urutan" integer NOT NULL,
  "jenis_alat" varchar(255) NOT NULL,
  "jumlah" integer NOT NULL,
  "harga_sewa" varchar(100) NOT NULL,
  "keterangan" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY ("surat_perjanjian_id") REFERENCES "surat_perjanjian"("id") ON DELETE CASCADE,
  UNIQUE("surat_perjanjian_id", "urutan")
);

-- Create indexes for surat_perjanjian_items
CREATE INDEX IF NOT EXISTS "surat_perjanjian_items_surat_perjanjian_id_idx" ON "surat_perjanjian_items"("surat_perjanjian_id");
