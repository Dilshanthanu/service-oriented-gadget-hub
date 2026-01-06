import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import { Product } from '../services/api';
import { cartService } from '../services/cartService';
import { useAlert } from './AlertContext';
import { useAuth } from './AuthContext';

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

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const { user } = useAuth(); // ✅ Use AuthContext directly

  const isFetchingRef = useRef(false);

  // 🛒 Fetch cart safely
  const fetchCart = async () => {
    if (!user) return; // ✅ Check user existence
    if (isFetchingRef.current) return;

    try {
      isFetchingRef.current = true;
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
      isFetchingRef.current = false;
      setLoading(false);
    }
  };

  // ✅ React to user changes
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]); // Clear cart on logout
    }
  }, [user]); // ✅ Depend on stable user object from AuthContext

  const addToCart = async (product: Product, quantity = 1) => {
    if (!user) {
      showAlert('Please login to add items to cart', 'warning');
      return;
    }

    try {
      await cartService.addToCart(product.id, quantity);
      await fetchCart();
    } catch {
      showAlert('Failed to add to cart', 'error');
    }
  };

  const removeFromCart = async (productId: number) => {
    if (!user) return;

    try {
      await cartService.removeFromCart(productId);
      setCartItems(prev => prev.filter(i => i.id !== productId));
    } catch {
      showAlert('Failed to remove item', 'error');
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (!user) return;

    const item = cartItems.find(i => i.id === productId);
    if (!item) return;

    const delta = quantity - item.quantity;
    if (delta > 0) await addToCart(item, delta);
    else if (quantity <= 0) await removeFromCart(productId);
  };

  const clearCart = async () => {
    if (!user) {
      setCartItems([]);
      return;
    }

    await cartService.clearCart();
    setCartItems([]);
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        loading,
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
