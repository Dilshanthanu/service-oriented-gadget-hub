import axiosInstance from '../utils/axiosInstance';
import { CartItem } from '../context/CartContext';

const CART_API_URL = '/Cart';

export const cartService = {
  // GET /api/Cart
  getCart: async (): Promise<CartItem[]> => {
    const response = await axiosInstance.get<CartItem[]>(CART_API_URL);
    return response.data;
  },

  // POST /api/Cart/add
  addToCart: async (productId: number, quantity: number): Promise<void> => {
    await axiosInstance.post(`${CART_API_URL}/add`, { productId, quantity });
  },

  // DELETE /api/Cart/remove/{id}
  removeFromCart: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${CART_API_URL}/remove/${id}`);
  },

  // DELETE /api/Cart/clear
  clearCart: async (): Promise<void> => {
    await axiosInstance.delete(`${CART_API_URL}/clear`);
  }
};
