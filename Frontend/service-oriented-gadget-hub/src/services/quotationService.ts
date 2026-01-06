import axiosInstance from '../utils/axiosInstance';

export interface QuotationRequestItem {
  productId: number;
  productName: string;
  quantity: number;
}

export interface Quotation {
  id: number;
  quotationId?: number; // Backend might send either
  requestedDate: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Responded';
  distributorName?: string;
  totalAmount?: number;
  finalPrice?: number;
  products?: { productId: number; productName: string; quantity: number }[]; // For details view
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
  createQuotation: async (data: { productName: string; quantity: number; notes: string }): Promise<void> => {
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
