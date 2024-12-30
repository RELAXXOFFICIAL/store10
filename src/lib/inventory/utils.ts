import { supabase } from '../supabase';
import { Product } from '../database/types';

export async function checkInventoryAvailability(
  productId: string,
  requestedQuantity: number
): Promise<boolean> {
  const { data: product, error } = await supabase
    .from('products')
    .select('inventory_quantity, inventory_policy')
    .eq('id', productId)
    .single();

  if (error) throw error;

  if (product.inventory_policy === 'continue') {
    return true;
  }

  return product.inventory_quantity >= requestedQuantity;
}

export async function reserveInventory(
  productId: string,
  quantity: number
): Promise<void> {
  const { error } = await supabase.rpc('reserve_inventory', {
    p_product_id: productId,
    p_quantity: quantity
  });

  if (error) throw error;
}

export async function releaseInventory(
  productId: string,
  quantity: number
): Promise<void> {
  const { error } = await supabase.rpc('release_inventory', {
    p_product_id: productId,
    p_quantity: quantity
  });

  if (error) throw error;
}

export async function adjustInventory(
  productId: string,
  adjustment: number,
  reason: string
): Promise<void> {
  const { error } = await supabase.rpc('adjust_inventory', {
    p_product_id: productId,
    p_adjustment: adjustment,
    p_reason: reason
  });

  if (error) throw error;
}

export async function getInventoryAlerts(threshold: number = 5): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .lt('inventory_quantity', threshold);

  if (error) throw error;
  return data;
}