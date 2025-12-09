-- Admin system tables and policies

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'moderator')),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin sessions table
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  session_token VARCHAR(500) UNIQUE NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin activity logs table
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  action VARCHAR(255) NOT NULL,
  resource_type VARCHAR(100),
  resource_id UUID,
  details JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for admins table
CREATE POLICY "Admins can view all admins" ON admins
  FOR SELECT USING (true);

CREATE POLICY "Only super_admin can insert admins" ON admins
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE email = current_user_email()
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Admins can update their own email password" ON admins
  FOR UPDATE USING (email = current_user_email() OR 
    EXISTS (SELECT 1 FROM admins WHERE email = current_user_email() AND role = 'super_admin')
  );

-- Create policies for admin_sessions table
CREATE POLICY "Admins can view their own sessions" ON admin_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id = admin_id 
      AND email = current_user_email()
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_id ON admin_sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_activity_admin_id ON admin_activity_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_created_at ON admin_activity_logs(created_at);

-- Insert the super admin (password will be hashed in the app)
-- This is a placeholder, actual password hash should be generated
INSERT INTO admins (email, password_hash, full_name, role, is_active)
VALUES (
  'ahdybau@gmail.com',
  '$2b$10$dummy', -- This will be replaced with actual hash
  'Admin Principal',
  'super_admin',
  true
)
ON CONFLICT (email) DO NOTHING;
