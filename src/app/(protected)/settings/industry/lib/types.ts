export interface IndustryResponse {
    id: string;
    industryName: string;
    description?: string;
    status: boolean;
    createdAt: string;
    lastUpdatedAt: string;
}

export interface CreateIndustryRequest {
    industryName: string;
    description?: string;
    status: boolean;
}

export interface UpdateIndustryRequest {
    industryName?: string;
    description?: string;
    status?: boolean;
}
