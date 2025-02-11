// src/hooks/useAuthRedirect.ts
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDecodedToken } from '@/utils/auth';

export function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const decoded = getDecodedToken();

    if (!decoded) {
      router.push('/login');
      return;
    }

    console.log(decoded)

    if (decoded.status === 'Active') {
      // Si el status es 'Active', redirigir a '/funnels' si está intentando acceder a una ruta pública
      if (['/login', '/register', '/verify-code'].includes(window.location.pathname)) {
        router.push('/funnels');
      }
    } else if (decoded.status === 'PENDING_BUSINESS') {
      router.push('/registerbusiness');
    }
  }, []);

  return getDecodedToken();
}
