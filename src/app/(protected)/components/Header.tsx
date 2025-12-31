
'use client';

import {
  Search,
  Bell,
  ChevronUp,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
} from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Link from 'next/link';
import axios from 'axios';

interface Page {
  name: string;
  path: string;
  category?: string;
  icon?: string;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

interface UserDetails {
  username: string;
  user_email: string;
  role: string;
  status: boolean;
  user_id: string;
}

interface HeaderProps {
  role: string | null;
  isAuthenticated: boolean;
  userId: string | null;
}

const pages: Page[] = [
  {
    name: 'Dashboard',
    path: '/org/admindashboard',
    category: 'Main',
    icon: '📊',
  },
  { name: 'Projects', path: '/org/projects', category: 'Main', icon: '📁' },
  {
    name: 'Admin Users',
    path: '/org/adminusers',
    category: 'Users',
    icon: '👥',
  },
  { name: 'Industry', path: '/org/industry', category: 'Settings', icon: '🏢' },
  { name: 'Identify', path: '/org/identify', category: 'Security', icon: '🔍' },
  { name: 'Protect', path: '/org/protect', category: 'Security', icon: '🛡️' },
  { name: 'Detect', path: '/org/detect', category: 'Security', icon: '👁️' },
  { name: 'Respond', path: '/org/respond', category: 'Security', icon: '⚡' },
  { name: 'Recover', path: '/org/recover', category: 'Security', icon: '🔄' },
  { name: 'Govern', path: '/org/govern' },
  { name: 'Answers', path: '/org/answers', category: 'Content', icon: '💬' },
  {
    name: 'Conversations',
    path: '/org/conversations',
    category: 'Content',
    icon: '💭',
  },
  { name: 'Settings', path: '/org/settings', category: 'Settings', icon: '⚙️' },
  { name: 'End Users', path: '/org/endusers', category: 'Users', icon: '👤' },
];

export default function Header({ role, isAuthenticated, userId }: HeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredPages, setFilteredPages] = useState<Page[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const notificationRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const [userdetails, setUserDetails] = useState<UserDetails | null>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (!userId) {
          console.log('User ID is not defined in header admin');
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1'}/admin-user-details/${userId}`
        );
        setUserDetails(response.data.user_details);
      } catch (err) {
        console.error('Error fetching user details:', err);
      }
    };

    fetchUserDetails();
  }, [userId]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchFocused(false);
        setFilteredPages([]);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = pages.filter((page) =>
        page.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPages(filtered);
    } else {
      setFilteredPages([]);
    }
  };

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim() && filteredPages.length > 0) {
      router.push(filteredPages[0].path);
      setSearchQuery('');
      setFilteredPages([]);
      setSearchFocused(false);
    }
  };

  const handleSelect = (path: string) => {
    router.push(path);
    setSearchQuery('');
    setFilteredPages([]);
    setSearchFocused(false);
  };

  const handleNotificationClick = (notificationId: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, unread: false } : notif
      )
    );
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      router.replace('/login'); // Redirect to login
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const groupedPages = filteredPages.reduce(
    (acc, page) => {
      const category = page.category || 'Other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(page);
      return acc;
    },
    {} as Record<string, Page[]>
  );

  return (
    <TooltipProvider>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white/80 backdrop-blur-md border-b border-gray-200 py-4 px-6 w-full rounded-2xl mt-3 mb-3 mr-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
              <p className="text-sm text-gray-500">
                Welcome back, {userdetails?.username}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative" ref={searchRef}>
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search pages... (Ctrl+K)"
                    className={`pl-10 pr-4 w-64 lg:w-80 h-10 bg-gray-50 border-gray-200 rounded-xl transition-all duration-200 ${searchFocused
                      ? 'bg-white shadow-md border-blue-300 ring-2 ring-blue-100'
                      : 'hover:bg-white'
                      }`}
                    value={searchQuery}
                    onChange={handleChange}
                    onFocus={() => setSearchFocused(true)}
                  />
                  {searchQuery && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery('');
                            setFilteredPages([]);
                          }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          ×
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Clear search</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </form>

              <AnimatePresence>
                {(filteredPages.length > 0 ||
                  (searchFocused && searchQuery.trim())) && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-96 overflow-auto z-50"
                    >
                      {Object.keys(groupedPages).length > 0 ? (
                        <div className="p-2">
                          {Object.entries(groupedPages).map(
                            ([category, categoryPages]) => (
                              <div key={category} className="mb-3 last:mb-0">
                                <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                  {category}
                                </div>
                                {categoryPages.map((page) => (
                                  <button
                                    key={page.path}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors duration-150"
                                    onClick={() => handleSelect(page.path)}
                                  >
                                    <span className="text-lg">{page.icon}</span>
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">
                                        {page.name}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {page.path}
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )
                          )}
                        </div>
                      ) : searchQuery.trim() ? (
                        <div className="p-4 text-center text-gray-500">
                          <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">
                            No pages found for "{searchQuery}"
                          </p>
                        </div>
                      ) : null}
                    </motion.div>
                  )}
              </AnimatePresence>
            </div>

            <div className="relative" ref={notificationRef}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 w-10 p-0 rounded-xl relative bg-transparent"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </motion.div>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Notifications {unreadCount > 0 && `(${unreadCount} unread)`}
                  </p>
                </TooltipContent>
              </Tooltip>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 shadow-xl rounded-xl z-50"
                  >
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">
                          Notifications
                        </h3>
                        {unreadCount > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {unreadCount} new
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                          <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">No notifications</p>
                        </div>
                      ) : (
                        <div className="p-2">
                          {notifications.map((notif) => (
                            <motion.button
                              key={notif.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className={`w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150 ${notif.unread
                                ? 'bg-blue-50 border-l-2 border-blue-500'
                                : ''
                                }`}
                              onClick={() => handleNotificationClick(notif.id)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {notif.title}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {notif.message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {notif.time}
                                  </p>
                                </div>
                                {notif.unread && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                                )}
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-gray-100">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-sm"
                        >
                          View all notifications
                        </Button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <DropdownMenu onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 px-3 py-2 h-auto rounded-xl hover:bg-gray-50"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="/placeholder-avatar.jpg"
                      alt={userdetails?.username}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                      {userdetails?.username
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {userdetails?.username}
                    </p>
                    <p className="text-xs text-gray-500">{userdetails?.role}</p>
                  </div>
                  {dropdownOpen ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="/placeholder-avatar.jpg"
                        alt={userdetails?.username}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                        {userdetails?.username
                          ?.split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{userdetails?.username}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {userdetails?.user_email}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/org/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/org/updatepassword"
                    className="flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Update Password
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.header>
    </TooltipProvider >
  );
}
