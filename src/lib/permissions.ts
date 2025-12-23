// lib/permissions.ts
// lib/permissions.ts
export const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/org/admindashboard',
    icon: 'Home',
    requiredPermission: 'view:dashboard',
  },
  {
    label: 'Admin Users',
    href: '/org/adminusers',
    icon: 'Users',
    requiredPermission: 'view:adminusers',
  },
  {
    label: 'Calendar Slots',
    href: '/org/calendarslots',
    icon: 'CalendarCheck',
    requiredPermission: 'view:calendarslots',
  },
  {
    label: 'Projects',
    href: '/org/projects',
    icon: 'Folder',
    requiredPermission: 'view:projects',
  },
  {
    label: 'End Users',
    href: '/org/endusers',
    icon: 'Users',
    requiredPermission: 'view:endusers',
  },
  {
    label: 'INDUSTRY',
    href: '/org/industry',
    icon: 'Factory',
    requiredPermission: 'view:industry',
  },
  {
    label: 'IDENTIFY (ID)',
    href: '/org/identify',
    icon: 'ScanBarcodeIcon',
    requiredPermission: 'view:identify',
  },
  {
    label: 'PROTECT (PR)',
    href: '/org/protect',
    icon: 'Fingerprint',
    requiredPermission: 'view:protect',
  },
  {
    label: 'DETECT (DE)',
    href: '/org/detect',
    icon: 'ShieldAlert',
    requiredPermission: 'view:detect',
  },
  {
    label: 'RESPOND (RS)',
    href: '/org/respond',
    icon: 'Radar',
    requiredPermission: 'view:respond',
  },
  {
    label: 'RECOVER (RE)',
    href: '/org/recover',
    icon: 'EarthLock',
    requiredPermission: 'view:recover',
  },
  {
    label: 'GOVERN (GO)',
    href: '/org/govern',
    icon: 'Landmark',
    requiredPermission: 'view:govern',
  },
  {
    label: 'ANSWERS',
    href: '/org/answers',
    icon: 'BookOpenCheck',
    requiredPermission: 'view:answers',
  },
];

export const USER_NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'Home',
    requiredPermission: 'view:userdashboard',
  },
  {
    label: 'Projects',
    href: '/project',
    icon: 'Folder',
    requiredPermission: 'view:userprojects',
  },
];
