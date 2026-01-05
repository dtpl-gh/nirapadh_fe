export interface RoleResponse {
    id: string;
    name: string;
    description: string;
    status: boolean;
    createdAt: string;
    lastUpdatedAt: string;
}

export interface CreateRoleRequest {
    name: string;
    description: string;
}

export interface UpdateRoleRequest {
    name?: string;
    description?: string;
    status?: boolean;
}
export interface PermissionQualifierResponse {
    name: string;
    description: string;
}

export interface AclClass {
    id: number;
    className: string;
    classIdType: string;
}

export interface Permission {
    id: string;
    name: string;
    description: string;
    status: boolean;
    createdAt: string;
    lastUpdatedAt: string;
}

export interface RolePermissionPolicyResponse {
    id: string;
    roleId: string;
    qualifier: string;
    aclClassId: number;
    permissionId: string;
    createdAt: string;
    lastUpdatedAt: string;
}

export interface CreateRolePermissionPolicyRequest {
    roleId: string;
    qualifier: string;
    aclClassId: string;
    permissionId: string;
}

export interface UpdateRolePermissionPolicyRequest {
    roleId: string;
    qualifier: string;
    aclClassId: string;
    permissionId: string;
}
