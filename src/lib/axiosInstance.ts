
// lib/axiosInstance.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api/proxy',  // ✅ always hit the Next.js proxy
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const headers = config.headers as Record<string, string>;
    const token = localStorage.getItem('token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      try {
        const refreshResponse = await axios.post(
          '/api/proxy/refresh-token/',
          {},
          { withCredentials: true }
        );
        const newToken = refreshResponse.data.token;
        localStorage.setItem('token', newToken);

        if (error.config) {
          const headers = error.config.headers as Record<string, string>;
          headers.Authorization = `Bearer ${newToken}`;
        }
        return axiosInstance(error.config!);
      } catch (refreshError) {
        localStorage.removeItem('token');
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

