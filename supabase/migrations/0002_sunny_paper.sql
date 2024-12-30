/*
  # Theme Management System Updates

  1. New Tables
    - `theme_backups`
      - Store theme backups for recovery
    - `theme_permissions`
      - Fine-grained access control for theme management
    - `theme_migrations`
      - Track theme migration history

  2. Security
    - Add policies for backup management
    - Add policies for permission management
*/

-- Theme Backups
CREATE TABLE IF NOT EXISTS theme_backups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_id uuid REFERENCES color_themes(id),
  backup_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  notes text
);

-- Theme Permissions
CREATE TABLE IF NOT EXISTS theme_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  theme_id uuid REFERENCES color_themes(id),
  can_edit boolean DEFAULT false,
  can_delete boolean DEFAULT false,
  can_schedule boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Theme Migrations
CREATE TABLE IF NOT EXISTS theme_migrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  applied_at timestamptz DEFAULT now(),
  applied_by uuid REFERENCES auth.users(id),
  status text NOT NULL,
  rollback_data jsonb
);

-- Enable RLS
ALTER TABLE theme_backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_migrations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins can manage backups"
  ON theme_backups
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view their theme permissions"
  ON theme_permissions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage permissions"
  ON theme_permissions
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Indexes
CREATE INDEX idx_theme_backups_theme ON theme_backups(theme_id);
CREATE INDEX idx_theme_permissions_user ON theme_permissions(user_id);
CREATE INDEX idx_theme_permissions_theme ON theme_permissions(theme_id);