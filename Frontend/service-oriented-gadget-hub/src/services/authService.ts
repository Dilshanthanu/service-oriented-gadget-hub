import axiosInstance from '../utils/axiosInstance';
import { API_ENDPOINTS } from '../utils/urls';
import { User } from './api';

export interface DistributorRegisterPayload {
  fullName: string;
  email: string;
  password: string;
  companyName: string;
}

export interface AdminRegisterPayload {
  userName: string;
  email: string;
  password: string;
}

export const authService = {
  registerDistributor: async (data: DistributorRegisterPayload): Promise<User> => {
    const response = await axiosInstance.post<User>(API_ENDPOINTS.REGISTER_DISTRIBUTOR, data);
    return response.data;
  },

  registerAdmin: async (data: AdminRegisterPayload): Promise<User> => {
    const response = await axiosInstance.post<User>(API_ENDPOINTS.REGISTER_ADMIN, data);
    return response.data;
  }
};
