import axiosInstance from '@/lib/axios';
import { SystemConfig, UpdateSystemConfigRequest } from './types';
import { PageRequest, PaginatedResponse } from '@/lib/pagination';

export const fetchSystemConfigs = async (params?: PageRequest): Promise<PaginatedResponse<SystemConfig>> => {
    // Map configKey filter to search
    let searchTerm = params?.search;
    if (params?.filters?.configKey) {
        searchTerm = params.filters.configKey as string;
    }

    const queryParams: any = {
        page: params?.page,
        size: params?.size,
        search: searchTerm,
        sort: params?.sort,
    };

    if (params?.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '' && key !== 'configKey') {
                queryParams[key] = value;
            }
        });
    }

    const response = await axiosInstance.get(`${'/system-configs'}`, {
        params: queryParams,
    });
    return response.data;
};

export const fetchSystemConfigById = async (id: string): Promise<SystemConfig> => {
    const response = await axiosInstance.get(`${'/system-configs'}/${id}`);
    return response.data;
};

export const updateSystemConfig = async (id: string, data: UpdateSystemConfigRequest): Promise<SystemConfig> => {
    const response = await axiosInstance.put(`${'/system-configs'}/${id}`, data);
    return response.data;
};
