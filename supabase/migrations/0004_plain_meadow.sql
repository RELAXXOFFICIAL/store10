/*
  # Order Management Schema
  
  1. New Tables
    - `orders`: Main order information
    - `order_items`: Individual items in orders
    - `order_statuses`: Order status history
    - `order_shipping`: Shipping details
    - `order_payments`: Payment information
    
  2. Security
    - RLS policies for all tables
    - Customer access to own orders
    - Admin access to all orders
*/

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  status text NOT NULL DEFAULT 'pending',
  subtotal decimal(10,2) NOT NULL,
  shipping_total decimal(10,2) NOT NULL DEFAULT 0,
  tax_total decimal(10,2) NOT NULL DEFAULT 0,
  discount_total decimal(10,2) NOT NULL DEFAULT 0,
  total decimal(10,2) NOT NULL,
  notes text,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  subtotal decimal(10,2) NOT NULL,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Order Status History
CREATE TABLE IF NOT EXISTS order_statuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  status text NOT NULL,
  notes text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Order Shipping
CREATE TABLE IF NOT EXISTS order_shipping (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  address_id uuid REFERENCES addresses(id),
  shipping_rate_id uuid REFERENCES shipping_rates(id),
  tracking_number text,
  tracking_url text,
  estimated_delivery timestamptz,
  shipped_at timestamptz,
  delivered_at timestamptz,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order Payments
CREATE TABLE IF NOT EXISTS order_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  amount decimal(10,2) NOT NULL,
  provider text NOT NULL,
  status text NOT NULL,
  transaction_id text,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_shipping ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all orders"
  ON orders FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Order Items (follows order access)
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  ));

-- Indexes
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
CREATE INDEX idx_order_statuses_order ON order_statuses(order_id);
CREATE INDEX idx_order_shipping_order ON order_shipping(order_id);
CREATE INDEX idx_order_payments_order ON order_payments(order_id);

-- Functions for inventory tracking
CREATE OR REPLACE FUNCTION update_product_inventory()
RETURNS TRIGGER AS $$
BEGIN
  -- Decrease inventory on order creation
  IF (TG_OP = 'INSERT') THEN
    UPDATE products
    SET inventory_quantity = inventory_quantity - NEW.quantity
    WHERE id = NEW.product_id;
  -- Adjust inventory on order item update
  ELSIF (TG_OP = 'UPDATE') THEN
    UPDATE products
    SET inventory_quantity = inventory_quantity + OLD.quantity - NEW.quantity
    WHERE id = NEW.product_id;
  -- Restore inventory on order item deletion
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE products
    SET inventory_quantity = inventory_quantity + OLD.quantity
    WHERE id = OLD.product_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for inventory tracking
CREATE TRIGGER track_inventory
  AFTER INSERT OR UPDATE OR DELETE ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION update_product_inventory();