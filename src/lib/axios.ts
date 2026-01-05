import axios, { AxiosError } from 'axios';
import { toast } from '@/components/ui/use-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    paramsSerializer: (params) => {
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
            const value = params[key];
            if (value === undefined || value === null) return;
            if (Array.isArray(value)) {
                value.forEach((v) => searchParams.append(key, v));
            } else {
                searchParams.append(key, value);
            }
        });
        return searchParams.toString();
    },
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        let title = 'Error';
        let description = 'Something went wrong';

        if (error.response) {
            const data = error.response.data as any;
            const status = error.response.status;

            // RFC 7807 Problem Details support
            title = data?.title || `Error ${status}`;
            description = data?.detail || data?.message || 'An unexpected error occurred.';

            // Handle validation errors if present in common format
            if (data?.errors && Array.isArray(data.errors)) {
                description = data.errors.map((e: any) => e.message || e).join(', ');
            } else if (data?.errors && typeof data.errors === 'object') {
                description = Object.values(data.errors).flat().join(', ');
            }

            // Fallback for specific status codes if no title/detail provided
            if (!data?.title) {
                switch (status) {
                    case 400: title = 'Bad Request'; break;
                    case 401: title = 'Unauthorized'; description = description || 'Session expired or invalid credentials.'; break;
                    case 403: title = 'Access Denied'; description = description || 'You do not have permission to perform this action.'; break;
                    case 404: title = 'Not Found'; description = description || 'The requested resource was not found.'; break;
                    case 500: title = 'Server Error'; description = description || 'Internal server error. Please try again later.'; break;
                }
            }
        } else if (error.request) {
            title = 'Network Error';
            description = 'Unable to connect to the server. Please check your internet connection.';
        }

        toast({
            title,
            description,
            variant: 'destructive',
        });

        return Promise.reject(error);
    }
);

export default axiosInstance;
