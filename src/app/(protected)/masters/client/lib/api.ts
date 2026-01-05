import axiosInstance from '@/lib/axios';
import { ClientResponse, CreateClientRequest, UpdateClientRequest } from './types';
import { PageRequest, PaginatedResponse } from '@/lib/pagination';

export const fetchUnassignedClients = async (): Promise<any[]> => {
    const response = await axiosInstance.get(`/users/unassigned-clients`);
    return response.data;
};

export const fetchClients = async (params?: PageRequest): Promise<PaginatedResponse<ClientResponse>> => {
    // Map companyName filter to search
    let searchTerm = params?.search;
    if (params?.filters?.companyName) {
        searchTerm = params.filters.companyName as string;
    }

    const queryParams: any = {
        page: params?.page,
        size: params?.size,
        search: searchTerm,
        sort: params?.sort,
    };

    if (params?.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '' && key !== 'companyName') {
                queryParams[key] = value;
            }
        });
    }

    const response = await axiosInstance.get(`/clients`, {
        params: queryParams,
    });
    return response.data;
};

export const fetchClientById = async (id: string): Promise<ClientResponse> => {
    const response = await axiosInstance.get(`/clients/${id}`);
    return response.data;
};

export const createClient = async (data: CreateClientRequest): Promise<ClientResponse> => {
    console.log(data);
    const response = await axiosInstance.post(`/clients`, data);
    return response.data;
};

export const updateClient = async (id: string, data: UpdateClientRequest): Promise<ClientResponse> => {
    const response = await axiosInstance.put(`/clients/${id}`, data);
    return response.data;
};

export const deleteClient = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/clients/${id}`);
};
