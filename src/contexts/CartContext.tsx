
import { createContext, useState, useEffect, useContext, ReactNode, useCallback, useMemo } from 'react';
import { Tables } from '@/integrations/supabase/types';
import { toast } from "sonner";

type Product = Tables<'products'>;

interface CartItem {
  id: string;
  quantity: number;
  product: Product;
}

interface CartContextType {
  cartItems: Product[];
  items: CartItem[]; // เพิ่ม property นี้เพื่อให้ตรงกับ Header
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const localData = localStorage.getItem('begins-guide-cart');
      if (localData) {
        setCartItems(JSON.parse(localData));
      }
    } catch (error) {
      console.error("Failed to parse cart data from localStorage", error);
      localStorage.removeItem('begins-guide-cart');
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('begins-guide-cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart data to localStorage", error);
    }
  }, [cartItems]);

  const addToCart = useCallback((product: Product) => {
    setCartItems(prevItems => {
      const isItemInCart = prevItems.find(item => item.id === product.id);
      if (isItemInCart) {
        toast.info(`"${product.title}" อยู่ในตะกร้าแล้ว`);
        return prevItems;
      }
      toast.success(`เพิ่ม "${product.title}" ลงในตะกร้าแล้ว`);
      return [...prevItems, product];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === productId);
      if (itemToRemove) {
        toast.success(`นำ "${itemToRemove.title}" ออกจากตะกร้าแล้ว`);
      }
      return prevItems.filter(item => item.id !== productId);
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    toast.info("ล้างตะกร้าสินค้าแล้ว");
  }, []);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  }, [cartItems]);

  const itemCount = cartItems.length;

  // แปลง cartItems เป็น items format ที่ Header ต้องการ
  const items = useMemo(() => {
    return cartItems.map(product => ({
      id: product.id,
      quantity: 1, // สำหรับระบบปัจจุบันที่ไม่มี quantity system
      product
    }));
  }, [cartItems]);

  const value = {
    cartItems,
    items, // เพิ่ม property นี้
    addToCart,
    removeFromCart,
    clearCart,
    cartTotal,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
