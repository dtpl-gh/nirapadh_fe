'use client';
import type React from 'react';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useStore from './Zustand';

type AuthOptions = {
  requireAuth?: boolean;
  allowedRoles?: string[];
  redirectTo?: string;
};

const excludedComponents = ['Navbar'];

export default function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: AuthOptions = { requireAuth: true }
) {
  if (
    excludedComponents.includes(Component.displayName || Component.name || '')
  ) {
    return Component;
  }

  return function AuthProtected(props: P) {
    const { role, exp, isAuthenticated, checkAuth } = useStore();
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);

    // Single auth + unauthorized routes
    const authRoute = '/auth';
    const unauthorizedRoute = '/unauthorized';

    useEffect(() => {
      const init = async () => {
        await checkAuth(); // ensure store is updated
        setLoading(false);
      };
      init();
    }, [checkAuth]);

    useEffect(() => {
      if (loading) return;

      console.log('Checking auth...');
      console.log('isAuthenticated:', isAuthenticated);
      console.log('role:', role);
      console.log('allowedRoles:', options.allowedRoles);

      const isTokenExpired = exp && exp * 1000 < Date.now();

      if (!isAuthenticated || (options.requireAuth && isTokenExpired)) {
        console.log('Redirecting to auth:', authRoute);
        router.replace(authRoute);
        return;
      }

      if (
        options.allowedRoles &&
        (!role || !options.allowedRoles.includes(role))
      ) {
        console.log('Redirecting unauthorized:', unauthorizedRoute);
        router.replace(unauthorizedRoute);
      }
    }, [isAuthenticated, role, exp, loading, router]);

    if (loading) {
      return <div>Loading...</div>;
    }

    return <Component {...props} />;
  };
}

