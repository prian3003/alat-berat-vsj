-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    no_faktur VARCHAR(50) UNIQUE NOT NULL,
    tanggal DATE NOT NULL,

    -- Customer Info
    customer_name VARCHAR(255) NOT NULL,
    customer_location VARCHAR(255) NOT NULL,
    pembayara VARCHAR(255),

    -- Invoice Details
    jatuh_tempo DATE NOT NULL,
    nomor_po VARCHAR(100),

    -- Payment Info
    payment_method VARCHAR(50) DEFAULT 'transfer' NOT NULL,
    bank_name VARCHAR(100),
    account_number VARCHAR(100),
    account_name VARCHAR(255),

    -- Totals
    subtotal DECIMAL(15, 2) NOT NULL,
    total_discount DECIMAL(15, 2) DEFAULT 0 NOT NULL,
    total DECIMAL(15, 2) NOT NULL,

    -- Metadata
    keterangan TEXT,
    status VARCHAR(50) DEFAULT 'draft' NOT NULL,
    created_by VARCHAR(255),
    created_at TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for invoices table
CREATE INDEX IF NOT EXISTS invoices_tanggal_idx ON invoices(tanggal);
CREATE INDEX IF NOT EXISTS invoices_customer_name_idx ON invoices(customer_name);
CREATE INDEX IF NOT EXISTS invoices_status_idx ON invoices(status);
CREATE INDEX IF NOT EXISTS invoices_jatuh_tempo_idx ON invoices(jatuh_tempo);

-- Create invoice_items table
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL,
    urutan INTEGER NOT NULL,
    nama_item VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    harga DECIMAL(15, 2) NOT NULL,
    diskon DECIMAL(15, 2) DEFAULT 0 NOT NULL,
    total_harga DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Foreign key constraint
    CONSTRAINT invoice_items_invoice_id_fkey
        FOREIGN KEY (invoice_id)
        REFERENCES invoices(id)
        ON DELETE CASCADE,

    -- Unique constraint
    CONSTRAINT invoice_items_invoice_id_urutan_key
        UNIQUE (invoice_id, urutan)
);

-- Create indexes for invoice_items table
CREATE INDEX IF NOT EXISTS invoice_items_invoice_id_idx ON invoice_items(invoice_id);

-- Create trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_invoices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER invoices_updated_at_trigger
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_invoices_updated_at();

-- Grant permissions (adjust role name if needed)
GRANT ALL ON invoices TO postgres;
GRANT ALL ON invoice_items TO postgres;
GRANT ALL ON invoices TO authenticated;
GRANT ALL ON invoice_items TO authenticated;
GRANT ALL ON invoices TO service_role;
GRANT ALL ON invoice_items TO service_role;

-- Verify tables created
SELECT 'Invoices table created successfully' AS message
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'invoices');

SELECT 'Invoice items table created successfully' AS message
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'invoice_items');
