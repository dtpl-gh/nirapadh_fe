export interface ClientResponse {
    id: string;
    companyName: string;
    address: string;
    pan: string;
    gst: string;
    phone: string;
    email: string;
    pocName: string;
    pocEmail: string;
    pocMobile: string;
    businessName: string;
    numberOfLocations: number;
    numberOfEmployees: number;
    numberOfSuppliers: number;
    numberOfExternalPartners: number;
    industryId: string;
    userId: string;
    status: boolean;
    createdAt: string;
    lastUpdatedAt: string;
}

export interface UserResponse {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

export interface CreateClientRequest {
    companyName: string;
    address: string;
    pan: string;
    gst: string;
    phone: string;
    email: string;
    pocName: string;
    pocEmail: string;
    pocMobile: string;
    businessName: string;
    numberOfLocations: number;
    numberOfEmployees: number;
    numberOfSuppliers: number;
    numberOfExternalPartners: number;
    industryId: string;
    userId: string;
    status: boolean;
}

export interface UpdateClientRequest {
    companyName?: string;
    address?: string;
    pan?: string;
    gst?: string;
    phone?: string;
    email?: string;
    pocName?: string;
    pocEmail?: string;
    pocMobile?: string;
    businessName?: string;
    numberOfLocations?: number;
    numberOfEmployees?: number;
    numberOfSuppliers: number;
    numberOfExternalPartners: number;
    industryId: string;
    userId: string;
    status: boolean;
}

export interface UpdateClientRequest {
    companyName?: string;
    address?: string;
    pan?: string;
    gst?: string;
    phone?: string;
    email?: string;
    pocName?: string;
    pocEmail?: string;
    pocMobile?: string;
    businessName?: string;
    numberOfLocations?: number;
    numberOfEmployees?: number;
    numberOfSuppliers?: number;
    numberOfExternalPartners?: number;
    industryId?: string;
    userId?: string;
    status?: boolean;
}
