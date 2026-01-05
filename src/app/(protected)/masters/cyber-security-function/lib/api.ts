import axios from 'axios';

import { CyberSecurityFunctionResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1';

export const fetchCyberSecurityFunctions = async (): Promise<CyberSecurityFunctionResponse[]> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/cyber-security-functions`);
        return response.data;
    } catch (error) {
        console.error('Error fetching cyber security functions:', error);
        throw error;
    }
};
