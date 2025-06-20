
import React, { createContext, useState, useContext, useEffect } from 'react';

interface CartItem {
  id: string;
  title: string;
  price: number;
  product_type?: string;
  image_url?: string | null;
  slug: string;
  description?: string | null;
  category?: string | null;
  quantity?: number;
}

interface CartContextType {
  items: CartItem[];
  cartItems: CartItem[]; // Alias for compatibility
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  cartTotal: number; // Computed property
  getItemQuantity: (id: string) => number;
  itemCount: number; // Computed property
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (item: CartItem) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(i => i.id === item.id);

      if (existingItemIndex !== -1) {
        // Item already exists, update quantity or handle as needed
        return prevItems;
      } else {
        // Item doesn't exist, add it to the cart
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
  };

  const getItemQuantity = (id: string) => {
    const item = items.find(item => item.id === id);
    return item?.quantity || 0;
  };

  const cartTotal = getCartTotal();
  const itemCount = items.reduce((count, item) => count + (item.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        cartItems: items, // Alias for compatibility
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        cartTotal,
        getItemQuantity,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
