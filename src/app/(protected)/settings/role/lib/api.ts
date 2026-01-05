import axiosInstance from '@/lib/axios';
import { RoleResponse, CreateRoleRequest, UpdateRoleRequest, PermissionQualifierResponse, AclClass, Permission, RolePermissionPolicyResponse, CreateRolePermissionPolicyRequest, UpdateRolePermissionPolicyRequest } from './types';
import { PageRequest, PaginatedResponse } from '@/lib/pagination';



// ... (Role Code)

// Policy CRUD

export const fetchAllRolePermissionPolicies = async (): Promise<RolePermissionPolicyResponse[]> => {
    const response = await axiosInstance.get(`/role-permission-policies`);
    return response.data;
};

export const fetchRolePermissionPolicyById = async (id: string): Promise<RolePermissionPolicyResponse> => {
    const response = await axiosInstance.get(`/role-permission-policies/${id}`);
    return response.data;
};

export const fetchRolePermissionPolicies = async (roleId: string): Promise<RolePermissionPolicyResponse[]> => {
    const response = await axiosInstance.get(`/role-permission-policies/by-role/${roleId}`);
    return response.data;
};

export const createRolePermissionPolicy = async (data: CreateRolePermissionPolicyRequest): Promise<RolePermissionPolicyResponse> => {
    const response = await axiosInstance.post(`/role-permission-policies`, data);
    return response.data;
};

export const updateRolePermissionPolicy = async (id: string, data: UpdateRolePermissionPolicyRequest): Promise<RolePermissionPolicyResponse> => {
    const response = await axiosInstance.put(`/role-permission-policies/${id}`, data);
    return response.data;
};

export const deleteRolePermissionPolicy = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/role-permission-policies/${id}`);
};

export const fetchRoles = async (params?: PageRequest): Promise<PaginatedResponse<RoleResponse>> => {
    // Map name filter to search
    let searchTerm = params?.search;
    if (params?.filters?.name) {
        searchTerm = params.filters.name as string;
    }

    const queryParams: any = {
        page: params?.page,
        size: params?.size,
        search: searchTerm,
        sort: params?.sort,
    };

    if (params?.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '' && key !== 'name') {
                queryParams[key] = value;
            }
        });
    }

    const response = await axiosInstance.get(`/roles`, {
        params: queryParams,
    });
    return response.data;
};

export const fetchRoleById = async (id: string): Promise<RoleResponse> => {
    const response = await axiosInstance.get(`/roles/${id}`);
    return response.data;
};

export const createRole = async (data: CreateRoleRequest): Promise<RoleResponse> => {
    const response = await axiosInstance.post(`/roles`, data);
    return response.data;
};

export const updateRole = async (id: string, data: UpdateRoleRequest): Promise<RoleResponse> => {
    const response = await axiosInstance.put(`/roles/${id}`, data);
    return response.data;
};

export const deleteRole = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/roles/${id}`);
};

// Helper APIs
export const fetchQualifiers = async (): Promise<PermissionQualifierResponse[]> => {
    const response = await axiosInstance.get(`/role-permission-policies-helper/qualifiers`);
    return response.data;
};

export const fetchAclClasses = async (): Promise<AclClass[]> => {
    const response = await axiosInstance.get(`/role-permission-policies-helper/acl-classes`);
    return response.data;
};

export const fetchPermissions = async (): Promise<Permission[]> => {
    const response = await axiosInstance.get(`/role-permission-policies-helper/permissions/status/true`);
    return response.data;
};


