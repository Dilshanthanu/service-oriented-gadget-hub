import axios from 'axios';
import { appURLs } from './urls';

const axiosInstance = axios.create({
  baseURL: appURLs.web,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
