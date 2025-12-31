import axios from 'axios';
import { AppUser, CreateUserRequest, UpdateUserRequest, UserRoleResponse, CreateUserRoleRequest } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1';

export const fetchUsers = async (): Promise<AppUser[]> => {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
};

export const fetchUserById = async (id: string): Promise<AppUser> => {
    const response = await axios.get(`${API_BASE_URL}/users/${id}`);
    return response.data;
};

export const createUser = async (data: CreateUserRequest): Promise<AppUser> => {
    const response = await axios.post(`${API_BASE_URL}/users`, data);
    return response.data;
};

export const updateUser = async (id: string, data: UpdateUserRequest): Promise<AppUser> => {
    const response = await axios.put(`${API_BASE_URL}/users/${id}`, data);
    return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/users/${id}`);
};

export const fetchUserRoles = async (userId: string): Promise<UserRoleResponse[]> => {
    const response = await axios.get(`${API_BASE_URL}/user-roles/by-user/${userId}`);
    return response.data;
};

export const createUserRole = async (data: CreateUserRoleRequest): Promise<UserRoleResponse> => {
    const response = await axios.post(`${API_BASE_URL}/user-roles`, data);
    return response.data;
};

export const deleteUserRole = async (userId: string, roleId: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/user-roles/user/${userId}/role/${roleId}`);
};
