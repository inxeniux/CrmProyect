// src/lib/auth.ts
import { serialize } from 'cookie';

export const setAuthCookie = (token: string) => {
  // Configuración de la cookie
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60, // 7 días
    path: '/'
  };

  // Serializar la cookie
  return serialize('auth_token', token, cookieOptions);
};

