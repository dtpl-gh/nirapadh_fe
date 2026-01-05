import axiosInstance from '@/lib/axios';
import { AppUser, CreateUserRequest, UpdateUserRequest, UserRoleResponse, CreateUserRoleRequest, ChangePasswordRequest } from './types';
import { PageRequest, PaginatedResponse } from '@/lib/pagination';

export const fetchUsers = async (params?: PageRequest): Promise<PaginatedResponse<AppUser>> => {
    // Map username filter to search
    let searchTerm = params?.search;
    if (params?.filters?.username) {
        searchTerm = params.filters.username as string;
    }

    const queryParams: any = {
        page: params?.page,
        size: params?.size,
        search: searchTerm,
        sort: params?.sort,
    };

    if (params?.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '' && key !== 'username') {
                queryParams[key] = value;
            }
        });
    }

    const response = await axiosInstance.get(`/users`, {
        params: queryParams,
    });
    return response.data;
};

export const fetchUserById = async (id: string): Promise<AppUser> => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
};

export const createUser = async (data: CreateUserRequest): Promise<AppUser> => {
    const response = await axiosInstance.post(`/users`, data);
    return response.data;
};

export const updateUser = async (id: string, data: UpdateUserRequest): Promise<AppUser> => {
    const response = await axiosInstance.put(`/users/${id}`, data);
    return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/users/${id}`);
};

export const fetchUnassignedConsultants = async (): Promise<AppUser[]> => {
    const response = await axiosInstance.get(`/users/unassigned-consultants`);
    return response.data;
};

export const changePassword = async (id: string, data: ChangePasswordRequest): Promise<void> => {
    await axiosInstance.post(`/users/${id}/password`, data);
};


