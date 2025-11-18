-- Add tanggal column to invoice_items table
ALTER TABLE invoice_items
ADD COLUMN tanggal DATE NOT NULL DEFAULT CURRENT_DATE;

-- Remove default after adding the column
ALTER TABLE invoice_items
ALTER COLUMN tanggal DROP DEFAULT;
