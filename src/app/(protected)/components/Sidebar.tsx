'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { PredefinedRole } from '@/app/lib/rbac';
import { motion } from 'framer-motion';
import {
  PanelLeftClose,
  PanelRightClose,
  ChevronRight,
  Home,
  Users,
  CalendarCheck,
  Folder,
  Factory,
  ScanBarcodeIcon,
  Fingerprint,
  ShieldAlert,
  Radar,
  EarthLock,
  Landmark,
  BookOpenCheck,
  Settings,
  MessageSquare,
  Database,
  ChevronDown,
  ClipboardList,
  FileQuestion,
  Briefcase,
  UserCog,
  ShieldCheck,
  Sliders,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import axios from 'axios';

// Icon mapping
const iconMap: Record<string, any> = {
  Home,
  Users,
  CalendarCheck,
  Folder,
  Factory,
  ScanBarcodeIcon,
  Protect: Fingerprint,
  Detect: ShieldAlert,
  Respond: Radar,
  Recover: EarthLock,
  Govern: Landmark,
  Answers: BookOpenCheck,
  Settings,
  MessageSquare,
  Database,
  ClipboardList,
  FileQuestion,
  Briefcase,
  UserCog,
  ShieldCheck,
  Sliders,
  // String fallbacks
  'Fingerprint': Fingerprint,
  'ShieldAlert': ShieldAlert,
  'Radar': Radar,
  'EarthLock': EarthLock,
  'Landmark': Landmark,
  'BookOpenCheck': BookOpenCheck
};

interface NavItem {
  label: string;
  href?: string;
  icon: string;
  badge?: string | null;
  children?: NavItem[];
}

interface UserDetails {
  username: string;
  user_email: string;
  role: string;
  status: boolean;
  user_id: string;
}

interface SidebarProps {
  role: string | null;
  isAuthenticated: boolean;
  userId: string | null;
}

// ------------------ NAV SOURCES ------------------
const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'Home' },
  { label: 'Appointments', href: '/appointment', icon: 'CalendarCheck' },
  { label: 'Assessment', href: '/assessment', icon: 'ClipboardList' },
  // { label: 'Conversations', href: '/conversations', icon: 'MessageSquare' },
  {
    label: 'Masters',
    icon: 'Database',
    children: [
      { label: 'Client', href: '/masters/client', icon: 'Briefcase' },
      { label: 'Consultant', href: '/masters/consultant', icon: 'UserCog' },
      { label: 'User', href: '/masters/user', icon: 'Users' },
    ]
  },
  {
    label: 'Settings',
    icon: 'Settings',
    children: [
      /*{ label: 'Role', href: '/settings/role', icon: 'ShieldCheck' },*/
      { label: 'Industry', href: '/settings/industry', icon: 'Factory' },
      { label: 'Question', href: '/settings/question', icon: 'FileQuestion' },
      { label: 'System Config', href: '/settings/system-config', icon: 'Sliders' },
    ]
  },
];

const USER_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'Home' },
  { label: 'Appointments', href: '/appointment', icon: 'CalendarCheck' },
  { label: 'Assessment', href: '/assessment', icon: 'ClipboardList' },
];

const CONSULTANT_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'Home' },
  { label: 'Appointments', href: '/appointment', icon: 'CalendarCheck' },
  { label: 'Assessment', href: '/assessment', icon: 'ClipboardList' },
];

// ------------------ SIDEBAR ------------------
function Sidebar({ role, isAuthenticated, userId }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  // Select nav items based on role
  let navSource: NavItem[] = [];
  if (role === PredefinedRole.ROLE_ADMIN) {
    navSource = ADMIN_NAV_ITEMS;
  } else if (role === PredefinedRole.ROLE_CLIENT) {
    navSource = USER_NAV_ITEMS;
  } else if (role === PredefinedRole.ROLE_CONSULTANT) {
    navSource = CONSULTANT_NAV_ITEMS;
  }

  // Auto-collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setCollapsed(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]
    );
  };

  const isExpanded = (label: string) => expandedItems.includes(label);

  const renderNavItem = (item: NavItem, isChild = false) => {
    const IconComponent = iconMap[item.icon] || Home;
    const isActive = item.href ? pathname === item.href : false;
    // Also check children active state to keep parent expanded
    const isChildActive = item.children?.some(child => child.href === pathname);
    const hasChildren = !!item.children;
    const expanded = isExpanded(item.label);

    // Auto-expand if child is active (on mount or path change could do this via effect,
    // but simple check here helps highlighting parent).
    // Actually sidebar usually auto-expands active parents. Let's stick to manual toggle + active indicator.

    const hasNotification = item.badge && Number.parseInt(item.badge) > 0;

    return (
      <div key={item.label}>
        {hasChildren ? (
          // Parent Item
          <div
            className={`group relative flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer ${(isActive || isChildActive) ? 'text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            onClick={() => !collapsed && toggleExpand(item.label)}
          >
            {isChildActive && !collapsed && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-purple-600 rounded-r-full"
              />
            )}
            <div className="relative flex-shrink-0">
              <IconComponent className={`w-5 h-5 ${(isActive || isChildActive) ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
            </div>

            {!collapsed && (
              <div className="flex items-center justify-between flex-1 min-w-0">
                <span className="text-sm font-medium truncate">
                  {item.label}
                </span>
                {expanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
              </div>
            )}
          </div>
        ) : (
          // Leaf Item
          <Link
            href={item.href || '#'}
            className={`group relative flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-xl transition-all duration-200 ${isActive
              ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-md border border-blue-100'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              } ${isChild ? 'ml-6' : ''}`}
          >
            {isActive && !collapsed && !isChild && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-purple-600 rounded-r-full"
              />
            )}
            <div className="relative flex-shrink-0">
              <IconComponent className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
              {hasNotification && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
                />
              )}
            </div>
            {!collapsed && (
              <div className="flex items-center justify-between flex-1 min-w-0">
                <span className="text-sm font-medium truncate">
                  {item.label}
                </span>
                {item.badge && (
                  <Badge variant={isActive ? 'default' : 'secondary'} className="text-xs px-2 py-0.5">
                    {item.badge}
                  </Badge>
                )}
              </div>
            )}
          </Link>
        )}

        {/* Render Children */}
        {hasChildren && !collapsed && expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {item.children?.map(child => renderNavItem(child, true))}
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <TooltipProvider>
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`bg-white flex flex-col transition-all duration-300 shadow-xl rounded-2xl mx-3 mt-3 mb-3 border border-gray-100 ${collapsed ? 'w-20' : 'w-72'
          }`}
      >
        {/* Header - No changes needed */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          {/* Same header content */}
          {!collapsed ? (
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <Image
                src="/image/Niraapadh.jpg"
                width={200}
                height={160}
                alt="Logo"
                className="rounded-xl"
              />
            </Link>
          ) : (
            <Link href="/dashboard" className="group">
              <Image
                src="/image/favicon.png"
                width={50}
                height={50}
                alt="Logo"
                className="w-12 h-12 object-contain rounded-xl"
              />
            </Link>
          )}

          <Tooltip>
            {/* Toggle button */}
            <TooltipTrigger asChild>
              <button
                onClick={toggleSidebar}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                {collapsed ? <PanelRightClose size={18} /> : <PanelLeftClose size={18} />}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{collapsed ? 'Expand sidebar' : 'Collapse sidebar'}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {isAuthenticated && navSource.map(item => renderNavItem(item))}
        </nav>
      </motion.div>
    </TooltipProvider>
  );
}

export default Sidebar;
