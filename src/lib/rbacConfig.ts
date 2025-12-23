// lib/rbacConfig.ts

export type RoleKey = 'role_1' | 'role_2' | 'role_4';

interface Role {
  name: string;
  permissions: string[];
}

interface RBACConfig {
  roles: Record<RoleKey, Role>;
}

export const RBAC_CONFIG: RBACConfig = {
  roles: {
    role_1: {
      name: 'Admin',
      permissions: [
        'view:dashboard',
        'view:adminusers',
        'edit:adminusers',
        'view:calendarslots',
        'edit:calendarslots',
        'view:endusers',
        'edit:endusers',
        'view:projects',
        'edit:projects',
        'view:industry',
        'view:identify',
        'view:protect',
        'view:detect',
        'view:respond',
        'view:recover',
        'view:govern',
        'view:answers',
      ],
    },
    role_2: {
      name: 'Manager',
      permissions: [
        'view:dashboard',
        'view:endusers',
        'view:projects',
        'view:industry',
        'view:identify',
        'view:protect',
        'view:detect',
        'view:respond',
        'view:recover',
        'view:govern',
        'view:answers',
      ],
    },
    role_4: {
      name: 'User',
      permissions: ['view:dashboard', 'view:projects'],
    },
  },
};

// ✅ Type-safe permission check
export const hasPermission = (
  role: RoleKey | null | undefined,
  permission: string
): boolean => {
  if (!role || !(role in RBAC_CONFIG.roles)) return false;
  return RBAC_CONFIG.roles[role].permissions.includes(permission);
};

// ✅ Type-safe getter
export const getPermissions = (role: RoleKey | null | undefined): string[] => {
  if (!role || !(role in RBAC_CONFIG.roles)) return [];
  return RBAC_CONFIG.roles[role].permissions;
};
