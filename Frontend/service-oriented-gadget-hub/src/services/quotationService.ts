import axiosInstance from '../utils/axiosInstance';

export interface QuotationRequestItem {
  productId: number;
  productName: string;
  quantity: number;
}

export interface Quotation {
  id: number;
  quotationId?: number; // Backend might send either
  clickedDate: string; // The error log said 'requestDate' does not exist on type 'Quotation'. Did you mean 'requestedDate'? But dashboard uses requestDate or requestedDate. I will add both or just requestedDate.
  // Actually, let's stick to what the dashbaord uses or fix the dashboard. Dashboard uses `req.requestDate || req.requestedDate`.
  requestedDate: string;
  requestDate?: string; // For compatibility
  status: 'Pending' | 'Approved' | 'Rejected' | 'Responded' | 'Selected' | 'ConvertedToOrder'; // Added more statuses
  distributorName?: string;
  totalAmount?: number;
  finalPrice?: number;
  products?: { productId: number; productName: string; quantity: number }[];

  // Re-added fields for compatibility
  items: {
    id?: number;
    productId: number;
    productName?: string;
    quantity: number;
    offeredUnitPrice?: number;
  }[];
  customerId?: number;
  distributorId?: number;
  expiryDate?: string;
  grandTotal?: number;
  requestType?: 'SingleDistributor' | 'MultiDistributor';
  distributorResponses?: any[]; // Simplified for now
}

export interface NegotiatedItem {
  productId: number;
  negotiatedPrice: number;
}

const QUOTATION_API_URL = '/Quotation';

export const quotationService = {
  // POST /api/Quotation/request-from-cart
  requestQuotationFromCart: async (): Promise<void> => {
    await axiosInstance.post(`${QUOTATION_API_URL}/request-from-cart`);
  },

  // POST /api/Quotation/request (Manual)
  // POST /api/Quotation/request (Manual)
  createQuotation: async (data: { productId?: number; productName?: string; quantity: number; notes: string }): Promise<void> => {
    await axiosInstance.post(`${QUOTATION_API_URL}/request`, data);
  },

  // GET /api/Quotation/my-quotations
  getMyQuotations: async (): Promise<Quotation[]> => {
    const response = await axiosInstance.get<Quotation[]>(`${QUOTATION_API_URL}/my-quotations`);
    return response.data;
  },

  // GET /api/Quotation/pending-requests
  getPendingRequests: async (): Promise<Quotation[]> => {
    const response = await axiosInstance.get<Quotation[]>(`${QUOTATION_API_URL}/pending-requests`);
    return response.data;
  },

  // PUT /api/Quotation/approve/{quotationId}
  approveQuotation: async (quotationId: number | string, negotiatedItems: NegotiatedItem[]): Promise<void> => {
    await axiosInstance.put(`${QUOTATION_API_URL}/approve/${quotationId}`, negotiatedItems);
  }
};
