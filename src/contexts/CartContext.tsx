import React, { createContext, useContext, useState } from 'react';

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    name: string;
    price: number;
    images?: string[];
  };
}

interface CartContextType {
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items] = useState<CartItem[]>([]);

  const addItem = async (productId: string, quantity = 1) => {
    console.log('add item', productId, quantity);
  };

  const removeItem = async (itemId: string) => {
    console.log('remove item', itemId);
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    console.log('update quantity', itemId, quantity);
  };

  const clearCart = async () => {
    console.log('clear cart');
  };

  const total = items.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      loading: false,
      total
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
