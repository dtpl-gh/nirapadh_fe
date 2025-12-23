export interface User {
  id: string;
  name: string;
  email: string;
  roleIds: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissionIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  createdAt: string;
  updatedAt: string;
}

export interface RbacContext {
  user: User | null;
  roles: Role[];
  permissions: Permission[];
  hasPermission: (resource: string, action: string) => boolean;
  hasRole: (roleName: string) => boolean;
}
