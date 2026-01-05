
export interface PageRequest {
    page?: number;
    size?: number;
    sort?: string[];
    search?: string;
    filters?: Record<string, string | number | boolean>;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}
