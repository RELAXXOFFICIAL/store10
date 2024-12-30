/*
  # Theme System Enhancements

  1. New Tables
    - theme_presets: Pre-defined theme configurations
    - theme_components: Component-specific theme overrides
    - theme_accessibility: Accessibility validation results
    - theme_history: Version history and change tracking
    - theme_tokens: Design tokens and variables

  2. Enhancements
    - Added semantic color mapping
    - Improved color scheme management
    - Enhanced theme metadata
    - Added validation functions

  3. Security
    - Updated RLS policies
    - Added audit logging
*/

-- Theme Presets
CREATE TABLE IF NOT EXISTS theme_presets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text,
  colors jsonb NOT NULL,
  typography jsonb,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Component-specific Theme Overrides
CREATE TABLE IF NOT EXISTS theme_components (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_id uuid REFERENCES color_themes(id) ON DELETE CASCADE,
  component_name text NOT NULL,
  styles jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(theme_id, component_name)
);

-- Theme Accessibility Validation
CREATE TABLE IF NOT EXISTS theme_accessibility (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_id uuid REFERENCES color_themes(id) ON DELETE CASCADE,
  validation_results jsonb NOT NULL,
  issues_count integer,
  last_checked_at timestamptz DEFAULT now()
);

-- Theme Version History
CREATE TABLE IF NOT EXISTS theme_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_id uuid REFERENCES color_themes(id) ON DELETE CASCADE,
  version integer NOT NULL,
  changes jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Design Tokens
CREATE TABLE IF NOT EXISTS theme_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_id uuid REFERENCES color_themes(id) ON DELETE CASCADE,
  category text NOT NULL,
  name text NOT NULL,
  value text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(theme_id, category, name)
);

-- Add new columns to color_themes
ALTER TABLE color_themes
ADD COLUMN IF NOT EXISTS semantic_colors jsonb,
ADD COLUMN IF NOT EXISTS color_scheme text DEFAULT 'light',
ADD COLUMN IF NOT EXISTS metadata jsonb,
ADD COLUMN IF NOT EXISTS validation_status text;

-- Enable RLS
ALTER TABLE theme_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_accessibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Theme Presets
CREATE POLICY "Public presets are viewable by all"
  ON theme_presets FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can view their own presets"
  ON theme_presets FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Admins can manage all presets"
  ON theme_presets FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Component Overrides
CREATE POLICY "Users can view component overrides"
  ON theme_components FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM color_themes
    WHERE color_themes.id = theme_components.theme_id
    AND (color_themes.is_active = true OR color_themes.created_by = auth.uid())
  ));

-- Theme History
CREATE POLICY "Users can view theme history"
  ON theme_history FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM color_themes
    WHERE color_themes.id = theme_history.theme_id
    AND (color_themes.is_active = true OR color_themes.created_by = auth.uid())
  ));

-- Functions

-- Function to validate theme accessibility
CREATE OR REPLACE FUNCTION validate_theme_accessibility(theme_id uuid)
RETURNS void AS $$
DECLARE
  theme_record record;
  validation_results jsonb;
BEGIN
  SELECT * INTO theme_record FROM color_themes WHERE id = theme_id;
  
  -- Perform validation checks
  validation_results = jsonb_build_object(
    'contrast_ratios', jsonb_build_object(
      'text_background', calculate_contrast_ratio(
        theme_record.base_colors->>'text',
        theme_record.base_colors->>'background'
      )
    ),
    'checked_at', now()
  );
  
  -- Update or insert validation results
  INSERT INTO theme_accessibility (theme_id, validation_results, issues_count)
  VALUES (
    theme_id,
    validation_results,
    (SELECT count(*) FROM jsonb_array_elements(validation_results->'issues'))
  )
  ON CONFLICT (theme_id) DO UPDATE
  SET 
    validation_results = EXCLUDED.validation_results,
    issues_count = EXCLUDED.issues_count,
    last_checked_at = now();
    
  -- Update theme validation status
  UPDATE color_themes
  SET validation_status = CASE 
    WHEN (SELECT issues_count FROM theme_accessibility WHERE theme_id = theme_id) = 0
    THEN 'valid' ELSE 'invalid'
    END
  WHERE id = theme_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create theme version
CREATE OR REPLACE FUNCTION create_theme_version()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO theme_history (
    theme_id,
    version,
    changes,
    created_by
  ) VALUES (
    NEW.id,
    COALESCE((
      SELECT MAX(version) + 1
      FROM theme_history
      WHERE theme_id = NEW.id
    ), 1),
    jsonb_build_object(
      'previous', row_to_json(OLD),
      'current', row_to_json(NEW)
    ),
    auth.uid()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for version history
CREATE TRIGGER theme_version_trigger
  AFTER UPDATE ON color_themes
  FOR EACH ROW
  WHEN (OLD.* IS DISTINCT FROM NEW.*)
  EXECUTE FUNCTION create_theme_version();

-- Indexes
CREATE INDEX idx_theme_presets_public ON theme_presets(is_public);
CREATE INDEX idx_theme_components_theme ON theme_components(theme_id);
CREATE INDEX idx_theme_history_theme ON theme_history(theme_id);
CREATE INDEX idx_theme_tokens_theme ON theme_tokens(theme_id);
CREATE INDEX idx_theme_tokens_category ON theme_tokens(category);