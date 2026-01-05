import axiosInstance from '@/lib/axios';
import { ClientResponse, CreateClientRequest } from '@/app/(protected)/masters/client/lib/types';

// Return the whole response object to check status
export const fetchClientByAppUserId = async (id: string): Promise<any> => {
    const response = await axiosInstance.get(`/clients/byAppUserid/${id}`);
    return response;
};

export const createClient = async (data: CreateClientRequest): Promise<ClientResponse> => {
    const response = await axiosInstance.post(`/clients`, data);
    return response.data;
};
