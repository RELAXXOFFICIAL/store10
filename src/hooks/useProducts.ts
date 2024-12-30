import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sku?: string;
  inventory_count: number;
  category: string;
  status: 'active' | 'archived' | 'out_of_stock';
  images?: string[];
  tags?: string[];
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) throw error;
      setProducts(prev => [data, ...prev]);
      return data;
    } catch (error) {
      toast.error('Failed to create product');
      throw error;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setProducts(prev => prev.map(p => p.id === id ? data : p));
      return data;
    } catch (error) {
      toast.error('Failed to update product');
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      toast.error('Failed to delete product');
      throw error;
    }
  };

  const updateProductStatus = async (id: string, status: Product['status']) => {
    return updateProduct(id, { status });
  };

  return {
    products,
    loading,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductStatus,
    refreshProducts: fetchProducts
  };
}