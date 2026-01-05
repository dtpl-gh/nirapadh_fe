export interface AppUser {
    id: string;
    username: string;
    email: string;
    enabled: boolean;
    accountNonLocked: boolean;
    createdAt: string;
    lastUpdatedAt: string;
    roleName?: string;
    roleId?: string;
    profilePicUrl?: string;
}

export interface CreateUserRequest {
    username: string;
    email: string;
    password?: string;
    roleId: string;
}

export interface UpdateUserRequest {
    username?: string;
    email?: string;
    password?: string; // Optional for updates if needed separately
    enabled?: boolean;
    accountNonLocked?: boolean;
    roleId?: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
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
