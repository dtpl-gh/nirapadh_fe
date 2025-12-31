export enum PredefinedRole {
    ROLE_ADMIN = 'ROLE_ADMIN',
    ROLE_CONSULTANT = 'ROLE_CONSULTANT',
    ROLE_CLIENT = 'ROLE_CLIENT'
}

export type Role = PredefinedRole | 'guest';

// Define permissions map: Role -> Allowed Path RegEx patterns
const permissions: Record<Role, RegExp[]> = {
    [PredefinedRole.ROLE_ADMIN]: [
        /.*/, // Admin has access to everything
    ],
    [PredefinedRole.ROLE_CONSULTANT]: [
        /^\/conversations/,
        /^\/profile/,
        /^\/dashboard/,
        /^\/appointment/,
        /^\/assessment/,
    ],
    [PredefinedRole.ROLE_CLIENT]: [
        /^\/conversations/,
        /^\/profile/,
        /^\/dashboard/,
        /^\/appointment/,
        /^\/assessment/,
    ],
    guest: [
        // Guest generally shouldn't reach protected routes, but for completeness
    ],
};

export function hasAccess(role: string, path: string): boolean {
    const currentRole = (role as Role) || 'guest';
    const rolePermissions = permissions[currentRole];

    if (!rolePermissions) {
        return false;
    }

    return rolePermissions.some((pattern) => pattern.test(path));
}
