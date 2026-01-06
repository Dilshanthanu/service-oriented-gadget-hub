import axiosInstance from '../utils/axiosInstance';

export interface Order {
  id: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  fromQuotationId?: number;
  items: {
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
}


const ORDER_API_URL = '/Order';

export const orderService = {
  // POST /api/Order/checkout/{quotationId}
  checkoutOrder: async (quotationId: number | string): Promise<void> => {
    await axiosInstance.post(`${ORDER_API_URL}/checkout/${quotationId}`);
  },

  // GET /api/Order/all (Admin/Distributor)
  getAllOrders: async (): Promise<Order[]> => {
    const response = await axiosInstance.get<Order[]>(`${ORDER_API_URL}/all`);
    return response.data;
  },

  // GET /api/Order/my-orders (Customer - Assumption based on requirements)
  // If this endpoint doesn't exist, we might need to filter GetAll or ask user.
  // Given "View my quotations" was /my-quotations, likely /my-orders exists.
  getMyOrders: async (): Promise<Order[]> => {
    const response = await axiosInstance.get<Order[]>(`${ORDER_API_URL}/my-orders`);
    return response.data;
  },

  // GET /api/Order/{orderId}
  getOrderById: async (orderId: number | string): Promise<Order> => {
    const response = await axiosInstance.get<Order>(`${ORDER_API_URL}/${orderId}`);
    return response.data;
  },

  // PUT /api/Order/update-status/{orderId}
  updateOrderStatus: async (orderId: number | string, status: string): Promise<void> => {
    // API expects string body. Axios sends object as JSON by default.
    // If backend expects raw string "Pending", we set headers.
    await axiosInstance.put(`${ORDER_API_URL}/update-status/${orderId}`, JSON.stringify(status), {
        headers: { 'Content-Type': 'application/json' }
    });
  },

  // DELETE /api/Order/{orderId}
  deleteOrder: async (orderId: number | string): Promise<void> => {
    await axiosInstance.delete(`${ORDER_API_URL}/${orderId}`);
  }
};
