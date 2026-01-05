import axiosInstance from '@/lib/axios';
import { ConsultantResponse, CreateConsultantRequest, UpdateConsultantRequest } from './types';
import { PageRequest, PaginatedResponse } from '@/lib/pagination';

export const fetchUnassignedConsultants = async (): Promise<any[]> => {
    const response = await axiosInstance.get(`/users/unassigned-consultants`);
    return response.data;
};

export const fetchConsultants = async (params?: PageRequest): Promise<PaginatedResponse<ConsultantResponse>> => {
    // Map consultantCode filter to search
    let searchTerm = params?.search;
    if (params?.filters?.consultantCode) {
        searchTerm = params.filters.consultantCode as string;
    }

    const queryParams: any = {
        page: params?.page,
        size: params?.size,
        search: searchTerm,
        sort: params?.sort,
    };

    if (params?.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '' && key !== 'consultantCode') {
                queryParams[key] = value;
            }
        });
    }

    const response = await axiosInstance.get(`/consultants`, {
        params: queryParams,
    });
    return response.data;
};

export const fetchConsultantById = async (id: string): Promise<ConsultantResponse> => {
    const response = await axiosInstance.get(`/consultants/${id}`);
    return response.data;
};

export const createConsultant = async (data: CreateConsultantRequest): Promise<ConsultantResponse> => {
    const response = await axiosInstance.post(`/consultants`, data);
    return response.data;
};

export const updateConsultant = async (id: string, data: UpdateConsultantRequest): Promise<ConsultantResponse> => {
    const response = await axiosInstance.put(`/consultants/${id}`, data);
    return response.data;
};

export const deleteConsultant = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/consultants/${id}`);
};
