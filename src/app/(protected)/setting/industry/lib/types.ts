export interface IndustryResponse {
    id: string;
    industryName: string;
    status: boolean;
    createdAt: string;
    lastUpdatedAt: string;
}

export interface CreateIndustryRequest {
    industryName: string;
    status: boolean;
}

export interface UpdateIndustryRequest {
    industryName?: string;
    status?: boolean;
}
