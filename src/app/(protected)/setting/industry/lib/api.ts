import axios from 'axios';
import { IndustryResponse, CreateIndustryRequest, UpdateIndustryRequest } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1';

export const fetchIndustries = async (): Promise<IndustryResponse[]> => {
    const response = await axios.get(`${API_BASE_URL}/industries`);
    return response.data;
};

export const fetchIndustryById = async (id: string): Promise<IndustryResponse> => {
    const response = await axios.get(`${API_BASE_URL}/industries/${id}`);
    return response.data;
};

export const createIndustry = async (data: CreateIndustryRequest): Promise<IndustryResponse> => {
    const response = await axios.post(`${API_BASE_URL}/industries`, data);
    return response.data;
};

export const updateIndustry = async (id: string, data: UpdateIndustryRequest): Promise<IndustryResponse> => {
    const response = await axios.put(`${API_BASE_URL}/industries/${id}`, data);
    return response.data;
};

export const deleteIndustry = async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/industries/${id}`);
};
