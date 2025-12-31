import axios from 'axios';
import { SystemConfig, UpdateSystemConfigRequest } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1';

export const fetchSystemConfigs = async (): Promise<SystemConfig[]> => {
    const response = await axios.get(`${API_BASE_URL}/system-configs`);
    // Assuming the API returns a list directly or wrapped in data property
    // Based on the postman description: "Returns list of SystemConfigResponse objects"
    // Adjusting based on typical response structure, usually response.data is the payload.
    // If the API returns proper JSON array:
    return response.data;
};

export const fetchSystemConfigById = async (id: string): Promise<SystemConfig> => {
    const response = await axios.get(`${API_BASE_URL}/system-configs/${id}`);
    return response.data;
};

export const updateSystemConfig = async (id: string, data: UpdateSystemConfigRequest): Promise<SystemConfig> => {
    const response = await axios.put(`${API_BASE_URL}/system-configs/${id}`, data);
    return response.data;
};
