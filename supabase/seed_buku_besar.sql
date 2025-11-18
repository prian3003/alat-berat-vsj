-- Create buku_besar table for general ledger tracking
CREATE TABLE IF NOT EXISTS buku_besar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nomor TEXT NOT NULL,
  tanggal DATE NOT NULL,
  deskripsi TEXT NOT NULL,
  debit DECIMAL(15, 2) NOT NULL DEFAULT 0,
  kredit DECIMAL(15, 2) NOT NULL DEFAULT 0,
  keterangan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX idx_buku_besar_tanggal ON buku_besar(tanggal);
CREATE INDEX idx_buku_besar_nomor ON buku_besar(nomor);
CREATE INDEX idx_buku_besar_deskripsi ON buku_besar(deskripsi);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_buku_besar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_buku_besar_updated_at
BEFORE UPDATE ON buku_besar
FOR EACH ROW
EXECUTE FUNCTION update_buku_besar_timestamp();

-- Insert sample data for testing (optional)
INSERT INTO buku_besar (nomor, tanggal, deskripsi, debit, kredit, keterangan) VALUES
('001', '2025-01-01', 'Saldo Awal Kas', 10000000.00, 0, 'Saldo Awal Periode'),
('002', '2025-01-05', 'Pendapatan Sewa Alat Berat', 0, 5000000.00, 'Invoice #001'),
('003', '2025-01-10', 'Pengeluaran Operasional', 2000000.00, 0, 'Biaya BBM'),
('004', '2025-01-15', 'Pendapatan Konsultasi', 0, 1500000.00, 'Konsultasi Proyek');
