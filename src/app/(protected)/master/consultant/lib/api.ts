import axios from 'axios';
import { ConsultantResponse, CreateConsultantRequest, UpdateConsultantRequest } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1';

export const fetchUnassignedConsultants = async (): Promise<any[]> => {
    const response = await axios.get(`${API_BASE_URL}/users/unassigned-consultants`);
    return response.data;
};

export const fetchConsultants = async (): Promise<ConsultantResponse[]> => {
    const response = await axios.get(`${API_BASE_URL}/consultants`);
    return response.data;
};

export const fetchConsultantById = async (id: string): Promise<ConsultantResponse> => {
    const response = await axios.get(`${API_BASE_URL}/consultants/${id}`);
    return response.data;
};

export const createConsultant = async (data: CreateConsultantRequest): Promise<ConsultantResponse> => {
    const response = await axios.post(`${API_BASE_URL}/consultants`, data);
    return response.data;
};

export const updateConsultant = async (id: string, data: UpdateConsultantRequest): Promise<ConsultantResponse> => {
    const response = await axios.put(`${API_BASE_URL}/consultants/${id}`, data);
    return response.data;
};

export const deleteConsultant = async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/consultants/${id}`);
};
