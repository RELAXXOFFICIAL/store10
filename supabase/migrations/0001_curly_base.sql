/*
  # Color Management System Schema

  1. New Tables
    - `color_themes`
      - Main theme definitions with versioning
    - `color_palettes`
      - Reusable color palettes that can be applied to themes
    - `theme_schedules`
      - Scheduling system for automatic theme changes
    - `theme_analytics`
      - Usage tracking and analytics
    - `component_colors`
      - Component-specific color overrides

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
    - Add policies for theme usage tracking

  3. Relationships
    - Link themes to palettes
    - Track theme versions
    - Connect analytics to themes
*/

-- Color Themes
CREATE TABLE IF NOT EXISTS color_themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  version integer NOT NULL DEFAULT 1,
  is_active boolean DEFAULT false,
  base_colors jsonb NOT NULL,
  gradients jsonb,
  typography jsonb,
  shadows jsonb,
  dark_mode_values jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  parent_theme_id uuid REFERENCES color_themes(id)
);

-- Color Palettes
CREATE TABLE IF NOT EXISTS color_palettes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  colors jsonb NOT NULL,
  is_preset boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Theme Schedules
CREATE TABLE IF NOT EXISTS theme_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_id uuid REFERENCES color_themes(id),
  start_date timestamptz NOT NULL,
  end_date timestamptz,
  recurrence text,
  conditions jsonb,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Theme Analytics
CREATE TABLE IF NOT EXISTS theme_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_id uuid REFERENCES color_themes(id),
  views integer DEFAULT 0,
  user_interactions integer DEFAULT 0,
  performance_metrics jsonb,
  feedback_score numeric,
  recorded_at timestamptz DEFAULT now()
);

-- Component Colors
CREATE TABLE IF NOT EXISTS component_colors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_id uuid REFERENCES color_themes(id),
  component_name text NOT NULL,
  color_overrides jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE color_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE color_palettes ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_colors ENABLE ROW LEVEL SECURITY;

-- Policies for color_themes
CREATE POLICY "Admins can manage themes"
  ON color_themes
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Public can view active themes"
  ON color_themes
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Policies for color_palettes
CREATE POLICY "Admins can manage palettes"
  ON color_palettes
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Public can view palettes"
  ON color_palettes
  FOR SELECT
  TO authenticated
  USING (true);

-- Functions for theme versioning
CREATE OR REPLACE FUNCTION create_theme_version()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.id = OLD.id THEN
    -- Create new version
    INSERT INTO color_themes (
      name,
      description,
      version,
      base_colors,
      gradients,
      typography,
      shadows,
      dark_mode_values,
      created_by,
      parent_theme_id
    ) VALUES (
      OLD.name || ' v' || (OLD.version + 1),
      OLD.description,
      OLD.version + 1,
      NEW.base_colors,
      NEW.gradients,
      NEW.typography,
      NEW.shadows,
      NEW.dark_mode_values,
      auth.uid(),
      OLD.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for theme versioning
CREATE TRIGGER theme_version_trigger
  BEFORE UPDATE ON color_themes
  FOR EACH ROW
  WHEN (OLD.base_colors != NEW.base_colors)
  EXECUTE FUNCTION create_theme_version();

-- Indexes for performance
CREATE INDEX idx_color_themes_active ON color_themes(is_active);
CREATE INDEX idx_theme_schedules_dates ON theme_schedules(start_date, end_date);
CREATE INDEX idx_theme_analytics_theme ON theme_analytics(theme_id);