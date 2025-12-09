-- Table pour les paiements d'activités
CREATE TABLE IF NOT EXISTS activity_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id INTEGER NOT NULL,
  activity_title VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'FCFA',
  payment_method VARCHAR(50) NOT NULL,
  transaction_id VARCHAR(100) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  status VARCHAR(50) DEFAULT 'confirmed',
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(transaction_id)
);

-- Index pour les recherches
CREATE INDEX idx_activity_payments_activity_id ON activity_payments(activity_id);
CREATE INDEX idx_activity_payments_email ON activity_payments(email);
CREATE INDEX idx_activity_payments_transaction_id ON activity_payments(transaction_id);
CREATE INDEX idx_activity_payments_paid_at ON activity_payments(paid_at);

-- RLS (Row Level Security)
ALTER TABLE activity_payments ENABLE ROW LEVEL SECURITY;

-- Policy: Permet à tous d'insérer un paiement
CREATE POLICY "public_insert_activity_payments" ON activity_payments
  FOR INSERT WITH CHECK (TRUE);

-- Policy: Permet à tous de lire les paiements (pour vérification)
CREATE POLICY "public_select_activity_payments" ON activity_payments
  FOR SELECT USING (TRUE);

-- Table pour compter les places réservées par activité
CREATE TABLE IF NOT EXISTS activity_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id INTEGER NOT NULL,
  activity_title VARCHAR(255),
  max_places INTEGER,
  registered_count INTEGER DEFAULT 0,
  paid_count INTEGER DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW(),
  UNIQUE(activity_id)
);

-- Index
CREATE INDEX idx_activity_stats_activity_id ON activity_stats(activity_id);

-- RLS
ALTER TABLE activity_stats ENABLE ROW LEVEL SECURITY;

-- Policy: Permet à tous de lire les stats
CREATE POLICY "public_select_activity_stats" ON activity_stats
  FOR SELECT USING (TRUE);

-- Policy: Permet au service de mettre à jour les stats
CREATE POLICY "public_update_activity_stats" ON activity_stats
  FOR UPDATE USING (TRUE);
