// src/components/AuthGuard.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import jwt from 'jsonwebtoken';

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
      // Obtener token
      const token = localStorage.getItem('auth_token');

      // Si es una ruta pública y el token está presente y el status es 'Active', redirigir a '/funnels'
      if ((PUBLIC_ROUTES.includes(pathname) || pathname === '/registerbusiness')  && token ) {
        try {
          const decoded = jwt.decode(token) as any; // Usar decode en lugar de verify en el cliente
         console.log(decoded)
          if (decoded.status === 'Active') {
            router.push('/funnels');
            return;
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          localStorage.removeItem('auth_token');
          router.push('/login');
          return;
        }
      }

      // Si es una ruta protegida y no hay token, redirigir a login
      if (PROTECTED_ROUTES.some(route => pathname.startsWith(route)) && !token) {
        router.push('/login');
        return;
      }

      if (token) {
        try {
          const decoded = jwt.decode(token) as any; // Usar decode en lugar de verify en el cliente

          if (decoded.status === 'PENDING_BUSINESS' && 
              !pathname.includes('/registerbusiness')) {
            router.push('/registerbusiness');
          } else if (decoded.status === 'Active' && 
                    pathname.includes('/registerbusiness')) {
            router.push('/funnels');
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          localStorage.removeItem('auth_token');
          router.push('/login');
        }
      }
    };

    checkAuth();
  }, [pathname, router]);

  return <>{children}</>;
}
