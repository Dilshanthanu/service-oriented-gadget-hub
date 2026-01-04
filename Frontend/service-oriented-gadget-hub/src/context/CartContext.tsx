import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../services/api';
import { cartService } from '../services/cartService';

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  total: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔑 ALWAYS normalize backend response
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();

      const items: CartItem[] = Array.isArray(response)
        ? response
        : response?.items ?? [];

      setCartItems(items);
    } catch (error) {
      console.error('Failed to fetch cart', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (product: Product, quantity = 1) => {
    try {
      await cartService.addToCart(product.id, quantity);
      await fetchCart();
    } catch (error) {
      console.error('Failed to add to cart', error);
      alert('Failed to add to cart');
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      await cartService.removeFromCart(productId);
      setCartItems(prev => prev.filter(item => item.id !== productId));
    } catch (error) {
      console.error('Failed to remove item', error);
      alert('Failed to remove item');
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    const currentItem = cartItems.find(i => i.id === productId);
    if (!currentItem) return;

    const delta = quantity - currentItem.quantity;

    if (delta > 0) {
      await addToCart(currentItem, delta);
    } else if (delta < 0) {
      if (quantity <= 0) {
        await removeFromCart(productId);
      } else {
        console.warn('Backend does not support decrement update directly.');
      }
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCartItems([]);
    } catch (error) {
      console.error('Failed to clear cart', error);
    }
  };

  // 🛡️ SAFE reduce
  const total = Array.isArray(cartItems)
    ? cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 0;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        loading
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
