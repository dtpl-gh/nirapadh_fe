export interface ConsultantResponse {
    id: string;
    userId: string;
    consultantCode: string;
    specialization: string;
    experienceYears: number;
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

export interface CreateConsultantRequest {
    userId: string;
    consultantCode: string;
    specialization: string;
    experienceYears: number;
    status: boolean;
}

export interface UpdateConsultantRequest {
    userId?: string;
    consultantCode?: string;
    specialization?: string;
    experienceYears?: number;
    status?: boolean;
}

export enum ConsultantSpecialization {
    CYBER_SECURITY = 'CYBER_SECURITY',
    RISK_MANAGEMENT = 'RISK_MANAGEMENT',
    COMPLIANCE = 'COMPLIANCE',
    NETWORK_SECURITY = 'NETWORK_SECURITY',
    APPLICATION_SECURITY = 'APPLICATION_SECURITY',
    DATA_PRIVACY = 'DATA_PRIVACY',
    CLOUD_SECURITY = 'CLOUD_SECURITY',
    SECURITY_AUDIT = 'SECURITY_AUDIT',
    GENERAL = 'GENERAL'
}
