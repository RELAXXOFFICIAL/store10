import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

export type ProductDiscount = Database['public']['Tables']['product_discounts']['Row'];
export type PopupPromotion = Database['public']['Tables']['popup_promotions']['Row'];

export function usePromotions() {
  const [discounts, setDiscounts] = useState<ProductDiscount[]>([]);
  const [popups, setPopups] = useState<PopupPromotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const [discountsResponse, popupsResponse] = await Promise.all([
        supabase.from('product_discounts').select('*'),
        supabase.from('popup_promotions').select('*')
      ]);

      if (discountsResponse.error) throw discountsResponse.error;
      if (popupsResponse.error) throw popupsResponse.error;

      setDiscounts(discountsResponse.data);
      setPopups(popupsResponse.data);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDiscount = async (data: Omit<ProductDiscount, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase.from('product_discounts').insert([data]);
    if (error) throw error;
    await fetchPromotions();
  };

  const updateDiscount = async (id: string, data: Partial<ProductDiscount>) => {
    const { error } = await supabase
      .from('product_discounts')
      .update(data)
      .eq('id', id);
    if (error) throw error;
    await fetchPromotions();
  };

  const deleteDiscount = async (id: string) => {
    const { error } = await supabase
      .from('product_discounts')
      .delete()
      .eq('id', id);
    if (error) throw error;
    await fetchPromotions();
  };

  const createPopup = async (data: Omit<PopupPromotion, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase.from('popup_promotions').insert([data]);
    if (error) throw error;
    await fetchPromotions();
  };

  const updatePopup = async (id: string, data: Partial<PopupPromotion>) => {
    const { error } = await supabase
      .from('popup_promotions')
      .update(data)
      .eq('id', id);
    if (error) throw error;
    await fetchPromotions();
  };

  const deletePopup = async (id: string) => {
    const { error } = await supabase
      .from('popup_promotions')
      .delete()
      .eq('id', id);
    if (error) throw error;
    await fetchPromotions();
  };

  return {
    discounts,
    popups,
    loading,
    createDiscount,
    updateDiscount,
    deleteDiscount,
    createPopup,
    updatePopup,
    deletePopup
  };
}
