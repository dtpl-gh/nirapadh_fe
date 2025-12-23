// 'use client';

// import { Search } from 'lucide-react';
// import React, {
//   useState,
//   ChangeEvent,
//   FormEvent,
//   useEffect,
//   useRef,
// } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import {
//   Home,
//   MailCheck,
//   Folder,
//   PanelLeft,
//   PanelRight,
//   PanelLeftClose,
//   PanelRightClose,
// } from 'lucide-react';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import { Input } from './ui/input';

// export const NavbarItems = [
//   {
//     label: 'Dashboard',
//     href: '/dashboard',
//     icon: <Home className="h-5 w-5" />,
//   },
//   {
//     label: 'Projects',
//     href: '/project',
//     icon: <Folder className="h-5 w-5" />,
//   },
//   // {
//   //   label: "Conversations",
//   //   href: "/conversations",
//   //   icon: <MailCheck className="h-5 w-5" />
//   // },
// ];
// interface Page {
//   name: string;
//   path: string;
// }
// const pages: Page[] = [
//   { name: 'Dashboard', path: '/dashboard' },
//   { name: 'Projects', path: '/projects' },
//   { name: 'Conversations', path: '/conversations' },
// ];

// function Sidebar() {
//   const router = useRouter();
//   const [searchQuery, setSearchQuery] = useState<string>('');
//   const [filteredPages, setFilteredPages] = useState<Page[]>([]);

//   const pathname = usePathname();
//   const [collapsed, setCollapsed] = useState(false);

//   const toggleSidebar = () => {
//     setCollapsed(!collapsed);
//   };

//   const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const query = event.target.value;
//     setSearchQuery(query);

//     if (query.trim()) {
//       setFilteredPages(
//         pages.filter((page) =>
//           page.name.toLowerCase().includes(query.toLowerCase())
//         )
//       );
//     } else {
//       setFilteredPages([]);
//     }
//   };

//   // Handle search form submission
//   const handleSearch = (event: FormEvent) => {
//     event.preventDefault();
//     if (searchQuery.trim()) {
//       router.push(`/${encodeURIComponent(searchQuery.trim())}`);
//     }
//   };

//   // Handle selecting a page from search suggestions
//   const handleSelect = (path: string) => {
//     router.push(path);
//     setSearchQuery('');
//     setFilteredPages([]);
//   };

//   return (
//     <div
//       className={`bg-white flex flex-col transition-all duration-300 shadow-lg rounded-lg mx-2 mt-2 mb-2
//                   ${collapsed ? 'w-16' : 'w-64'}`}
//     >
//       {/* 🔹 Sidebar Header with Logo & Toggle Button */}
//       <div className="p-2 flex items-center justify-between">
//         {!collapsed && (
//           <Link
//             href="https://niraapadh.driveittech.in/dashboard"
//             className="flex items-center gap-2 text-blue-600 font-semibold"
//           >
//             <div className="flex-shrink-0">
//               <Image
//                 src="/image/Niraapadh.jpg"
//                 width={150}
//                 height={150}
//                 alt="Logo"
//               />
//             </div>
//           </Link>
//         )}
//         {collapsed && (
//           <Link
//             href="https://niraapadh.driveittech.in/dashboard"
//             className="flex justify-center items-center"
//           >
//             <Image
//               src="/image/favicon.png"
//               width={50} // Increased width
//               height={50} // Increased height
//               alt="Logo"
//               className="w-12 h-12 object-contain"
//             />
//           </Link>
//         )}
//         {/* Toggle Button */}
//         <button
//           onClick={toggleSidebar}
//           className="text-gray-500 hover:text-gray-700 focus:outline-none"
//         >
//           {collapsed ? (
//             <PanelRightClose size={20} />
//           ) : (
//             <PanelLeftClose size={20} />
//           )}
//         </button>
//       </div>

//       {/* 🔹 Navigation Items (Properly Collapsing) */}

//       <nav className="flex flex-col flex-1 py-4">
//         {NavbarItems.map((item) => (
//           <Link
//             key={item.label}
//             href={item.href}
//             className={`flex items-center transition-all duration-300 px-3 py-2 rounded-md
//                       ${collapsed ? 'justify-center' : 'gap-3'}
//                       ${pathname === item.href ? 'bg-[#1d5868] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
//           >
//             {item.icon}
//             {!collapsed && <span className="text-sm">{item.label}</span>}{' '}
//             {/* Hide text when collapsed */}
//           </Link>
//         ))}
//       </nav>
//     </div>
//   );
// }

// export default Sidebar;

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  PanelLeftClose,
  PanelRightClose,
  ChevronRight,
  User,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import useStore from '../lib/Zustand';
import { iconMap } from '../lib/iconMap';
import axiosInstance from '@/lib/axiosInstance';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string | null;
}

interface UserDetails {
  username: string;
  user_email: string;
  role: string;
  status: boolean;
  user_id: string;
}

// ------------------ NAV SOURCES ------------------
const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/admindashboard', icon: 'Home' },
  { label: 'Admin Users', href: '/adminusers', icon: 'Users' },
  { label: 'Calendar Slots', href: '/calendarslots', icon: 'CalendarCheck' },
  { label: 'Projects', href: '/projects', icon: 'Folder' },
  { label: 'End Users', href: '/endusers', icon: 'Users' },
  { label: 'INDUSTRY', href: '/industry', icon: 'Factory' },
  { label: 'IDENTIFY (ID)', href: '/identify', icon: 'ScanBarcodeIcon' },
  { label: 'PROTECT (PR)', href: '/protect', icon: 'Fingerprint' },
  { label: 'DETECT (DE)', href: '/detect', icon: 'ShieldAlert' },
  { label: 'RESPOND (RS)', href: '/respond', icon: 'Radar' },
  { label: 'RECOVER (RE)', href: '/recover', icon: 'EarthLock' },
  { label: 'GOVERN (GO)', href: '/govern', icon: 'Landmark' },
  { label: 'ANSWERS', href: '/answers', icon: 'BookOpenCheck' },
];

const USER_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'Home' },
  { label: 'Projects', href: '/project', icon: 'Folder' },
];

const CONSULTANT_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/admindashboard', icon: 'Home' },
  { label: 'Projects', href: '/projects', icon: 'Folder' },
];

// ------------------ SIDEBAR ------------------
function Sidebar() {
  const pathname = usePathname();
  const { role, isAuthenticated, userId } = useStore();
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [userdetails, setUserDetails] = useState<UserDetails | null>(null);

  const toggleSidebar = () => setCollapsed(!collapsed);

  // Select nav items based on role
  let navSource: NavItem[] = [];
  if (role === 'role_1' || role === 'role_2') {
    navSource = ADMIN_NAV_ITEMS;
  } else if ((role as string) === 'role_3') {
    navSource = USER_NAV_ITEMS;
  } else if (role === 'role_4') {
    navSource = CONSULTANT_NAV_ITEMS;
  }

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (!userId || !role) {
          console.log('User ID or role is not defined in sidebar');
          return;
        }

        const response = await axiosInstance.get(
          `/get-user-details/${userId}?role=${role}`
        );

        const details = response.data.data.user_details;

        // Normalize based on role
        const normalizedDetails: UserDetails = {
          username:
            (role as string) === 'role_3'
              ? details.fullname || details.user_fullname
              : details.fullname || details.username,
          user_email: details.email || details.user_email,
          role: details.role,
          status: details.status,
          user_id: details.login_id,
        };

        setUserDetails(normalizedDetails);
      } catch (err) {
        console.error('Error fetching user details:', err);
      }
    };

    fetchUserDetails();
  }, [userId, role]);

  // Auto-collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setCollapsed(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <TooltipProvider>
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`bg-white flex flex-col transition-all duration-300 shadow-xl rounded-2xl mx-3 mt-3 mb-3 border border-gray-100 ${
          collapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          {!collapsed ? (
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <Image
                src="/image/Niraapadh.jpg"
                width={40}
                height={40}
                alt="Logo"
                className="rounded-xl"
              />
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Niraapadh
                </h1>
                <p className="text-xs text-gray-500">Security Platform</p>
              </div>
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
            <TooltipTrigger asChild>
              <button
                onClick={toggleSidebar}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                {collapsed ? (
                  <PanelRightClose size={18} />
                ) : (
                  <PanelLeftClose size={18} />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{collapsed ? 'Expand sidebar' : 'Collapse sidebar'}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {isAuthenticated &&
            navSource.map((item) => {
              const IconComponent = iconMap[item.icon];
              const isActive = pathname === item.href;
              const hasNotification =
                item.badge && Number.parseInt(item.badge) > 0;

              return (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    className={`group relative flex items-center ${
                      collapsed ? 'justify-center' : 'gap-3'
                    } px-3 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-md border border-blue-100'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    onMouseEnter={() => setHoveredItem(item.label)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {isActive && !collapsed && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-purple-600 rounded-r-full"
                      />
                    )}
                    <div className="relative flex-shrink-0">
                      <IconComponent
                        className={`w-5 h-5 ${
                          isActive
                            ? 'text-blue-600'
                            : 'text-gray-500 group-hover:text-gray-700'
                        }`}
                      />
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
                        <span
                          className={`text-sm font-medium truncate ${
                            isActive
                              ? 'text-blue-700'
                              : 'text-gray-700 group-hover:text-gray-900'
                          }`}
                        >
                          {item.label}
                        </span>
                        {item.badge && (
                          <Badge
                            variant={isActive ? 'default' : 'secondary'}
                            className="text-xs px-2 py-0.5"
                          >
                            {item.badge}
                          </Badge>
                        )}
                        {(hoveredItem === item.label || isActive) && (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    )}
                  </Link>
                </div>
              );
            })}
        </nav>

        {/* Footer */}
        {/* <div className="p-4 border-t border-gray-100">
          {!collapsed ? (
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
             <div>
                      <p className="font-medium">{userdetails?.username || 'Loading...'}</p>
                      <p className="text-xs text-gray-500">{userdetails?.user_email || 'Loading...'}</p>
                    </div>
            </div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center cursor-pointer">
                  <User className="w-5 h-5 text-white" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
               <div>
                      <p className="font-medium">{userdetails?.username || 'Loading...'}</p>
                      <p className="text-xs text-gray-500">{userdetails?.user_email || 'Loading...'}</p>
                    </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div> */}
      </motion.div>
    </TooltipProvider>
  );
}

export default Sidebar;
