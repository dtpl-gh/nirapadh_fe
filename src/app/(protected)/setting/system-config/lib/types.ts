export interface SystemConfig {
    id: string;
    configKey: string;
    configValue: any;
    description: string;
    status: boolean;
    createdAt: string;
    lastUpdatedAt: string;
}

export interface SystemConfigsResponse {
    data: SystemConfig[];
}

export interface SystemConfigResponse {
    data: SystemConfig;
}

export interface UpdateSystemConfigRequest {
    configValue: any;
    description: string;
    status?: boolean;
}
