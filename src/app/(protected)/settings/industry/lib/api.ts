import axiosInstance from '@/lib/axios';
import { IndustryResponse, CreateIndustryRequest, UpdateIndustryRequest } from './types';
import { PageRequest, PaginatedResponse } from '@/lib/pagination';

export const fetchIndustries = async (params?: PageRequest): Promise<PaginatedResponse<IndustryResponse>> => {
    // Map industryName filter to search
    let searchTerm = params?.search;
    if (params?.filters?.industryName) {
        searchTerm = params.filters.industryName as string;
    }

    const queryParams: any = {
        page: params?.page,
        size: params?.size,
        search: searchTerm,
        sort: params?.sort,
    };

    if (params?.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '' && key !== 'industryName') {
                queryParams[key] = value;
            }
        });
    }

    const response = await axiosInstance.get(`/industries`, {
        params: queryParams,
    });
    return response.data;
};

export const fetchIndustryById = async (id: string): Promise<IndustryResponse> => {
    const response = await axiosInstance.get(`/industries/${id}`);
    return response.data;
};

export const createIndustry = async (data: CreateIndustryRequest): Promise<IndustryResponse> => {
    const response = await axiosInstance.post(`/industries`, data);
    return response.data;
};

export const updateIndustry = async (id: string, data: UpdateIndustryRequest): Promise<IndustryResponse> => {
    const response = await axiosInstance.put(`/industries/${id}`, data);
    return response.data;
};

export const deleteIndustry = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/industries/${id}`);
};
