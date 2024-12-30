DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP TRIGGER IF EXISTS update_product_status_trigger ON products;
DROP FUNCTION IF EXISTS update_product_status();
DROP FUNCTION IF EXISTS check_inventory_available(uuid, integer);
DROP INDEX IF EXISTS idx_products_search;
DROP INDEX IF EXISTS idx_products_status;
DROP INDEX IF EXISTS idx_products_category;
DROP INDEX IF EXISTS idx_products_sku;
DROP TABLE IF EXISTS products CASCADE;

/*
  # Product Management Schema

  1. New Tables
    - `products`
      - Core product information including name, price, inventory
      - Image storage and metadata
      - SEO and categorization fields
    
  2. Security
    - Enable RLS on products table
    - Add policies for admin access
    - Add policies for public read access
    
  3. Storage
    - Configure product images bucket
    - Set up access policies
*/

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  sku text UNIQUE,
  inventory_count integer NOT NULL DEFAULT 0,
  category text,
  status text NOT NULL DEFAULT 'active',
  images text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  meta_title text,
  meta_description text,
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(category, '')), 'C')
  ) STORED,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Public can view active products"
  ON products
  FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Admins can manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create Indexes
CREATE INDEX idx_products_search ON products USING gin(search_vector);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_sku ON products(sku);

-- Update Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Inventory Management Functions
CREATE OR REPLACE FUNCTION check_inventory_available(
  product_id uuid,
  requested_quantity integer
) RETURNS boolean AS $$
DECLARE
  available_quantity integer;
BEGIN
  SELECT inventory_count INTO available_quantity
  FROM products
  WHERE id = product_id;
  
  RETURN available_quantity >= requested_quantity;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-update status based on inventory
CREATE OR REPLACE FUNCTION update_product_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.inventory_count = 0 AND NEW.status = 'active' THEN
    NEW.status = 'out_of_stock';
  ELSIF NEW.inventory_count > 0 AND NEW.status = 'out_of_stock' THEN
    NEW.status = 'active';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_status_trigger
  BEFORE INSERT OR UPDATE OF inventory_count ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_product_status();

-- Storage Configuration
-- Note: This needs to be applied through the Supabase dashboard or CLI
/*
storage.createBucket('product-images', {
  public: true,
  fileSizeLimit: '5MB',
  allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp']
});
*/
