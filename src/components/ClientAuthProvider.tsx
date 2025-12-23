'use client';

import { useEffect } from 'react';
import useStore from '@/lib/Zustand';

export default function ClientAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const checkAuth = useStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
}
