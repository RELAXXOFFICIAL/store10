// Add to existing Database interface
export interface Database {
  public: {
    Tables: {
      // ... existing tables ...
      product_discounts: {
        Row: {
          id: string;
          product_id: string;
          discount_type: 'percentage' | 'fixed';
          discount_value: number;
          label: string | null;
          start_date: string;
          end_date: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      popup_promotions: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          image_url: string | null;
          start_date: string;
          end_date: string;
          frequency: 'once_per_session' | 'daily' | 'every_visit';
          target_audience: 'all' | 'new_visitors' | 'returning_customers';
          position: 'center' | 'top' | 'bottom';
          display_delay: number;
          cta_text: string | null;
          cta_link: string | null;
          styling: Record<string, any> | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      promotion_analytics: {
        Row: {
          id: string;
          promotion_id: string;
          promotion_type: 'product_discount' | 'popup';
          views: number;
          clicks: number;
          conversions: number;
          created_at: string;
        };
      };
    };
  };
}