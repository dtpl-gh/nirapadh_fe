import axios from 'axios';
import { RoleResponse, CreateRoleRequest, UpdateRoleRequest, PermissionQualifierResponse, AclClass, Permission, RolePermissionPolicyResponse, CreateRolePermissionPolicyRequest, UpdateRolePermissionPolicyRequest } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1';

// ... (Role Code)

// Policy CRUD

export const fetchAllRolePermissionPolicies = async (): Promise<RolePermissionPolicyResponse[]> => {
    const response = await axios.get(`${API_BASE_URL}/role-permission-policies`);
    return response.data;
};

export const fetchRolePermissionPolicyById = async (id: string): Promise<RolePermissionPolicyResponse> => {
    const response = await axios.get(`${API_BASE_URL}/role-permission-policies/${id}`);
    return response.data;
};

export const fetchRolePermissionPolicies = async (roleId: string): Promise<RolePermissionPolicyResponse[]> => {
    const response = await axios.get(`${API_BASE_URL}/role-permission-policies/by-role/${roleId}`);
    return response.data;
};

export const createRolePermissionPolicy = async (data: CreateRolePermissionPolicyRequest): Promise<RolePermissionPolicyResponse> => {
    const response = await axios.post(`${API_BASE_URL}/role-permission-policies`, data);
    return response.data;
};

export const updateRolePermissionPolicy = async (id: string, data: UpdateRolePermissionPolicyRequest): Promise<RolePermissionPolicyResponse> => {
    const response = await axios.put(`${API_BASE_URL}/role-permission-policies/${id}`, data);
    return response.data;
};

export const deleteRolePermissionPolicy = async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/role-permission-policies/${id}`);
};

export const fetchRoles = async (): Promise<RoleResponse[]> => {
    const response = await axios.get(`${API_BASE_URL}/roles`);
    return response.data;
};

export const fetchRoleById = async (id: string): Promise<RoleResponse> => {
    const response = await axios.get(`${API_BASE_URL}/roles/${id}`);
    return response.data;
};

export const createRole = async (data: CreateRoleRequest): Promise<RoleResponse> => {
    const response = await axios.post(`${API_BASE_URL}/roles`, data);
    return response.data;
};

export const updateRole = async (id: string, data: UpdateRoleRequest): Promise<RoleResponse> => {
    const response = await axios.put(`${API_BASE_URL}/roles/${id}`, data);
    return response.data;
};

export const deleteRole = async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/roles/${id}`);
};

// Helper APIs
export const fetchQualifiers = async (): Promise<PermissionQualifierResponse[]> => {
    const response = await axios.get(`${API_BASE_URL}/role-permission-policies-helper/qualifiers`);
    return response.data;
};

export const fetchAclClasses = async (): Promise<AclClass[]> => {
    const response = await axios.get(`${API_BASE_URL}/role-permission-policies-helper/acl-classes`);
    return response.data;
};

export const fetchPermissions = async (): Promise<Permission[]> => {
    const response = await axios.get(`${API_BASE_URL}/role-permission-policies-helper/permissions/status/true`);
    return response.data;
};


