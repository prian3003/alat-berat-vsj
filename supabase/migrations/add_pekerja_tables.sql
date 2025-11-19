-- Create Pekerja (Worker) table
CREATE TABLE IF NOT EXISTS "pekerja" (
    "id" UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "nama" VARCHAR(255) NOT NULL,
    "jabatan" VARCHAR(255) NOT NULL,
    "nomor_telepon" VARCHAR(20),
    "alamat" TEXT,
    "status" VARCHAR(50) NOT NULL DEFAULT 'aktif', -- 'aktif' or 'tidak aktif'
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT now()
);

-- Create index for Pekerja table
CREATE INDEX "pekerja_status_idx" ON "pekerja"("status");

-- Create GajiPekerja (Worker Salary) junction table
CREATE TABLE IF NOT EXISTS "gaji_pekerja" (
    "id" UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "gaji_id" UUID NOT NULL,
    "pekerja_nama" VARCHAR(255) NOT NULL,
    "pekerja_id" UUID,
    "jabatan" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
    CONSTRAINT "gaji_pekerja_gaji_id_fkey" FOREIGN KEY ("gaji_id") REFERENCES "gaji"("id") ON DELETE CASCADE
);

-- Create indexes for GajiPekerja table
CREATE INDEX "gaji_pekerja_gaji_id_idx" ON "gaji_pekerja"("gaji_id");
CREATE INDEX "gaji_pekerja_pekerja_id_idx" ON "gaji_pekerja"("pekerja_id");
