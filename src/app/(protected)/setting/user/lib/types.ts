export interface AppUser {
    id: string;
    username: string;
    email: string;
    enabled: boolean;
    accountNonLocked: boolean;
    createdAt: string;
    lastUpdatedAt: string;
}

export interface CreateUserRequest {
    username: string;
    email: string;
    password?: string;
}

export interface UpdateUserRequest {
    username?: string;
    email?: string;
    password?: string; // Optional for updates if needed separately
    enabled?: boolean;
    accountNonLocked?: boolean;
}

export interface UserRoleResponse {
    userId: string;
    roleId: string;
    createdAt: string;
    lastUpdatedAt: string;
}

export interface CreateUserRoleRequest {
    userId: string;
    roleId: string;
}
