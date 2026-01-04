import axiosInstance from '../utils/axiosInstance';
import { Product } from './api';

// Re-using Product interface from api.ts or defining new one based on payload
export interface ProductPayload {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  imageUrl: string;
}

const PRODUCT_API_URL = '/Product';

export const productService = {
  // GET /api/Product/{id}
  getProductById: async (id: string | number): Promise<Product> => {
    const response = await axiosInstance.get<Product>(`${PRODUCT_API_URL}/${id}`);
    return response.data;
  },

  // POST /api/Product
  createProduct: async (product: ProductPayload): Promise<Product> => {
    const response = await axiosInstance.post<Product>(PRODUCT_API_URL, product);
    return response.data;
  },

  // PUT /api/Product/{id}
  updateProduct: async (id: string | number, product: ProductPayload): Promise<Product> => {
    const response = await axiosInstance.put<Product>(`${PRODUCT_API_URL}/${id}`, product);
    return response.data;
  },

  // DELETE /api/Product/{id}
  deleteProduct: async (id: string | number): Promise<void> => {
    await axiosInstance.delete(`${PRODUCT_API_URL}/${id}`);
  },
  
  // Optional: GET all products (if needed for the view/list)
  // Assuming GET /api/Product might return a list based on standard REST, 
  // though user only explicitly listed POST, GET {id}, DELETE {id}.
  getAllProducts: async (): Promise<Product[]> => {
     const response = await axiosInstance.get<Product[]>(PRODUCT_API_URL);
     return response.data;
  }
};
