export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  subtotal: number;
  shipping_total: number;
  tax_total: number;
  discount_total: number;
  total: number;
  notes?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface OrderStatus {
  id: string;
  order_id: string;
  status: string;
  notes?: string;
  created_by: string;
  created_at: string;
}

export interface OrderShipping {
  id: string;
  order_id: string;
  address_id: string;
  shipping_rate_id: string;
  tracking_number?: string;
  tracking_url?: string;
  estimated_delivery?: string;
  shipped_at?: string;
  delivered_at?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface OrderPayment {
  id: string;
  order_id: string;
  amount: number;
  provider: string;
  status: string;
  transaction_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Database {
  public: {
    Tables: {
      orders: {
        Row: Order;
        Insert: Omit<Order, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Order, 'id' | 'created_at' | 'updated_at'>>;
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, 'id' | 'created_at'>;
        Update: Partial<Omit<OrderItem, 'id' | 'created_at'>>;
      };
      order_statuses: {
        Row: OrderStatus;
        Insert: Omit<OrderStatus, 'id' | 'created_at'>;
        Update: Partial<Omit<OrderStatus, 'id' | 'created_at'>>;
      };
      order_shipping: {
        Row: OrderShipping;
        Insert: Omit<OrderShipping, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<OrderShipping, 'id' | 'created_at' | 'updated_at'>>;
      };
      order_payments: {
        Row: OrderPayment;
        Insert: Omit<OrderPayment, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<OrderPayment, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}