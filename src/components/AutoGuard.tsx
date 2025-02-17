// src/components/AuthGuard.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getAuthToken, decodeToken } from '@/lib/auth';

const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/verify-code'
];

const PROTECTED_ROUTES = [
  '/dashboard',
  '/funnels',
  '/registerbusiness',
];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const token = getAuthToken();
      const decoded = token ? decodeToken() : null;

      // Si es una ruta pública y el token está presente y el status es 'Active', redirigir a '/funnels'
      if ((PUBLIC_ROUTES.includes(pathname) || pathname === '/registerbusiness') && decoded?.status === 'Active') {
        router.push('/funnels');
        return;
      }

      // Si es una ruta protegida y no hay token, redirigir a login
      if (PROTECTED_ROUTES.some(route => pathname.startsWith(route)) && !token) {
        router.push('/login');
        return;
      }

      // Manejar estados específicos del usuario
      if (decoded) {
        if (decoded.status === 'PENDING_BUSINESS' && !pathname.includes('/registerbusiness')) {
          router.push('/registerbusiness');
        } else if (decoded.status === 'Active' && pathname.includes('/registerbusiness')) {
          router.push('/funnels');
        }
      }
    };

    checkAuth();
  }, [pathname, router]);

  return <>{children}</>;
}
