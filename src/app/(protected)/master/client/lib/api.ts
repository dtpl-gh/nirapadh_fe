import axios from 'axios';
import { ClientResponse, CreateClientRequest, UpdateClientRequest } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1';

export const fetchUnassignedClients = async (): Promise<any[]> => {
    const response = await axios.get(`${API_BASE_URL}/users/unassigned-clients`);
    return response.data;
};

export const fetchClients = async (): Promise<ClientResponse[]> => {
    const response = await axios.get(`${API_BASE_URL}/clients`);
    return response.data;
};

export const fetchClientById = async (id: string): Promise<ClientResponse> => {
    const response = await axios.get(`${API_BASE_URL}/clients/${id}`);
    return response.data;
};

export const createClient = async (data: CreateClientRequest): Promise<ClientResponse> => {
    const response = await axios.post(`${API_BASE_URL}/clients`, data);
    return response.data;
};

export const updateClient = async (id: string, data: UpdateClientRequest): Promise<ClientResponse> => {
    const response = await axios.put(`${API_BASE_URL}/clients/${id}`, data);
    return response.data;
};

export const deleteClient = async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/clients/${id}`);
};
