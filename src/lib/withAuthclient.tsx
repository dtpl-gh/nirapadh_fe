'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useStore from './Zustand';

type AuthOptions = {
  requireAuth?: boolean;
  allowedRoles?: string[]; // ✅ Add allowedRoles array
  redirectTo?: string;
};

const excludedComponents = ['Navbar'];

export default function withAuthadmin<P extends object>(
  Component: React.ComponentType<P>,
  options: AuthOptions = { requireAuth: true }
) {
  if (
    excludedComponents.includes(Component.displayName || Component.name || '')
  ) {
    return Component;
  }

  return function AuthProtected(props: P) {
    const { userId, role, exp, isAuthenticated, checkAuth } = useStore();
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      checkAuth();
      setLoading(false);
    }, [checkAuth]);

    useEffect(() => {
      if (loading) return;

      const isTokenExpired = exp && exp * 1000 < Date.now();

      if (!isAuthenticated) {
        router.replace('/auth'); // Always go to login when not authenticated
        return;
      }

      if (options.requireAuth && isTokenExpired) {
        router.replace('/auth');
        return;
      }

      if (
        options.allowedRoles &&
        (!role || !options.allowedRoles.includes(role))
      ) {
        router.replace('../unauthorized');
        return;
      }
    }, [isAuthenticated, role, exp, router, pathname, loading]);

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
